import { useState } from 'react'
import { X, Copy, Check, Terminal, FileJson, RotateCcw } from 'lucide-react'

interface ConnectOpenClawModalProps {
  isOpen: boolean
  onClose: () => void
  token: string | null
}

export function ConnectOpenClawModal({ isOpen, onClose, token }: ConnectOpenClawModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  if (!isOpen) return null

  const mcpConfig = JSON.stringify(
    {
      mcpServers: {
        'teach-charlie': {
          command: 'npx',
          args: ['tc-connector', '--token', token || 'YOUR_TOKEN_HERE'],
        },
      },
    },
    null,
    2
  )

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-800">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Connect to OpenClaw
            </h2>
            <p className="text-sm text-gray-500 dark:text-neutral-400 mt-0.5">
              Use your workflows as tools in OpenClaw
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Steps */}
        <div className="p-6 space-y-6">
          {/* Step 1: Install */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">1</span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Install TC Connector
              </h3>
              <p className="text-sm text-gray-500 dark:text-neutral-400 mb-3">
                No installation needed if using npx. Or install globally:
              </p>
              <div className="relative">
                <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-3 font-mono text-sm text-gray-800 dark:text-neutral-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-gray-400" />
                    <span>npm install -g tc-connector</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard('npm install -g tc-connector', 'install')}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded transition-colors"
                  >
                    {copiedField === 'install' ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Configure */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">2</span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Add to OpenClaw Config
              </h3>
              <p className="text-sm text-gray-500 dark:text-neutral-400 mb-3">
                Copy this into your <code className="px-1 py-0.5 bg-gray-100 dark:bg-neutral-800 rounded text-xs">.mcp.json</code> file:
              </p>
              <div className="relative">
                <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-3 font-mono text-xs text-gray-800 dark:text-neutral-200 overflow-x-auto">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <FileJson className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <pre className="whitespace-pre">{mcpConfig}</pre>
                    </div>
                    <button
                      onClick={() => copyToClipboard(mcpConfig, 'config')}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded transition-colors flex-shrink-0 ml-2"
                    >
                      {copiedField === 'config' ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Restart */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">3</span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Restart OpenClaw
              </h3>
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                Restart OpenClaw and your skill-enabled workflows will appear as available tools.
                Make sure you've enabled at least one workflow as a skill in the Workflows tab.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-neutral-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
