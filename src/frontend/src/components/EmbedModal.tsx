/**
 * EmbedModal - Modal to enable/disable embedding and copy embed code
 * Works with both Agent and AgentComponent types
 */
import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Agent, AgentComponent } from '@/types'

interface EmbedModalProps {
  // Support both old Agent type and new AgentComponent type
  agent?: Agent
  agentComponent?: AgentComponent
  isOpen: boolean
  onClose: () => void
}

// Get backend URL for embed endpoint
const BACKEND_URL = import.meta.env.VITE_API_URL || ''

export function EmbedModal({ agent, agentComponent, isOpen, onClose }: EmbedModalProps) {
  const queryClient = useQueryClient()
  const [copied, setCopied] = useState(false)
  const [embedCode, setEmbedCode] = useState<string | null>(null)
  const [embedToken, setEmbedToken] = useState<string | null>(null)
  const [isEnabled, setIsEnabled] = useState(false)
  const [welcomeMessage, setWelcomeMessage] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#7C3AED')

  // Determine which entity we're working with
  const entity = agentComponent || agent
  const entityId = entity?.id || ''
  const entityName = entity?.name || 'Agent'
  const isAgentComponent = !!agentComponent

  // Check current embed status
  useEffect(() => {
    if (isOpen && agentComponent) {
      setIsEnabled(agentComponent.is_embeddable || false)
      setEmbedToken(agentComponent.embed_token || null)
      const config = agentComponent.embed_config || {}
      setWelcomeMessage(config.welcome_message || '')
      setPrimaryColor(config.primary_color || '#7C3AED')
    }
  }, [isOpen, agentComponent])

  // Enable embed mutation
  const enableMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${BACKEND_URL}/api/v1/embed/${entityId}/enable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          embed_config: {
            theme: 'light',
            primary_color: primaryColor,
            welcome_message: welcomeMessage || null,
            placeholder: 'Type your message...',
          },
        }),
      })
      if (!response.ok) throw new Error('Failed to enable embed')
      return response.json()
    },
    onSuccess: (data) => {
      setEmbedCode(data.embed_code)
      setEmbedToken(data.embed_token)
      setIsEnabled(true)
      queryClient.invalidateQueries({ queryKey: ['agent-components'] })
    },
  })

  // Disable embed mutation
  const disableMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${BACKEND_URL}/api/v1/embed/${entityId}/disable`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Failed to disable embed')
      return response.json()
    },
    onSuccess: () => {
      setIsEnabled(false)
      setEmbedCode(null)
      setEmbedToken(null)
      queryClient.invalidateQueries({ queryKey: ['agent-components'] })
    },
  })

  // Get embed code mutation
  const getCodeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${BACKEND_URL}/api/v1/embed/${entityId}/code`)
      if (!response.ok) throw new Error('Failed to get embed code')
      return response.json()
    },
    onSuccess: (data) => {
      setEmbedCode(data.embed_code)
      setEmbedToken(data.embed_token)
    },
  })

  // Load embed code on open if already enabled
  useEffect(() => {
    if (isOpen && isEnabled && !embedCode && isAgentComponent) {
      getCodeMutation.mutate()
    }
  }, [isOpen, isEnabled])

  if (!isOpen) return null

  // SECURITY: Escape HTML special characters to prevent XSS in embed code
  const escapeHtml = (str: string): string => {
    const htmlEscapes: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }
    return str.replace(/[&<>"']/g, (char) => htmlEscapes[char] || char)
  }

  // Legacy embed code for old Agent type (uses Langflow)
  // SECURITY: Escape agent name and flow ID to prevent XSS
  const legacyEmbedCode = agent ? `<script
  src="https://cdn.jsdelivr.net/gh/logspace-ai/langflow-embedded-chat@v1.0.7/dist/build/static/js/bundle.min.js">
</script>
<langflow-chat
  window_title="${escapeHtml(agent.name || '')}"
  flow_id="${escapeHtml(agent.langflow_flow_id || '')}"
  host_url="${import.meta.env.VITE_LANGFLOW_HOST || 'http://localhost:7860'}">
</langflow-chat>` : ''

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleEnable = () => {
    enableMutation.mutate()
  }

  const handleDisable = () => {
    if (confirm('Disable embedding? The embed code will stop working on external sites.')) {
      disableMutation.mutate()
    }
  }

  const isLoading = enableMutation.isPending || disableMutation.isPending || getCodeMutation.isPending

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Embed Widget</h2>
              <p className="text-sm text-gray-500">Add {entityName} to your website</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* For AgentComponent - new embed system */}
          {isAgentComponent && (
            <>
              {/* Enable/Disable Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-6">
                <div>
                  <h3 className="font-medium text-gray-900">Embed Status</h3>
                  <p className="text-sm text-gray-500">
                    {isEnabled ? 'Widget is active and can be embedded' : 'Enable to get embed code'}
                  </p>
                </div>
                <button
                  onClick={isEnabled ? handleDisable : handleEnable}
                  disabled={isLoading}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isEnabled ? 'bg-violet-600' : 'bg-gray-300'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Configuration (only when enabling) */}
              {!isEnabled && (
                <div className="space-y-4 mb-6">
                  <h4 className="font-medium text-gray-900">Widget Settings</h4>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Welcome Message (optional)</label>
                    <input
                      type="text"
                      value={welcomeMessage}
                      onChange={(e) => setWelcomeMessage(e.target.value)}
                      placeholder="Hi! How can I help you today?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Primary Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-violet-500 font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Embed Code (when enabled) */}
              {isEnabled && embedCode && (
                <>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      Copy the code below and paste it into your website's HTML.
                    </p>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => handleCopy(embedCode)}
                      className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? (
                        <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                    <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 pr-14 overflow-x-auto text-sm font-mono whitespace-pre-wrap">
                      <code>{embedCode}</code>
                    </pre>
                  </div>

                  {copied && (
                    <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied to clipboard!
                    </p>
                  )}
                </>
              )}
            </>
          )}

          {/* For old Agent type - legacy Langflow embed */}
          {!isAgentComponent && agent && (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Copy the code below and paste it into your website's HTML to add a chat widget powered by {agent.name}.
                </p>
              </div>

              <div className="relative">
                <button
                  onClick={() => handleCopy(legacyEmbedCode)}
                  className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
                <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 pr-14 overflow-x-auto text-sm font-mono">
                  <code>{legacyEmbedCode}</code>
                </pre>
              </div>

              {copied && (
                <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied to clipboard!
                </p>
              )}
            </>
          )}

          {/* Tips */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tips
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>Place the code just before the closing <code className="bg-blue-100 px-1 rounded">&lt;/body&gt;</code> tag</li>
              <li>The chat widget will appear as a floating button in the corner</li>
              <li>Users can click the button to open the chat window</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
          >
            Close
          </button>
          {isEnabled && embedCode && (
            <button
              onClick={() => handleCopy(embedCode)}
              className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors font-medium flex items-center gap-2"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Code
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
