import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Sun, Moon, Bell, CreditCard, Key, User, Palette, Zap, ExternalLink, Plug, Copy, Check, RotateCcw } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuth } from '@/providers/DevModeProvider'
import { useTheme } from '@/providers/ThemeProvider'
import { ConnectOpenClawModal } from '@/components/ConnectOpenClawModal'

export function SettingsPage() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const { theme, setTheme } = useTheme()
  const [defaultProvider, setDefaultProvider] = useState('openai')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [usageAlerts, setUsageAlerts] = useState(true)
  const [showOpenClawModal, setShowOpenClawModal] = useState(false)
  const [generatedToken, setGeneratedToken] = useState<string | null>(null)
  const [tokenCopied, setTokenCopied] = useState(false)

  useEffect(() => {
    api.setTokenGetter(getToken)
  }, [getToken])

  // Fetch settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.getSettings(),
  })

  // Update settings when data loads
  useEffect(() => {
    if (settings) {
      setDefaultProvider(settings.default_llm_provider || 'openai')
    }
  }, [settings])

  // Update settings mutation
  const updateMutation = useMutation({
    mutationFn: (data: { theme?: 'light' | 'dark'; default_llm_provider?: string }) =>
      api.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
  })

  // MCP Token
  const { data: tokenStatus, refetch: refetchTokenStatus } = useQuery({
    queryKey: ['mcp-token-status'],
    queryFn: () => api.getMCPTokenStatus(),
  })

  const generateTokenMutation = useMutation({
    mutationFn: () => api.generateMCPToken(),
    onSuccess: (data) => {
      setGeneratedToken(data.token)
      refetchTokenStatus()
    },
  })

  const revokeTokenMutation = useMutation({
    mutationFn: () => api.revokeMCPToken(),
    onSuccess: () => {
      setGeneratedToken(null)
      refetchTokenStatus()
    },
  })

  const copyToken = (text: string) => {
    navigator.clipboard.writeText(text)
    setTokenCopied(true)
    setTimeout(() => setTokenCopied(false), 2000)
  }

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme)
    updateMutation.mutate({ theme: newTheme })
  }

  const handleProviderChange = (provider: string) => {
    setDefaultProvider(provider)
    updateMutation.mutate({ default_llm_provider: provider })
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 dark:bg-neutral-700 rounded mb-4"></div>
          <div className="h-4 w-64 bg-gray-100 dark:bg-neutral-800 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
      <p className="text-gray-500 dark:text-neutral-400 mb-8">Manage your account preferences and configurations</p>

      {/* Appearance Section */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
            <Palette className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
        </div>

        <div className="space-y-4">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Theme</div>
              <div className="text-sm text-gray-500 dark:text-neutral-400">Choose your preferred color scheme</div>
            </div>
            <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-neutral-800 rounded-lg">
              <button
                onClick={() => handleThemeChange('light')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  theme === 'light'
                    ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200'
                }`}
              >
                <Sun className="w-4 h-4" />
                Light
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  theme === 'dark'
                    ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200'
                }`}
              >
                <Moon className="w-4 h-4" />
                Dark
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Provider Section */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
            <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Configuration</h2>
        </div>

        <div className="space-y-4">
          {/* Default Provider */}
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Default AI Provider</div>
              <div className="text-sm text-gray-500 dark:text-neutral-400">Used when creating new agents</div>
            </div>
            <select
              value={defaultProvider}
              onChange={(e) => handleProviderChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="google">Google</option>
            </select>
          </div>
        </div>
      </div>

      {/* API Keys Section */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <Key className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">API Keys</h2>
            <p className="text-sm text-gray-500 dark:text-neutral-400">Securely stored and encrypted</p>
          </div>
        </div>

        <div className="space-y-1">
          {['openai', 'anthropic', 'google'].map((provider) => {
            const keyInfo = settings?.api_keys?.find(k => k.provider === provider)
            const providerNames: Record<string, string> = {
              openai: 'OpenAI',
              anthropic: 'Anthropic',
              google: 'Google AI'
            }
            return (
              <div
                key={provider}
                className="flex items-center justify-between py-3 px-4 -mx-4 hover:bg-gray-50 dark:hover:bg-neutral-800/50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${keyInfo?.is_set ? 'bg-green-500' : 'bg-gray-300 dark:bg-neutral-600'}`} />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{providerNames[provider]}</div>
                    <div className="text-xs text-gray-500 dark:text-neutral-400">
                      {keyInfo?.is_set ? 'API key configured' : 'No API key set'}
                    </div>
                  </div>
                </div>
                <button
                  className="px-3 py-1.5 text-sm font-medium text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors"
                  onClick={() => {
                    const key = prompt(`Enter your ${providerNames[provider]} API key:`)
                    if (key) {
                      api.setApiKey({ provider, api_key: key }).then(() => {
                        queryClient.invalidateQueries({ queryKey: ['settings'] })
                      })
                    }
                  }}
                >
                  {keyInfo?.is_set ? 'Update' : 'Configure'}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
        </div>

        <div className="space-y-4">
          {/* Email notifications */}
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Email Notifications</div>
              <div className="text-sm text-gray-500 dark:text-neutral-400">Receive updates about your account</div>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                notificationsEnabled ? 'bg-violet-500' : 'bg-gray-300 dark:bg-neutral-600'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Usage alerts */}
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Usage Alerts</div>
              <div className="text-sm text-gray-500 dark:text-neutral-400">Get notified when credits are running low</div>
            </div>
            <button
              onClick={() => setUsageAlerts(!usageAlerts)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                usageAlerts ? 'bg-violet-500' : 'bg-gray-300 dark:bg-neutral-600'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  usageAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* OpenClaw Connection Section */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Plug className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">OpenClaw Connection</h2>
            <p className="text-sm text-gray-500 dark:text-neutral-400">Connect your workflow skills to local AI agents</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Token Status */}
          <div className="py-3">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">MCP Bridge Token</div>
                <div className="text-sm text-gray-500 dark:text-neutral-400">
                  {tokenStatus?.has_token
                    ? `Active: ${tokenStatus.token_preview}`
                    : 'No token generated'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {tokenStatus?.has_token && (
                  <button
                    onClick={() => {
                      if (confirm('Regenerate token? The current token will stop working.')) {
                        generateTokenMutation.mutate()
                      }
                    }}
                    disabled={generateTokenMutation.isPending}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Regenerate
                  </button>
                )}
                <button
                  onClick={() => generateTokenMutation.mutate()}
                  disabled={generateTokenMutation.isPending}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  {generateTokenMutation.isPending
                    ? 'Generating...'
                    : tokenStatus?.has_token
                      ? 'New Token'
                      : 'Generate Token'}
                </button>
              </div>
            </div>

            {/* Show generated token (only right after generation) */}
            {generatedToken && (
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                    Your MCP Token (copy now — it won't be shown again)
                  </span>
                  <button
                    onClick={() => copyToken(generatedToken)}
                    className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded transition-colors"
                  >
                    {tokenCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <code className="block text-sm font-mono text-purple-900 dark:text-purple-100 bg-white dark:bg-neutral-800 p-2 rounded border border-purple-200 dark:border-purple-700 break-all">
                  {generatedToken}
                </code>
              </div>
            )}
          </div>

          {/* Connect OpenClaw button */}
          <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-neutral-800">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Setup Guide</div>
              <div className="text-sm text-gray-500 dark:text-neutral-400">Step-by-step instructions to connect OpenClaw</div>
            </div>
            <button
              onClick={() => setShowOpenClawModal(true)}
              className="px-3 py-1.5 text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
            >
              View Guide
            </button>
          </div>

          {/* Revoke token */}
          {tokenStatus?.has_token && (
            <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-neutral-800">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Revoke Token</div>
                <div className="text-sm text-gray-500 dark:text-neutral-400">Disconnect all external agents</div>
              </div>
              <button
                onClick={() => {
                  if (confirm('Revoke token? All connected agents will lose access.')) {
                    revokeTokenMutation.mutate()
                  }
                }}
                disabled={revokeTokenMutation.isPending}
                className="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                Revoke
              </button>
            </div>
          )}
        </div>
      </div>

      {/* OpenClaw Setup Modal */}
      <ConnectOpenClawModal
        isOpen={showOpenClawModal}
        onClose={() => setShowOpenClawModal(false)}
        token={generatedToken || (tokenStatus?.has_token ? tokenStatus.token_preview : null)}
      />

      {/* Account & Billing Section */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <User className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Account</h2>
        </div>

        <div className="space-y-1">
          <Link
            to="/dashboard/billing"
            className="flex items-center justify-between py-3 px-4 -mx-4 hover:bg-gray-50 dark:hover:bg-neutral-800/50 rounded-lg transition-colors group"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-400 dark:text-neutral-500" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Billing & Subscription</div>
                <div className="text-sm text-gray-500 dark:text-neutral-400">Manage your plan and payment methods</div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 dark:text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <div className="py-3 px-4 -mx-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400 dark:text-neutral-500" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Profile</div>
                <div className="text-sm text-gray-500 dark:text-neutral-400">Managed through Clerk authentication</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
