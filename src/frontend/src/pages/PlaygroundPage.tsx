import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '@/providers/DevModeProvider'
import { useQuery } from '@tanstack/react-query'
import ReactMarkdown from 'react-markdown'
import { api } from '@/lib/api'
import { ShareDeployModal } from '@/components/ShareDeployModal'
import type { ChatMessage } from '@/types'

export function PlaygroundPage() {
  // Support both old agent routes and new workflow routes
  const { agentId, workflowId } = useParams<{ agentId?: string; workflowId?: string }>()
  const { getToken } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Determine if we're in workflow mode or agent/component mode
  const isWorkflowMode = !!workflowId
  const entityId = workflowId || agentId

  useEffect(() => {
    api.setTokenGetter(getToken)
  }, [getToken])

  // Fetch agent component (new table) or workflow details
  const { data: agentComponent } = useQuery({
    queryKey: ['agent-component', agentId],
    queryFn: () => api.getAgentComponent(agentId!),
    enabled: !!agentId && !isWorkflowMode,
  })

  const { data: workflow } = useQuery({
    queryKey: ['workflow', workflowId],
    queryFn: () => api.getWorkflow(workflowId!),
    enabled: !!workflowId && isWorkflowMode,
  })

  // For workflow mode, also fetch the agent component to get avatar
  const workflowAgentComponentId = workflow?.agent_component_ids?.[0]
  const { data: workflowAgentComponent } = useQuery({
    queryKey: ['agent-component-for-workflow', workflowAgentComponentId],
    queryFn: () => api.getAgentComponent(workflowAgentComponentId!),
    enabled: !!workflowAgentComponentId && isWorkflowMode,
  })

  // Find workflow associated with this agent component (for chat purposes)
  const { data: associatedWorkflows } = useQuery({
    queryKey: ['workflows-for-component', agentId],
    queryFn: async () => {
      const result = await api.listWorkflows(undefined, 1, 100)
      // Find workflows that include this agent component
      return result.workflows.filter(w =>
        w.agent_component_ids?.includes(agentId!) || false
      )
    },
    enabled: !!agentId && !isWorkflowMode && !!agentComponent,
  })

  // The workflow to use for chat - either direct or via agent component
  const chatWorkflow = isWorkflowMode ? workflow : associatedWorkflows?.[0]

  // Use either agent component or workflow for display
  const entity = isWorkflowMode ? workflow : agentComponent
  const entityName = entity?.name || 'Loading...'

  // Get avatar URL - from agent component directly or via workflow's agent component
  const avatarUrl = isWorkflowMode
    ? workflowAgentComponent?.avatar_url || null
    : agentComponent?.avatar_url || null

  // Get the agent component ID for edit link (works in both modes)
  const editAgentComponentId = isWorkflowMode
    ? workflowAgentComponentId
    : agentId

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`
    }
  }, [input])

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading || !entityId) return

    // For agent components, we need an associated workflow to chat
    if (!isWorkflowMode && !chatWorkflow) {
      console.error('No workflow found for this agent component')
      return
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      status: 'sending',
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Always use workflow chat API - either direct workflow or associated workflow
      const targetWorkflowId = isWorkflowMode ? workflowId! : chatWorkflow!.id
      const response = await api.chatWithWorkflow(targetWorkflowId, {
        message: userMessage.content,
        conversation_id: conversationId || undefined,
      })

      setConversationId(response.conversation_id)

      setMessages((prev) => [
        ...prev.map((m) =>
          m.id === userMessage.id ? { ...m, status: 'sent' as const } : m
        ),
        {
          id: response.message_id,
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === userMessage.id ? { ...m, status: 'error' as const } : m
        )
      )
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, entityId, conversationId, isWorkflowMode, workflowId, chatWorkflow])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to={editAgentComponentId ? `/edit/${editAgentComponentId}` : '/dashboard'}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center overflow-hidden flex-shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt={entityName} className="w-full h-full object-contain" />
              ) : (
                <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              )}
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {entityName}
              </h1>
              <p className="text-sm text-gray-500">Chat Playground</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-violet-500 hover:bg-violet-600 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Share
            </button>
            {/* Edit link - goes to agent component edit page (works for both modes) */}
            {editAgentComponentId && (
              <Link
                to={`/edit/${editAgentComponentId}`}
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Agent
              </Link>
            )}
            <button
              onClick={() => {
                setMessages([])
                setConversationId(null)
              }}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Clear chat
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mb-4 overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt={entityName} className="w-full h-full object-contain" />
              ) : (
                <svg className="w-10 h-10 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              )}
            </div>
            <h2 className="text-lg font-medium text-gray-900 mb-1">
              Chat with {entityName}
            </h2>
            <p className="text-gray-500 max-w-sm">
              Start a conversation to test your workflow responses
            </p>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                </div>
                <span className="text-sm text-gray-500">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white p-4">
        <div className="max-w-4xl mx-auto flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
              disabled={isLoading}
              rows={1}
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 pr-12
                         focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200
                         disabled:bg-gray-50 disabled:cursor-not-allowed
                         max-h-[150px] overflow-y-auto transition-colors"
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading || !chatWorkflow}
            className="flex-shrink-0 w-12 h-12 rounded-xl bg-violet-500 text-white
                       hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-200
                       disabled:bg-gray-300 disabled:cursor-not-allowed
                       transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>

      {/* Share & Deploy Modal - works with both agent components and workflows */}
      {entity && chatWorkflow && (
        <ShareDeployModal
          agent={{ ...entity, langflow_flow_id: chatWorkflow.langflow_flow_id } as any}
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </div>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? 'bg-violet-500 text-white rounded-br-sm'
            : 'bg-white border border-gray-200 text-gray-900 rounded-bl-sm'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}

        {message.status === 'sending' && (
          <span className="text-xs opacity-60 mt-1 block">Sending...</span>
        )}
        {message.status === 'error' && (
          <span className="text-xs text-red-300 mt-1 block">
            Failed to send
          </span>
        )}
      </div>
    </div>
  )
}
