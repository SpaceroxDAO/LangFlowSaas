import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/providers/DevModeProvider'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import ReactMarkdown from 'react-markdown'
import { api } from '@/lib/api'
import { ShareDeployModal } from '@/components/ShareDeployModal'
import { StreamingMessageBubble, FileDropZone, AttachmentBar, VoiceInputButton } from '@/components/playground'
import { useStreamingChat } from '@/hooks/useStreamingChat'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useTour, useShouldShowTour } from '@/providers/TourProvider'
import { startPlaygroundTour } from '@/tours'
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
  const [searchParams] = useSearchParams()
  const isNewAgent = searchParams.get('new') === 'true'
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [useStreaming, setUseStreaming] = useState(true)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null)
  const [deletingConversationId, setDeletingConversationId] = useState<string | null>(null)
  const [playgroundTourStarted, setPlaygroundTourStarted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Tour hooks
  const { completeTour } = useTour()
  const shouldShowPlaygroundTour = useShouldShowTour('playground')

  const isWorkflowMode = !!workflowId
  const entityId = workflowId || agentId

  useEffect(() => {
    api.setTokenGetter(getToken)
  }, [getToken])

  // Start playground tour for first-time users (or when coming from agent creation)
  useEffect(() => {
    if ((shouldShowPlaygroundTour || isNewAgent) && !playgroundTourStarted) {
      const timer = setTimeout(() => {
        setPlaygroundTourStarted(true)
        startPlaygroundTour(() => {
          completeTour('playground')
        })
      }, 800) // Slightly longer delay to let the page render
      return () => clearTimeout(timer)
    }
  }, [shouldShowPlaygroundTour, isNewAgent, playgroundTourStarted, completeTour])

  // Manual tour trigger
  const handleStartPlaygroundTour = useCallback(() => {
    startPlaygroundTour(() => {
      completeTour('playground')
    })
  }, [completeTour])

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

  // Streaming chat hook
  const {
    streamingMessage,
    isStreaming,
    sendMessage: sendStreamingMessage,
    stopGeneration,
    sessionConversationId,
  } = useStreamingChat({
    workflowId: chatWorkflow?.id,
  })

  // File upload hook
  const {
    files: uploadedFiles,
    isUploading,
    addFiles,
    removeFile,
    clearFiles,
  } = useFileUpload({
    workflowId: chatWorkflow?.id,
    onError: (error) => console.error('File upload error:', error),
  })

  // Sync conversation ID from streaming session
  useEffect(() => {
    if (sessionConversationId && sessionConversationId !== conversationId) {
      setConversationId(sessionConversationId)
      queryClient.invalidateQueries({ queryKey: ['workflow-conversations', chatWorkflow?.id] })
    }
  }, [sessionConversationId, conversationId, chatWorkflow?.id, queryClient])

  // Convert completed streaming message to regular message
  useEffect(() => {
    if (streamingMessage && !streamingMessage.isStreaming && streamingMessage.content) {
      // Streaming is done, add the message to the messages array
      const completedMessage: ChatMessage = {
        id: streamingMessage.id,
        role: 'assistant',
        content: streamingMessage.content,
        timestamp: new Date(),
        status: 'sent',
      }
      setMessages((prev) => [...prev, completedMessage])
    }
  }, [streamingMessage?.isStreaming, streamingMessage?.id])

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
  }, [messages, streamingMessage?.content])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`
    }
  }, [input])

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading || isStreaming || isUploading || !entityId) return
    if (!isWorkflowMode && !chatWorkflow) return

    const messageContent = input.trim()

    // Get completed file attachments
    const completedFiles = uploadedFiles.filter(f => f.status === 'completed' && f.langflowFileId)
    const attachments = completedFiles.map(f => ({
      langflow_file_id: f.langflowFileId!,
      name: f.name,
      type: f.fileType,
    }))

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
      status: 'sending',
      attachments: attachments.length > 0 ? attachments : undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    clearFiles() // Clear files after adding to message

    // Use streaming if enabled (default Langflow execution)
    if (useStreaming) {
      // Mark user message as sent immediately
      setMessages((prev) =>
        prev.map((m) =>
          m.id === userMessage.id ? { ...m, status: 'sent' as const } : m
        )
      )

      // Start streaming - the hook handles the streaming message state
      // TODO: Add file support to streaming once backend supports it
      sendStreamingMessage(messageContent, conversationId || undefined)
      return
    }

    // Fallback to non-streaming mode
    setIsLoading(true)

    try {
      const targetWorkflowId = isWorkflowMode ? workflowId! : chatWorkflow!.id
      const response = await api.chatWithWorkflow(targetWorkflowId, {
        message: messageContent,
        conversation_id: conversationId || undefined,
        attachments: attachments.length > 0 ? attachments : undefined,
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
  }, [input, isLoading, isStreaming, isUploading, entityId, conversationId, isWorkflowMode, workflowId, chatWorkflow, queryClient, useStreaming, sendStreamingMessage, uploadedFiles, clearFiles])

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

  // Start editing a message
  const startEditMessage = useCallback((messageId: string, content: string) => {
    setEditingMessageId(messageId)
    setEditContent(content)
  }, [])

  // Cancel editing
  const cancelEditMessage = useCallback(() => {
    setEditingMessageId(null)
    setEditContent('')
  }, [])

  // Save edited message
  const saveEditMessage = useCallback(async () => {
    if (!editingMessageId || !editContent.trim() || !chatWorkflow?.id || !conversationId) return

    try {
      await api.updateMessage(chatWorkflow.id, conversationId, editingMessageId, editContent.trim())

      // Update local state
      setMessages(prev => prev.map(m =>
        m.id === editingMessageId
          ? { ...m, content: editContent.trim(), isEdited: true, editedAt: new Date().toISOString() }
          : m
      ))
      setEditingMessageId(null)
      setEditContent('')
    } catch (error) {
      console.error('Failed to edit message:', error)
    }
  }, [editingMessageId, editContent, chatWorkflow?.id, conversationId])

  // Delete a message
  const deleteMessage = useCallback(async (messageId: string) => {
    if (!chatWorkflow?.id || !conversationId) return

    try {
      await api.deleteMessage(chatWorkflow.id, conversationId, messageId)
      setMessages(prev => prev.filter(m => m.id !== messageId))
      setDeletingMessageId(null)
    } catch (error) {
      console.error('Failed to delete message:', error)
    }
  }, [chatWorkflow?.id, conversationId])

  // Delete a conversation
  const deleteConversation = useCallback(async (convId: string) => {
    if (!chatWorkflow?.id) return

    try {
      await api.deleteConversation(chatWorkflow.id, convId)
      queryClient.invalidateQueries({ queryKey: ['workflow-conversations', chatWorkflow.id] })

      // If deleting the current conversation, start a new chat
      if (convId === conversationId) {
        startNewChat()
      }
      setDeletingConversationId(null)
    } catch (error) {
      console.error('Failed to delete conversation:', error)
    }
  }, [chatWorkflow?.id, conversationId, queryClient, startNewChat])

  // Submit feedback on a message
  const submitFeedback = useCallback(async (messageId: string, feedback: 'positive' | 'negative') => {
    if (!chatWorkflow?.id || !conversationId) return

    try {
      const result = await api.submitMessageFeedback(chatWorkflow.id, conversationId, messageId, feedback)

      // Update local state
      setMessages(prev => prev.map(m =>
        m.id === messageId
          ? { ...m, feedback: result.feedback }
          : m
      ))
    } catch (error) {
      console.error('Failed to submit feedback:', error)
    }
  }, [chatWorkflow?.id, conversationId])

  // Handle voice input transcript
  const handleVoiceTranscript = useCallback((transcript: string) => {
    setInput((prev) => prev + (prev ? ' ' : '') + transcript)
  }, [])

  return (
    <div className="flex h-full">
      {/* Conversation Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-72' : 'w-0'
        } flex-shrink-0 border-r border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 transition-all duration-300 overflow-hidden`}
      >
        <div className="w-72 h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 dark:border-neutral-700">
            <button
              onClick={startNewChat}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-500 hover:bg-violet-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5 transition-all duration-300"
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
              <div className="text-center text-gray-400 dark:text-neutral-500 text-sm py-8 px-4">
                No conversations yet. Start chatting to create one!
              </div>
            ) : (
              <div className="space-y-1">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`relative w-full text-left px-3 py-2.5 rounded-lg transition-colors group ${
                      conversationId === conv.id
                        ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-900 dark:text-violet-100'
                        : 'hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-700 dark:text-neutral-300'
                    }`}
                  >
                    <button
                      onClick={() => loadConversation(conv)}
                      className="w-full text-left"
                    >
                      <div className="flex items-start gap-2 pr-6">
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
                          <p className="text-xs text-gray-400 dark:text-neutral-500 mt-0.5">
                            {formatRelativeTime(new Date(conv.updated_at))}
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* Delete button */}
                    {deletingConversationId === conv.id ? (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <button
                          onClick={() => deleteConversation(conv.id)}
                          className="p-1 text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-900/30 rounded"
                          title="Confirm delete"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeletingConversationId(null)}
                          className="p-1 text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200 bg-gray-100 dark:bg-neutral-700 rounded"
                          title="Cancel"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeletingConversationId(conv.id)
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete conversation"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Sidebar Toggle */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-1.5 text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Avatar & Title */}
              <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center overflow-hidden flex-shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={entityName} className="w-full h-full object-contain" />
                ) : (
                  <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11.25 16.25h1.5L12 17z"/>
                    <path d="M16 14v.5"/>
                    <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309"/>
                    <path d="M8 14v.5"/>
                    <path d="M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5"/>
                  </svg>
                )}
              </div>
              <div>
                <h1 className="text-base font-semibold text-gray-900 dark:text-white">{entityName}</h1>
                <p className="text-xs text-gray-500 dark:text-neutral-400">Chat Playground</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Help Button */}
              <button
                onClick={handleStartPlaygroundTour}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                title="Take a guided tour"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Help
              </button>
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg hover:shadow-lg hover:shadow-gray-900/25 hover:-translate-y-0.5 transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Share
              </button>
              {editAgentComponentId && (
                <Link
                  to={`/edit/${editAgentComponentId}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
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
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-neutral-950" data-tour="playground-messages">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg className="w-12 h-12 text-gray-900 dark:text-neutral-100 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M11.25 16.25h1.5L12 17z"/>
                <path d="M16 14v.5"/>
                <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309"/>
                <path d="M8 14v.5"/>
                <path d="M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5"/>
              </svg>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                Chat with {entityName}
              </h2>
              <p className="text-gray-500 dark:text-neutral-400 max-w-sm">
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
              isLast={index === messages.length - 1 && !isStreaming}
              onRegenerate={message.role === 'assistant' && index === messages.length - 1 && !isStreaming ? regenerateResponse : undefined}
              isRegenerating={isLoading && index === messages.length - 1}
              // Edit props
              isEditing={editingMessageId === message.id}
              editContent={editingMessageId === message.id ? editContent : ''}
              onStartEdit={(content) => startEditMessage(message.id, content)}
              onCancelEdit={cancelEditMessage}
              onSaveEdit={saveEditMessage}
              onEditContentChange={setEditContent}
              // Delete props
              isDeleting={deletingMessageId === message.id}
              onStartDelete={() => setDeletingMessageId(message.id)}
              onCancelDelete={() => setDeletingMessageId(null)}
              onConfirmDelete={() => deleteMessage(message.id)}
              // Feedback props
              onFeedback={(feedback) => submitFeedback(message.id, feedback)}
            />
          ))}

          {/* Streaming message display */}
          {streamingMessage && streamingMessage.isStreaming && (
            <StreamingMessageBubble
              message={streamingMessage}
              avatarUrl={avatarUrl}
              entityName={entityName}
              onStop={stopGeneration}
            />
          )}

          {/* Loading indicator for non-streaming mode */}
          {isLoading && !useStreaming && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex items-start gap-3">
              {/* Assistant Avatar */}
              <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center overflow-hidden flex-shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={entityName} className="w-full h-full object-contain" />
                ) : (
                  <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                )}
              </div>
              <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
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
        <FileDropZone onFilesAdded={addFiles} disabled={isLoading || isStreaming}>
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900" data-tour="playground-input">
            {/* Attachment Bar */}
            <AttachmentBar files={uploadedFiles} onRemoveFile={removeFile} />

            <div className="p-4">
              <div className="max-w-4xl mx-auto flex items-end gap-3">
                {/* File picker button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || isStreaming || isUploading}
                  className="flex-shrink-0 w-11 h-11 rounded-xl border border-gray-300 dark:border-neutral-600 text-gray-500 dark:text-neutral-400
                             hover:border-violet-500 dark:hover:border-violet-400 hover:text-violet-500 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20
                             focus:outline-none focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-800
                             disabled:opacity-50 disabled:cursor-not-allowed
                             transition-colors flex items-center justify-center"
                  title="Attach files"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      addFiles(e.target.files)
                      e.target.value = '' // Reset to allow selecting same file again
                    }
                  }}
                  accept=".csv,.json,.pdf,.txt,.md,.yaml,.yml,.xml,.html,.docx,.py,.js,.ts,.sql,.jpg,.jpeg,.png,.bmp,.gif,.webp,.webm,.wav,.mp3,.m4a"
                />

                {/* Voice input button */}
                <VoiceInputButton
                  onTranscript={handleVoiceTranscript}
                  disabled={isLoading || isStreaming}
                />

                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={uploadedFiles.length > 0 ? "Add a message about your files..." : "Type a message..."}
                    disabled={isLoading || isStreaming}
                    rows={1}
                    className="w-full resize-none rounded-xl border border-gray-300 dark:border-neutral-600 px-4 py-3
                               bg-white dark:bg-neutral-800 text-gray-900 dark:text-white
                               placeholder-gray-400 dark:placeholder-neutral-500
                               focus:border-violet-500 dark:focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-800
                               disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:cursor-not-allowed
                               max-h-[150px] overflow-y-auto transition-colors"
                  />
                </div>
                {/* Stop button when streaming */}
                {isStreaming ? (
                  <button
                    onClick={stopGeneration}
                    className="flex-shrink-0 w-11 h-11 rounded-xl bg-red-500 text-white
                               hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-200
                               transition-colors flex items-center justify-center"
                    title="Stop generating"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="6" width="12" height="12" rx="1" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading || isUploading || !chatWorkflow}
                    className="flex-shrink-0 w-11 h-11 rounded-xl bg-violet-500 text-white
                               hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-200
                               disabled:bg-gray-300 disabled:cursor-not-allowed
                               transition-colors flex items-center justify-center"
                  >
                    {isLoading || isUploading ? (
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
                )}
              </div>
              <p className="text-xs text-gray-400 dark:text-neutral-500 mt-2 text-center">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        </FileDropZone>
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

function MessageBubble({
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
