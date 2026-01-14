/**
 * useStreamingChat - Hook for streaming chat with agent visibility
 *
 * Provides real-time streaming of chat responses with support for:
 * - Token-by-token text streaming
 * - Tool call visualization
 * - Agent thinking/reasoning display
 * - Stop generation functionality
 */

import { useState, useCallback, useRef } from 'react'
import { api } from '@/lib/api'
import type {
  StreamEvent,
  StreamingMessage,
  ToolCall,
  ThinkingBlock,
  ContentBlock,
  ChatMessage,
} from '@/types'

interface UseStreamingChatOptions {
  workflowId: string | undefined
  onMessageComplete?: (message: ChatMessage, conversationId: string) => void
  onError?: (error: Error) => void
}

interface UseStreamingChatReturn {
  /** Current streaming message (null when not streaming) */
  streamingMessage: StreamingMessage | null
  /** Whether currently streaming a response */
  isStreaming: boolean
  /** Send a message and start streaming response */
  sendMessage: (message: string, conversationId?: string) => Promise<void>
  /** Stop the current generation */
  stopGeneration: () => void
  /** Current conversation ID from session */
  sessionConversationId: string | null
}

export function useStreamingChat({
  workflowId,
  onMessageComplete,
  onError,
}: UseStreamingChatOptions): UseStreamingChatReturn {
  const [streamingMessage, setStreamingMessage] = useState<StreamingMessage | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [sessionConversationId, setSessionConversationId] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleStreamEvent = useCallback((event: StreamEvent) => {
    setStreamingMessage((prev) => {
      if (!prev) return prev

      const updated = { ...prev }

      switch (event.event) {
        case 'session_start':
          // Store conversation and message IDs
          if (event.data.conversation_id) {
            setSessionConversationId(event.data.conversation_id as string)
          }
          if (event.data.message_id) {
            updated.id = event.data.message_id as string
          }
          break

        case 'text_delta':
          // Append text chunk
          updated.content += event.data.text as string || ''
          break

        case 'text_complete':
          // Set final complete text
          updated.content = event.data.text as string || updated.content
          break

        case 'thinking_start':
          // Initialize thinking block
          updated.thinking = {
            content: '',
            isComplete: false,
          }
          break

        case 'thinking_delta':
          // Append to thinking content
          if (updated.thinking) {
            updated.thinking = {
              ...updated.thinking,
              content: updated.thinking.content + (event.data.content as string || ''),
            }
          }
          break

        case 'thinking_end':
          // Mark thinking as complete
          if (updated.thinking) {
            updated.thinking = {
              content: event.data.content as string || updated.thinking.content,
              isComplete: true,
            }
          }
          break

        case 'tool_call_start': {
          // Add new tool call
          const toolData = event.data as {
            id: string
            name: string
            input?: Record<string, unknown>
            status: string
            started_at?: string
          }
          const newToolCall: ToolCall = {
            id: toolData.id,
            name: toolData.name,
            input: toolData.input,
            status: 'running',
            startedAt: toolData.started_at ? new Date(toolData.started_at) : new Date(),
          }
          updated.toolCalls = [...(updated.toolCalls || []), newToolCall]
          break
        }

        case 'tool_call_end': {
          // Update tool call with result
          const resultData = event.data as {
            id: string
            name: string
            output?: string
            error?: string
            status: string
            completed_at?: string
          }
          if (updated.toolCalls) {
            updated.toolCalls = updated.toolCalls.map((tc) =>
              tc.id === resultData.id
                ? {
                    ...tc,
                    output: resultData.output,
                    error: resultData.error,
                    status: resultData.error ? 'failed' : 'completed',
                    completedAt: resultData.completed_at
                      ? new Date(resultData.completed_at)
                      : new Date(),
                  }
                : tc
            )
          }
          break
        }

        case 'content_block_end': {
          // Add content block
          const blockData = event.data as {
            id: string
            type: string
            content: string
            language?: string
            title?: string
            metadata?: Record<string, unknown>
          }
          const newBlock: ContentBlock = {
            id: blockData.id,
            type: blockData.type as ContentBlock['type'],
            content: blockData.content,
            language: blockData.language,
            title: blockData.title,
            metadata: blockData.metadata,
          }
          updated.contentBlocks = [...(updated.contentBlocks || []), newBlock]
          break
        }

        case 'error': {
          // Handle error
          const errorData = event.data as { code: string; message: string }
          console.error('Stream error:', errorData)
          updated.status = 'error'
          if (!updated.content) {
            updated.content = errorData.message || 'An error occurred'
          }
          break
        }

        case 'done':
          // Stream complete
          updated.isStreaming = false
          updated.status = 'sent'
          break
      }

      return updated
    })
  }, [])

  const sendMessage = useCallback(
    async (message: string, conversationId?: string) => {
      if (!workflowId || isStreaming) return

      // Cancel any existing stream
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()

      setIsStreaming(true)

      // Initialize streaming message
      const initialMessage: StreamingMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        status: 'sending',
        isStreaming: true,
        toolCalls: [],
        thinking: undefined,
        contentBlocks: [],
      }
      setStreamingMessage(initialMessage)

      try {
        await api.chatWithWorkflowStream(
          workflowId,
          {
            message,
            conversation_id: conversationId,
          },
          handleStreamEvent,
          abortControllerRef.current.signal
        )

        // Get final message state
        setStreamingMessage((finalMsg) => {
          if (finalMsg && onMessageComplete) {
            // Convert to regular ChatMessage for callback
            const completedMessage: ChatMessage = {
              id: finalMsg.id,
              role: 'assistant',
              content: finalMsg.content,
              timestamp: finalMsg.timestamp,
              status: 'sent',
            }
            // Use the conversation ID from session
            const convId = sessionConversationId || conversationId || ''
            onMessageComplete(completedMessage, convId)
          }
          return finalMsg
        })
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          // User stopped generation - this is expected
          setStreamingMessage((prev) =>
            prev
              ? {
                  ...prev,
                  isStreaming: false,
                  status: 'sent',
                }
              : null
          )
        } else {
          console.error('Streaming error:', error)
          onError?.(error as Error)
          setStreamingMessage((prev) =>
            prev
              ? {
                  ...prev,
                  isStreaming: false,
                  status: 'error',
                  content: prev.content || 'Something went wrong. Please try again.',
                }
              : null
          )
        }
      } finally {
        setIsStreaming(false)
      }
    },
    [workflowId, isStreaming, handleStreamEvent, onMessageComplete, onError, sessionConversationId]
  )

  const stopGeneration = useCallback(() => {
    abortControllerRef.current?.abort()
    setIsStreaming(false)
    setStreamingMessage((prev) =>
      prev
        ? {
            ...prev,
            isStreaming: false,
            status: 'sent',
          }
        : null
    )
  }, [])

  return {
    streamingMessage,
    isStreaming,
    sendMessage,
    stopGeneration,
    sessionConversationId,
  }
}
