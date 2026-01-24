import React, { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  AlertTriangle, CheckCircle, XCircle, RefreshCw, Globe, Terminal,
  Trash2, Loader2, Copy, Check, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Key, X
} from 'lucide-react'
import { api } from '@/lib/api'
import { MCPServerCard } from './MCPServerCard'
import { getHealthIcon } from './utils'
import type { MCPConfigModalProps, AddServerPanelProps, MCPTransportType, Workflow } from './types'

export function MCPConfigModal({ projectId, workflows, servers, onClose }: MCPConfigModalProps) {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'external' | 'expose'>('external')

  // Expose as Server state
  const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set())
  const [toolsSearchQuery, setToolsSearchQuery] = useState('')
  const [toolsPage, setToolsPage] = useState(1)
  const [transport, setTransport] = useState<'sse' | 'streamable-http'>('streamable-http')
  const [copiedConfig, setCopiedConfig] = useState(false)
  const toolsPerPage = 10

  // External Servers state
  const [searchQuery, setSearchQuery] = useState('')

  // Filter and paginate tools
  const filteredTools = useMemo(() => {
    if (!toolsSearchQuery.trim()) return workflows
    const query = toolsSearchQuery.toLowerCase()
    return workflows.filter(
      (w) =>
        w.name.toLowerCase().includes(query) ||
        w.description?.toLowerCase().includes(query)
    )
  }, [workflows, toolsSearchQuery])

  const totalToolsPages = Math.ceil(filteredTools.length / toolsPerPage)
  const paginatedTools = filteredTools.slice(
    (toolsPage - 1) * toolsPerPage,
    toolsPage * toolsPerPage
  )

  // Get enabled workflows
  const enabledWorkflows = selectedTools.size > 0
    ? workflows.filter(w => selectedTools.has(w.id))
    : workflows

  // Generate tool name from workflow
  const generateToolName = (workflow: Workflow) => {
    const baseName = workflow.name.toUpperCase().replace(/\s+/g, '_')
    const shortId = workflow.id.slice(0, 8).toUpperCase()
    return `${baseName}_${shortId}...`
  }

  // MCP config generation
  const langflowBaseUrl = 'http://localhost:7860'
  const mcpServerUrl = `${langflowBaseUrl}/api/v1/mcp/project/${projectId}/${transport === 'streamable-http' ? 'streamable' : 'sse'}`

  const generateMcpConfig = () => {
    const serverName = `tc-project-${projectId.slice(0, 8)}`
    return {
      mcpServers: {
        [serverName]: {
          command: 'uvx',
          args: [
            'mcp-proxy',
            '--transport',
            transport === 'streamable-http' ? 'streamablehttp' : 'sse',
            mcpServerUrl
          ]
        }
      }
    }
  }

  const mcpConfig = generateMcpConfig()
  const mcpConfigJson = JSON.stringify(mcpConfig, null, 2)

  const handleCopyConfig = async () => {
    try {
      await navigator.clipboard.writeText(mcpConfigJson)
      setCopiedConfig(true)
      setTimeout(() => setCopiedConfig(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Filter external servers
  const filteredServers = useMemo(() => {
    if (!searchQuery.trim()) return servers
    const query = searchQuery.toLowerCase()
    return servers.filter(
      (server) =>
        server.name.toLowerCase().includes(query) ||
        server.description?.toLowerCase().includes(query) ||
        server.server_type.toLowerCase().includes(query)
    )
  }, [servers, searchQuery])

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (serverId: string) => api.deleteMCPServer(serverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcp-servers', projectId] })
      queryClient.invalidateQueries({ queryKey: ['restart-status'] })
    },
  })

  // Enable/Disable mutations
  const enableMutation = useMutation({
    mutationFn: (serverId: string) => api.enableMCPServer(serverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcp-servers', projectId] })
    },
  })

  const disableMutation = useMutation({
    mutationFn: (serverId: string) => api.disableMCPServer(serverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcp-servers', projectId] })
    },
  })

  const handleToggleServer = (server: { id: string; is_enabled: boolean }) => {
    if (server.is_enabled) {
      disableMutation.mutate(server.id)
    } else {
      enableMutation.mutate(server.id)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-900 rounded-xl w-full max-w-4xl mx-4 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New MCP Server</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-gray-200 dark:border-neutral-700">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('external')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'external'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-300'
              }`}
            >
              Add External Server
              {servers.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 text-xs rounded-full">
                  {servers.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('expose')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'expose'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-300'
              }`}
            >
              Expose Internal Project as Server
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto">
          {/* EXPOSE AS SERVER TAB */}
          {activeTab === 'expose' && (
            <ExposeAsServerPanel
              workflows={workflows}
              enabledWorkflows={enabledWorkflows}
              filteredTools={filteredTools}
              paginatedTools={paginatedTools}
              selectedTools={selectedTools}
              setSelectedTools={setSelectedTools}
              toolsSearchQuery={toolsSearchQuery}
              setToolsSearchQuery={setToolsSearchQuery}
              toolsPage={toolsPage}
              setToolsPage={setToolsPage}
              totalToolsPages={totalToolsPages}
              toolsPerPage={toolsPerPage}
              transport={transport}
              setTransport={setTransport}
              mcpConfigJson={mcpConfigJson}
              copiedConfig={copiedConfig}
              handleCopyConfig={handleCopyConfig}
              generateToolName={generateToolName}
            />
          )}

          {/* ADD EXTERNAL SERVER TAB */}
          {activeTab === 'external' && (
            <AddServerPanel
              projectId={projectId}
              servers={servers}
              filteredServers={filteredServers}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onToggleServer={handleToggleServer}
              onDeleteServer={(s) => deleteMutation.mutate(s.id)}
              getHealthIcon={getHealthIcon}
              isToggling={enableMutation.isPending || disableMutation.isPending}
              onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ['mcp-servers', projectId] })
                queryClient.invalidateQueries({ queryKey: ['restart-status'] })
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ================================================================
// Expose As Server Panel
// ================================================================
interface ExposeAsServerPanelProps {
  workflows: Workflow[]
  enabledWorkflows: Workflow[]
  filteredTools: Workflow[]
  paginatedTools: Workflow[]
  selectedTools: Set<string>
  setSelectedTools: (tools: Set<string>) => void
  toolsSearchQuery: string
  setToolsSearchQuery: (query: string) => void
  toolsPage: number
  setToolsPage: (page: number | ((p: number) => number)) => void
  totalToolsPages: number
  toolsPerPage: number
  transport: 'sse' | 'streamable-http'
  setTransport: (transport: 'sse' | 'streamable-http') => void
  mcpConfigJson: string
  copiedConfig: boolean
  handleCopyConfig: () => void
  generateToolName: (workflow: Workflow) => string
}

function ExposeAsServerPanel({
  workflows,
  enabledWorkflows,
  filteredTools,
  paginatedTools,
  selectedTools,
  setSelectedTools,
  toolsSearchQuery,
  setToolsSearchQuery,
  toolsPage,
  setToolsPage,
  totalToolsPages,
  toolsPerPage,
  transport,
  setTransport,
  mcpConfigJson,
  copiedConfig,
  handleCopyConfig,
  generateToolName,
}: ExposeAsServerPanelProps) {
  return (
    <div className="p-6">
      <p className="text-sm text-gray-600 mb-6">
        Expose your project's workflows as tools that MCP clients can use.
      </p>

      {/* Tools Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Available Tools ({enabledWorkflows.length})</h3>
          <div className="relative w-64">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search tools..."
              value={toolsSearchQuery}
              onChange={(e) => {
                setToolsSearchQuery(e.target.value)
                setToolsPage(1)
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>
        </div>

        {/* Tools Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedTools.size === workflows.length && workflows.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTools(new Set(workflows.map(w => w.id)))
                      } else {
                        setSelectedTools(new Set())
                      }
                    }}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flow Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tool Name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedTools.map((workflow) => (
                <tr key={workflow.id} className="hover:bg-gray-50 transition-colors">
                  <td className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedTools.has(workflow.id)}
                      onChange={(e) => {
                        const newSelected = new Set(selectedTools)
                        if (e.target.checked) {
                          newSelected.add(workflow.id)
                        } else {
                          newSelected.delete(workflow.id)
                        }
                        setSelectedTools(newSelected)
                      }}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 truncate max-w-[180px]" title={workflow.name}>
                    {workflow.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-[220px]" title={workflow.description || ''}>
                    {workflow.description || `Workflow for ${workflow.name}`}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-mono truncate max-w-[200px]" title={generateToolName(workflow)}>
                    {generateToolName(workflow)}
                  </td>
                </tr>
              ))}
              {paginatedTools.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">
                    {toolsSearchQuery ? 'No tools found' : 'No workflows in this project'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalToolsPages > 1 && (
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm text-gray-500">
              {(toolsPage - 1) * toolsPerPage + 1} - {Math.min(toolsPage * toolsPerPage, filteredTools.length)} of {filteredTools.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setToolsPage(1)}
                disabled={toolsPage === 1}
                className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setToolsPage(p => Math.max(1, p - 1))}
                disabled={toolsPage === 1}
                className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 text-sm text-gray-600">Page {toolsPage} of {totalToolsPages}</span>
              <button
                onClick={() => setToolsPage(p => Math.min(totalToolsPages, p + 1))}
                disabled={toolsPage >= totalToolsPages}
                className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setToolsPage(totalToolsPages)}
                disabled={toolsPage >= totalToolsPages}
                className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Auth & Transport */}
      <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
        {/* Auth */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Auth:</span>
          <div className="flex items-center gap-1.5 text-amber-600">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">None (public)</span>
          </div>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            onClick={() => alert('Authentication configuration coming soon!')}
          >
            <Key className="w-4 h-4" />
            Add Auth
          </button>
        </div>

        <div className="h-6 w-px bg-gray-200" />

        {/* Transport */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Transport:</span>
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setTransport('sse')}
              className={`px-3 py-1.5 text-sm transition-colors ${
                transport === 'sse'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              SSE
            </button>
            <button
              onClick={() => setTransport('streamable-http')}
              className={`px-3 py-1.5 text-sm transition-colors ${
                transport === 'streamable-http'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Streamable HTTP
            </button>
          </div>
        </div>
      </div>

      {/* JSON Config */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Configuration</h3>
        <div className="relative bg-gray-900 rounded-lg overflow-hidden">
          <button
            onClick={handleCopyConfig}
            className="absolute top-3 right-3 p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
            title="Copy to clipboard"
          >
            {copiedConfig ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          <pre className="p-4 pr-14 text-sm text-gray-100 overflow-x-auto font-mono">
            {mcpConfigJson}
          </pre>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Add this configuration to your MCP client (Claude Desktop, Cursor, etc.)
        </p>
      </div>
    </div>
  )
}

// ================================================================
// Add Server Panel
// ================================================================
function AddServerPanel({
  projectId,
  servers,
  filteredServers,
  searchQuery,
  setSearchQuery,
  onToggleServer,
  onDeleteServer,
  getHealthIcon,
  isToggling,
  onSuccess,
}: AddServerPanelProps) {
  const [mode, setMode] = useState<'templates' | 'json'>('templates')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [name, setName] = useState('')
  const [credentials, setCredentials] = useState<Record<string, string>>({})
  const [url, setUrl] = useState('')
  const [headers, setHeaders] = useState<Array<{ key: string; value: string }>>([])
  const [sslVerify, setSslVerify] = useState(true)
  const [useCache, setUseCache] = useState(false)
  const [customCommand, setCustomCommand] = useState('')
  const [customArgs, setCustomArgs] = useState('')
  const [jsonConfig, setJsonConfig] = useState('')
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [isTesting, setIsTesting] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const { data: templatesData } = useQuery({
    queryKey: ['mcp-templates'],
    queryFn: () => api.getMCPServerTemplates(),
  })

  const templates = templatesData?.templates || []
  const selectedTemplateData = templates.find((t) => t.name === selectedTemplate)
  const isSSETemplate = selectedTemplateData?.transport === 'sse' || selectedTemplateData?.transport === 'http'
  const isCustomTemplate = selectedTemplate === 'custom'

  const handleSelectTemplate = (templateName: string) => {
    setSelectedTemplate(templateName)
    setCredentials({})
    setUrl('')
    setHeaders([])
    setSslVerify(true)
    setUseCache(false)
    setCustomCommand('')
    setCustomArgs('')
    setTestResult(null)
  }

  const handleTestConnection = async () => {
    if (!selectedTemplateData) return
    setIsTesting(true)
    setTestResult(null)

    try {
      const headersObj: Record<string, string> = {}
      headers.forEach(({ key, value }) => {
        if (key.trim()) headersObj[key.trim()] = value
      })

      const command = isCustomTemplate && customCommand ? customCommand : selectedTemplateData.command || undefined
      const args = isCustomTemplate && customArgs ? customArgs.split(' ').filter(Boolean) : selectedTemplateData.args

      const result = await api.testMCPConnection({
        transport: selectedTemplateData.transport as MCPTransportType,
        command,
        args,
        url: isSSETemplate ? url : undefined,
        headers: isSSETemplate ? headersObj : undefined,
        ssl_verify: sslVerify,
        env: credentials,
      })
      setTestResult({ success: result.success, message: result.message })
    } catch (error) {
      setTestResult({ success: false, message: 'Failed to test connection' })
    } finally {
      setIsTesting(false)
    }
  }

  const handleCreate = async () => {
    setIsCreating(true)
    try {
      if (mode === 'json') {
        try {
          const parsed = JSON.parse(jsonConfig)
          await api.createMCPServer({
            name: parsed.name || 'Imported Server',
            description: parsed.description,
            server_type: parsed.server_type || 'custom',
            transport: parsed.transport || 'stdio',
            command: parsed.command,
            args: parsed.args || [],
            url: parsed.url,
            headers: parsed.headers || {},
            ssl_verify: parsed.ssl_verify !== false,
            use_cache: parsed.use_cache || false,
            env: parsed.env || {},
            credentials: parsed.credentials || {},
            project_id: projectId,
          })
        } catch (parseError) {
          setJsonError('Invalid JSON format')
          setIsCreating(false)
          return
        }
      } else if (selectedTemplate) {
        const headersObj: Record<string, string> = {}
        headers.forEach(({ key, value }) => {
          if (key.trim()) headersObj[key.trim()] = value
        })

        const customCommandValue = isCustomTemplate && customCommand ? customCommand : undefined
        const customArgsValue = isCustomTemplate && customArgs ? customArgs.split(' ').filter(Boolean) : undefined

        await api.createMCPServerFromTemplate({
          template_name: selectedTemplate,
          name: name || undefined,
          credentials: Object.keys(credentials).length > 0 ? credentials : undefined,
          url: isSSETemplate ? url : undefined,
          headers: isSSETemplate && Object.keys(headersObj).length > 0 ? headersObj : undefined,
          ssl_verify: sslVerify,
          use_cache: useCache,
          command: customCommandValue,
          args: customArgsValue,
          project_id: projectId,
        })
      }
      onSuccess()
    } catch (error) {
      console.error('Failed to create MCP server:', error)
      alert('Failed to create MCP server. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const addHeader = () => setHeaders([...headers, { key: '', value: '' }])
  const removeHeader = (index: number) => setHeaders(headers.filter((_, i) => i !== index))
  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers]
    newHeaders[index][field] = value
    setHeaders(newHeaders)
  }

  return (
    <div className="p-6">
      {/* Existing Servers List (if any) */}
      {servers.length > 0 && !selectedTemplate && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Connected Servers ({servers.length})</h3>
            <div className="relative w-64">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search servers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>
          <div className="space-y-2 max-h-48 overflow-auto">
            {filteredServers.map((server, index) => (
              <MCPServerCard
                key={server.id}
                server={server}
                colorIndex={index}
                onToggle={onToggleServer}
                onDelete={onDeleteServer}
                getHealthIcon={getHealthIcon}
                isToggling={isToggling}
              />
            ))}
            {filteredServers.length === 0 && searchQuery && (
              <div className="text-center py-4 text-sm text-gray-500">
                No servers found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add New Server Section */}
      {!selectedTemplate && (
        <>
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            {servers.length > 0 ? 'Add Another Server' : 'Add a Server'}
          </h3>

          {/* Mode Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setMode('templates')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                mode === 'templates'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Templates
            </button>
            <button
              onClick={() => setMode('json')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                mode === 'json'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              JSON Import
            </button>
          </div>
        </>
      )}

      {/* JSON Mode */}
      {mode === 'json' && !selectedTemplate && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paste MCP Server Configuration
            </label>
            <textarea
              value={jsonConfig}
              onChange={(e) => {
                setJsonConfig(e.target.value)
                setJsonError(null)
              }}
              placeholder={`{
  "name": "My MCP Server",
  "transport": "stdio",
  "command": "npx",
  "args": ["-y", "@example/mcp-server"]
}`}
              rows={10}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
            {jsonError && <p className="text-xs text-red-500 mt-1">{jsonError}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleCreate}
              disabled={isCreating || !jsonConfig.trim()}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm disabled:opacity-50"
            >
              {isCreating ? 'Adding...' : 'Add Server'}
            </button>
          </div>
        </div>
      )}

      {/* Templates Mode */}
      {mode === 'templates' && !selectedTemplate && (
        <div className="grid grid-cols-2 gap-3">
          {templates.map((template) => (
            <button
              key={template.name}
              onClick={() => handleSelectTemplate(template.name)}
              className="p-4 border border-gray-200 rounded-lg text-left hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              <div className="flex items-center gap-2 mb-1">
                {template.transport === 'sse' || template.transport === 'http' ? (
                  <Globe className="w-5 h-5 text-blue-600" />
                ) : (
                  <Terminal className="w-5 h-5 text-gray-600" />
                )}
                <span className="font-medium text-gray-900">{template.display_name}</span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2">{template.description}</p>
            </button>
          ))}
        </div>
      )}

      {/* Template Configuration */}
      {selectedTemplate && selectedTemplateData && (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedTemplate('')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to templates
          </button>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            {isSSETemplate ? (
              <Globe className="w-5 h-5 text-blue-600" />
            ) : (
              <Terminal className="w-5 h-5 text-gray-600" />
            )}
            <div>
              <p className="font-medium text-gray-900">{selectedTemplateData.display_name}</p>
              <p className="text-sm text-gray-500">{selectedTemplateData.description}</p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Server Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={selectedTemplateData.display_name}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          {/* SSE/HTTP Config */}
          {isSSETemplate && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Server URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://api.example.com/mcp"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">HTTP Headers</label>
                  <button onClick={addHeader} className="text-xs text-purple-600 hover:text-purple-700">
                    + Add Header
                  </button>
                </div>
                {headers.length === 0 && (
                  <p className="text-xs text-gray-400">No headers configured</p>
                )}
                <div className="space-y-2">
                  {headers.map((header, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={header.key}
                        onChange={(e) => updateHeader(index, 'key', e.target.value)}
                        placeholder="Header name"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                      />
                      <input
                        type={header.key.toLowerCase().includes('auth') ? 'password' : 'text'}
                        value={header.value}
                        onChange={(e) => updateHeader(index, 'value', e.target.value)}
                        placeholder="Header value"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                      />
                      <button onClick={() => removeHeader(index)} className="p-2 text-gray-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={sslVerify}
                  onChange={(e) => setSslVerify(e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Verify SSL Certificate</span>
              </label>
            </>
          )}

          {/* STDIO Credentials */}
          {!isSSETemplate && Object.keys(selectedTemplateData.env_schema).length > 0 && (
            <div className="space-y-3">
              {Object.entries(selectedTemplateData.env_schema).map(([key, schema]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {key} {schema.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={schema.secret ? 'password' : 'text'}
                    value={credentials[key] || ''}
                    onChange={(e) => setCredentials({ ...credentials, [key]: e.target.value })}
                    placeholder={schema.description}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Custom STDIO */}
          {isCustomTemplate && !isSSETemplate && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
              <p className="text-sm font-medium text-blue-800">Custom Server Configuration</p>
              <div>
                <label className="block text-xs text-blue-700 mb-1">Command <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={customCommand}
                  onChange={(e) => setCustomCommand(e.target.value)}
                  placeholder="npx, python, uvx, etc."
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-blue-700 mb-1">Arguments</label>
                <input
                  type="text"
                  value={customArgs}
                  onChange={(e) => setCustomArgs(e.target.value)}
                  placeholder="-y @example/mcp-server"
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Use Cache */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={useCache}
              onChange={(e) => setUseCache(e.target.checked)}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span className="text-sm text-gray-700">Enable caching for better performance</span>
          </label>

          {/* Test Connection */}
          <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-gray-600">Test your configuration</span>
            <button
              onClick={handleTestConnection}
              disabled={isTesting || (isSSETemplate && !url)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Test Connection
                </>
              )}
            </button>
          </div>
          {testResult && (
            <div className={`flex items-center gap-2 text-sm ${testResult.success ? 'text-green-600' : 'text-red-600'}`}>
              {testResult.success ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {testResult.message}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button onClick={() => setSelectedTemplate('')} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={isCreating || (isSSETemplate && !url) || (isCustomTemplate && !isSSETemplate && !customCommand)}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm disabled:opacity-50"
            >
              {isCreating ? 'Adding...' : 'Add Server'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
