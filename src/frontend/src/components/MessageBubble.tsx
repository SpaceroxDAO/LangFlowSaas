import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import type { ChatMessage } from '@/types'

// Format timestamp for message hover
function formatTimestamp(date: Date): string {
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export interface MessageBubbleProps {
  message: ChatMessage
  avatarUrl: string | null
  entityName: string
  onCopy: (content: string) => void
  isCopied: boolean
  isLast: boolean
  onRegenerate?: () => void
  isRegenerating?: boolean
  // Edit functionality
  isEditing?: boolean
  editContent?: string
  onStartEdit?: (content: string) => void
  onCancelEdit?: () => void
  onSaveEdit?: () => void
  onEditContentChange?: (content: string) => void
  // Delete functionality
  isDeleting?: boolean
  onStartDelete?: () => void
  onCancelDelete?: () => void
  onConfirmDelete?: () => void
  // Feedback functionality
  onFeedback?: (feedback: 'positive' | 'negative') => void
}

export function MessageBubble({
  message,
  avatarUrl,
  entityName,
  onCopy,
  isCopied,
  isLast,
  onRegenerate,
  isRegenerating,
  isEditing,
  editContent,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onEditContentChange,
  isDeleting,
  onStartDelete,
  onCancelDelete,
  onConfirmDelete,
  onFeedback,
}: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const [showTimestamp, setShowTimestamp] = useState(false)

  return (
    <div
      className={`flex items-start gap-3 group ${isUser ? 'flex-row-reverse' : ''}`}
      onMouseEnter={() => setShowTimestamp(true)}
      onMouseLeave={() => setShowTimestamp(false)}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center overflow-hidden flex-shrink-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt={entityName} className="w-full h-full object-contain" />
          ) : (
            <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}
        </div>
      )}

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}

      {/* Message Content */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[75%]`}>
        <div
          className={`relative rounded-2xl px-4 py-3 shadow-sm ${
            isUser
              ? 'bg-violet-500 text-white rounded-tr-sm'
              : 'bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-white rounded-tl-sm'
          }`}
        >
          {isEditing && isUser ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => onEditContentChange?.(e.target.value)}
                className="w-full min-w-[200px] bg-violet-400 text-white placeholder-violet-200 rounded-lg px-2 py-1 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-white/50"
                rows={3}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={onCancelEdit}
                  className="px-2 py-1 text-xs bg-violet-400 hover:bg-violet-300 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onSaveEdit}
                  className="px-2 py-1 text-xs bg-white text-violet-600 hover:bg-violet-50 rounded transition-colors font-medium"
                >
                  Save
                </button>
              </div>
            </div>
          ) : isUser ? (
            <p className="whitespace-pre-wrap text-sm">{message.content}</p>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-headings:my-2">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}

          {message.status === 'sending' && (
            <span className="text-xs opacity-60 mt-1 block">Sending...</span>
          )}
          {message.status === 'error' && (
            <span className="text-xs text-red-300 mt-1 block">Failed to send</span>
          )}

          {/* Edited indicator */}
          {message.isEdited && !isEditing && (
            <span className="text-xs opacity-60 mt-1 block" title={message.editedAt ? `Edited ${formatTimestamp(new Date(message.editedAt))}` : 'Edited'}>
              (edited)
            </span>
          )}
        </div>

        {/* Actions & Timestamp */}
        <div
          className={`flex items-center gap-2 mt-1 transition-opacity duration-200 ${
            showTimestamp ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Timestamp */}
          <span className="text-xs text-gray-400">
            {formatTimestamp(message.timestamp)}
          </span>

          {/* Delete confirmation */}
          {isDeleting ? (
            <div className="flex items-center gap-1">
              <button
                onClick={onConfirmDelete}
                className="p-1 text-red-600 hover:text-red-700 bg-red-50 rounded"
                title="Confirm delete"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                onClick={onCancelDelete}
                className="p-1 text-gray-500 hover:text-gray-700 bg-gray-100 rounded"
                title="Cancel"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              {/* Copy Button */}
              <button
                onClick={() => onCopy(message.content)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                title="Copy message"
              >
                {isCopied ? (
                  <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>

              {/* Edit Button (only for user messages) */}
              {isUser && onStartEdit && !isEditing && (
                <button
                  onClick={() => onStartEdit(message.content)}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  title="Edit message"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}

              {/* Delete Button */}
              {onStartDelete && (
                <button
                  onClick={onStartDelete}
                  className="p-1 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded transition-colors"
                  title="Delete message"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}

              {/* Feedback buttons (only for assistant messages) */}
              {!isUser && onFeedback && (
                <>
                  <button
                    onClick={() => onFeedback('positive')}
                    className={`p-1 rounded transition-colors ${
                      message.feedback === 'positive'
                        ? 'text-green-600 bg-green-50'
                        : 'text-gray-400 hover:text-green-600 hover:bg-gray-100'
                    }`}
                    title="Good response"
                  >
                    <svg className="w-3.5 h-3.5" fill={message.feedback === 'positive' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onFeedback('negative')}
                    className={`p-1 rounded transition-colors ${
                      message.feedback === 'negative'
                        ? 'text-red-600 bg-red-50'
                        : 'text-gray-400 hover:text-red-600 hover:bg-gray-100'
                    }`}
                    title="Bad response"
                  >
                    <svg className="w-3.5 h-3.5" fill={message.feedback === 'negative' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                    </svg>
                  </button>
                </>
              )}

              {/* Regenerate Button (only for last assistant message) */}
              {onRegenerate && !isUser && isLast && (
                <button
                  onClick={onRegenerate}
                  disabled={isRegenerating}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                  title="Regenerate response"
                >
                  <svg
                    className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
