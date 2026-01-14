/**
 * useAudioRecorder - Hook for recording audio using MediaRecorder API
 *
 * Provides:
 * - Audio recording via browser API
 * - Recording time tracking
 * - Audio blob output
 */

import { useState, useCallback, useRef, useEffect } from 'react'

interface UseAudioRecorderOptions {
  /** Audio MIME type (default: 'audio/webm') */
  mimeType?: string
  /** Time slice for data availability (ms) */
  timeSlice?: number
  /** Maximum recording duration in seconds */
  maxDuration?: number
  /** Callback when recording stops with audio blob */
  onRecordingComplete?: (blob: Blob) => void
  /** Callback when an error occurs */
  onError?: (error: string) => void
}

interface UseAudioRecorderReturn {
  /** Whether the browser supports audio recording */
  isSupported: boolean
  /** Whether currently recording */
  isRecording: boolean
  /** Whether recording is paused */
  isPaused: boolean
  /** Recording duration in seconds */
  recordingTime: number
  /** The recorded audio blob (after stopping) */
  audioBlob: Blob | null
  /** URL for the recorded audio blob */
  audioUrl: string | null
  /** Start recording */
  startRecording: () => Promise<void>
  /** Stop recording */
  stopRecording: () => void
  /** Pause recording */
  pauseRecording: () => void
  /** Resume recording */
  resumeRecording: () => void
  /** Clear the recorded audio */
  clearRecording: () => void
  /** Error message if any */
  error: string | null
}

function getSupportedMimeType(): string {
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
    'audio/ogg',
    'audio/wav',
  ]

  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type
    }
  }

  return 'audio/webm' // Default fallback
}

export function useAudioRecorder({
  mimeType,
  timeSlice = 1000,
  maxDuration = 300, // 5 minutes default max
  onRecordingComplete,
  onError,
}: UseAudioRecorderOptions = {}): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  // Check browser support
  const isSupported = typeof window !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== 'undefined'

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  const startRecording = useCallback(async () => {
    if (!isSupported) {
      const msg = 'Audio recording is not supported in this browser.'
      setError(msg)
      onError?.(msg)
      return
    }

    try {
      setError(null)
      chunksRef.current = []

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })

      streamRef.current = stream

      // Determine MIME type
      const type = mimeType || getSupportedMimeType()

      // Create MediaRecorder
      const recorder = new MediaRecorder(stream, { mimeType: type })
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      recorder.onstop = () => {
        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())

        // Create blob from chunks
        const blob = new Blob(chunksRef.current, { type })
        setAudioBlob(blob)

        // Create URL for playback
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)

        // Callback with blob
        onRecordingComplete?.(blob)

        setIsRecording(false)
        setIsPaused(false)

        // Clear timer
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }
      }

      recorder.onerror = () => {
        const msg = 'An error occurred while recording audio.'
        setError(msg)
        onError?.(msg)
        setIsRecording(false)
        setIsPaused(false)
      }

      // Start recording
      recorder.start(timeSlice)
      setIsRecording(true)
      startTimeRef.current = Date.now()
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
        setRecordingTime(elapsed)

        // Check max duration
        if (elapsed >= maxDuration) {
          recorder.stop()
        }
      }, 100)
    } catch (err) {
      let msg = 'Failed to start recording.'

      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          msg = 'Microphone access was denied. Please allow microphone access to record audio.'
        } else if (err.name === 'NotFoundError') {
          msg = 'No microphone found. Please connect a microphone and try again.'
        } else if (err.name === 'NotReadableError') {
          msg = 'Could not access the microphone. It may be in use by another application.'
        } else {
          msg = `Recording error: ${err.message}`
        }
      }

      setError(msg)
      onError?.(msg)
      setIsRecording(false)
    }
  }, [isSupported, mimeType, timeSlice, maxDuration, onRecordingComplete, onError])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
  }, [])

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause()
      setIsPaused(true)

      // Pause timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [])

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume()
      setIsPaused(false)

      // Resume timer
      const pausedTime = recordingTime
      startTimeRef.current = Date.now() - (pausedTime * 1000)

      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
        setRecordingTime(elapsed)

        if (elapsed >= maxDuration) {
          mediaRecorderRef.current?.stop()
        }
      }, 100)
    }
  }, [recordingTime, maxDuration])

  const clearRecording = useCallback(() => {
    // Clear audio blob and URL
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioBlob(null)
    setAudioUrl(null)
    setRecordingTime(0)
    setError(null)
    chunksRef.current = []
  }, [audioUrl])

  return {
    isSupported,
    isRecording,
    isPaused,
    recordingTime,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearRecording,
    error,
  }
}
