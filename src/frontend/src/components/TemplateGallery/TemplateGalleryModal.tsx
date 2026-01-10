/**
 * Template Gallery Modal
 *
 * A Langflow-style template browser for creating new workflows.
 * Features category sidebar, gradient template cards, and My Agents integration.
 */
import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import type { WorkflowTemplate, TemplateCategory, AgentComponent } from '@/types'

// Gradient definitions for template cards
const gradients: Record<string, string> = {
  // Original gradients
  'purple-pink': 'bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700',
  'blue-cyan': 'bg-gradient-to-br from-blue-900 via-indigo-800 to-cyan-700',
  'pink-purple': 'bg-gradient-to-br from-pink-900 via-fuchsia-800 to-purple-700',
  'green-teal': 'bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-700',
  'orange-red': 'bg-gradient-to-br from-orange-900 via-red-800 to-rose-700',
  'indigo-purple': 'bg-gradient-to-br from-indigo-900 via-violet-800 to-purple-700',
  'gray': 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600',
  // New gradients for additional templates
  'cyan-blue': 'bg-gradient-to-br from-cyan-900 via-sky-800 to-blue-700',
  'teal-green': 'bg-gradient-to-br from-teal-900 via-emerald-800 to-green-700',
  'violet-purple': 'bg-gradient-to-br from-violet-900 via-purple-800 to-fuchsia-700',
  'amber-orange': 'bg-gradient-to-br from-amber-900 via-orange-800 to-red-700',
  'rose-pink': 'bg-gradient-to-br from-rose-900 via-pink-800 to-fuchsia-700',
  'emerald-teal': 'bg-gradient-to-br from-emerald-900 via-green-800 to-teal-700',
  'sky-blue': 'bg-gradient-to-br from-sky-900 via-blue-800 to-indigo-700',
  'indigo-blue': 'bg-gradient-to-br from-indigo-900 via-blue-800 to-sky-700',
  'lime-green': 'bg-gradient-to-br from-lime-900 via-green-800 to-emerald-700',
  'fuchsia-pink': 'bg-gradient-to-br from-fuchsia-900 via-pink-800 to-rose-700',
  'purple-indigo': 'bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-700',
  'yellow-amber': 'bg-gradient-to-br from-yellow-800 via-amber-700 to-orange-600',
  'pink-rose': 'bg-gradient-to-br from-pink-900 via-rose-800 to-red-700',
  'green-emerald': 'bg-gradient-to-br from-green-900 via-emerald-800 to-teal-700',
  'slate-gray': 'bg-gradient-to-br from-slate-800 via-gray-700 to-zinc-600',
  'zinc-slate': 'bg-gradient-to-br from-zinc-800 via-slate-700 to-gray-600',
  'orange-amber': 'bg-gradient-to-br from-orange-900 via-amber-800 to-yellow-700',
  'red-orange': 'bg-gradient-to-br from-red-900 via-orange-800 to-amber-700',
}

// Icons for categories and templates
function CategoryIcon({ name, className = "w-4 h-4" }: { name: string; className?: string }) {
  const icons: Record<string, JSX.Element> = {
    'play': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'grid': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    'bot': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    'message-square': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    'database': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
    'user': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    'plus': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
    'zap': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    'brain': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    'file-text': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    'git-branch': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 15v6m0 0l4-4m-4 4l-4-4M18 9V3m0 0l-4 4m4-4l4 4M12 3v18" />
      </svg>
    ),
    // New icons for additional templates
    'search': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    'globe': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'layers': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l9 4.5v4L12 15 3 10.5v-4L12 2zm0 13l9-4.5v4L12 19l-9-4.5v-4L12 15z" />
      </svg>
    ),
    'folder': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    'align-left': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h14" />
      </svg>
    ),
    'scissors': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
      </svg>
    ),
    'heart': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    'send': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    'headphones': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 18v-6a9 9 0 0118 0v6M3 18a3 3 0 003 3h0a3 3 0 003-3v-3a3 3 0 00-3-3h0a3 3 0 00-3 3v3zm18 0a3 3 0 01-3 3h0a3 3 0 01-3-3v-3a3 3 0 013-3h0a3 3 0 013 3v3z" />
      </svg>
    ),
    'table': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    'bar-chart': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    'trending-up': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    'star': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    'edit': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    'code': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    'terminal': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    'refresh-cw': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    'mail': (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  }
  return icons[name] || icons['zap']
}

