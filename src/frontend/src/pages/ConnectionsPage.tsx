import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import { useAuth } from '@/providers/DevModeProvider'
import {
  Link2,
  Link2Off,
  RefreshCw,
  Trash2,
  ExternalLink,
  Check,
  AlertCircle,
  Clock,
  Mail,
  Calendar,
  MessageSquare,
  FileText,
  Users,
  HardDrive,
  Github,
  Layout,
  Loader2,
} from 'lucide-react'
import type { ComposioAppInfo, Connection } from '@/types'

// Icon mapping for apps
const APP_ICONS: Record<string, React.FC<{ className?: string }>> = {
  mail: Mail,
  calendar: Calendar,
  'message-square': MessageSquare,
  'file-text': FileText,
  users: Users,
  'hard-drive': HardDrive,
  github: Github,
  layout: Layout,
}

function getAppIcon(iconName: string) {
  return APP_ICONS[iconName] || Link2
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    active: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', icon: <Check className="w-3 h-3" /> },
    pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', icon: <Clock className="w-3 h-3" /> },
    expired: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', icon: <AlertCircle className="w-3 h-3" /> },
    revoked: { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-700 dark:text-gray-400', icon: <Link2Off className="w-3 h-3" /> },
    error: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: <AlertCircle className="w-3 h-3" /> },
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

// App card for connecting
function AppCard({
  app,
  onConnect,
  isConnecting,
}: {
  app: ComposioAppInfo
  onConnect: (appName: string) => void
  isConnecting: boolean
}) {
  const Icon = getAppIcon(app.icon)

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <Icon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">{app.display_name}</h3>
            <p className="text-sm text-gray-500 dark:text-neutral-400">{app.description}</p>
          </div>
        </div>
        {app.is_connected ? (
          <StatusBadge status={app.connection_status || 'active'} />
        ) : (
          <button
            onClick={() => onConnect(app.app_name)}
            disabled={isConnecting}
            className="px-3 py-1.5 text-sm font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors disabled:opacity-50"
          >
            {isConnecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Connect'
            )}
          </button>
        )}
      </div>
    </div>
  )
}

