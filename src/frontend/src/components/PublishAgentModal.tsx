/**
 * PublishAgentModal - Two-phase modal for publishing an agent.
 *
 * Phase A: Choose skills (workflow checkboxes) + publish
 * Phase B: Download Teach Charlie desktop app (primary) + advanced options
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Download, Copy, Check, Terminal, ChevronDown, Monitor, KeyRound, RefreshCw } from 'lucide-react'
import { api } from '@/lib/api'
import { detectOS, getOpenClawConfigDir } from '@/lib/osDetect'
import { downloadOpenClawConfig, type AgentPersonality } from '@/lib/mcpConfigGenerator'
import { downloadInstaller } from '@/lib/installerGenerator'
import type { AgentComponent, PublishWithSkillsResponse } from '@/types'

/** Absolute download URLs served by nginx (must be absolute to bypass SPA routing) */
const DOWNLOAD_FILES: Record<string, string> = {
  mac: 'https://app.teachcharlie.ai/downloads/TeachCharlie-0.1.0-mac-arm64.dmg',
  windows: 'https://app.teachcharlie.ai/downloads/TeachCharlie-0.1.0-win-x64.msi',
}

interface PublishAgentModalProps {
  agent: AgentComponent
  currentPublished: AgentComponent | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function PublishAgentModal({
  agent,
  currentPublished,
  isOpen,
  onClose,
  onSuccess,
}: PublishAgentModalProps) {
  const queryClient = useQueryClient()
  const isReplacing = currentPublished && currentPublished.id !== agent.id

  // Phase state: 'skills' (choose + publish) or 'connect' (download instructions)
  const [phase, setPhase] = useState<'skills' | 'connect'>('skills')
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set())
  const [publishResult, setPublishResult] = useState<PublishWithSkillsResponse | null>(null)
  const [pathCopied, setPathCopied] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [setupCode, setSetupCode] = useState<string | null>(null)
  const [setupCodeExpiry, setSetupCodeExpiry] = useState<number>(0)
  const [setupCodeLoading, setSetupCodeLoading] = useState(false)
  const [setupCodeCopied, setSetupCodeCopied] = useState(false)
  const expiryTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const os = detectOS()
  const configDir = getOpenClawConfigDir(os)

  // Fetch user's workflows for skill selection
  const { data: workflowsData, isLoading: isLoadingWorkflows } = useQuery({
    queryKey: ['workflows-for-skills'],
    queryFn: () => api.listWorkflows(undefined, 1, 100, true),
    enabled: isOpen,
  })

  const workflows = workflowsData?.workflows || []

  // Track whether the initial auto-select has fired for this modal session.
  // Prevents background React Query refetches from overwriting user's checkbox changes.
  const hasAutoSelected = useRef(false)

