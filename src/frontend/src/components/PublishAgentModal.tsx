/**
 * PublishAgentModal - Confirmation modal for publishing an agent as the live OpenClaw agent.
 *
 * Explains what publishing does and handles the replace flow when
 * another agent is already published.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { AgentComponent } from '@/types'

interface PublishAgentModalProps {
  agent: AgentComponent
  currentPublished: AgentComponent | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function PublishAgentModal({
  agent,
  currentPublished,
  isOpen,
  onClose,
  onSuccess,
}: PublishAgentModalProps) {
  const queryClient = useQueryClient()
  const isReplacing = currentPublished && currentPublished.id !== agent.id

  const publishMutation = useMutation({
    mutationFn: () => api.publishAgent(agent.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-components'] })
      onSuccess?.()
      onClose()
    },
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header gradient */}
        <div className="h-1.5 bg-gradient-to-r from-violet-500 to-purple-500" />

        <div className="p-6">
          {/* Icon */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
            {isReplacing ? 'Replace Live Agent?' : 'Publish Agent'}
          </h2>

          {isReplacing ? (
            <div className="space-y-3 mb-6">
              <p className="text-sm text-gray-600 dark:text-neutral-400 text-center">
                This will replace <span className="font-medium text-gray-900 dark:text-white">{currentPublished.name}</span> with{' '}
                <span className="font-medium text-gray-900 dark:text-white">{agent.name}</span> as your live AI agent.
              </p>
              <div className="flex items-center justify-center gap-3 py-2">
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center mx-auto mb-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-500 line-through">{currentPublished.name}</span>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-1">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-violet-600">{agent.name}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              <p className="text-sm text-gray-600 dark:text-neutral-400 text-center">
                Make <span className="font-medium text-gray-900 dark:text-white">{agent.name}</span> your live AI agent.
              </p>
              <div className="bg-violet-50 dark:bg-violet-950/30 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2 text-sm text-violet-700 dark:text-violet-300">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Your agent becomes your live AI assistant
                </div>
                <div className="flex items-center gap-2 text-sm text-violet-700 dark:text-violet-300">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Workflows marked as skills become agent abilities
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-neutral-500">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Coming soon: Download Charlie to your computer
                </div>
              </div>
            </div>
          )}

          {publishMutation.isError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg text-sm text-red-600 dark:text-red-400">
              Failed to publish agent. Please try again.
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => publishMutation.mutate()}
              disabled={publishMutation.isPending}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 rounded-xl transition-all disabled:opacity-50"
            >
              {publishMutation.isPending
                ? 'Publishing...'
                : isReplacing
                  ? 'Replace Agent'
                  : 'Publish Agent'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
