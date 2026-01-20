import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuth } from '@/providers/DevModeProvider'
import { useTheme } from '@/providers/ThemeProvider'

export function SettingsPage() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const { theme, setTheme } = useTheme()
  const [defaultProvider, setDefaultProvider] = useState('openai')

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

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme) // Updates theme via ThemeProvider (localStorage + DOM)
    updateMutation.mutate({ theme: newTheme }) // Persist to server
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
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
      <p className="text-gray-500 dark:text-neutral-400 mb-8">Manage your account and preferences</p>

      {/* General Settings */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">General</h2>

        {/* Theme */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
            Theme
          </label>
          <div className="flex gap-2">
            {(['light', 'dark'] as const).map((t) => (
              <button
                key={t}
                onClick={() => handleThemeChange(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  theme === t
                    ? 'bg-violet-500 text-white'
                    : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Default LLM Provider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
            Default AI Provider
          </label>
          <select
            value={defaultProvider}
            onChange={(e) => handleProviderChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
          >
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="google">Google</option>
          </select>
        </div>
      </div>

      {/* API Keys Section */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">API Keys</h2>
        <p className="text-sm text-gray-500 dark:text-neutral-400 mb-4">
          Configure API keys for different AI providers. Keys are stored securely and encrypted.
        </p>

        <div className="space-y-4">
          {['openai', 'anthropic', 'google'].map((provider) => {
            const keyInfo = settings?.api_keys?.find(k => k.provider === provider)
            return (
              <div
                key={provider}
                className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-neutral-800 last:border-0"
              >
                <div>
                  <div className="font-medium text-gray-900 dark:text-white capitalize">{provider}</div>
                  <div className="text-sm text-gray-500 dark:text-neutral-400">
                    {keyInfo?.is_set ? (
                      <span className="text-green-600 dark:text-green-400">Configured</span>
                    ) : (
                      <span className="text-gray-400 dark:text-neutral-500">Not configured</span>
                    )}
                  </div>
                </div>
                <button
                  className="px-3 py-1.5 text-sm border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                  onClick={() => {
                    const key = prompt(`Enter your ${provider} API key:`)
                    if (key) {
                      api.setApiKey({ provider, api_key: key }).then(() => {
                        queryClient.invalidateQueries({ queryKey: ['settings'] })
                      })
                    }
                  }}
                >
                  {keyInfo?.is_set ? 'Update' : 'Add'}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Account Section */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account</h2>
        <p className="text-sm text-gray-500 dark:text-neutral-400">
          Your account is managed through Clerk authentication.
        </p>
      </div>
    </div>
  )
}