// Connected account card
function ConnectionCard({
  connection,
  onRevoke,
  onDelete,
  onRefresh,
  isRevoking,
}: {
  connection: Connection
  onRevoke: (id: string) => void
  onDelete: (id: string) => void
  onRefresh: (id: string) => void
  isRevoking: boolean
}) {
  const Icon = getAppIcon(connection.app_name)

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <Icon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900 dark:text-white">{connection.app_display_name}</h3>
              <StatusBadge status={connection.status} />
            </div>
            {connection.account_identifier && (
              <p className="text-sm text-gray-500 dark:text-neutral-400">{connection.account_identifier}</p>
            )}
            {connection.connected_at && (
              <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">
                Connected {new Date(connection.connected_at).toLocaleDateString()}
              </p>
            )}
            {connection.last_error && (
              <p className="text-xs text-red-500 dark:text-red-400 mt-1">{connection.last_error}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {connection.status === 'expired' || connection.status === 'error' ? (
            <button
              onClick={() => onRefresh(connection.id)}
              className="p-2 text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              title="Reconnect"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          ) : null}
          <button
            onClick={() => onRevoke(connection.id)}
            disabled={isRevoking}
            className="p-2 text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            title="Revoke access"
          >
            {isRevoking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2Off className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onDelete(connection.id)}
            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function ConnectionsPage() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [connectingApp, setConnectingApp] = useState<string | null>(null)
  const [revokingId, setRevokingId] = useState<string | null>(null)

  // Handle OAuth callback - check for both our connection_id and Composio's connectedAccountId
  const connectionId = searchParams.get('connection_id')
  const composioConnectedAccountId = searchParams.get('connectedAccountId')
  const callbackStatus = searchParams.get('status')
  const callbackAppName = searchParams.get('appName')

  useEffect(() => {
    api.setTokenGetter(getToken)
  }, [getToken])

  // Handle OAuth callback when connection_id or connectedAccountId is present
  useEffect(() => {
    const handleCallback = async () => {
      if (connectionId) {
        // Our internal connection_id - use directly
        try {
          await api.handleConnectionCallback({ connection_id: connectionId })
          queryClient.invalidateQueries({ queryKey: ['connections'] })
          queryClient.invalidateQueries({ queryKey: ['available-apps'] })
        } catch (error) {
          console.error('Callback error:', error)
        }
        setSearchParams({})
      } else if (composioConnectedAccountId && callbackStatus === 'success') {
        // Composio's connectedAccountId - look up by Composio ID
        try {
          await api.handleConnectionCallback({
            composio_connection_id: composioConnectedAccountId,
            app_name: callbackAppName || undefined
          })
          queryClient.invalidateQueries({ queryKey: ['connections'] })
          queryClient.invalidateQueries({ queryKey: ['available-apps'] })
        } catch (error) {
          console.error('Callback error:', error)
        }
        setSearchParams({})
      }
    }

    handleCallback()
  }, [connectionId, composioConnectedAccountId, callbackStatus, callbackAppName, queryClient, setSearchParams])

  // Fetch available apps
  const { data: appsData, isLoading: appsLoading } = useQuery({
    queryKey: ['available-apps'],
    queryFn: () => api.getAvailableApps(),
  })

  // Fetch user's connections
  const { data: connectionsData, isLoading: connectionsLoading } = useQuery({
    queryKey: ['connections'],
    queryFn: () => api.listConnections(1, 50, false),
  })

  // Initiate connection mutation
  const connectMutation = useMutation({
    mutationFn: (appName: string) => api.initiateConnection({ app_name: appName }),
    onSuccess: (data) => {
      // Redirect to OAuth URL
      window.location.href = data.redirect_url
    },
    onError: (error) => {
      console.error('Connect error:', error)
      setConnectingApp(null)
    },
  })

  // Revoke connection mutation
  const revokeMutation = useMutation({
    mutationFn: (connectionId: string) => api.revokeConnection(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] })
      queryClient.invalidateQueries({ queryKey: ['available-apps'] })
      setRevokingId(null)
    },
    onError: (error) => {
      console.error('Revoke error:', error)
      setRevokingId(null)
    },
  })

  // Delete connection mutation
  const deleteMutation = useMutation({
    mutationFn: (connectionId: string) => api.deleteConnection(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] })
      queryClient.invalidateQueries({ queryKey: ['available-apps'] })
    },
  })

  const handleConnect = (appName: string) => {
    setConnectingApp(appName)
    connectMutation.mutate(appName)
  }

  const handleRevoke = (connectionId: string) => {
    if (confirm('Are you sure you want to revoke access to this app?')) {
      setRevokingId(connectionId)
      revokeMutation.mutate(connectionId)
    }
  }

  const handleDelete = (connectionId: string) => {
    if (confirm('Are you sure you want to delete this connection? This cannot be undone.')) {
      deleteMutation.mutate(connectionId)
    }
  }

  const handleRefresh = (connectionId: string) => {
    api.refreshConnection(connectionId).then(() => {
      queryClient.invalidateQueries({ queryKey: ['connections'] })
    })
  }

  // Separate connected and available apps
  const connectedApps = appsData?.apps.filter(app => app.is_connected) || []
  const availableApps = appsData?.apps.filter(app => !app.is_connected) || []
  const connections = connectionsData?.connections || []

  const isLoading = appsLoading || connectionsLoading

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 dark:bg-neutral-700 rounded mb-4"></div>
          <div className="h-4 w-64 bg-gray-100 dark:bg-neutral-800 rounded mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-100 dark:bg-neutral-800 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Connected Accounts</h1>
      </div>
      <p className="text-gray-500 dark:text-neutral-400 mb-8">
        Connect your apps to let Charlie access your email, calendar, and more.
      </p>

      {/* Processing callback notice */}
      {connectionId && (
        <div className="mb-6 bg-violet-50 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 text-violet-600 dark:text-violet-400 animate-spin" />
            <span className="text-violet-700 dark:text-violet-300">Completing connection...</span>
          </div>
        </div>
      )}

      {/* Connected Accounts Section */}
      {connections.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            Connected ({connections.length})
          </h2>
          <div className="space-y-3">
            {connections.map(connection => (
              <ConnectionCard
                key={connection.id}
                connection={connection}
                onRevoke={handleRevoke}
                onDelete={handleDelete}
                onRefresh={handleRefresh}
                isRevoking={revokingId === connection.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Available Apps Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Link2 className="w-5 h-5 text-violet-600" />
          Available Apps ({availableApps.length})
        </h2>

        {availableApps.length === 0 && connections.length > 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-neutral-400">
            You've connected all available apps!
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {availableApps.map(app => (
              <AppCard
                key={app.app_name}
                app={app}
                onConnect={handleConnect}
                isConnecting={connectingApp === app.app_name}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-8 p-4 bg-gray-50 dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800">
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">How connections work</h3>
        <ul className="text-sm text-gray-500 dark:text-neutral-400 space-y-1">
          <li>Your data stays secure - we never store your passwords</li>
          <li>Charlie can only access what you allow via OAuth permissions</li>
          <li>You can revoke access anytime</li>
          <li>Connected apps enable powerful automations in your workflows</li>
        </ul>
      </div>
    </div>
  )
}
