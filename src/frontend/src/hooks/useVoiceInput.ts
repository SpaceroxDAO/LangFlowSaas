/**
 * useVoiceInput - Hook for voice-to-text input using Web Speech API
 *
 * Provides:
 * - Speech recognition via browser API
 * - Real-time transcript updates
 * - Browser compatibility handling
 */

import { useState, useCallback, useRef, useEffect } from 'react'

// Web Speech API types (not included in standard TypeScript lib)
interface SpeechRecognitionEvent {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  isFinal: boolean
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionErrorEvent {
  error: string
  message?: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition
    webkitSpeechRecognition?: new () => SpeechRecognition
  }
}

interface UseVoiceInputOptions {
  /** Language for speech recognition (default: 'en-US') */
  language?: string
  /** Enable continuous recognition mode */
  continuous?: boolean
  /** Show interim results while speaking */
  interimResults?: boolean
  /** Callback when transcript is updated */
  onTranscript?: (transcript: string) => void
  /** Callback when recognition ends */
  onEnd?: () => void
  /** Callback when an error occurs */
  onError?: (error: string) => void
}

interface UseVoiceInputReturn {
  /** Whether the browser supports voice input */
  isSupported: boolean
  /** Whether currently listening for voice input */
  isListening: boolean
  /** Current transcript text */
  transcript: string
  /** Interim (not final) transcript */
  interimTranscript: string
  /** Start listening for voice input */
  startListening: () => void
  /** Stop listening */
  stopListening: () => void
  /** Toggle listening state */
  toggleListening: () => void
  /** Clear the current transcript */
  clearTranscript: () => void
  /** Error message if any */
  error: string | null
}

export function useVoiceInput({
  language = 'en-US',
  continuous = false,
  interimResults = true,
  onTranscript,
  onEnd,
  onError,
}: UseVoiceInputOptions = {}): UseVoiceInputReturn {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Check browser support
  const isSupported = typeof window !== 'undefined' &&
    (!!window.SpeechRecognition || !!window.webkitSpeechRecognition)

  // Initialize speech recognition
  useEffect(() => {
    if (!isSupported) return

    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognitionClass) return

    const recognition = new SpeechRecognitionClass()
    recognition.continuous = continuous
    recognition.interimResults = interimResults
    recognition.lang = language

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = ''
      let interim = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
        } else {
          interim += result[0].transcript
        }
      }

      if (finalTranscript) {
        setTranscript((prev) => {
          const newTranscript = prev + finalTranscript
          onTranscript?.(newTranscript)
          return newTranscript
        })
      }

      setInterimTranscript(interim)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      let errorMessage = 'Speech recognition error'

      switch (event.error) {
        case 'not-allowed':
          errorMessage = 'Microphone access was denied. Please allow microphone access to use voice input.'
          break
        case 'no-speech':
          errorMessage = 'No speech was detected. Please try again.'
          break
        case 'network':
          errorMessage = 'Network error occurred. Please check your connection.'
          break
        case 'aborted':
          // User aborted, not an error
          return
        default:
          errorMessage = `Speech recognition error: ${event.error}`
      }

      setError(errorMessage)
      setIsListening(false)
      onError?.(errorMessage)
    }

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognition.onend = () => {
      setIsListening(false)
      setInterimTranscript('')
      onEnd?.()
    }

    recognitionRef.current = recognition

    return () => {
      recognition.abort()
      recognitionRef.current = null
    }
  }, [isSupported, language, continuous, interimResults, onTranscript, onEnd, onError])

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.')
      return
    }

    try {
      setError(null)
      recognitionRef.current?.start()
    } catch (err) {
      // Recognition might already be running
      console.error('Failed to start speech recognition:', err)
    }
  }, [isSupported])

  const stopListening = useCallback(() => {
    try {
      recognitionRef.current?.stop()
    } catch (err) {
      console.error('Failed to stop speech recognition:', err)
    }
  }, [])

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  const clearTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
  }, [])

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    toggleListening,
    clearTranscript,
    error,
  }
}
