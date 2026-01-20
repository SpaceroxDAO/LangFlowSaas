/**
 * Analytics Dashboard Page
 *
 * Displays aggregated metrics and usage statistics.
 */
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api'
import { useAuth } from '@/providers/DevModeProvider'
import { DateRangePicker, type DateRange } from '@/components/DateRangePicker'
import type { DashboardStats } from '@/types'

export function AnalyticsDashboardPage() {
  const { getToken } = useAuth()
  const [dateRange, setDateRange] = useState<DateRange>({
    preset: 7,
    startDate: null,
    endDate: null,
  })

  useEffect(() => {
    api.setTokenGetter(getToken)
  }, [getToken])

  // Build query key from date range
  const queryKey = dateRange.preset
    ? ['dashboard-stats', dateRange.preset]
    : ['dashboard-stats', 'custom', dateRange.startDate, dateRange.endDate]

  // Fetch dashboard stats
  const { data: stats, isLoading, refetch, isFetching } = useQuery({
    queryKey,
    queryFn: () =>
      dateRange.preset
        ? api.getDashboardStats(dateRange.preset)
        : api.getDashboardStats(
            0, // days not used for custom range
            dateRange.startDate || undefined,
            dateRange.endDate || undefined
          ),
    refetchOnWindowFocus: true,
    staleTime: 0, // Always refetch when query key changes
  })

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
    return num.toString()
  }

  const formatDate = (dateStr: string) => {
    // Parse YYYY-MM-DD without timezone shift by adding time component
    // This prevents the date from shifting to previous day in local timezone
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Helper component for change indicator
  const ChangeIndicator = ({ change, suffix = '' }: { change: number; suffix?: string }) => {
    if (change === 0) return null
    const isPositive = change > 0
    return (
      <span
        className={`text-xs font-medium ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {isPositive ? '↑' : '↓'} {Math.abs(change)}%{suffix}
      </span>
    )
  }

  const maxMessages = stats?.daily
    ? Math.max(...stats.daily.map((d) => d.messages), 1)
    : 1

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 dark:bg-neutral-700 rounded mb-4" />
          <div className="h-4 w-64 bg-gray-100 dark:bg-neutral-800 rounded mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-neutral-900 rounded-xl p-4">
                <div className="h-4 w-24 bg-gray-200 dark:bg-neutral-700 rounded mb-2" />
                <div className="h-8 w-16 bg-gray-100 dark:bg-neutral-800 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-500 dark:text-neutral-400">Monitor your usage and performance</p>
        </div>
        <div className="flex items-center gap-2">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 border border-gray-300 dark:border-neutral-700 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50 transition-colors"
            title="Refresh data"
          >
            <svg
              className={`w-5 h-5 text-gray-600 dark:text-neutral-400 ${isFetching ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
          <button
            onClick={() => {
              const params = new URLSearchParams({ format: 'csv' })
              if (dateRange.preset) {
                params.set('days', dateRange.preset.toString())
              } else if (dateRange.startDate && dateRange.endDate) {
                params.set('start_date', dateRange.startDate)
                params.set('end_date', dateRange.endDate)
              }
              window.open(`/api/v1/dashboard/export?${params.toString()}`, '_blank')
            }}
            className="flex items-center gap-1 px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm transition-colors"
            title="Export as CSV"
          >
            <svg
              className="w-4 h-4 text-gray-600 dark:text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span className="text-gray-700 dark:text-neutral-300">Export</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-4">
          <p className="text-sm text-gray-500 dark:text-neutral-400 mb-1">Total Agents</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats?.totals.agents || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-4">
          <p className="text-sm text-gray-500 dark:text-neutral-400 mb-1">Total Workflows</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats?.totals.workflows || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-4">
          <p className="text-sm text-gray-500 dark:text-neutral-400 mb-1">Messages This Period</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(stats?.comparison?.current_period.messages || 0)}
            </p>
            {stats?.comparison && (
              <ChangeIndicator change={stats.comparison.messages_change} />
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-4">
          <p className="text-sm text-gray-500 dark:text-neutral-400 mb-1">Tokens This Period</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(stats?.comparison?.current_period.tokens || 0)}
            </p>
            {stats?.comparison && (
              <ChangeIndicator change={stats.comparison.tokens_change} />
            )}
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Daily Messages
        </h2>
        <div className="flex items-end gap-1 h-40">
          {stats?.daily.map((d, index) => {
            const height = maxMessages > 0 ? (d.messages / maxMessages) * 100 : 0
            return (
              <div
                key={d.date}
                className="flex-1 h-full flex flex-col justify-end items-center group relative"
              >
                <div
                  className="w-full bg-violet-500 rounded-t transition-all hover:bg-violet-600"
                  style={{ height: `${Math.max(height, 2)}%` }}
                />
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 dark:bg-neutral-700 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                  {formatDate(d.date)}: {d.messages} messages
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-neutral-400">
          <span>{stats?.daily[0] ? formatDate(stats.daily[0].date) : ''}</span>
          <span>
            {stats?.daily[stats.daily.length - 1]
              ? formatDate(stats.daily[stats.daily.length - 1].date)
              : ''}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Conversations */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Conversations
          </h2>
          {stats?.recent_conversations.length === 0 ? (
            <p className="text-gray-500 dark:text-neutral-400 text-sm">No conversations yet.</p>
          ) : (
            <div className="space-y-3">
              {stats?.recent_conversations.map((conv) => (
                <Link
                  key={conv.id}
                  to={
                    conv.workflow_id
                      ? `/playground/workflow/${conv.workflow_id}`
                      : conv.agent_id
                      ? `/playground/${conv.agent_id}`
                      : '#'
                  }
                  className="block p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                >
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {conv.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                    {conv.updated_at
                      ? new Date(conv.updated_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })
                      : 'Unknown date'}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Top Agents */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Agents by Usage
          </h2>
          {stats?.agent_stats.length === 0 ? (
            <p className="text-gray-500 dark:text-neutral-400 text-sm">No agents yet.</p>
          ) : (
            <div className="space-y-3">
              {stats?.agent_stats.map((agent, index) => {
                const maxConv = stats.agent_stats[0]?.conversations || 1
                const width = (agent.conversations / maxConv) * 100

                return (
                  <div key={agent.id}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-neutral-300 truncate flex-1">
                        {index + 1}. {agent.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-neutral-400 ml-2">
                        {agent.conversations} conv.
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-2">
                      <div
                        className="bg-violet-500 h-2 rounded-full transition-all"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Period Info */}
      <div className="text-center text-sm text-gray-400 dark:text-neutral-500 mt-8">
        <p>
          Showing data from {stats?.period.start} to {stats?.period.end}
        </p>
        {stats?.comparison && (
          <p className="text-xs mt-1">
            Compared to {stats.comparison.previous_period.start} to {stats.comparison.previous_period.end}
          </p>
        )}
      </div>
    </div>
  )
}
