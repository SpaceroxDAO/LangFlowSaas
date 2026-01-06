/**
 * EmbedModal - Modal to display embed code for sharing agents
 * Allows users to copy embed code to add their agent to any website
 */
import { useState } from 'react'
import type { Agent } from '@/types'

interface EmbedModalProps {
  agent: Agent
  isOpen: boolean
  onClose: () => void
}

// Get the Langflow host URL from environment or use default
const LANGFLOW_HOST = import.meta.env.VITE_LANGFLOW_HOST || 'http://localhost:7860'

export function EmbedModal({ agent, isOpen, onClose }: EmbedModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const embedCode = `<script
  src="https://cdn.jsdelivr.net/gh/logspace-ai/langflow-embedded-chat@v1.0.7/dist/build/static/js/bundle.min.js">
</script>
<langflow-chat
  window_title="${agent.name}"
  flow_id="${agent.langflow_flow_id}"
  host_url="${LANGFLOW_HOST}">
</langflow-chat>`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Embed into Site</h2>
              <p className="text-sm text-gray-500">Add {agent.name} to your website</p>
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
          {/* Instructions */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Copy the code below and paste it into your website's HTML to add a chat widget powered by {agent.name}.
            </p>
          </div>

          {/* Code Block */}
          <div className="relative">
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
            <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 pr-14 overflow-x-auto text-sm font-mono">
              <code>{embedCode}</code>
            </pre>
          </div>

          {/* Copied feedback */}
          {copied && (
            <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied to clipboard!
            </p>
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
              <li>• Place the code just before the closing <code className="bg-blue-100 px-1 rounded">&lt;/body&gt;</code> tag</li>
              <li>• The chat widget will appear as a floating button in the corner</li>
              <li>• Make sure your Langflow server is accessible from your website</li>
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
          <button
            onClick={handleCopy}
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
        </div>
      </div>
    </div>
  )
}
