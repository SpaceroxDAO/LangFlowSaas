import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { TemplateGalleryModal } from '@/components/TemplateGallery'
import type { Project } from '@/types'
import {
  Bot,
  GitBranch,
  LayoutGrid,
  GraduationCap,
  Plus,
  ArrowRight,
  X,
  Sparkles,
} from 'lucide-react'

// Getting Started card data
const GETTING_STARTED_CARDS = [
  {
    id: 'build-agent',
    title: 'Build Your First Agent',
    description: 'Create an AI agent with our guided 3-step wizard',
    icon: Bot,
    gradient: 'from-orange-400 via-pink-400 to-purple-500',
    bgGradient: 'from-orange-50 via-pink-50 to-purple-50',
    action: 'navigate',
    path: '/create',
  },
  {
    id: 'build-workflow',
    title: 'Build Your First Workflow',
    description: 'Automate tasks by connecting AI components together',
    icon: GitBranch,
    gradient: 'from-purple-400 via-violet-400 to-indigo-500',
    bgGradient: 'from-purple-50 via-violet-50 to-indigo-50',
    action: 'modal',
    modalType: 'workflow',
  },
  {
    id: 'explore-templates',
    title: 'Explore Templates',
    description: 'Browse pre-built templates to jumpstart your projects',
    icon: LayoutGrid,
    gradient: 'from-cyan-400 via-blue-400 to-indigo-500',
    bgGradient: 'from-cyan-50 via-blue-50 to-indigo-50',
    action: 'modal',
    modalType: 'templates',
  },
  {
    id: 'learning-mission',
    title: 'Start a Learning Mission',
    description: 'Follow guided tutorials to master AI agent building',
    icon: GraduationCap,
    gradient: 'from-emerald-400 via-teal-400 to-cyan-500',
    bgGradient: 'from-emerald-50 via-teal-50 to-cyan-50',
    action: 'navigate',
    path: '/dashboard/missions',
  },
]

