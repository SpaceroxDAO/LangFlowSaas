/**
 * ThinkingDisplay - Shows agent's reasoning/thinking process
 *
 * A collapsible section that displays the agent's internal thought process,
 * with a spinner while thinking and the full content when expanded.
 */

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import type { ThinkingBlock } from '@/types'

interface ThinkingDisplayProps {
  thinking: ThinkingBlock
  defaultExpanded?: boolean
}

export function ThinkingDisplay({ thinking, defaultExpanded = false }: ThinkingDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  if (!thinking.content && thinking.isComplete) {
    return null
  }

  return (
    <div className="mb-3">
      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        {/* Chevron icon */}
        <svg
          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>

        {/* Brain icon */}
        <svg
          className={`w-4 h-4 ${!thinking.isComplete ? 'text-violet-500' : 'text-gray-400'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>

        <span className="font-medium">
          {thinking.isComplete ? 'Thought process' : 'Thinking...'}
        </span>

        {/* Spinner while thinking */}
        {!thinking.isComplete && (
          <svg className="w-4 h-4 animate-spin text-violet-500" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="mt-2 pl-6 border-l-2 border-violet-200">
          <div className="prose prose-sm max-w-none text-gray-600 prose-p:my-1 prose-headings:my-2">
            <ReactMarkdown>{thinking.content || '...'}</ReactMarkdown>
          </div>

          {!thinking.isComplete && (
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
              <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
              <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse [animation-delay:0.4s]" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
