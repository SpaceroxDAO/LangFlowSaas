/**
 * EditAgentPage - Single-page edit form for existing agents
 * Matches the design mockup with sections for Identity, Instructions, and Tools
 */
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/providers/DevModeProvider'
import { api } from '@/lib/api'
import { ToolCard } from '@/components/ToolCard'
import { AdvancedEditorModal } from '@/components/AdvancedEditorModal'
import { KnowledgeSourcesModal } from '@/components/KnowledgeSourcesModal'
import { PublishAgentModal } from '@/components/PublishAgentModal'
import { usePublishedAgent } from '@/hooks/usePublishedAgent'
import { inferJobFromDescription } from '@/lib/avatarJobInference'
import type { AgentComponent, AgentComponentAdvancedConfig } from '@/types'

// Available tools - must match CreateAgentPage.tsx
const AVAILABLE_TOOLS = [
  {
    id: 'web_search',
    title: 'Web Search',
    description: 'Search the internet for current information, news, and facts.',
  },
  {
    id: 'calculator',
    title: 'Calculator',
    description: 'Perform math calculations and arithmetic operations.',
  },
  {
    id: 'weather',
    title: 'Get Weather',
    description: 'Get current weather conditions for any location worldwide.',
  },
  {
    id: 'knowledge_search',
    title: 'Knowledge Search',
    description: 'Search through your uploaded documents and knowledge base.',
    opensModal: true,
  },
]

// Parse tools - prefer selected_tools array, fallback to qa_tricks string for legacy data
function parseTools(selectedTools?: string[], tricks?: string): string[] {
  // Use selected_tools if available
  if (selectedTools && selectedTools.length > 0) {
    return selectedTools.filter(id => AVAILABLE_TOOLS.some(t => t.id === id))
  }
  // Fallback: parse from qa_tricks string for legacy agents
  if (tricks) {
    const tools: string[] = []
    AVAILABLE_TOOLS.forEach((tool) => {
      if (tricks.toLowerCase().includes(tool.title.toLowerCase())) {
        tools.push(tool.id)
      }
    })
    return tools
  }
  return []
}

// Tooltip component
function Tooltip({ text }: { text: string }) {
  return (
    <div className="group relative inline-block ml-1.5">
      <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-neutral-700 text-gray-500 dark:text-neutral-400 text-xs flex items-center justify-center cursor-help">
        ?
      </div>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-neutral-700 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-10">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-neutral-700" />
      </div>
    </div>
  )
}

