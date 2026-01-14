/**
 * StreamingMessageBubble - Enhanced message bubble with streaming support
 *
 * Displays a streaming message with:
 * - Real-time text content with typing indicator
 * - Tool call visualization
 * - Thinking/reasoning display
 * - Content blocks (code, tables, etc.)
 * - Stop generation button
 */

import ReactMarkdown from 'react-markdown'
import type { StreamingMessage } from '@/types'
import { ToolCallDisplay } from './ToolCallDisplay'
import { ThinkingDisplay } from './ThinkingDisplay'

interface StreamingMessageBubbleProps {
  message: StreamingMessage
  avatarUrl: string | null
  entityName: string
  onStop?: () => void
}

export function StreamingMessageBubble({
  message,
  avatarUrl,
  entityName,
  onStop,
}: StreamingMessageBubbleProps) {
  const hasToolCalls = message.toolCalls && message.toolCalls.length > 0
  const hasThinking = message.thinking && (message.thinking.content || !message.thinking.isComplete)
  const hasContent = message.content.length > 0

  return (
    <div className="flex items-start gap-3">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center overflow-hidden flex-shrink-0">
        {avatarUrl ? (
          <img src={avatarUrl} alt={entityName} className="w-full h-full object-contain" />
        ) : (
          <svg
            className="w-4 h-4 text-violet-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </div>

      {/* Message content */}
      <div className="flex-1 min-w-0 max-w-[75%]">
        {/* Thinking section */}
        {hasThinking && message.thinking && (
          <ThinkingDisplay thinking={message.thinking} defaultExpanded={!message.isStreaming} />
        )}

        {/* Tool calls */}
        {hasToolCalls && message.toolCalls && (
          <ToolCallDisplay toolCalls={message.toolCalls} />
        )}

        {/* Main message bubble */}
        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
          {hasContent ? (
            <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          ) : message.isStreaming ? (
            // Empty state while streaming starts
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
            </div>
          ) : null}

          {/* Streaming indicator */}
          {message.isStreaming && hasContent && (
            <span className="inline-block w-2 h-4 bg-violet-400 ml-0.5 animate-pulse rounded-sm" />
          )}
        </div>

        {/* Stop button */}
        {message.isStreaming && onStop && (
          <button
            onClick={onStop}
            className="mt-2 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="1" />
            </svg>
            Stop generating
          </button>
        )}

        {/* Content blocks */}
        {message.contentBlocks && message.contentBlocks.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.contentBlocks.map((block) => (
              <ContentBlockRenderer key={block.id} block={block} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Content block renderer
import type { ContentBlock } from '@/types'

function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'code':
      return (
        <div className="rounded-lg overflow-hidden border border-gray-200">
          {block.title && (
            <div className="bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 border-b border-gray-200">
              {block.title}
              {block.language && (
                <span className="ml-2 text-gray-400">{block.language}</span>
              )}
            </div>
          )}
          <pre className="bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto">
            <code>{block.content}</code>
          </pre>
        </div>
      )

    case 'json':
      return (
        <div className="rounded-lg overflow-hidden border border-gray-200">
          {block.title && (
            <div className="bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 border-b border-gray-200">
              {block.title}
            </div>
          )}
          <pre className="bg-gray-50 p-4 text-sm overflow-x-auto text-gray-700">
            {block.content}
          </pre>
        </div>
      )

    case 'image':
      return (
        <div className="rounded-lg overflow-hidden border border-gray-200">
          {block.title && (
            <div className="bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 border-b border-gray-200">
              {block.title}
            </div>
          )}
          <img src={block.content} alt={block.title || 'Image'} className="max-w-full" />
        </div>
      )

    case 'table':
    case 'markdown':
    default:
      return (
        <div className="rounded-lg overflow-hidden border border-gray-200 p-4 bg-gray-50">
          {block.title && (
            <div className="text-xs font-medium text-gray-600 mb-2">{block.title}</div>
          )}
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{block.content}</ReactMarkdown>
          </div>
        </div>
      )
  }
}
