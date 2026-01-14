/**
 * ToolCallDisplay - Displays agent tool calls with status and details
 *
 * Shows:
 * - Tool name with status indicator (running/completed/failed)
 * - Expandable input/output details
 * - Duration timer for running tools
 */

import { useState } from 'react'
import type { ToolCall } from '@/types'

interface ToolCallDisplayProps {
  toolCalls: ToolCall[]
}

function formatDuration(start: Date, end?: Date): string {
  const endTime = end || new Date()
  const ms = endTime.getTime() - start.getTime()

  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`
}

function ToolCallItem({ tool }: { tool: ToolCall }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const statusColors = {
    pending: 'bg-gray-100 text-gray-600',
    running: 'bg-violet-100 text-violet-700',
    completed: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
  }

  const statusIcons = {
    pending: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
      </svg>
    ),
    running: (
      <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
    completed: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    ),
    failed: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {/* Status badge */}
          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[tool.status]}`}>
            {statusIcons[tool.status]}
            {tool.status}
          </span>

          {/* Tool name */}
          <span className="text-sm font-medium text-gray-900">{tool.name}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Duration */}
          {tool.startedAt && (
            <span className="text-xs text-gray-400">
              {formatDuration(tool.startedAt, tool.completedAt)}
            </span>
          )}

          {/* Expand icon */}
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded details */}
      {isExpanded && (
        <div className="border-t border-gray-100 px-3 py-2 space-y-2">
          {/* Input */}
          {tool.input && Object.keys(tool.input).length > 0 && (
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">Input</div>
              <pre className="text-xs bg-gray-50 rounded p-2 overflow-x-auto text-gray-700">
                {JSON.stringify(tool.input, null, 2)}
              </pre>
            </div>
          )}

          {/* Output */}
          {tool.output && (
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">Output</div>
              <pre className="text-xs bg-gray-50 rounded p-2 overflow-x-auto text-gray-700 max-h-32 overflow-y-auto">
                {tool.output}
              </pre>
            </div>
          )}

          {/* Error */}
          {tool.error && (
            <div>
              <div className="text-xs font-medium text-red-500 mb-1">Error</div>
              <pre className="text-xs bg-red-50 rounded p-2 overflow-x-auto text-red-700">
                {tool.error}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function ToolCallDisplay({ toolCalls }: ToolCallDisplayProps) {
  if (!toolCalls || toolCalls.length === 0) {
    return null
  }

  return (
    <div className="space-y-2 mb-3">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span>Tool Calls ({toolCalls.length})</span>
      </div>

      {toolCalls.map((tool) => (
        <ToolCallItem key={tool.id} tool={tool} />
      ))}
    </div>
  )
}
