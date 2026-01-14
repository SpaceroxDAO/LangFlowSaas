/**
 * AudioRecorder - Record and send audio messages
 *
 * Features:
 * - Record button with timer
 * - Preview before sending
 * - Uses MediaRecorder API
 */

import { useCallback } from 'react'
import { useAudioRecorder } from '@/hooks/useAudioRecorder'

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void
  onCancel: () => void
  maxDuration?: number
  disabled?: boolean
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function AudioRecorder({
  onRecordingComplete,
  onCancel,
  maxDuration = 120, // 2 minutes default
  disabled,
}: AudioRecorderProps) {
  const {
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
  } = useAudioRecorder({
    maxDuration,
    onRecordingComplete: (blob) => {
      // Don't auto-send, let user preview first
    },
  })

  const handleSend = useCallback(() => {
    if (audioBlob) {
      onRecordingComplete(audioBlob)
      clearRecording()
    }
  }, [audioBlob, onRecordingComplete, clearRecording])

  const handleCancel = useCallback(() => {
    if (isRecording) {
      stopRecording()
    }
    clearRecording()
    onCancel()
  }, [isRecording, stopRecording, clearRecording, onCancel])

  const handleRetry = useCallback(() => {
    clearRecording()
    startRecording()
  }, [clearRecording, startRecording])

  if (!isSupported) {
    return (
      <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-sm text-yellow-700">Audio recording is not supported in this browser.</p>
        <button
          onClick={onCancel}
          className="ml-auto text-yellow-600 hover:text-yellow-800"
        >
          Close
        </button>
      </div>
    )
  }

  // Preview mode - after recording
  if (audioBlob && audioUrl) {
    return (
      <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
        {/* Audio player */}
        <audio
          src={audioUrl}
          controls
          className="h-10 flex-1"
        />

        {/* Actions */}
        <button
          onClick={handleRetry}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Re-record"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        <button
          onClick={handleCancel}
          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Cancel"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <button
          onClick={handleSend}
          className="p-2 bg-violet-500 text-white hover:bg-violet-600 rounded-lg transition-colors"
          title="Send audio"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    )
  }

  // Recording mode
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
      {/* Recording indicator */}
      {isRecording && (
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`} />
          <span className="text-sm font-mono text-gray-700">
            {formatTime(recordingTime)}
          </span>
          <span className="text-xs text-gray-400">
            / {formatTime(maxDuration)}
          </span>
        </div>
      )}

      {/* Waveform visualization (simple bars) */}
      {isRecording && !isPaused && (
        <div className="flex items-center gap-0.5 h-6 flex-1">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-violet-400 rounded-full animate-pulse"
              style={{
                height: `${Math.random() * 100}%`,
                animationDelay: `${i * 50}ms`,
                animationDuration: '500ms',
              }}
            />
          ))}
        </div>
      )}

      {/* Start recording prompt */}
      {!isRecording && !audioBlob && (
        <p className="text-sm text-gray-500 flex-1">Click to start recording...</p>
      )}

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-500 flex-1">{error}</p>
      )}

      {/* Controls */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Pause/Resume */}
        {isRecording && (
          <button
            onClick={isPaused ? resumeRecording : pauseRecording}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            )}
          </button>
        )}

        {/* Stop / Start button */}
        {isRecording ? (
          <button
            onClick={stopRecording}
            className="p-2 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors"
            title="Stop recording"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="1" />
            </svg>
          </button>
        ) : (
          <button
            onClick={startRecording}
            disabled={disabled}
            className="p-2 bg-violet-500 text-white hover:bg-violet-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
            title="Start recording"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        )}

        {/* Cancel */}
        <button
          onClick={handleCancel}
          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Cancel"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
