/**
 * VoiceInputButton - Voice-to-text input button
 *
 * Features:
 * - Toggle voice recognition on/off
 * - Pulsing animation while listening
 * - Browser compatibility indicator
 */

import { useVoiceInput } from '@/hooks/useVoiceInput'
import { useEffect, useCallback } from 'react'

interface VoiceInputButtonProps {
  onTranscript: (transcript: string) => void
  disabled?: boolean
}

export function VoiceInputButton({ onTranscript, disabled }: VoiceInputButtonProps) {
  const {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    toggleListening,
    clearTranscript,
    error,
  } = useVoiceInput({
    continuous: true,
    interimResults: true,
  })

  // When transcript changes, pass it to parent
  useEffect(() => {
    if (transcript) {
      onTranscript(transcript)
      clearTranscript()
    }
  }, [transcript, onTranscript, clearTranscript])

  const handleClick = useCallback(() => {
    if (!disabled) {
      toggleListening()
    }
  }, [disabled, toggleListening])

  // Don't render if not supported
  if (!isSupported) {
    return (
      <button
        disabled
        className="flex-shrink-0 w-11 h-11 rounded-xl border border-gray-200 text-gray-300
                   cursor-not-allowed flex items-center justify-center"
        title="Voice input is not supported in this browser. Please use Chrome or Edge."
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`flex-shrink-0 w-11 h-11 rounded-xl border transition-all flex items-center justify-center ${
          isListening
            ? 'bg-red-50 border-red-300 text-red-500'
            : 'border-gray-300 text-gray-500 hover:border-violet-500 hover:text-violet-500 hover:bg-violet-50'
        } ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        title={isListening ? 'Stop voice input' : 'Start voice input'}
      >
        {/* Pulsing animation ring when listening */}
        {isListening && (
          <span className="absolute inset-0 rounded-xl animate-ping bg-red-200 opacity-50" />
        )}

        <svg
          className={`w-5 h-5 relative z-10 ${isListening ? 'animate-pulse' : ''}`}
          fill={isListening ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      </button>

      {/* Interim transcript indicator */}
      {isListening && interimTranscript && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap max-w-[200px] truncate">
          {interimTranscript}
        </div>
      )}

      {/* Error tooltip */}
      {error && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg whitespace-nowrap max-w-[250px]">
          {error}
        </div>
      )}
    </div>
  )
}
