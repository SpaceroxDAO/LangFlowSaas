import React, { useState } from 'react'
import { Globe, Terminal, Trash2 } from 'lucide-react'
import { getGradientColor } from './utils'
import type { MCPServerCardProps } from './types'

export function MCPServerCard({
  server,
  colorIndex,
  onToggle,
  onDelete,
  getHealthIcon,
  isToggling,
}: MCPServerCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const gradientColor = getGradientColor(colorIndex)

  return (
    <div className={`bg-white dark:bg-neutral-800 border rounded-lg p-4 transition-all ${server.is_enabled ? 'border-gray-200 dark:border-neutral-700' : 'border-gray-100 dark:border-neutral-800 opacity-60'}`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradientColor} flex items-center justify-center flex-shrink-0`}>
          {server.transport === 'sse' || server.transport === 'http' ? (
            <Globe className="w-5 h-5 text-white" />
          ) : (
            <Terminal className="w-5 h-5 text-white" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900 dark:text-white">{server.name}</h3>
            {getHealthIcon(server.health_status)}
            {server.needs_sync && (
              <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs rounded-full">
                Pending sync
              </span>
            )}
          </div>
          {server.description && (
            <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">{server.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 dark:text-neutral-500">
            <span>Type: {server.server_type}</span>
            {server.transport === 'sse' || server.transport === 'http' ? (
              <span className="truncate max-w-[200px]" title={server.url}>URL: {server.url}</span>
            ) : (
              <span>Command: {server.command}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggle(server)}
            disabled={isToggling}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
              server.is_enabled ? 'bg-purple-600' : 'bg-gray-200 dark:bg-neutral-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                server.is_enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
              className="p-1.5 text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-lg z-10 py-1">
                <button
                  onClick={() => { setMenuOpen(false); onDelete(server) }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-left"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function MCPServerGridCard({
  server,
  colorIndex,
  onToggle,
  onDelete,
  getHealthIcon,
  isToggling,
}: MCPServerCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const gradientColor = getGradientColor(colorIndex)

  return (
    <div className={`bg-white dark:bg-neutral-800 border rounded-xl p-5 transition-all hover:shadow-md ${server.is_enabled ? 'border-gray-200 dark:border-neutral-700' : 'border-gray-100 dark:border-neutral-800 opacity-60'}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientColor} flex items-center justify-center`}>
          {server.transport === 'sse' || server.transport === 'http' ? (
            <Globe className="w-6 h-6 text-white" />
          ) : (
            <Terminal className="w-6 h-6 text-white" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggle(server)}
            disabled={isToggling}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
              server.is_enabled ? 'bg-purple-600' : 'bg-gray-200 dark:bg-neutral-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                server.is_enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
              className="p-1.5 text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-lg z-10 py-1">
                <button
                  onClick={() => { setMenuOpen(false); onDelete(server) }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-left"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium text-gray-900 dark:text-white truncate">{server.name}</h3>
          {getHealthIcon(server.health_status)}
        </div>
        {server.needs_sync && (
          <span className="inline-block px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs rounded-full mb-2">
            Pending sync
          </span>
        )}
        {server.description && (
          <p className="text-sm text-gray-500 dark:text-neutral-400 line-clamp-2">{server.description}</p>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-gray-100 dark:border-neutral-700">
        <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-neutral-500">
          <span className="px-2 py-1 bg-gray-100 dark:bg-neutral-700 rounded">
            {server.server_type}
          </span>
          <span className="truncate flex-1">
            {server.transport === 'sse' || server.transport === 'http' ? server.url : server.command}
          </span>
        </div>
      </div>
    </div>
  )
}