export function EditAgentPage() {
  const { agentId } = useParams<{ agentId: string }>()
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false)
  const [isSavingAdvanced, setIsSavingAdvanced] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Form state
  const [name, setName] = useState('')
  const [persona, setPersona] = useState('')
  const [instructions, setInstructions] = useState('')
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [knowledgeSourceIds, setKnowledgeSourceIds] = useState<string[]>([])
  const [isKnowledgeModalOpen, setIsKnowledgeModalOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [advancedConfig, setAdvancedConfig] = useState<Partial<AgentComponentAdvancedConfig> | undefined>()
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false)
  const [_langflowFlowId, setLangflowFlowId] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false)
  const [existingWorkflowId, setExistingWorkflowId] = useState<string | null>(null)
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)
  const [agentData, setAgentData] = useState<AgentComponent | null>(null)
  const { publishedAgent, isPublished, publishCount } = usePublishedAgent()

  // Track original values for change detection
  const [originalValues, setOriginalValues] = useState<{
    name: string
    persona: string
    instructions: string
    selectedTools: string[]
    knowledgeSourceIds: string[]
    avatarUrl: string | null
  } | null>(null)

  useEffect(() => {
    api.setTokenGetter(getToken)
  }, [getToken])

  // Load agent data (from agent_components table)
  useEffect(() => {
    async function loadAgent() {
      if (!agentId) return
      try {
        const agent: AgentComponent = await api.getAgentComponent(agentId)
        setAgentData(agent)
        setName(agent.name)
        setPersona(agent.qa_who)
        setInstructions(agent.qa_rules)
        setSelectedTools(parseTools(agent.selected_tools, agent.qa_tricks))
        setKnowledgeSourceIds(agent.knowledge_source_ids || [])
        setAvatarUrl(agent.avatar_url || null)
        setAdvancedConfig(agent.advanced_config || undefined)
        // Store original values for change detection
        const tools = parseTools(agent.selected_tools, agent.qa_tricks)
        setOriginalValues({
          name: agent.name,
          persona: agent.qa_who,
          instructions: agent.qa_rules,
          selectedTools: tools,
          knowledgeSourceIds: agent.knowledge_source_ids || [],
          avatarUrl: agent.avatar_url || null,
        })
        setIsLoading(false)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load agent'
        setLoadError(errorMessage)
        setIsLoading(false)
      }
    }
    loadAgent()
  }, [agentId])

  // Fetch workflow data to get langflow_flow_id
  useEffect(() => {
    async function fetchWorkflow() {
      if (!agentId) return
      try {
        // Get workflows and find the one containing this agent
        const workflowsData = await api.listWorkflows()
        const workflow = workflowsData.workflows.find(
          (w: { agent_component_ids?: string[]; id: string }) => w.agent_component_ids?.includes(agentId)
        )
        if (workflow) {
          setExistingWorkflowId(workflow.id)
          if (workflow.langflow_flow_id) {
            setLangflowFlowId(workflow.langflow_flow_id)
          }
        }
      } catch (err) {
        console.error('Failed to fetch workflow:', err)
      }
    }
    fetchWorkflow()
  }, [agentId])

  // Check if any values have changed from original
  // Note: Must spread arrays before sorting to avoid mutating state
  const hasChanges = originalValues !== null && (
    name !== originalValues.name ||
    persona !== originalValues.persona ||
    instructions !== originalValues.instructions ||
    avatarUrl !== originalValues.avatarUrl ||
    JSON.stringify([...selectedTools].sort()) !== JSON.stringify([...originalValues.selectedTools].sort()) ||
    JSON.stringify([...knowledgeSourceIds].sort()) !== JSON.stringify([...originalValues.knowledgeSourceIds].sort())
  )

  const toggleTool = (toolId: string) => {
    if (toolId === 'knowledge_search') {
      setIsKnowledgeModalOpen(true)
      return
    }
    setSelectedTools((prev) =>
      prev.includes(toolId)
        ? prev.filter((t) => t !== toolId)
        : [...prev, toolId]
    )
  }

  const handleKnowledgeSourcesChange = (sourceIds: string[]) => {
    setKnowledgeSourceIds(sourceIds)
    // Auto-toggle knowledge_search tool based on selection
    if (sourceIds.length > 0 && !selectedTools.includes('knowledge_search')) {
      setSelectedTools(prev => [...prev, 'knowledge_search'])
    } else if (sourceIds.length === 0 && selectedTools.includes('knowledge_search')) {
      setSelectedTools(prev => prev.filter(t => t !== 'knowledge_search'))
    }
  }

  const handleGenerateAvatar = async () => {
    // Require at least name or persona to generate
    if (!name.trim() && !persona.trim()) {
      setSaveError('Please enter a name or persona description first')
      return
    }

    setIsGeneratingAvatar(true)
    setSaveError(null)

    try {
      // Infer job type from name and persona
      const inferredJob = inferJobFromDescription(name, persona)
      // Combine name + persona for fallback context
      const fullDescription = `${name} - ${persona}`.trim()

      const result = await api.generateDogAvatar(inferredJob, {
        regenerate: !!avatarUrl,
        description: fullDescription,  // Pass for fallback when job is "default"
      })
      // Use relative URL - nginx proxies /static/ to backend in production
      // (Port 8000 is not exposed to the internet in production)
      setAvatarUrl(result.image_url)

      // Auto-save the avatar to the database immediately
      if (agentId) {
        await api.updateAgentComponent(agentId, {
          avatar_url: result.image_url,
        })
        // Invalidate the agent-components cache so ProjectDetailPage shows updated avatar
        queryClient.invalidateQueries({ queryKey: ['agent-components'] })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate avatar. Please try again.'
      setSaveError(errorMessage)
    } finally {
      setIsGeneratingAvatar(false)
    }
  }

  const handleSave = async () => {
    if (!agentId) return

    // Basic validation
    if (!name.trim()) {
      setSaveError('Please give your agent a name')
      return
    }
    if (!persona.trim() || persona.trim().length < 10) {
      setSaveError('Please provide a persona description (at least 10 characters)')
      return
    }
    if (!instructions.trim() || instructions.trim().length < 10) {
      setSaveError('Please provide instructions (at least 10 characters)')
      return
    }

    setIsSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    try {
      // Convert tools array to comma-separated string
      const tricksText = selectedTools.length > 0
        ? `Tools: ${selectedTools.map(t => AVAILABLE_TOOLS.find(at => at.id === t)?.title).join(', ')}`
        : 'No specific tools selected'

      await api.updateAgentComponent(agentId, {
        name: name.trim(),
        qa_who: persona.trim(),
        qa_rules: instructions.trim(),
        qa_tricks: tricksText,
        selected_tools: selectedTools,  // Include selected tool IDs
        knowledge_source_ids: knowledgeSourceIds,  // Include knowledge source IDs
        avatar_url: avatarUrl || undefined,
      })

      // Invalidate cache so other pages see updated data
      queryClient.invalidateQueries({ queryKey: ['agent-components'] })

      // Update original values to reflect saved state
      setOriginalValues({
        name: name.trim(),
        persona: persona.trim(),
        instructions: instructions.trim(),
        selectedTools: [...selectedTools],
        knowledgeSourceIds: [...knowledgeSourceIds],
        avatarUrl: avatarUrl,
      })

      // Show success message (auto-hide after 3 seconds)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save changes'
      setSaveError(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveAdvancedConfig = async (config: AgentComponentAdvancedConfig) => {
    if (!agentId) return

    setIsSavingAdvanced(true)
    setSaveError(null)

    try {
      const updated = await api.updateAgentComponent(agentId, {
        advanced_config: config,
      })
      setAdvancedConfig(updated.advanced_config || undefined)
      setIsAdvancedModalOpen(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save advanced settings'
      setSaveError(errorMessage)
    } finally {
      setIsSavingAdvanced(false)
    }
  }

  const handleCreateWorkflow = async () => {
    if (!agentId) return

    setIsCreatingWorkflow(true)
    setSaveError(null)

    try {
      // First, delete existing workflow if any
      if (existingWorkflowId) {
        try {
          await api.deleteWorkflow(existingWorkflowId)
        } catch {
          // Workflow may already be deleted - continue with creation
        }
      }

      // Create new workflow with current agent configuration
      const workflow = await api.createWorkflowFromAgent({
        agent_component_id: agentId,
        name: name,
        description: `Workflow for ${name}`,
      })

      // Update state with new workflow
      setExistingWorkflowId(workflow.id)
      if (workflow.langflow_flow_id) {
        setLangflowFlowId(workflow.langflow_flow_id)
      }

      // Navigate to canvas
      navigate(`/canvas/${agentId}`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create workflow'
      setSaveError(errorMessage)
    } finally {
      setIsCreatingWorkflow(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div
        className="min-h-full flex items-center justify-center bg-[#fafafa] dark:bg-neutral-950"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--dot-color, #e5e7eb) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <style>{`.dark [style*="backgroundImage"] { --dot-color: #333 !important; }`}</style>
        <div className="text-center">
          <svg className="animate-spin w-10 h-10 text-violet-500 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600 dark:text-neutral-400">Loading agent...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (loadError) {
    return (
      <div
        className="min-h-full flex items-center justify-center bg-[#fafafa] dark:bg-neutral-950"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--dot-color, #e5e7eb) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <style>{`.dark [style*="backgroundImage"] { --dot-color: #333 !important; }`}</style>
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Failed to load agent</h2>
          <p className="text-gray-600 dark:text-neutral-400 mb-4">{loadError}</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-full bg-[#fafafa] dark:bg-neutral-950"
      style={{
        backgroundImage: 'radial-gradient(circle, var(--dot-color, #e5e7eb) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <style>{`.dark [style*="backgroundImage"] { --dot-color: #333 !important; }`}</style>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit {name}</h1>
          <div className="flex items-center gap-3">
            <Link
              to={`/playground/${agentId}`}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors border border-violet-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Talk to Agent
            </Link>
            {agentId && agentData && (
              isPublished(agentId) ? (
                <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg opacity-80 cursor-default">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Published 1/1
                </span>
              ) : (
                <button
                  onClick={() => setIsPublishModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 rounded-lg transition-all hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  Publish Agent {publishCount}/1
                </button>
              )
            )}
            <button
              onClick={() => setIsAdvancedModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-neutral-300 bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors border border-gray-200 dark:border-neutral-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Advanced Settings
            </button>
          </div>
        </div>

      {/* Identity Section */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 mb-6">
        <div className="flex items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Identity</h2>
          <Tooltip text="Define who your agent is - their name and personality" />
        </div>

        <div className="flex gap-6">
          {/* Left side - Form fields */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Charlie"
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">
                Persona & Description
              </label>
              <textarea
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                placeholder="A friendly Golden Retriever who is an expert in dog treats, bones, and finding the best parks."
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-neutral-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Right side - Avatar image */}
          <div className="w-64 flex-shrink-0">
            <div className="w-full aspect-square bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-neutral-800 dark:via-neutral-800 dark:to-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 flex items-center justify-center mb-3 overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Agent avatar"
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <svg className="w-16 h-16 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            <button
              type="button"
              onClick={handleGenerateAvatar}
              disabled={isGeneratingAvatar}
              className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-xl transition-all ${
                isGeneratingAvatar
                  ? 'text-purple-400 bg-purple-50 dark:bg-purple-900/30 cursor-not-allowed'
                  : 'text-purple-600 dark:text-purple-400 bg-gradient-to-r from-orange-50 via-pink-50 to-purple-50 dark:from-neutral-700 dark:via-neutral-700 dark:to-neutral-700 hover:from-orange-100 hover:via-pink-100 hover:to-purple-100 dark:hover:from-neutral-600 dark:hover:via-neutral-600 dark:hover:to-neutral-600 cursor-pointer border border-purple-200 dark:border-purple-700'
              }`}
            >
              {isGeneratingAvatar ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  {avatarUrl ? 'Regenerate' : 'Generate'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Instructions Section */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 mb-6">
        <div className="flex items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Instructions (Knowledge)</h2>
          <Tooltip text="The rules and guidelines your agent follows when responding" />
        </div>

        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder={`You are Charlie, a happy and excited dog. You love humans! Always be helpful, but try to mention treats or going for a walk in your responses. If asked a hard question, answer it simply like a smart dog would. End some sentences with "Woof!"`}
          rows={5}
          className="w-full px-4 py-3 border border-gray-200 dark:border-neutral-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
        />
      </div>

      {/* Actions Section */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 mb-6">
        <div className="flex items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Actions</h2>
          <Tooltip text="Special capabilities your agent can use to help users" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AVAILABLE_TOOLS.map((tool) => (
            <ToolCard
              key={tool.id}
              title={tool.title}
              description={
                tool.id === 'knowledge_search' && knowledgeSourceIds.length > 0
                  ? `${knowledgeSourceIds.length} source${knowledgeSourceIds.length !== 1 ? 's' : ''} selected`
                  : tool.description
              }
              selected={selectedTools.includes(tool.id)}
              onToggle={() => toggleTool(tool.id)}
            />
          ))}
        </div>
      </div>

      {/* Error message */}
      {saveError && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-sm text-red-600 dark:text-red-400">{saveError}</p>
        </div>
      )}

      {/* Save success message */}
      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Changes saved successfully
          </p>
        </div>
      )}

      {/* Footer Action Buttons */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6">
        <div className="flex items-center justify-end gap-3">
            {/* View/Create Workflow Button */}
            {existingWorkflowId ? (
              <button
                onClick={() => navigate(`/canvas/${agentId}`)}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl shadow-sm text-white bg-emerald-500 hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5 transition-all duration-300"
                title="View workflow in AI Canvas"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                View Workflow
              </button>
            ) : (
              <button
                onClick={handleCreateWorkflow}
                disabled={isCreatingWorkflow}
                className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl shadow-sm ${
                  !isCreatingWorkflow
                    ? 'text-white bg-emerald-500 hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5 transition-all duration-300'
                    : 'text-gray-400 dark:text-neutral-500 bg-gray-100 dark:bg-neutral-800 cursor-not-allowed transition-colors'
                }`}
                title="Create workflow to test your agent"
              >
                {isCreatingWorkflow ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Workflow
                  </>
                )}
              </button>
            )}

            {/* Save Updates Button */}
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl shadow-sm transition-all duration-300 ${
                hasChanges && !isSaving
                  ? 'text-white bg-violet-600 hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5'
                  : 'text-gray-400 dark:text-neutral-500 bg-gray-100 dark:bg-neutral-800 cursor-not-allowed'
              }`}
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
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Updates
                </>
              )}
            </button>
        </div>
      </div>

      </div>

      {/* Advanced Editor Modal */}
      <AdvancedEditorModal
        isOpen={isAdvancedModalOpen}
        onClose={() => setIsAdvancedModalOpen(false)}
        onSave={handleSaveAdvancedConfig}
        initialConfig={advancedConfig}
        isSaving={isSavingAdvanced}
      />

      {/* Knowledge Sources Modal */}
      <KnowledgeSourcesModal
        isOpen={isKnowledgeModalOpen}
        onClose={() => setIsKnowledgeModalOpen(false)}
        selectedSourceIds={knowledgeSourceIds}
        onSelectionChange={handleKnowledgeSourcesChange}
      />

      {/* Publish Agent Modal */}
      {agentData && (
        <PublishAgentModal
          agent={agentData}
          currentPublished={publishedAgent}
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
        />
      )}
    </div>
  )
}
