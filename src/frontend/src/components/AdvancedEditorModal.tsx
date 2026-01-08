/**
 * AdvancedEditorModal - Modal for configuring LLM settings
 *
 * Allows users to customize:
 * - Model provider (OpenAI, Anthropic, Google)
 * - Model name
 * - Temperature
 * - Max tokens
 * - Max iterations
 * - Verbose mode
 * - Error handling
 * - Chat history
 */
import { useState, useEffect } from 'react'
import type { AgentComponentAdvancedConfig } from '@/types'

// Model options by provider
const MODEL_OPTIONS: Record<string, string[]> = {
  OpenAI: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  Anthropic: ['claude-3-haiku-20240307', 'claude-3-sonnet-20240229', 'claude-3-opus-20240229'],
  Google: ['gemini-1.5-flash', 'gemini-1.5-pro'],
  'Azure OpenAI': ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo'],
}

// Default configuration values
const DEFAULT_CONFIG: AgentComponentAdvancedConfig = {
  model_provider: 'OpenAI',
  model_name: 'gpt-4o-mini',
  temperature: 0.7,
  max_tokens: 4096,
  max_iterations: 10,
  verbose: false,
  handle_parsing_errors: true,
  chat_history_enabled: true,
}

interface AdvancedEditorModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (config: AgentComponentAdvancedConfig) => void
  initialConfig?: Partial<AgentComponentAdvancedConfig>
  isSaving?: boolean
}

export function AdvancedEditorModal({
  isOpen,
  onClose,
  onSave,
  initialConfig,
  isSaving = false,
}: AdvancedEditorModalProps) {
  const [config, setConfig] = useState<AgentComponentAdvancedConfig>({
    ...DEFAULT_CONFIG,
    ...initialConfig,
  })

  // Reset config when modal opens with new initial values
  useEffect(() => {
    if (isOpen) {
      setConfig({
        ...DEFAULT_CONFIG,
        ...initialConfig,
      })
    }
  }, [isOpen, initialConfig])

  // Update model name when provider changes
  const handleProviderChange = (provider: string) => {
    const models = MODEL_OPTIONS[provider] || MODEL_OPTIONS.OpenAI
    setConfig({
      ...config,
      model_provider: provider,
      model_name: models[0],
    })
  }

  const handleSave = () => {
    onSave(config)
  }

  if (!isOpen) return null

  const availableModels = MODEL_OPTIONS[config.model_provider] || MODEL_OPTIONS.OpenAI

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Advanced Settings</h2>
            <p className="text-sm text-gray-500 mt-0.5">Configure LLM behavior and model settings</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Model Selection Section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Model Selection
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Provider</label>
                <select
                  value={config.model_provider}
                  onChange={(e) => handleProviderChange(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                >
                  {Object.keys(MODEL_OPTIONS).map((provider) => (
                    <option key={provider} value={provider}>{provider}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Model</label>
                <select
                  value={config.model_name}
                  onChange={(e) => setConfig({ ...config, model_name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                >
                  {availableModels.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Generation Settings Section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Generation Settings
            </h3>

            {/* Temperature Slider */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-600">Temperature (Creativity)</label>
                <span className="text-sm font-medium text-violet-600">{config.temperature.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.01"
                value={config.temperature}
                onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Precise (0)</span>
                <span>Balanced (1)</span>
                <span>Creative (2)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Max Tokens</label>
                <input
                  type="number"
                  min="1"
                  max="128000"
                  value={config.max_tokens}
                  onChange={(e) => setConfig({ ...config, max_tokens: parseInt(e.target.value) || 4096 })}
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">Maximum response length</p>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Max Iterations</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={config.max_iterations}
                  onChange={(e) => setConfig({ ...config, max_iterations: parseInt(e.target.value) || 10 })}
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">Max reasoning steps</p>
              </div>
            </div>
          </div>

          {/* Behavior Settings Section */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Behavior Settings
            </h3>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={config.chat_history_enabled}
                  onChange={(e) => setConfig({ ...config, chat_history_enabled: e.target.checked })}
                  className="w-4 h-4 text-violet-500 rounded border-gray-300 focus:ring-violet-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Enable Chat History</span>
                  <p className="text-xs text-gray-500">Remember previous messages for context</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={config.handle_parsing_errors}
                  onChange={(e) => setConfig({ ...config, handle_parsing_errors: e.target.checked })}
                  className="w-4 h-4 text-violet-500 rounded border-gray-300 focus:ring-violet-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Handle Parsing Errors</span>
                  <p className="text-xs text-gray-500">Gracefully recover from LLM output errors</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={config.verbose}
                  onChange={(e) => setConfig({ ...config, verbose: e.target.checked })}
                  className="w-4 h-4 text-violet-500 rounded border-gray-300 focus:ring-violet-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Verbose Mode</span>
                  <p className="text-xs text-gray-500">Show detailed reasoning steps in output</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => setConfig({ ...DEFAULT_CONFIG })}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            Reset to Defaults
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-violet-500 text-white text-sm font-medium rounded-xl hover:bg-violet-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
