/**
 * EditAgentPage - Single-page edit form for existing agents
 * Matches the design mockup with sections for Identity, Instructions, and Tools
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuth } from '@/providers/DevModeProvider'
import { api } from '@/lib/api'
import { ToolCard } from '@/components/ToolCard'
import { AdvancedEditorModal } from '@/components/AdvancedEditorModal'
import { inferJobFromDescription } from '@/lib/avatarJobInference'
import type { AgentComponent, AgentComponentAdvancedConfig } from '@/types'

// Available tools
const AVAILABLE_TOOLS = [
  { id: 'web_search', title: 'Web Search', description: 'Search the internet for current facts.' },
  { id: 'google_maps', title: 'Google Maps', description: 'Find real-world locations.' },
  { id: 'image_generator', title: 'Image Generator', description: 'Create AI images from text descriptions.' },
  { id: 'video_creator', title: 'Video Creator', description: 'Generate short AI videos (requires API Key).' },
]

// Parse tools from qa_tricks string
function parseToolsFromTricks(tricks: string): string[] {
  const tools: string[] = []
  AVAILABLE_TOOLS.forEach((tool) => {
    if (tricks.toLowerCase().includes(tool.title.toLowerCase())) {
      tools.push(tool.id)
    }
  })
  return tools
}

// Tooltip component
function Tooltip({ text }: { text: string }) {
  return (
    <div className="group relative inline-block ml-1.5">
      <div className="w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-xs flex items-center justify-center cursor-help">
        ?
      </div>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-10">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  )
}

export function EditAgentPage() {
  const { agentId } = useParams<{ agentId: string }>()
  const navigate = useNavigate()
  const { getToken } = useAuth()

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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [advancedConfig, setAdvancedConfig] = useState<Partial<AgentComponentAdvancedConfig> | undefined>()
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isRestarting, setIsRestarting] = useState(false)
  const [publishMessage, setPublishMessage] = useState<string | null>(null)
  const [needsRestart, setNeedsRestart] = useState(false)

  useEffect(() => {
    api.setTokenGetter(getToken)
  }, [getToken])

  // Load agent data (from agent_components table)
  useEffect(() => {
    async function loadAgent() {
      if (!agentId) return
      try {
        const agent: AgentComponent = await api.getAgentComponent(agentId)
        setName(agent.name)
        setPersona(agent.qa_who)
        setInstructions(agent.qa_rules)
        setSelectedTools(parseToolsFromTricks(agent.qa_tricks))
        setAvatarUrl(agent.avatar_url || null)
        setAdvancedConfig(agent.advanced_config || undefined)
        setIsPublished(agent.is_published)
        setIsLoading(false)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load agent'
        setLoadError(errorMessage)
        setIsLoading(false)
      }
    }
    loadAgent()
  }, [agentId])

  const toggleTool = (toolId: string) => {
    setSelectedTools((prev) =>
      prev.includes(toolId)
        ? prev.filter((t) => t !== toolId)
        : [...prev, toolId]
    )
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
      // Convert relative URL to full URL for the backend
      const fullUrl = `${window.location.protocol}//${window.location.hostname}:8000${result.image_url}`
      setAvatarUrl(fullUrl)
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
        avatar_url: avatarUrl || undefined,
      })

      navigate(`/playground/${agentId}`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save changes'
      setSaveError(errorMessage)
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
      setIsPublished(updated.is_published) // Will be false if config changed
      setIsAdvancedModalOpen(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save advanced settings'
      setSaveError(errorMessage)
    } finally {
      setIsSavingAdvanced(false)
    }
  }

  const handlePublish = async () => {
    if (!agentId) return

    setIsPublishing(true)
    setPublishMessage(null)
    setSaveError(null)

    try {
      const result = await api.publishAgentComponent(agentId)
      setIsPublished(result.is_published)
      setPublishMessage(result.message)
      if (result.needs_restart) {
        setNeedsRestart(true)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to publish agent'
      setSaveError(errorMessage)
    } finally {
      setIsPublishing(false)
    }
  }

  const handleUnpublish = async () => {
    if (!agentId) return

    setIsPublishing(true)
    setPublishMessage(null)
    setSaveError(null)

    try {
      const result = await api.unpublishAgentComponent(agentId)
      setIsPublished(result.is_published)
      setPublishMessage(result.message)
      if (result.needs_restart) {
        setNeedsRestart(true)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unpublish agent'
      setSaveError(errorMessage)
    } finally {
      setIsPublishing(false)
    }
  }

  const handleRestartLangflow = async () => {
    setIsRestarting(true)
    setPublishMessage(null)
    setSaveError(null)

    try {
      const result = await api.restartLangflow()
      if (result.success) {
        setPublishMessage(result.message)
        setNeedsRestart(false)
      } else {
        setSaveError(result.message)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to restart Langflow'
      setSaveError(errorMessage)
    } finally {
      setIsRestarting(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div
        className="min-h-[calc(100vh-64px)] flex items-center justify-center"
        style={{
          backgroundColor: '#fafafa',
          backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div className="text-center">
          <svg className="animate-spin w-10 h-10 text-violet-500 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600">Loading agent...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (loadError) {
    return (
      <div
        className="min-h-[calc(100vh-64px)] flex items-center justify-center"
        style={{
          backgroundColor: '#fafafa',
          backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load agent</h2>
          <p className="text-gray-600 mb-4">{loadError}</p>
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
      className="min-h-[calc(100vh-64px)]"
      style={{
        backgroundColor: '#fafafa',
        backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Edit {name}</h1>
          <Link
            to={`/playground/${agentId}`}
            className="text-violet-600 hover:text-violet-700 font-medium text-sm"
          >
            Back to Chat
          </Link>
        </div>

      {/* Identity Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Identity</h2>
          <Tooltip text="Define who your agent is - their name and personality" />
        </div>

        <div className="flex gap-6">
          {/* Left side - Form fields */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Charlie"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Persona & Description
              </label>
              <textarea
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                placeholder="A friendly Golden Retriever who is an expert in dog treats, bones, and finding the best parks."
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right side - Avatar image */}
          <div className="w-64 flex-shrink-0">
            <div className="w-full aspect-square bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center mb-3 overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Agent avatar"
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            <button
              type="button"
              onClick={handleGenerateAvatar}
              disabled={isGeneratingAvatar}
              className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-xl transition-colors ${
                isGeneratingAvatar
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  : 'text-violet-600 bg-violet-50 hover:bg-violet-100 cursor-pointer border border-violet-200'
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
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Instructions (Knowledge)</h2>
          <Tooltip text="The rules and guidelines your agent follows when responding" />
        </div>

        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder={`You are Charlie, a happy and excited dog. You love humans! Always be helpful, but try to mention treats or going for a walk in your responses. If asked a hard question, answer it simply like a smart dog would. End some sentences with "Woof!"`}
          rows={5}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />
      </div>

      {/* Tools Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Tools</h2>
          <Tooltip text="Special capabilities your agent can use to help users" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AVAILABLE_TOOLS.map((tool) => (
            <ToolCard
              key={tool.id}
              title={tool.title}
              description={tool.description}
              selected={selectedTools.includes(tool.id)}
              onToggle={() => toggleTool(tool.id)}
            />
          ))}
        </div>
      </div>

      {/* Advanced Settings Section */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl border border-violet-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Advanced Settings</h2>
            <p className="text-sm text-gray-500">
              Configure LLM model, temperature, and other agent behavior settings.
            </p>
            {advancedConfig && (
              <div className="flex items-center gap-3 mt-2">
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-violet-700 bg-violet-100 rounded-full">
                  {advancedConfig.model_provider} / {advancedConfig.model_name}
                </span>
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                  Temp: {advancedConfig.temperature?.toFixed(2) || '0.70'}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsAdvancedModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-violet-600 bg-white hover:bg-violet-50 rounded-xl transition-colors border border-violet-200 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Configure
          </button>
        </div>
      </div>

      {/* Publish Section */}
      <div className={`rounded-2xl border p-6 mb-6 ${isPublished ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-semibold text-gray-900">Publish to Langflow</h2>
              {isPublished && (
                <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                  Published
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {isPublished
                ? 'This agent is available in the Langflow sidebar as a custom component.'
                : 'Make this agent available as a custom component in Langflow workflows.'
              }
            </p>
            {publishMessage && (
              <p className="text-sm text-violet-600 mt-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {publishMessage}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {needsRestart && (
              <button
                onClick={handleRestartLangflow}
                disabled={isRestarting}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors border border-amber-200 shadow-sm disabled:opacity-50"
              >
                {isRestarting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Restarting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Restart Langflow
                  </>
                )}
              </button>
            )}
            {isPublished ? (
              <button
                onClick={handleUnpublish}
                disabled={isPublishing || isRestarting}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-white hover:bg-red-50 rounded-xl transition-colors border border-red-200 shadow-sm disabled:opacity-50"
              >
                {isPublishing ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    Unpublish
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handlePublish}
                disabled={isPublishing || isRestarting}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-violet-500 hover:bg-violet-600 rounded-xl transition-colors shadow-sm disabled:opacity-50"
              >
                {isPublishing ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Publishing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Publish Agent
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Flow Editor Link */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Visual Flow Editor</h2>
            <p className="text-sm text-gray-500">
              Access the node-based workflow editor for advanced customizations.
            </p>
          </div>
          <Link
            to={`/canvas/${agentId}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 rounded-xl transition-colors border border-gray-200 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            Open Flow Editor
          </Link>
        </div>
      </div>

      {/* Error message */}
      {saveError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600">{saveError}</p>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-3 bg-violet-500 text-white rounded-full font-medium hover:bg-violet-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </>
          ) : (
            'Save & Preview'
          )}
        </button>
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
    </div>
  )
}