interface TemplateGalleryModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
}

export function TemplateGalleryModal({ isOpen, onClose, projectId }: TemplateGalleryModalProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedCategory, setSelectedCategory] = useState('get-started')
  const [isCreating, setIsCreating] = useState(false)

  // Fetch templates from backend
  const { data: templatesData, isLoading: templatesLoading } = useQuery({
    queryKey: ['workflow-templates'],
    queryFn: () => api.getWorkflowTemplates(),
    enabled: isOpen,
  })

  // Fetch published agent components for "My Agents" category
  const { data: agentsData } = useQuery({
    queryKey: ['agent-components', projectId],
    queryFn: () => api.listAgentComponents(projectId),
    enabled: isOpen,
  })

  const publishedAgents = useMemo(() => {
    return (agentsData?.agent_components || []).filter(a => a.is_published)
  }, [agentsData])

  // Create workflow mutation (for templates)
  const createWorkflowMutation = useMutation({
    mutationFn: async (params: {
      template: WorkflowTemplate | null
      agent?: AgentComponent
    }) => {
      const { template, agent } = params

      // If creating from agent
      if (agent) {
        return api.createWorkflowFromAgent({
          agent_component_id: agent.id,
          project_id: projectId,
        })
      }

      // If blank workflow
      if (!template || template.is_blank) {
        return api.createWorkflow({
          name: 'New Workflow',
          project_id: projectId,
        })
      }

      // If Langflow starter template with data
      if (template.is_langflow_starter && template.data) {
        return api.createWorkflowFromLangflowData({
          name: template.name,
          flow_data: template.data,
          project_id: projectId,
          description: template.description,
        })
      }

      // For built-in templates or templates without data, create with template name
      // In the future, we could fetch actual flow data from template files
      return api.createWorkflow({
        name: template.name || 'New Workflow',
        description: template.description,
        project_id: projectId,
      })
    },
    onSuccess: (workflow) => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] })
      onClose()
      // Navigate to canvas
      navigate(`/canvas/${workflow.id}`)
    },
  })

  // Filter templates by category
  const filteredTemplates = useMemo(() => {
    if (!templatesData?.templates) return []

    if (selectedCategory === 'all') {
      return templatesData.templates
    }

    if (selectedCategory === 'my-agents') {
      return [] // We'll show agents separately
    }

    return templatesData.templates.filter(t => t.category === selectedCategory)
  }, [templatesData, selectedCategory])

  // Group categories by their group
  const groupedCategories = useMemo(() => {
    if (!templatesData?.categories) return { ungrouped: [], grouped: {} }

    const ungrouped: TemplateCategory[] = []
    const grouped: Record<string, TemplateCategory[]> = {}

    templatesData.categories.forEach(cat => {
      if (cat.group) {
        if (!grouped[cat.group]) grouped[cat.group] = []
        grouped[cat.group].push(cat)
      } else {
        ungrouped.push(cat)
      }
    })

    return { ungrouped, grouped }
  }, [templatesData])

  const handleSelectTemplate = async (template: WorkflowTemplate | null, agent?: AgentComponent) => {
    setIsCreating(true)
    try {
      await createWorkflowMutation.mutateAsync({ template, agent })
    } finally {
      setIsCreating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Templates</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isCreating}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-52 border-r bg-gray-50 p-4 overflow-y-auto">
            {/* Ungrouped categories */}
            <div className="space-y-1">
              {groupedCategories.ungrouped.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-violet-100 text-violet-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <CategoryIcon name={cat.icon} />
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Grouped categories */}
            {Object.entries(groupedCategories.grouped).map(([group, cats]) => (
              <div key={group} className="mt-6">
                <div className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {group}
                </div>
                <div className="space-y-1">
                  {cats.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-violet-100 text-violet-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <CategoryIcon name={cat.icon} />
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* My Agents section (Custom) */}
            {publishedAgents.length > 0 && (
              <div className="mt-6">
                <div className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Custom
                </div>
                <button
                  onClick={() => setSelectedCategory('my-agents')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === 'my-agents'
                      ? 'bg-violet-100 text-violet-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <CategoryIcon name="user" />
                  My Agents
                  <span className="ml-auto bg-gray-200 text-gray-600 text-xs px-1.5 py-0.5 rounded">
                    {publishedAgents.length}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {templatesLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
              </div>
            ) : (
              <>
                {/* Category header */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedCategory === 'my-agents'
                      ? 'My Agents'
                      : templatesData?.categories.find(c => c.id === selectedCategory)?.name || 'Templates'
                    }
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedCategory === 'my-agents'
                      ? 'Create workflows from your published agents.'
                      : selectedCategory === 'get-started'
                      ? 'Start with templates showcasing Langflow\'s Prompting, RAG, and Agent use cases.'
                      : 'Select a template to create a new workflow.'
                    }
                  </p>
                </div>

                {/* Template grid */}
                {selectedCategory === 'my-agents' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {publishedAgents.map(agent => (
                      <button
                        key={agent.id}
                        onClick={() => handleSelectTemplate(null, agent)}
                        disabled={isCreating}
                        className={`group relative overflow-hidden rounded-xl p-5 text-left transition-all duration-200 ${
                          isCreating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-lg cursor-pointer'
                        } ${gradients['purple-pink']}`}
                      >
                        {/* Decorative circles */}
                        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/5" />

                        <div className="relative">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/20 text-white/90">
                              AGENT
                            </span>
                          </div>
                          <h4 className="text-white font-semibold text-lg mb-2">
                            {agent.name}
                          </h4>
                          <p className="text-white/70 text-sm line-clamp-2">
                            {agent.qa_who || 'Custom AI agent'}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTemplates.map(template => (
                      <button
                        key={template.id}
                        onClick={() => handleSelectTemplate(template)}
                        disabled={isCreating}
                        className={`group relative overflow-hidden rounded-xl p-5 text-left transition-all duration-200 ${
                          isCreating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-lg cursor-pointer'
                        } ${template.is_blank ? 'border-2 border-dashed border-gray-300 bg-gray-50' : gradients[template.gradient] || gradients['purple-pink']}`}
                      >
                        {/* Decorative circles for non-blank templates */}
                        {!template.is_blank && (
                          <>
                            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/5" />
                          </>
                        )}

                        <div className="relative">
                          {/* Tags */}
                          {template.tags.length > 0 && (
                            <div className="flex items-center gap-2 mb-3">
                              {template.tags.map(tag => (
                                <span
                                  key={tag}
                                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                    template.is_blank
                                      ? 'bg-gray-200 text-gray-600'
                                      : 'bg-white/20 text-white/90'
                                  }`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Title */}
                          <h4 className={`font-semibold text-lg mb-2 ${
                            template.is_blank ? 'text-gray-700' : 'text-white'
                          }`}>
                            {template.name}
                          </h4>

                          {/* Description */}
                          <p className={`text-sm line-clamp-2 ${
                            template.is_blank ? 'text-gray-500' : 'text-white/70'
                          }`}>
                            {template.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Start from scratch section */}
                {selectedCategory !== 'my-agents' && (
                  <div className="mt-8 pt-6 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Start from scratch</h4>
                        <p className="text-sm text-gray-500">Begin with a fresh flow to build from scratch.</p>
                      </div>
                      <button
                        onClick={() => handleSelectTemplate(null)}
                        disabled={isCreating}
                        className={`inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg transition-colors ${
                          isCreating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Blank Flow
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Creating overlay */}
        {isCreating && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500 mx-auto mb-3"></div>
              <p className="text-gray-600">Creating workflow...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TemplateGalleryModal