export function ProjectsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showGettingStarted, setShowGettingStarted] = useState(true)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDescription, setNewProjectDescription] = useState('')
  const [selectedColor, setSelectedColor] = useState('#f97316')
  const [selectedIcon, setSelectedIcon] = useState('folder')

  const { data: projectsData, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.listProjects(),
  })

  const createProjectMutation = useMutation({
    mutationFn: () =>
      api.createProject({
        name: newProjectName,
        description: newProjectDescription || undefined,
        color: selectedColor,
        icon: selectedIcon,
      }),
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setShowNewProjectModal(false)
      resetForm()
      navigate(`/dashboard/project/${project.id}`)
    },
  })

  const resetForm = () => {
    setNewProjectName('')
    setNewProjectDescription('')
    setSelectedColor('#f97316')
    setSelectedIcon('folder')
  }

  const projects = projectsData?.projects || []

  // Find default project for auto-selection
  const defaultProject = useMemo(() => {
    return projects.find((p) => p.is_default) || projects[0]
  }, [projects])

  const colorOptions = [
    '#f97316', // orange
    '#ef4444', // red
    '#22c55e', // green
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f59e0b', // amber
  ]

  const iconOptions = [
    { id: 'folder', emoji: '📁' },
    { id: 'star', emoji: '⭐' },
    { id: 'briefcase', emoji: '💼' },
    { id: 'code', emoji: '💻' },
    { id: 'chat', emoji: '💬' },
    { id: 'book', emoji: '📚' },
    { id: 'rocket', emoji: '🚀' },
    { id: 'heart', emoji: '❤️' },
  ]

  const getProjectIcon = (project: Project) => {
    const icon = iconOptions.find((i) => i.id === project.icon)
    return icon?.emoji || '📁'
  }

  // Handle Getting Started card actions
  const handleCardAction = (card: (typeof GETTING_STARTED_CARDS)[0]) => {
    if (card.action === 'navigate' && card.path) {
      // For agent creation, include default project ID
      if (card.id === 'build-agent' && defaultProject) {
        navigate(`${card.path}?projectId=${defaultProject.id}`)
      } else {
        navigate(card.path)
      }
    } else if (card.action === 'modal') {
      setShowTemplateModal(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium text-gray-500">Dashboard</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back to{' '}
              <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Teach Charlie AI
              </span>
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (defaultProject) {
                  navigate(`/create?projectId=${defaultProject.id}`)
                } else {
                  navigate('/create')
                }
              }}
              className="group relative px-4 py-2.5 rounded-lg text-sm font-medium text-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5"
            >
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600" />
              {/* Shine effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full" style={{ transition: 'transform 0.6s' }} />
              <span className="relative flex items-center gap-2">
                <Bot className="w-4 h-4" />
                Create Agent
              </span>
            </button>

            <button
              onClick={() => setShowTemplateModal(true)}
              className="group px-4 py-2.5 rounded-lg text-sm font-medium border-2 border-purple-200 text-purple-700 bg-white hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
            >
              <GitBranch className="w-4 h-4" />
              Create Workflow
            </button>

            <button
              onClick={() => setShowNewProjectModal(true)}
              className="px-4 py-2.5 rounded-lg text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>
        </div>

        {/* Getting Started Section */}
        {showGettingStarted && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Getting Started</h2>
              <button
                onClick={() => setShowGettingStarted(false)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                Dismiss
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {GETTING_STARTED_CARDS.map((card, index) => {
                const Icon = card.icon
                return (
                  <button
                    key={card.id}
                    onClick={() => handleCardAction(card)}
                    className="group relative bg-white rounded-2xl border border-gray-200 p-6 text-left hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Gradient blob background */}
                    <div
                      className={`absolute -top-20 -right-20 w-48 h-48 rounded-full bg-gradient-to-br ${card.bgGradient} opacity-60 blur-2xl group-hover:scale-150 group-hover:opacity-80 transition-all duration-700`}
                    />

                    {/* Content */}
                    <div className="relative">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      {/* Text */}
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {card.description}
                      </p>

                      {/* CTA */}
                      <div className={`flex items-center gap-1 text-sm font-medium bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                        Start Building
                        <ArrowRight className="w-4 h-4 text-purple-500 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Projects</h2>
            {projects.length > 0 && (
              <span className="text-sm text-gray-500">{projects.length} project{projects.length !== 1 ? 's' : ''}</span>
            )}
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="relative">
                <div className="w-10 h-10 rounded-full border-2 border-gray-200" />
                <div className="absolute inset-0 w-10 h-10 rounded-full border-2 border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
              Failed to load projects. Please try again.
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && projects.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📁</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h2>
              <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                Create your first project to organize your agents and workflows
              </p>
              <button
                onClick={() => setShowNewProjectModal(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                Create Your First Project
              </button>
            </div>
          )}

          {/* Projects Grid */}
          {projects.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((project, index) => (
                <Link
                  key={project.id}
                  to={`/dashboard/project/${project.id}`}
                  className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-1 hover:border-gray-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: `${project.color || '#f97316'}15` }}
                    >
                      {getProjectIcon(project)}
                    </div>
                    {project.is_default && (
                      <span className="px-2.5 py-1 bg-gradient-to-r from-orange-100 to-purple-100 text-purple-700 text-xs font-medium rounded-full">
                        Default
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5" title="Agents">
                      <Bot className="w-4 h-4 text-gray-400" />
                      <span>{project.agent_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="Workflows">
                      <GitBranch className="w-4 h-4 text-gray-400" />
                      <span>{project.workflow_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="MCP Servers">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                        />
                      </svg>
                      <span>{project.mcp_server_count || 0}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* New Project Modal */}
        {showNewProjectModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div
              className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
              style={{ animation: 'modalFadeIn 0.2s ease-out' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Create New Project</h2>
                <button
                  onClick={() => {
                    setShowNewProjectModal(false)
                    resetForm()
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (newProjectName.trim()) {
                    createProjectMutation.mutate()
                  }
                }}
              >
                <div className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="My New Project"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all"
                      autoFocus
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                      value={newProjectDescription}
                      onChange={(e) => setNewProjectDescription(e.target.value)}
                      placeholder="A brief description of this project..."
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all resize-none"
                    />
                  </div>

                  {/* Icon */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                    <div className="flex gap-2 flex-wrap">
                      {iconOptions.map((icon) => (
                        <button
                          key={icon.id}
                          type="button"
                          onClick={() => setSelectedIcon(icon.id)}
                          className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-all ${
                            selectedIcon === icon.id
                              ? 'bg-purple-100 ring-2 ring-purple-500'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {icon.emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                    <div className="flex gap-2 flex-wrap">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`w-9 h-9 rounded-full transition-all hover:scale-110 ${
                            selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {createProjectMutation.isError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    Failed to create project. Please try again.
                  </div>
                )}

                <div className="mt-6 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewProjectModal(false)
                      resetForm()
                    }}
                    disabled={createProjectMutation.isPending}
                    className="px-5 py-2.5 text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newProjectName.trim() || createProjectMutation.isPending}
                    className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-gray-900/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                  >
                    {createProjectMutation.isPending && (
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    )}
                    {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Template Gallery Modal */}
        <TemplateGalleryModal
          isOpen={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
          projectId={defaultProject?.id || ''}
        />
      </div>
    </div>
  )
}
