/**
 * PublishAgentModal - Two-phase modal for publishing an agent.
 *
 * Phase A: Choose skills (workflow checkboxes) + publish
 * Phase B: Connect your agent (download config instructions)
 */
import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Download, Copy, Check, ExternalLink, Terminal } from 'lucide-react'
import { api } from '@/lib/api'
import { detectOS, getOpenClawConfigDir, getFinderHint } from '@/lib/osDetect'
import { downloadOpenClawConfig, type AgentPersonality } from '@/lib/mcpConfigGenerator'
import { downloadInstaller } from '@/lib/installerGenerator'
import type { AgentComponent, PublishWithSkillsResponse } from '@/types'

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

  const os = detectOS()
  const configDir = getOpenClawConfigDir(os)
  const finderHint = getFinderHint(os)

  // Fetch user's workflows for skill selection
  const { data: workflowsData } = useQuery({
    queryKey: ['workflows-for-skills'],
    queryFn: () => api.listWorkflows(undefined, 1, 100, true),
    enabled: isOpen,
  })

  const workflows = workflowsData?.workflows || []

  // Pre-check workflows that already have is_agent_skill enabled
  useEffect(() => {
    if (workflows.length > 0) {
      const preSelected = new Set(
        workflows.filter((w) => w.is_agent_skill).map((w) => w.id)
      )
      setSelectedSkills(preSelected)
    }
  }, [workflows])

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPhase('skills')
      setPublishResult(null)
      setPathCopied(false)
    }
  }, [isOpen])

  const publishMutation = useMutation({
    mutationFn: () =>
      api.publishAgentWithSkills(agent.id, Array.from(selectedSkills)),
    onSuccess: (data) => {
      setPublishResult(data)
      setPhase('connect')
      queryClient.invalidateQueries({ queryKey: ['agent-components'] })
      queryClient.invalidateQueries({ queryKey: ['workflows'] })
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

            {/* Skills selection */}
            {workflows.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-neutral-300 mb-3">
                  Choose skills for your agent
                </h3>
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
                    ? 'No skills selected. You can add skills later in the Workflows tab.'
                    : `${selectedSkills.size} skill${selectedSkills.size !== 1 ? 's' : ''} selected`}
                </p>
              </div>
            )}

            {workflows.length === 0 && (
              <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-lg p-3 mb-6">
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  No workflows yet. You can create workflows and add them as skills later.
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
                disabled={publishMutation.isPending}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 rounded-xl transition-all disabled:opacity-50"
              >
                {publishMutation.isPending
                  ? 'Publishing...'
                  : isReplacing
                    ? 'Replace & Publish'
                    : 'Publish Agent'}
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================
             PHASE B: Connect Your Agent (Download Instructions)
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
                ? `${publishResult.enabled_skills.length} skill${publishResult.enabled_skills.length !== 1 ? 's' : ''} enabled`
                : 'No skills enabled'}
            </p>

            {/* Connect steps - only show if we have a token to offer */}
            {publishResult?.mcp_token ? (
              <div className="space-y-5">
                {/* Primary: One-click installer */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Install your agent locally
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-neutral-400 mb-3">
                    Download and run this script to automatically install OpenClaw and configure your agent.
                  </p>
                  <button
                    onClick={handleDownloadInstaller}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 rounded-xl transition-all w-full justify-center"
                  >
                    <Terminal className="w-4 h-4" />
                    Download Installer ({os === 'windows' ? '.ps1' : '.sh'})
                  </button>
                  <p className="text-xs text-gray-400 dark:text-neutral-500 mt-2">
                    {os === 'windows'
                      ? 'Right-click the file → "Run with PowerShell"'
                      : `Run: bash ~/Downloads/install-${agent.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.sh`}
                  </p>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-neutral-700" />
                  <span className="text-xs text-gray-400 dark:text-neutral-500">or</span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-neutral-700" />
                </div>

                {/* Secondary: Manual config download */}
                <div>
                  <button
                    onClick={handleDownloadConfig}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-neutral-400 border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-xl transition-colors w-full justify-center"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Config File Only
                  </button>
                  <div className="flex items-center gap-2 mt-2">
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

                <p className="text-xs text-gray-400 dark:text-neutral-500 text-center pt-2 border-t border-gray-100 dark:border-neutral-800">
                  Requires{' '}
                  <a
                    href="https://nodejs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-500 hover:text-violet-600"
                  >
                    Node.js 18+
                  </a>
                  {' and '}
                  <a
                    href="https://openclaw.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-500 hover:text-violet-600 inline-flex items-center gap-0.5"
                  >
                    OpenClaw
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>
            ) : (
              /* Already has a token - simpler message */
              <div className="bg-violet-50 dark:bg-violet-950/30 rounded-lg p-4 mb-2">
                <p className="text-sm text-violet-700 dark:text-violet-300">
                  Your existing config still works — no need to re-download.
                  You can re-download the config anytime from Settings.
                </p>
              </div>
            )}

            {/* Done button */}
            <div className="mt-6">
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
