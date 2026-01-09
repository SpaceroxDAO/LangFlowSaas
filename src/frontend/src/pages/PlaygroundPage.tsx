import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '@/providers/DevModeProvider'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import ReactMarkdown from 'react-markdown'
import { api } from '@/lib/api'
import { ShareDeployModal } from '@/components/ShareDeployModal'
import type { ChatMessage, WorkflowConversation } from '@/types'

// Format relative time (e.g., "2 min ago", "Yesterday")
function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

// Format timestamp for message hover
function formatTimestamp(date: Date): string {
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function PlaygroundPage() {
  const { agentId, workflowId } = useParams<{ agentId?: string; workflowId?: string }>()
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isWorkflowMode = !!workflowId
  const entityId = workflowId || agentId

  useEffect(() => {
    api.setTokenGetter(getToken)
  }, [getToken])

  // Fetch agent component or workflow
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

  // Fetch avatar for workflow mode
  const workflowAgentComponentId = workflow?.agent_component_ids?.[0]
  const { data: workflowAgentComponent } = useQuery({
    queryKey: ['agent-component-for-workflow', workflowAgentComponentId],
    queryFn: () => api.getAgentComponent(workflowAgentComponentId!),
    enabled: !!workflowAgentComponentId && isWorkflowMode,
  })

  // Find associated workflow for agent mode
  const { data: associatedWorkflows } = useQuery({
    queryKey: ['workflows-for-component', agentId],
    queryFn: async () => {
      const result = await api.listWorkflows(undefined, 1, 100)
      return result.workflows.filter(w => w.agent_component_ids?.includes(agentId!) || false)
    },
    enabled: !!agentId && !isWorkflowMode && !!agentComponent,
  })

  const chatWorkflow = isWorkflowMode ? workflow : associatedWorkflows?.[0]
  const entity = isWorkflowMode ? workflow : agentComponent
  const entityName = entity?.name || 'Loading...'
  const avatarUrl = isWorkflowMode
    ? workflowAgentComponent?.avatar_url || null
    : agentComponent?.avatar_url || null
  const editAgentComponentId = isWorkflowMode ? workflowAgentComponentId : agentId

  // Fetch conversation history
  const { data: conversationsData } = useQuery({
    queryKey: ['workflow-conversations', chatWorkflow?.id],
    queryFn: () => api.listWorkflowConversations(chatWorkflow!.id),
    enabled: !!chatWorkflow?.id,
  })

  const conversations = conversationsData?.conversations || []

  // Load conversation messages
  const loadConversation = useCallback(async (conv: WorkflowConversation) => {
    if (!chatWorkflow?.id) return

    try {
      const data = await api.getConversationMessages(chatWorkflow.id, conv.id)
      const loadedMessages: ChatMessage[] = data.messages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
        status: 'sent' as const,
      }))
      setMessages(loadedMessages)
      setConversationId(conv.id)
    } catch (error) {
      console.error('Failed to load conversation:', error)
    }
  }, [chatWorkflow?.id])

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
    if (!isWorkflowMode && !chatWorkflow) return

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

      // Refresh conversation list
      queryClient.invalidateQueries({ queryKey: ['workflow-conversations', chatWorkflow?.id] })
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
  }, [input, isLoading, entityId, conversationId, isWorkflowMode, workflowId, chatWorkflow, queryClient])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const startNewChat = () => {
    setMessages([])
    setConversationId(null)
  }

  const copyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const regenerateResponse = useCallback(async () => {
    if (isLoading || messages.length < 2) return

    // Find the last user message
    const lastUserMessageIndex = [...messages].reverse().findIndex(m => m.role === 'user')
    if (lastUserMessageIndex === -1) return

    const actualIndex = messages.length - 1 - lastUserMessageIndex
    const lastUserMessage = messages[actualIndex]

    // Remove the last assistant message and set loading
    setMessages(prev => prev.slice(0, -1))
    setIsLoading(true)

    try {
      const targetWorkflowId = isWorkflowMode ? workflowId! : chatWorkflow!.id
      const response = await api.chatWithWorkflow(targetWorkflowId, {
        message: lastUserMessage.content,
        conversation_id: conversationId || undefined,
      })

      setMessages((prev) => [
        ...prev,
        {
          id: response.message_id,
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      console.error('Failed to regenerate:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, messages, isWorkflowMode, workflowId, chatWorkflow, conversationId])

  return (
    <div className="flex h-full">
      {/* Conversation Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-72' : 'w-0'
        } flex-shrink-0 border-r border-gray-200 bg-gray-50 transition-all duration-300 overflow-hidden`}
      >
        <div className="w-72 h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={startNewChat}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-500 hover:bg-violet-600 text-white rounded-lg font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Chat
            </button>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto p-2">
            {conversations.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-8 px-4">
                No conversations yet. Start chatting to create one!
              </div>
            ) : (
              <div className="space-y-1">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => loadConversation(conv)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors group ${
                      conversationId === conv.id
                        ? 'bg-violet-100 text-violet-900'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <svg
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          conversationId === conv.id ? 'text-violet-500' : 'text-gray-400'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {conv.title || 'New conversation'}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatRelativeTime(new Date(conv.updated_at))}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-200 bg-white px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Sidebar Toggle */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Back Button */}
              <Link
                to={editAgentComponentId ? `/edit/${editAgentComponentId}` : '/dashboard'}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>

              {/* Avatar & Title */}
              <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={entityName} className="w-full h-full object-contain" />
                ) : (
                  <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                )}
              </div>
              <div>
                <h1 className="text-base font-semibold text-gray-900">{entityName}</h1>
                <p className="text-xs text-gray-500">Chat Playground</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-violet-500 hover:bg-violet-600 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Share
              </button>
              {editAgentComponentId && (
                <Link
                  to={`/edit/${editAgentComponentId}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </Link>
              )}
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

          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              avatarUrl={avatarUrl}
              entityName={entityName}
              onCopy={(content) => copyMessage(message.id, content)}
              isCopied={copiedMessageId === message.id}
              isLast={index === messages.length - 1}
              onRegenerate={message.role === 'assistant' && index === messages.length - 1 ? regenerateResponse : undefined}
              isRegenerating={isLoading && index === messages.length - 1}
            />
          ))}

          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex items-start gap-3">
              {/* Assistant Avatar */}
              <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={entityName} className="w-full h-full object-contain" />
                ) : (
                  <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                )}
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
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
                placeholder="Type a message..."
                disabled={isLoading}
                rows={1}
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3
                           focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200
                           disabled:bg-gray-50 disabled:cursor-not-allowed
                           max-h-[150px] overflow-y-auto transition-colors"
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading || !chatWorkflow}
              className="flex-shrink-0 w-11 h-11 rounded-xl bg-violet-500 text-white
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
      </div>

      {/* Share Modal */}
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

interface MessageBubbleProps {
  message: ChatMessage
  avatarUrl: string | null
  entityName: string
  onCopy: (content: string) => void
  isCopied: boolean
  isLast: boolean
  onRegenerate?: () => void
  isRegenerating?: boolean
}

function MessageBubble({
  message,
  avatarUrl,
  entityName,
  onCopy,
  isCopied,
  isLast,
  onRegenerate,
  isRegenerating,
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
        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center overflow-hidden flex-shrink-0">
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
              : 'bg-white border border-gray-200 text-gray-900 rounded-tl-sm'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap text-sm">{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}

          {message.status === 'sending' && (
            <span className="text-xs opacity-60 mt-1 block">Sending...</span>
          )}
          {message.status === 'error' && (
            <span className="text-xs text-red-300 mt-1 block">Failed to send</span>
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
        </div>
      </div>
    </div>
  )
}
