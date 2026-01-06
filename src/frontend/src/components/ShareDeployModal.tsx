/**
 * ShareDeployModal - Comprehensive modal for sharing and deploying agents
 *
 * Provides multiple deployment options:
 * - Share Link: Public playground URL for instant sharing
 * - Embed Widget: JavaScript snippet for website embedding
 * - Webhook: URL for external service integration
 * - API: REST API endpoint for programmatic access
 */
import React, { useState } from 'react'
import type { Agent } from '@/types'

interface ShareDeployModalProps {
  agent: Agent
  isOpen: boolean
  onClose: () => void
}

type TabType = 'share' | 'embed' | 'webhook' | 'api'

// Get the Langflow host URL from environment or use default
const LANGFLOW_HOST = import.meta.env.VITE_LANGFLOW_HOST || 'http://localhost:7860'

export function ShareDeployModal({ agent, isOpen, onClose }: ShareDeployModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('share')
  const [copiedField, setCopiedField] = useState<string | null>(null)

  if (!isOpen) return null

  // URLs for different deployment methods
  const shareUrl = `${LANGFLOW_HOST}/flow/${agent.langflow_flow_id}`
  const webhookUrl = `${LANGFLOW_HOST}/api/v1/webhook/${agent.langflow_flow_id}`
  const apiUrl = `${LANGFLOW_HOST}/api/v1/run/${agent.langflow_flow_id}`

  const embedCode = `<!-- Teach Charlie AI Chat Widget -->
<script
  src="https://cdn.jsdelivr.net/gh/langflow-ai/langflow-embedded-chat@main/dist/build/static/js/bundle.min.js">
</script>
<langflow-chat
  window_title="${agent.name}"
  flow_id="${agent.langflow_flow_id}"
  host_url="${LANGFLOW_HOST}"
  chat_trigger_style='{"backgroundColor": "#f97316", "borderRadius": "50%"}'
  bot_message_style='{"backgroundColor": "#f3f4f6", "color": "#1f2937"}'
  user_message_style='{"backgroundColor": "#f97316", "color": "#ffffff"}'
  placeholder="Ask ${agent.name} anything..."
></langflow-chat>`

  const curlExample = `curl -X POST "${apiUrl}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "input_value": "Hello, how can you help me?",
    "output_type": "chat",
    "input_type": "chat"
  }'`

  const pythonExample = `import requests

response = requests.post(
    "${apiUrl}",
    json={
        "input_value": "Hello, how can you help me?",
        "output_type": "chat",
        "input_type": "chat"
    }
)
print(response.json())`

  const jsExample = `const response = await fetch("${apiUrl}", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    input_value: "Hello, how can you help me?",
    output_type: "chat",
    input_type: "chat"
  })
});
const data = await response.json();
console.log(data);`

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'share',
      label: 'Share Link',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      ),
    },
    {
      id: 'embed',
      label: 'Embed Widget',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      id: 'webhook',
      label: 'Webhook',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
    },
    {
      id: 'api',
      label: 'API',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Share & Deploy</h2>
              <p className="text-sm text-gray-500">Deploy {agent.name} anywhere</p>
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

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6 flex-shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-violet-500 text-violet-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Share Link Tab */}
          {activeTab === 'share' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Public Playground Link</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Share this link with anyone to let them chat with {agent.name}. No signup required.
                </p>
                <CopyField
                  value={shareUrl}
                  onCopy={() => handleCopy(shareUrl, 'share')}
                  copied={copiedField === 'share'}
                />
              </div>

              <div className="p-4 bg-green-50 rounded-xl">
                <h4 className="text-sm font-medium text-green-900 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Perfect for
                </h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Quick demos and presentations</li>
                  <li>• Sharing with clients or stakeholders</li>
                  <li>• Testing with beta users</li>
                  <li>• Workshop participants</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => window.open(shareUrl, '_blank')}
                  className="flex-1 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open Link
                </button>
                <button
                  onClick={() => handleCopy(shareUrl, 'share')}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {copiedField === 'share' ? (
                    <>
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Embed Widget Tab */}
          {activeTab === 'embed' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Embed Code</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Add this code to your website to display a floating chat widget powered by {agent.name}.
                </p>
              </div>

              <CodeBlock
                code={embedCode}
                language="html"
                onCopy={() => handleCopy(embedCode, 'embed')}
                copied={copiedField === 'embed'}
              />

              <div className="p-4 bg-blue-50 rounded-xl">
                <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Installation Tips
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Paste before the closing <code className="bg-blue-100 px-1 rounded">&lt;/body&gt;</code> tag</li>
                  <li>• Widget appears as a floating button in the corner</li>
                  <li>• Customize colors by editing the style attributes</li>
                  <li>• Works on any website, landing page, or web app</li>
                </ul>
              </div>
            </div>
          )}

          {/* Webhook Tab */}
          {activeTab === 'webhook' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Webhook URL</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Use this URL in Zapier, Make, or any service that supports webhooks to trigger {agent.name}.
                </p>
                <CopyField
                  value={webhookUrl}
                  onCopy={() => handleCopy(webhookUrl, 'webhook')}
                  copied={copiedField === 'webhook'}
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Example Request</h4>
                <CodeBlock
                  code={`POST ${webhookUrl}
Content-Type: application/json

{
  "input_value": "Your message here"
}`}
                  language="http"
                  onCopy={() => handleCopy(`POST ${webhookUrl}\nContent-Type: application/json\n\n{\n  "input_value": "Your message here"\n}`, 'webhook-example')}
                  copied={copiedField === 'webhook-example'}
                />
              </div>

              <div className="p-4 bg-purple-50 rounded-xl">
                <h4 className="text-sm font-medium text-purple-900 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Integration Ideas
                </h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Trigger from Zapier when a new form is submitted</li>
                  <li>• Connect to Slack for automated responses</li>
                  <li>• Process incoming emails through {agent.name}</li>
                  <li>• Build custom integrations with any service</li>
                </ul>
              </div>
            </div>
          )}

          {/* API Tab */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">API Endpoint</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Call {agent.name} programmatically from your application using the REST API.
                </p>
                <CopyField
                  value={apiUrl}
                  onCopy={() => handleCopy(apiUrl, 'api-url')}
                  copied={copiedField === 'api-url'}
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Code Examples</h4>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">cURL</p>
                    <CodeBlock
                      code={curlExample}
                      language="bash"
                      onCopy={() => handleCopy(curlExample, 'curl')}
                      copied={copiedField === 'curl'}
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Python</p>
                    <CodeBlock
                      code={pythonExample}
                      language="python"
                      onCopy={() => handleCopy(pythonExample, 'python')}
                      copied={copiedField === 'python'}
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">JavaScript</p>
                    <CodeBlock
                      code={jsExample}
                      language="javascript"
                      onCopy={() => handleCopy(jsExample, 'js')}
                      copied={copiedField === 'js'}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  API Documentation
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  View the full API documentation for advanced options like streaming, session management, and more.
                </p>
                <a
                  href={`${LANGFLOW_HOST}/docs`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
                >
                  Open API Docs
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// Helper component for copy fields
function CopyField({ value, onCopy, copied }: { value: string; onCopy: () => void; copied: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={value}
        readOnly
        className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono text-gray-700"
      />
      <button
        onClick={onCopy}
        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
          copied
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {copied ? (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Copied
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </>
        )}
      </button>
    </div>
  )
}

// Helper component for code blocks
function CodeBlock({ code, language, onCopy, copied }: { code: string; language: string; onCopy: () => void; copied: boolean }) {
  return (
    <div className="relative">
      <button
        onClick={onCopy}
        className={`absolute top-3 right-3 p-2 rounded-lg transition-colors ${
          copied
            ? 'bg-green-500/20 text-green-400'
            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
        }`}
        title="Copy to clipboard"
      >
        {copied ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 pr-14 overflow-x-auto text-sm font-mono">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )
}