  // Auto-select all workflows when modal opens (first load only).
  useEffect(() => {
    if (workflows.length > 0 && !hasAutoSelected.current) {
      setSelectedSkills(new Set(workflows.map((w) => w.id)))
      hasAutoSelected.current = true
    }
  }, [workflows])

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPhase('skills')
      setPublishResult(null)
      setPathCopied(false)
      setShowAdvanced(false)
      setSetupCode(null)
      setSetupCodeExpiry(0)
      setSetupCodeCopied(false)
      hasAutoSelected.current = false
    }
    return () => {
      if (expiryTimerRef.current) clearInterval(expiryTimerRef.current)
    }
  }, [isOpen])

  const handleGenerateSetupCode = useCallback(async () => {
    setSetupCodeLoading(true)
    try {
      const result = await api.generateDesktopSetupCode()
      setSetupCode(result.code)
      setSetupCodeExpiry(result.expires_in)
      setSetupCodeCopied(false)

      // Start countdown timer
      if (expiryTimerRef.current) clearInterval(expiryTimerRef.current)
      expiryTimerRef.current = setInterval(() => {
        setSetupCodeExpiry((prev) => {
          if (prev <= 1) {
            if (expiryTimerRef.current) clearInterval(expiryTimerRef.current)
            setSetupCode(null)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch {
      // Silently fail — user can retry
    } finally {
      setSetupCodeLoading(false)
    }
  }, [])

  const copySetupCode = useCallback(() => {
    if (!setupCode) return
    navigator.clipboard.writeText(setupCode)
    setSetupCodeCopied(true)
    setTimeout(() => setSetupCodeCopied(false), 2000)
  }, [setupCode])

  const publishMutation = useMutation({
    mutationFn: () =>
      api.publishAgentWithSkills(agent.id, Array.from(selectedSkills)),
    onSuccess: (data) => {
      setPublishResult(data)
      setPhase('connect')
      queryClient.invalidateQueries({ queryKey: ['agent-components'] })
      queryClient.invalidateQueries({ queryKey: ['agent-component'] })
      queryClient.invalidateQueries({ queryKey: ['agent-component-for-workflow'] })
      queryClient.invalidateQueries({ queryKey: ['workflows'] })
      queryClient.invalidateQueries({ queryKey: ['workflow'] })
      queryClient.invalidateQueries({ queryKey: ['workflows-for-component'] })
      queryClient.invalidateQueries({ queryKey: ['workflows-for-skills'] })
      queryClient.invalidateQueries({ queryKey: ['mcp-token-status'] })
      onSuccess?.()
    },
  })

  const toggleSkill = (workflowId: string) => {
    setSelectedSkills((prev) => {
      const next = new Set(prev)
      if (next.has(workflowId)) {
        next.delete(workflowId)
      } else {
        next.add(workflowId)
      }
      return next
    })
  }

  const buildPersonality = (): AgentPersonality => ({
    name: agent.name,
    systemPrompt: agent.system_prompt,
    avatarUrl: agent.avatar_url,
    skills: publishResult?.enabled_skills,
    channels: agent.advanced_config?.channel_preferences,
  })

  const handleDownloadInstaller = () => {
    if (!publishResult?.mcp_token) return
    downloadInstaller(publishResult.mcp_token, buildPersonality())
  }

  const handleDownloadConfig = () => {
    if (!publishResult?.mcp_token) return
    downloadOpenClawConfig(publishResult.mcp_token, buildPersonality())
  }

  const copyPath = () => {
    navigator.clipboard.writeText(configDir)
    setPathCopied(true)
    setTimeout(() => setPathCopied(false), 2000)
  }

  const handleClose = () => {
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-xl max-w-lg w-full mx-4 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header gradient */}
        <div className="h-1.5 bg-gradient-to-r from-violet-500 to-purple-500 flex-shrink-0" />

        {phase === 'skills' ? (
          /* ============================================================
             PHASE A: Choose Skills + Publish
             ============================================================ */
          <div className="p-6 overflow-y-auto">
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>

            <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
              {isReplacing ? 'Replace Live Agent?' : 'Publish Agent'}
            </h2>

            {isReplacing ? (
              <p className="text-sm text-gray-600 dark:text-neutral-400 text-center mb-4">
                This will replace <span className="font-medium text-gray-900 dark:text-white">{currentPublished.name}</span> with{' '}
                <span className="font-medium text-gray-900 dark:text-white">{agent.name}</span> as your live AI agent.
              </p>
            ) : (
              <p className="text-sm text-gray-600 dark:text-neutral-400 text-center mb-4">
                Make <span className="font-medium text-gray-900 dark:text-white">{agent.name}</span> your live AI agent.
              </p>
            )}

            {/* Channel preferences summary */}
            {agent.advanced_config?.channel_preferences && agent.advanced_config.channel_preferences.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                {agent.advanced_config.channel_preferences.map((ch) => (
                  <span key={ch} className="px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                    {ch.charAt(0).toUpperCase() + ch.slice(1)}
                  </span>
                ))}
              </div>
            )}

            {/* Skills selection */}
            {workflows.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-neutral-300">
                    Choose workflows for your agent
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedSkills.size === workflows.length) {
                        setSelectedSkills(new Set())
                      } else {
                        setSelectedSkills(new Set(workflows.map((w) => w.id)))
                      }
                    }}
                    className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium"
                  >
                    {selectedSkills.size === workflows.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto border border-gray-200 dark:border-neutral-700 rounded-xl p-2">
                  {workflows.map((workflow) => (
                    <label
                      key={workflow.id}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSkills.has(workflow.id)}
                        onChange={() => toggleSkill(workflow.id)}
                        className="w-4 h-4 rounded border-gray-300 dark:border-neutral-600 text-violet-600 focus:ring-violet-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {workflow.name}
                        </div>
                        {workflow.description && (
                          <div className="text-xs text-gray-500 dark:text-neutral-400 truncate">
                            {workflow.description}
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-400 dark:text-neutral-500 mt-2">
                  {selectedSkills.size === 0
                    ? 'No workflows selected. You can add workflows later in the Workflows tab.'
                    : `${selectedSkills.size} workflow${selectedSkills.size !== 1 ? 's' : ''} selected`}
                </p>
              </div>
            )}

            {workflows.length === 0 && (
              <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-lg p-3 mb-6">
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  No workflows yet. You can create workflows and add them later.
                </p>
              </div>
            )}

            {publishMutation.isError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg text-sm text-red-600 dark:text-red-400">
                Failed to publish agent. Please try again.
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => publishMutation.mutate()}
                disabled={publishMutation.isPending || isLoadingWorkflows}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 rounded-xl transition-all disabled:opacity-50"
              >
                {isLoadingWorkflows
                  ? 'Loading workflows...'
                  : publishMutation.isPending
                  ? 'Publishing...'
                  : isReplacing
                    ? 'Replace & Publish'
                    : 'Publish Agent'}
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================
             PHASE B: Download the Desktop App
             ============================================================ */
          <div className="p-6 overflow-y-auto">
            {/* Success header */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-1">
              Agent Published!
            </h2>
            <p className="text-sm text-gray-500 dark:text-neutral-400 text-center mb-6">
              {publishResult && publishResult.enabled_skills.length > 0
                ? `${publishResult.enabled_skills.length} workflow${publishResult.enabled_skills.length !== 1 ? 's' : ''} enabled`
                : 'No workflows enabled'}
            </p>

            {/* Setup Code Section */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-violet-200 dark:border-violet-800/50 bg-violet-50/50 dark:bg-violet-950/20">
                <div className="flex items-center gap-2 mb-2">
                  <KeyRound className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Setup Code
                  </h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-neutral-400 mb-3">
                  Enter this code in the Teach Charlie desktop app to connect your agent.
                </p>

                {setupCode ? (
                  <div className="space-y-2">
                    {/* Large code display */}
                    <button
                      onClick={copySetupCode}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 hover:border-violet-300 dark:hover:border-violet-600 transition-colors group"
                    >
                      <span className="text-2xl font-mono font-bold tracking-[0.3em] text-gray-900 dark:text-white">
                        {setupCode}
                      </span>
                      {setupCodeCopied ? (
                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400 group-hover:text-violet-500 shrink-0" />
                      )}
                    </button>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400 dark:text-neutral-500">
                        Expires in {Math.floor(setupCodeExpiry / 60)}:{String(setupCodeExpiry % 60).padStart(2, '0')}
                      </p>
                      <button
                        onClick={handleGenerateSetupCode}
                        disabled={setupCodeLoading}
                        className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3 h-3 ${setupCodeLoading ? 'animate-spin' : ''}`} />
                        New code
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleGenerateSetupCode}
                    disabled={setupCodeLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 rounded-lg transition-all disabled:opacity-50"
                  >
                    {setupCodeLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <KeyRound className="w-4 h-4" />
                    )}
                    {setupCodeLoading ? 'Generating...' : 'Generate Setup Code'}
                  </button>
                )}
              </div>

              {/* Download button */}
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  Download Teach Charlie
                </h3>
                <p className="text-xs text-gray-500 dark:text-neutral-400 mb-2">
                  Install the desktop app to run your agent locally.
                </p>
              </div>

              <a
                href={DOWNLOAD_FILES[os] || DOWNLOAD_FILES['mac']}
                download
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-xl transition-all w-full justify-center"
              >
                <Monitor className="w-4 h-4" />
                Download for {os === 'mac' ? 'macOS' : os === 'windows' ? 'Windows' : 'Desktop'}
                <Download className="w-3.5 h-3.5 opacity-60" />
              </a>

              {/* How it works — 3 steps */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { step: '1', label: 'Download', desc: 'Install the desktop app' },
                  { step: '2', label: 'Enter code', desc: 'Use your setup code' },
                  { step: '3', label: 'Done', desc: 'Agent connects automatically' },
                ].map((s) => (
                  <div key={s.step} className="text-center">
                    <div className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-xs font-bold flex items-center justify-center mx-auto mb-1.5">
                      {s.step}
                    </div>
                    <p className="text-xs font-medium text-gray-900 dark:text-white">{s.label}</p>
                    <p className="text-[11px] text-gray-500 dark:text-neutral-400 mt-0.5">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-400 dark:text-neutral-500 text-center mt-4">
              Already have the app? Your agent will update automatically within 30 seconds.
            </p>

            {/* Advanced: collapsible installer script + config download */}
            {publishResult?.mcp_token && (
              <div className="mt-4 border-t border-gray-100 dark:border-neutral-800 pt-4">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors w-full"
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                  Advanced: terminal installer or config file
                </button>

                {showAdvanced && (
                  <div className="mt-3 space-y-3">
                    {/* Installer script */}
                    <button
                      onClick={handleDownloadInstaller}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-neutral-400 border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-xl transition-colors w-full justify-center"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      Download Installer ({os === 'windows' ? '.ps1' : '.sh'})
                    </button>

                    {/* Config-only download */}
                    <button
                      onClick={handleDownloadConfig}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-neutral-400 border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-xl transition-colors w-full justify-center"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Config File Only
                    </button>

                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono text-gray-500 dark:text-neutral-400 flex-1 truncate">
                        Save to {configDir}
                      </code>
                      <button
                        onClick={copyPath}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded transition-colors flex-shrink-0"
                      >
                        {pathCopied ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Done button */}
            <div className="mt-4">
              <button
                onClick={handleClose}
                className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
