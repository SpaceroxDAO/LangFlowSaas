import { useState, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ProjectMenu } from '@/components/ProjectMenu'
import type { Project } from '@/types'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

// Chevron icon component
function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}

// Expandable project item component
function ExpandableProject({
  project,
  isActive,
  isRenaming,
  renameValue,
  renameInputRef,
  onRenameChange,
  onRenameSubmit,
  onRenameCancel,
  onStartRename,
}: {
  project: Project
  isActive: boolean
  isRenaming: boolean
  renameValue: string
  renameInputRef: React.RefObject<HTMLInputElement | null>
  onRenameChange: (value: string) => void
  onRenameSubmit: (e: React.FormEvent) => void
  onRenameCancel: () => void
  onStartRename: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const location = useLocation()

  // Fetch project contents when expanded
  const { data: agentComponents } = useQuery({
    queryKey: ['agent-components', project.id],
    queryFn: () => api.listAgentComponents(project.id),
    enabled: expanded,
  })

  const { data: workflows } = useQuery({
    queryKey: ['workflows', project.id],
    queryFn: () => api.listWorkflows(project.id),
    enabled: expanded,
  })

  const { data: mcpServers } = useQuery({
    queryKey: ['mcp-servers', project.id],
    queryFn: () => api.listMCPServers(project.id),
    enabled: expanded,
  })

  const agents = agentComponents?.agent_components || []
  const workflowList = workflows?.workflows || []
  const mcpList = mcpServers?.mcp_servers || []

  const hasContent = agents.length > 0 || workflowList.length > 0 || mcpList.length > 0

  return (
    <div>
      {/* Project row */}
      <div
        className={`group flex items-center gap-1 px-2 py-1.5 rounded transition-colors ${
          isActive ? 'bg-gray-100' : 'hover:bg-gray-50'
        }`}
      >
        {/* Expand/collapse toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ChevronIcon expanded={expanded} />
        </button>

        {isRenaming ? (
          <form onSubmit={onRenameSubmit} className="flex-1 min-w-0 flex gap-1">
            <input
              ref={renameInputRef}
              type="text"
              value={renameValue}
              onChange={(e) => onRenameChange(e.target.value)}
              onBlur={() => setTimeout(onRenameCancel, 150)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') onRenameCancel()
              }}
              className="flex-1 px-1 py-0 text-sm bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:border-gray-400"
              autoFocus
            />
          </form>
        ) : (
          <>
            <Link
              to={`/dashboard/project/${project.id}`}
              className="flex-1 min-w-0 text-sm text-gray-900 truncate"
            >
              {project.name}
            </Link>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <ProjectMenu
                project={project}
                onRename={onStartRename}
              />
            </div>
          </>
        )}
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="ml-4 pl-2 border-l border-gray-200">
          {/* Agents section */}
          {agents.length > 0 && (
            <div className="py-1">
              <div className="px-2 py-0.5 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                Agents
              </div>
              {agents.map((agent) => (
                <Link
                  key={agent.id}
                  to={`/edit/${agent.id}`}
                  className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded transition-colors ${
                    location.pathname === `/edit/${agent.id}`
                      ? 'bg-violet-50 text-violet-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="truncate">{agent.name}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Workflows section */}
          {workflowList.length > 0 && (
            <div className="py-1">
              <div className="px-2 py-0.5 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                Workflows
              </div>
              {workflowList.map((workflow) => (
                <Link
                  key={workflow.id}
                  to={`/playground/workflow/${workflow.id}`}
                  className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded transition-colors ${
                    location.pathname === `/playground/workflow/${workflow.id}`
                      ? 'bg-violet-50 text-violet-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="truncate">{workflow.name}</span>
                </Link>
              ))}
            </div>
          )}

          {/* MCP Servers section */}
          {mcpList.length > 0 && (
            <div className="py-1">
              <div className="px-2 py-0.5 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                MCP Servers
              </div>
              {mcpList.map((server) => (
                <div
                  key={server.id}
                  className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-600"
                >
                  <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                  </svg>
                  <span className="truncate">{server.name}</span>
                  <span className={`ml-auto w-1.5 h-1.5 rounded-full ${server.is_enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!hasContent && expanded && (
            <div className="px-2 py-2 text-[10px] text-gray-400 italic">
              No items yet
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showNewProjectInput, setShowNewProjectInput] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [renamingProjectId, setRenamingProjectId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const renameInputRef = useRef<HTMLInputElement>(null)

  // Fetch projects
  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['projects-with-agents'],
    queryFn: async () => {
      const projects = await api.listProjects()
      return projects
    },
  })

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: (name: string) => api.createProject({ name }),
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: ['projects-with-agents'] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setShowNewProjectInput(false)
      setNewProjectName('')
      navigate(`/dashboard/project/${newProject.id}`)
    },
  })

  // Rename project mutation
  const renameProjectMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => api.updateProject(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects-with-agents'] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setRenamingProjectId(null)
      setRenameValue('')
    },
  })

  const projects = projectsData?.projects || []

  const isProjectActive = (projectId: string) =>
    location.pathname === `/dashboard/project/${projectId}`

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (newProjectName.trim()) {
      createProjectMutation.mutate(newProjectName.trim())
    }
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    try {
      const text = await file.text()
      const data = JSON.parse(text)

      // Import the agent(s) from the file
      if (data.agent) {
        // Wrapped format: { agent: {...} }
        await api.importAgent(data)
        queryClient.invalidateQueries({ queryKey: ['projects-with-agents'] })
        queryClient.invalidateQueries({ queryKey: ['projects'] })
        alert('Agent imported successfully!')
      } else if (data.agents && Array.isArray(data.agents)) {
        // Multiple agents (project export): { agents: [...] }
        for (const agent of data.agents) {
          await api.importAgent({ agent })
        }
        queryClient.invalidateQueries({ queryKey: ['projects-with-agents'] })
        queryClient.invalidateQueries({ queryKey: ['projects'] })
        alert(`${data.agents.length} agent(s) imported successfully!`)
      } else if (data.name && (data.system_prompt || data.qa_who)) {
        // Direct export format: { name: "...", system_prompt: "...", ... }
        await api.importAgent(data)
        queryClient.invalidateQueries({ queryKey: ['projects-with-agents'] })
        queryClient.invalidateQueries({ queryKey: ['projects'] })
        alert('Agent imported successfully!')
      } else {
        alert('Invalid import file format. Please use an exported agent JSON file.')
      }
    } catch (error) {
      console.error('Import failed:', error)
      alert('Failed to import. Please check the file format and try again.')
    } finally {
      setIsImporting(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleStartRename = (projectId: string, currentName: string) => {
    setRenamingProjectId(projectId)
    setRenameValue(currentName)
    // Focus the input after render
    setTimeout(() => renameInputRef.current?.focus(), 0)
  }

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (renamingProjectId && renameValue.trim()) {
      renameProjectMutation.mutate({ id: renamingProjectId, name: renameValue.trim() })
    }
  }

  const handleRenameCancel = () => {
    setRenamingProjectId(null)
    setRenameValue('')
  }

  if (collapsed) {
    return (
      <div className="w-12 h-full bg-white border-r border-gray-200 flex flex-col items-center py-3">
        <button
          onClick={onToggle}
          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors mb-3"
          title="Expand sidebar"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>

        {/* Collapsed project icons */}
        <div className="flex flex-col gap-1">
          {projects.slice(0, 5).map((project) => (
            <Link
              key={project.id}
              to={`/dashboard/project/${project.id}`}
              className={`w-8 h-8 rounded flex items-center justify-center text-xs transition-colors ${
                isProjectActive(project.id)
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
              title={project.name}
            >
              {project.name.charAt(0).toUpperCase()}
            </Link>
          ))}
        </div>

        {/* Bottom - My Files only */}
        <div className="mt-auto">
          <Link
            to="/dashboard/files"
            className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
              location.pathname === '/dashboard/files'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
            }`}
            title="My Files"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-52 h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileImport}
        className="hidden"
      />

      {/* Header */}
      <div className="px-3 py-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Projects</span>
        <div className="flex items-center gap-1">
          {/* Upload/Import button */}
          <button
            onClick={handleImportClick}
            disabled={isImporting}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
            title="Import agent"
          >
            {isImporting ? (
              <div className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            )}
          </button>
          {/* Add project button */}
          <button
            onClick={() => setShowNewProjectInput(true)}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="New Project"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* New Project Input */}
      {showNewProjectInput && (
        <form onSubmit={handleCreateProject} className="px-2 mb-2">
          <div className="flex gap-1">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project name..."
              className="flex-1 px-2 py-1 text-xs bg-white border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400"
              autoFocus
            />
            <button
              type="button"
              onClick={() => {
                setShowNewProjectInput(false)
                setNewProjectName('')
              }}
              className="px-1.5 text-gray-400 hover:text-gray-600 text-xs"
            >
              x
            </button>
          </div>
        </form>
      )}

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="px-3 py-2 text-gray-400 text-xs">Loading...</div>
        ) : projects.length === 0 ? (
          <div className="px-3 py-2 text-gray-400 text-xs">No projects</div>
        ) : (
          <div className="space-y-0.5 px-1">
            {projects.map((project) => (
              <ExpandableProject
                key={project.id}
                project={project}
                isActive={isProjectActive(project.id)}
                isRenaming={renamingProjectId === project.id}
                renameValue={renameValue}
                renameInputRef={renameInputRef}
                onRenameChange={setRenameValue}
                onRenameSubmit={handleRenameSubmit}
                onRenameCancel={handleRenameCancel}
                onStartRename={() => handleStartRename(project.id, project.name)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-100 px-2 py-2">
        {/* My Files */}
        <Link
          to="/dashboard/files"
          className={`flex items-center gap-2 px-2 py-1.5 rounded transition-colors text-sm ${
            location.pathname === '/dashboard/files'
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          My Files
        </Link>
      </div>
    </div>
  )
}
