import type {
  Agent,
  AgentCreateFromQA,
  AgentUpdate,
  ChatRequest,
  ChatResponse,
  Conversation,
  AgentStats,
  MessagesResponse,
  Project,
  ProjectCreate,
  ProjectUpdate,
  ProjectListResponse,
  ProjectWithAgents,
  UserSettings,
  UserSettingsUpdate,
  ApiKeyInfo,
  ApiKeyCreate,
  TourStatus,
  // New three-tab types
  AgentComponent,
  AgentComponentCreateFromQA,
  AgentComponentUpdate,
  AgentComponentListResponse,
  Workflow,
  WorkflowCreate,
  WorkflowCreateFromAgent,
  WorkflowCreateFromTemplate,
  WorkflowUpdate,
  WorkflowListResponse,
  WorkflowConversationsResponse,
  MCPServer,
  MCPServerCreate,
  MCPServerCreateFromTemplate,
  MCPServerUpdate,
  MCPServerListResponse,
  MCPServerHealthResponse,
  MCPServerSyncResponse,
  MCPServerTemplatesResponse,
  MCPServerTestConnectionRequest,
  MCPServerTestConnectionResponse,
  RestartStatusResponse,
  // Dog avatar types
  DogAvatarResponse,
  AvailableJobsResponse,
  // Langflow types
  LangflowHealthResponse,
  LangflowRestartResponse,
  LangflowLogsResponse,
  // File types
  UserFile,
  FileListResponse,
  StorageStatsResponse,
  AllowedTypesResponse,
  // Knowledge source types
  KnowledgeSource,
  KnowledgeSourceCreateFromURL,
  KnowledgeSourceCreateFromText,
  KnowledgeSourceListResponse,
  // Streaming types
  StreamEvent,
  // Billing types
  Plan,
  Subscription,
  UsageStats,
  CheckoutRequest,
  CheckoutResponse,
  PortalRequest,
  PortalResponse,
  CreditBalance,
  CreditPack,
  PurchaseCreditsRequest,
  PurchaseCreditsResponse,
  AutoTopUpSettings,
  AutoTopUpRequest,
  SpendCapSettings,
  SpendCapRequest,
  ModelCost,
  PricingComparison,
  BillingOverview,
  InvoiceListResponse,
  // Dashboard types
  DashboardStats,
  DashboardTotals,
  // Mission types
  MissionListResponse,
  MissionWithProgress,
  MissionProgressResponse,
  CompleteStepRequest,
  // Canvas integration types
  CanvasStartResponse,
  CanvasEvent,
  CanvasEventResponse,
  // Learning analytics
  LearningProgress,
  // Connection types (Composio OAuth)
  Connection,
  ConnectionInitiateRequest,
  ConnectionInitiateResponse,
  ConnectionCallbackRequest,
  ConnectionListResponse,
  ConnectionStatusResponse,
  ComposioAppsResponse,
  ConnectionToolsRequest,
  ConnectionToolsResponse,
  // Enhanced Chat with Composio Tools
  ToolAvailabilityResponse,
  EnhancedChatRequest,
  EnhancedChatResponse,
} from '@/types'

// Stream event type for SSE
interface StreamEvent {
  event: string
  data: Record<string, unknown>
  index?: number
  timestamp?: string
}

// Check dev mode from environment
const isDevMode = import.meta.env.VITE_DEV_MODE === 'true'

class ApiClient {
  private baseUrl: string
  private getToken: (() => Promise<string | null>) | null = null

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl
  }

  setTokenGetter(getter: () => Promise<string | null>) {
    // Skip token getter in dev mode - backend accepts unauthenticated requests
    if (isDevMode) {
      return
    }
    this.getToken = getter
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    // Only add auth header in production mode
    if (!isDevMode && this.getToken) {
      const token = await this.getToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }))
      throw new Error(error.detail || `HTTP ${response.status}`)
    }

    // Handle 204 No Content (e.g., DELETE responses)
    if (response.status === 204) {
      return undefined as T
    }

    return response.json()
  }

  // Agents
  async createAgentFromQA(data: AgentCreateFromQA): Promise<Agent> {
    return this.request<Agent>('/api/v1/agents/create-from-qa', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async listAgents(projectId?: string): Promise<{ agents: Agent[]; total: number }> {
    const params = projectId ? `?project_id=${projectId}` : ''
    return this.request(`/api/v1/agents${params}`)
  }

  async getAgent(id: string): Promise<Agent> {
    return this.request(`/api/v1/agents/${id}`)
  }

  async deleteAgent(id: string): Promise<void> {
    return this.request(`/api/v1/agents/${id}`, { method: 'DELETE' })
  }

  async updateAgent(id: string, data: AgentUpdate): Promise<Agent> {
    return this.request<Agent>(`/api/v1/agents/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async exportAgent(id: string): Promise<Record<string, unknown>> {
    return this.request(`/api/v1/agents/${id}/export`)
  }

  async duplicateAgent(id: string, newName?: string): Promise<Agent> {
    const params = newName ? `?new_name=${encodeURIComponent(newName)}` : ''
    return this.request<Agent>(`/api/v1/agents/${id}/duplicate${params}`, {
      method: 'POST',
    })
  }

  async importAgent(data: Record<string, unknown>): Promise<Agent> {
    return this.request<Agent>('/api/v1/agents/import', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Chat
  async sendMessage(agentId: string, data: ChatRequest): Promise<ChatResponse> {
    return this.request<ChatResponse>(`/api/v1/agents/${agentId}/chat`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async listConversations(agentId: string): Promise<{ conversations: Conversation[] }> {
    return this.request(`/api/v1/agents/${agentId}/conversations`)
  }

  // Health
  async healthCheck(): Promise<{ status: string; service: string }> {
    return this.request('/health')
  }

  // Analytics
  async getAgentStats(agentId: string): Promise<AgentStats> {
    return this.request(`/api/v1/analytics/agents/${agentId}/stats`)
  }

  async getAgentMessages(
    agentId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<MessagesResponse> {
    return this.request(`/api/v1/analytics/agents/${agentId}/messages?limit=${limit}&offset=${offset}`)
  }

  async getLearningProgress(): Promise<LearningProgress> {
    return this.request('/api/v1/analytics/learning-progress')
  }

  // Projects
  async listProjects(includeArchived: boolean = false): Promise<ProjectListResponse> {
    const params = includeArchived ? '?include_archived=true' : ''
    return this.request(`/api/v1/projects${params}`)
  }

  async getProject(id: string): Promise<Project> {
    return this.request(`/api/v1/projects/${id}`)
  }

  async getProjectWithAgents(id: string, activeOnly: boolean = true): Promise<ProjectWithAgents> {
    const params = activeOnly ? '' : '?active_only=false'
    return this.request(`/api/v1/projects/${id}/agents${params}`)
  }

  async createProject(data: ProjectCreate): Promise<Project> {
    return this.request<Project>('/api/v1/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateProject(id: string, data: ProjectUpdate): Promise<Project> {
    return this.request<Project>(`/api/v1/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async archiveProject(id: string): Promise<void> {
    return this.request(`/api/v1/projects/${id}`, { method: 'DELETE' })
  }

  async moveAgentToProject(projectId: string, agentId: string): Promise<Agent> {
    return this.request<Agent>(`/api/v1/projects/${projectId}/agents/${agentId}/move`, {
      method: 'POST',
    })
  }

  async duplicateProject(id: string, newName?: string): Promise<Project> {
    const params = newName ? `?new_name=${encodeURIComponent(newName)}` : ''
    return this.request<Project>(`/api/v1/projects/${id}/duplicate${params}`, {
      method: 'POST',
    })
  }

  // Settings
  async getSettings(): Promise<UserSettings> {
    return this.request('/api/v1/settings')
  }

  async updateSettings(data: UserSettingsUpdate): Promise<UserSettings> {
    return this.request<UserSettings>('/api/v1/settings', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async listApiKeys(): Promise<ApiKeyInfo[]> {
    return this.request('/api/v1/settings/api-keys')
  }

  async setApiKey(data: ApiKeyCreate): Promise<ApiKeyInfo> {
    return this.request<ApiKeyInfo>('/api/v1/settings/api-keys', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async deleteApiKey(provider: string): Promise<void> {
    return this.request(`/api/v1/settings/api-keys/${provider}`, { method: 'DELETE' })
  }

  async completeTour(tourId: string): Promise<UserSettings> {
    return this.request<UserSettings>(`/api/v1/settings/tours/${tourId}/complete`, {
      method: 'POST',
    })
  }

  async checkTourCompleted(tourId: string): Promise<TourStatus> {
    return this.request(`/api/v1/settings/tours/${tourId}/completed`)
  }

  async completeOnboarding(): Promise<UserSettings> {
    return this.request<UserSettings>('/api/v1/settings/onboarding/complete', {
      method: 'POST',
    })
  }

  // ===========================================================================
  // Agent Components (Reusable AI Personalities)
  // ===========================================================================

  async createAgentComponentFromQA(data: AgentComponentCreateFromQA): Promise<AgentComponent> {
    return this.request<AgentComponent>('/api/v1/agent-components/create-from-qa', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async listAgentComponents(
    projectId?: string,
    page: number = 1,
    pageSize: number = 20,
    activeOnly: boolean = true,
    publishedOnly: boolean = false
  ): Promise<AgentComponentListResponse> {
    const params = new URLSearchParams()
    if (projectId) params.append('project_id', projectId)
    params.append('page', page.toString())
    params.append('page_size', pageSize.toString())
    params.append('active_only', activeOnly.toString())
    params.append('published_only', publishedOnly.toString())
    return this.request(`/api/v1/agent-components?${params}`)
  }

  async getAgentComponent(id: string): Promise<AgentComponent> {
    return this.request(`/api/v1/agent-components/${id}`)
  }

  async updateAgentComponent(id: string, data: AgentComponentUpdate): Promise<AgentComponent> {
    return this.request<AgentComponent>(`/api/v1/agent-components/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteAgentComponent(id: string): Promise<void> {
    return this.request(`/api/v1/agent-components/${id}`, { method: 'DELETE' })
  }

  async duplicateAgentComponent(id: string, newName?: string): Promise<AgentComponent> {
    const params = newName ? `?new_name=${encodeURIComponent(newName)}` : ''
    return this.request<AgentComponent>(`/api/v1/agent-components/${id}/duplicate${params}`, {
      method: 'POST',
    })
  }

  async exportAgentComponent(id: string): Promise<Record<string, unknown>> {
    return this.request(`/api/v1/agent-components/${id}/export`)
  }

  async importAgentComponent(data: Record<string, unknown>, projectId?: string): Promise<AgentComponent> {
    const params = projectId ? `?project_id=${projectId}` : ''
    return this.request<AgentComponent>(`/api/v1/agent-components/import${params}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async generateAvatar(description: string): Promise<{ avatar_url: string; message: string }> {
    return this.request<{ avatar_url: string; message: string }>('/api/v1/agent-components/generate-avatar', {
      method: 'POST',
      body: JSON.stringify({ description }),
    })
  }

  async generateAndSaveAvatar(componentId: string): Promise<AgentComponent> {
    return this.request<AgentComponent>(`/api/v1/agent-components/${componentId}/generate-avatar`, {
      method: 'POST',
    })
  }

  async publishAgent(id: string): Promise<AgentComponent> {
    return this.request<AgentComponent>(`/api/v1/agent-components/${id}/publish`, {
      method: 'POST',
    })
  }

  async unpublishAgent(id: string): Promise<AgentComponent> {
    return this.request<AgentComponent>(`/api/v1/agent-components/${id}/unpublish`, {
      method: 'POST',
    })
  }

  // ===========================================================================
  // Dog Avatars (GPT Image Edit)
  // ===========================================================================

  async generateDogAvatar(
    job: string,
    options?: {
      size?: string
      background?: string
      regenerate?: boolean
      description?: string
    }
  ): Promise<DogAvatarResponse> {
    return this.request<DogAvatarResponse>('/api/v1/avatars/dog', {
      method: 'POST',
      body: JSON.stringify({
        job,
        size: options?.size || '1024x1024',
        background: options?.background || 'transparent',
        regenerate: options?.regenerate || false,
        description: options?.description || null,
      }),
    })
  }

  async getAvailableAvatarJobs(): Promise<AvailableJobsResponse> {
    return this.request<AvailableJobsResponse>('/api/v1/avatars/dog/jobs')
  }

  // ===========================================================================
  // Workflows (Langflow Flows)
  // ===========================================================================

  async getWorkflowTemplates(): Promise<TemplatesResponse> {
    return this.request<TemplatesResponse>('/api/v1/workflows/templates')
  }

  async createWorkflowFromLangflowData(data: {
    name: string
    flow_data: Record<string, unknown>
    project_id?: string
    description?: string
  }): Promise<Workflow> {
    return this.request<Workflow>('/api/v1/workflows', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async createWorkflow(data: WorkflowCreate): Promise<Workflow> {
    return this.request<Workflow>('/api/v1/workflows', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async createWorkflowFromAgent(data: WorkflowCreateFromAgent): Promise<Workflow> {
    return this.request<Workflow>('/api/v1/workflows/from-agent', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async createWorkflowFromTemplate(data: WorkflowCreateFromTemplate): Promise<Workflow> {
    return this.request<Workflow>('/api/v1/workflows/from-template', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async listWorkflows(
    projectId?: string,
    page: number = 1,
    pageSize: number = 20,
    activeOnly: boolean = true
  ): Promise<WorkflowListResponse> {
    const params = new URLSearchParams()
    if (projectId) params.append('project_id', projectId)
    params.append('page', page.toString())
    params.append('page_size', pageSize.toString())
    params.append('active_only', activeOnly.toString())
    return this.request(`/api/v1/workflows?${params}`)
  }

  async getWorkflow(id: string): Promise<Workflow> {
    return this.request(`/api/v1/workflows/${id}`)
  }

  async updateWorkflow(id: string, data: WorkflowUpdate): Promise<Workflow> {
    return this.request<Workflow>(`/api/v1/workflows/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteWorkflow(id: string): Promise<void> {
    return this.request(`/api/v1/workflows/${id}`, { method: 'DELETE' })
  }

  async duplicateWorkflow(id: string, newName?: string): Promise<Workflow> {
    const params = newName ? `?new_name=${encodeURIComponent(newName)}` : ''
    return this.request<Workflow>(`/api/v1/workflows/${id}/duplicate${params}`, {
      method: 'POST',
    })
  }

  async exportWorkflow(id: string): Promise<Record<string, unknown>> {
    return this.request(`/api/v1/workflows/${id}/export`)
  }

  async toggleWorkflowSkill(id: string, isAgentSkill: boolean): Promise<Workflow> {
    return this.request<Workflow>(`/api/v1/workflows/${id}/agent-skill`, {
      method: 'PATCH',
      body: JSON.stringify({ is_agent_skill: isAgentSkill }),
    })
  }

  async chatWithWorkflow(workflowId: string, data: ChatRequest): Promise<ChatResponse> {
    return this.request<ChatResponse>(`/api/v1/workflows/${workflowId}/chat`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Stream chat with a workflow using Server-Sent Events.
   *
   * @param workflowId - The workflow ID
   * @param data - Chat request with message and optional conversation_id
   * @param onEvent - Callback for each stream event
   * @param signal - Optional AbortSignal for cancellation
   */
  async chatWithWorkflowStream(
    workflowId: string,
    data: ChatRequest,
    onEvent: (event: StreamEvent) => void,
    signal?: AbortSignal
  ): Promise<void> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Only add auth header in production mode
    if (!isDevMode && this.getToken) {
      const token = await this.getToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    const response = await fetch(`${this.baseUrl}/api/v1/workflows/${workflowId}/chat/stream`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
      signal,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Stream failed: ${error}`)
    }

    if (!response.body) {
      throw new Error('No response body')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          break
        }

        buffer += decoder.decode(value, { stream: true })

        // Process complete SSE messages from buffer
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // Keep incomplete line in buffer

        for (const line of lines) {
          // Skip empty lines and event type lines
          if (!line.trim() || line.startsWith('event:')) {
            continue
          }

          // Process data lines
          if (line.startsWith('data:')) {
            const dataStr = line.slice(5).trim()
            if (!dataStr) continue

            try {
              const eventData = JSON.parse(dataStr)

              // Convert to StreamEvent format
              const streamEvent: StreamEvent = {
                event: eventData.event,
                data: eventData.data || {},
                index: eventData.index,
                timestamp: eventData.timestamp,
              }

              onEvent(streamEvent)

              // Check for done event
              if (streamEvent.event === 'done') {
                return
              }
            } catch (e) {
              console.warn('Failed to parse SSE data:', dataStr, e)
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }

  async listWorkflowConversations(workflowId: string): Promise<WorkflowConversationsResponse> {
    return this.request(`/api/v1/workflows/${workflowId}/conversations`)
  }

  async getConversationMessages(workflowId: string, conversationId: string): Promise<{
    messages: Array<{
      id: string
      role: 'user' | 'assistant'
      content: string
      timestamp: string
      is_edited?: boolean
      edited_at?: string
      original_content?: string
      feedback?: 'positive' | 'negative' | null
      feedback_at?: string
    }>
    conversation_id: string
    total: number
  }> {
    return this.request(`/api/v1/workflows/${workflowId}/conversations/${conversationId}/messages`)
  }

  /**
   * Update a message (edit content)
   */
  async updateMessage(
    workflowId: string,
    conversationId: string,
    messageId: string,
    content: string
  ): Promise<{
    id: string
    content: string
    is_edited: boolean
    edited_at: string
  }> {
    return this.request(
      `/api/v1/workflows/${workflowId}/conversations/${conversationId}/messages/${messageId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ content }),
      }
    )
  }

  /**
   * Delete a message
   */
  async deleteMessage(
    workflowId: string,
    conversationId: string,
    messageId: string
  ): Promise<{ success: boolean; message: string }> {
    return this.request(
      `/api/v1/workflows/${workflowId}/conversations/${conversationId}/messages/${messageId}`,
      { method: 'DELETE' }
    )
  }

  /**
   * Delete a conversation and all its messages
   */
  async deleteConversation(
    workflowId: string,
    conversationId: string
  ): Promise<{ success: boolean; message: string }> {
    return this.request(
      `/api/v1/workflows/${workflowId}/conversations/${conversationId}`,
      { method: 'DELETE' }
    )
  }

  /**
   * Submit feedback on an assistant message (thumbs up/down)
   */
  async submitMessageFeedback(
    workflowId: string,
    conversationId: string,
    messageId: string,
    feedback: 'positive' | 'negative'
  ): Promise<{
    id: string
    feedback: 'positive' | 'negative' | null
    feedback_at: string | null
  }> {
    return this.request(
      `/api/v1/workflows/${workflowId}/conversations/${conversationId}/messages/${messageId}/feedback`,
      {
        method: 'POST',
        body: JSON.stringify({ feedback }),
      }
    )
  }

  /**
   * Remove feedback from a message
   */
  async removeMessageFeedback(
    workflowId: string,
    conversationId: string,
    messageId: string
  ): Promise<{
    id: string
    feedback: null
    feedback_at: null
  }> {
    return this.request(
      `/api/v1/workflows/${workflowId}/conversations/${conversationId}/messages/${messageId}/feedback`,
      { method: 'DELETE' }
    )
  }

  // ===========================================================================
  // MCP Servers (External Tool Integrations)
  // ===========================================================================

  async getMCPServerTemplates(): Promise<MCPServerTemplatesResponse> {
    return this.request('/api/v1/mcp-servers/templates')
  }

  async testMCPConnection(data: MCPServerTestConnectionRequest): Promise<MCPServerTestConnectionResponse> {
    return this.request<MCPServerTestConnectionResponse>('/api/v1/mcp-servers/test-connection', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async createMCPServer(data: MCPServerCreate): Promise<MCPServer> {
    return this.request<MCPServer>('/api/v1/mcp-servers', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async createMCPServerFromTemplate(data: MCPServerCreateFromTemplate): Promise<MCPServer> {
    return this.request<MCPServer>('/api/v1/mcp-servers/from-template', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async listMCPServers(
    projectId?: string,
    page: number = 1,
    pageSize: number = 20,
    enabledOnly: boolean = false
  ): Promise<MCPServerListResponse> {
    const params = new URLSearchParams()
    if (projectId) params.append('project_id', projectId)
    params.append('page', page.toString())
    params.append('page_size', pageSize.toString())
    params.append('enabled_only', enabledOnly.toString())
    return this.request(`/api/v1/mcp-servers?${params}`)
  }

  async getMCPServer(id: string): Promise<MCPServer> {
    return this.request(`/api/v1/mcp-servers/${id}`)
  }

  async updateMCPServer(id: string, data: MCPServerUpdate): Promise<MCPServer> {
    return this.request<MCPServer>(`/api/v1/mcp-servers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteMCPServer(id: string): Promise<void> {
    return this.request(`/api/v1/mcp-servers/${id}`, { method: 'DELETE' })
  }

  async enableMCPServer(id: string): Promise<MCPServer> {
    return this.request<MCPServer>(`/api/v1/mcp-servers/${id}/enable`, {
      method: 'POST',
    })
  }

  async disableMCPServer(id: string): Promise<MCPServer> {
    return this.request<MCPServer>(`/api/v1/mcp-servers/${id}/disable`, {
      method: 'POST',
    })
  }

  async checkMCPServerHealth(id: string): Promise<MCPServerHealthResponse> {
    return this.request(`/api/v1/mcp-servers/${id}/health`)
  }

  async syncMCPServers(): Promise<MCPServerSyncResponse> {
    return this.request<MCPServerSyncResponse>('/api/v1/mcp-servers/sync', {
      method: 'POST',
    })
  }

  async getRestartStatus(): Promise<RestartStatusResponse> {
    return this.request('/api/v1/mcp-servers/restart-status')
  }

  // ===========================================================================
  // Langflow Service (Unified Status & Restart)
  // ===========================================================================

  async getLangflowStatus(): Promise<RestartStatusResponse> {
    return this.request('/api/v1/langflow/status')
  }

  async checkLangflowHealth(): Promise<LangflowHealthResponse> {
    return this.request('/api/v1/langflow/health')
  }

  async restartLangflow(): Promise<LangflowRestartResponse> {
    return this.request<LangflowRestartResponse>('/api/v1/langflow/restart', {
      method: 'POST',
    })
  }

  async getLangflowLogs(lines: number = 50): Promise<LangflowLogsResponse> {
    return this.request(`/api/v1/langflow/logs?lines=${lines}`)
  }

  // ===========================================================================
  // Files (User File Storage)
  // ===========================================================================

  async listFiles(
    projectId?: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<FileListResponse> {
    const params = new URLSearchParams()
    if (projectId) params.append('project_id', projectId)
    params.append('page', page.toString())
    params.append('page_size', pageSize.toString())
    return this.request(`/api/v1/files?${params}`)
  }

  async uploadFile(file: File, projectId?: string, description?: string): Promise<UserFile> {
    const formData = new FormData()
    formData.append('file', file)
    if (projectId) formData.append('project_id', projectId)
    if (description) formData.append('description', description)

    // Use fetch directly for multipart/form-data (don't set Content-Type header)
    const headers: Record<string, string> = {}

    if (!isDevMode && this.getToken) {
      const token = await this.getToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    const response = await fetch(`${this.baseUrl}/api/v1/files`, {
      method: 'POST',
      headers,
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Upload failed' }))
      throw new Error(error.detail || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async getFile(fileId: string): Promise<UserFile> {
    return this.request(`/api/v1/files/${fileId}`)
  }

  async deleteFile(fileId: string): Promise<void> {
    return this.request(`/api/v1/files/${fileId}`, { method: 'DELETE' })
  }

  async getStorageStats(): Promise<StorageStatsResponse> {
    return this.request('/api/v1/files/stats/storage')
  }

  async getAllowedFileTypes(): Promise<AllowedTypesResponse> {
    return this.request('/api/v1/files/info/allowed-types')
  }

  // ===========================================================================
  // Knowledge Sources (RAG)
  // ===========================================================================

  async listKnowledgeSources(
    projectId?: string,
    page: number = 1,
    pageSize: number = 50
  ): Promise<KnowledgeSourceListResponse> {
    const params = new URLSearchParams()
    if (projectId) params.append('project_id', projectId)
    params.append('page', page.toString())
    params.append('page_size', pageSize.toString())
    return this.request(`/api/v1/knowledge-sources?${params}`)
  }

  async getKnowledgeSource(id: string): Promise<KnowledgeSource> {
    return this.request(`/api/v1/knowledge-sources/${id}`)
  }

  async uploadKnowledgeSource(file: File, projectId?: string): Promise<KnowledgeSource> {
    const formData = new FormData()
    formData.append('file', file)
    if (projectId) formData.append('project_id', projectId)

    // Use fetch directly for multipart/form-data (don't set Content-Type header)
    const headers: Record<string, string> = {}

    if (!isDevMode && this.getToken) {
      const token = await this.getToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    const response = await fetch(`${this.baseUrl}/api/v1/knowledge-sources/upload`, {
      method: 'POST',
      headers,
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Upload failed' }))
      throw new Error(error.detail || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async addKnowledgeSourceFromURL(data: KnowledgeSourceCreateFromURL): Promise<KnowledgeSource> {
    return this.request<KnowledgeSource>('/api/v1/knowledge-sources/url', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async addKnowledgeSourceFromText(data: KnowledgeSourceCreateFromText): Promise<KnowledgeSource> {
    return this.request<KnowledgeSource>('/api/v1/knowledge-sources/text', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async createKnowledgeSourceFromUserFile(data: { file_id: string; project_id?: string }): Promise<KnowledgeSource> {
    return this.request<KnowledgeSource>('/api/v1/knowledge-sources/from-user-file', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async deleteKnowledgeSource(id: string): Promise<void> {
    return this.request(`/api/v1/knowledge-sources/${id}`, { method: 'DELETE' })
  }

  // ===========================================================================
  // Agent Presets (Template Gallery)
  // ===========================================================================

  async listAgentPresets(
    category?: string,
    featuredOnly: boolean = false
  ): Promise<{
    presets: Array<{
      id: string
      name: string
      description: string | null
      icon: string
      category: string
      who: string
      rules: string | null
      tools: string[] | null
      gradient: string
      tags: string[]
      is_featured: boolean
    }>
    categories: Array<{ id: string; name: string; icon: string }>
    total: number
  }> {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    if (featuredOnly) params.append('featured_only', 'true')
    const queryString = params.toString()
    return this.request(`/api/v1/agent-presets${queryString ? `?${queryString}` : ''}`)
  }

  async getAgentPreset(id: string): Promise<{
    id: string
    name: string
    description: string | null
    icon: string
    category: string
    who: string
    rules: string | null
    tools: string[] | null
    gradient: string
    tags: string[]
    is_featured: boolean
  }> {
    return this.request(`/api/v1/agent-presets/${id}`)
  }

  async getFeaturedPresets(): Promise<{
    presets: Array<{
      id: string
      name: string
      description: string | null
      icon: string
      gradient: string
      category: string
    }>
  }> {
    return this.request('/api/v1/agent-presets/featured/list')
  }

  // ===========================================================================
  // Billing (Subscriptions, Credits & Usage)
  // ===========================================================================

  async listPlans(): Promise<Plan[]> {
    return this.request('/api/v1/billing/plans')
  }

  async getSubscription(): Promise<Subscription> {
    return this.request('/api/v1/billing/subscription')
  }

  async getUsage(): Promise<UsageStats> {
    return this.request('/api/v1/billing/usage')
  }

  async createCheckoutSession(data: CheckoutRequest): Promise<CheckoutResponse> {
    return this.request<CheckoutResponse>('/api/v1/billing/checkout', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async createPortalSession(data: PortalRequest): Promise<PortalResponse> {
    return this.request<PortalResponse>('/api/v1/billing/portal', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Credit Balance
  async getCreditBalance(): Promise<CreditBalance> {
    return this.request('/api/v1/billing/credits/balance')
  }

  // Credit Packs
  async listCreditPacks(): Promise<CreditPack[]> {
    return this.request('/api/v1/billing/credits/packs')
  }

  // Purchase Credits
  async purchaseCredits(data: PurchaseCreditsRequest): Promise<PurchaseCreditsResponse> {
    return this.request<PurchaseCreditsResponse>('/api/v1/billing/credits/purchase', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Auto Top-Up Settings
  async getAutoTopUpSettings(): Promise<AutoTopUpSettings> {
    return this.request('/api/v1/billing/credits/auto-top-up')
  }

  async updateAutoTopUpSettings(data: AutoTopUpRequest): Promise<AutoTopUpSettings> {
    return this.request<AutoTopUpSettings>('/api/v1/billing/credits/auto-top-up', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Spend Cap Settings
  async getSpendCapSettings(): Promise<SpendCapSettings> {
    return this.request('/api/v1/billing/credits/spend-cap')
  }

  async updateSpendCapSettings(data: SpendCapRequest): Promise<SpendCapSettings> {
    return this.request<SpendCapSettings>('/api/v1/billing/credits/spend-cap', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Model Costs
  async listModelCosts(): Promise<ModelCost[]> {
    return this.request('/api/v1/billing/credits/models')
  }

  // Pricing Comparison
  async getPricingComparison(): Promise<PricingComparison> {
    return this.request('/api/v1/billing/pricing/comparison')
  }

  // Billing Overview (all-in-one)
  async getBillingOverview(): Promise<BillingOverview> {
    return this.request('/api/v1/billing/overview')
  }

  // Invoice History
  async getInvoices(limit: number = 10): Promise<InvoiceListResponse> {
    return this.request(`/api/v1/billing/invoices?limit=${limit}`)
  }

  // ===========================================================================
  // Dashboard Analytics
  // ===========================================================================

  async getDashboardStats(
    days: number = 30,
    startDate?: string,
    endDate?: string
  ): Promise<DashboardStats> {
    const params = new URLSearchParams()
    // Only include days if no custom date range is provided
    if (startDate && endDate) {
      params.set('start_date', startDate)
      params.set('end_date', endDate)
    } else {
      params.set('days', days.toString())
    }
    return this.request(`/api/v1/dashboard/stats?${params.toString()}`)
  }

  async getDashboardTotals(): Promise<DashboardTotals> {
    return this.request('/api/v1/dashboard/totals')
  }

  // ===========================================================================
  // Missions (Guided Learning)
  // ===========================================================================

  async listMissions(category?: string): Promise<MissionListResponse> {
    const params = category ? `?category=${encodeURIComponent(category)}` : ''
    return this.request(`/api/v1/missions${params}`)
  }

  async getMission(missionId: string): Promise<MissionWithProgress> {
    return this.request(`/api/v1/missions/${missionId}`)
  }

  async startMission(missionId: string): Promise<MissionProgressResponse> {
    return this.request<MissionProgressResponse>(`/api/v1/missions/${missionId}/start`, {
      method: 'POST',
    })
  }

  async completeMissionStep(missionId: string, data: CompleteStepRequest): Promise<MissionProgressResponse> {
    return this.request<MissionProgressResponse>(`/api/v1/missions/${missionId}/complete-step`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async resetMissionProgress(missionId: string): Promise<MissionProgressResponse> {
    return this.request<MissionProgressResponse>(`/api/v1/missions/${missionId}/reset`, {
      method: 'POST',
    })
  }

  async uncompleteMissionStep(missionId: string, data: CompleteStepRequest): Promise<MissionProgressResponse> {
    return this.request<MissionProgressResponse>(`/api/v1/missions/${missionId}/uncomplete-step`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Canvas integration
  async startMissionWithCanvas(missionId: string): Promise<CanvasStartResponse> {
    return this.request<CanvasStartResponse>(`/api/v1/missions/${missionId}/start-canvas`, {
      method: 'POST',
    })
  }

  async sendCanvasEvent(missionId: string, event: CanvasEvent): Promise<CanvasEventResponse> {
    return this.request<CanvasEventResponse>(`/api/v1/missions/${missionId}/canvas-event`, {
      method: 'POST',
      body: JSON.stringify(event),
    })
  }

  // ===========================================================================
  // Connections (Composio OAuth Integrations)
  // ===========================================================================

  async getAvailableApps(): Promise<ComposioAppsResponse> {
    return this.request('/api/v1/connections/apps')
  }

  async initiateConnection(data: ConnectionInitiateRequest): Promise<ConnectionInitiateResponse> {
    return this.request<ConnectionInitiateResponse>('/api/v1/connections/initiate', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async handleConnectionCallback(data: ConnectionCallbackRequest): Promise<Connection> {
    return this.request<Connection>('/api/v1/connections/callback', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async listConnections(
    page: number = 1,
    pageSize: number = 20,
    activeOnly: boolean = false
  ): Promise<ConnectionListResponse> {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('page_size', pageSize.toString())
    params.append('active_only', activeOnly.toString())
    return this.request(`/api/v1/connections?${params}`)
  }

  async getConnection(connectionId: string): Promise<Connection> {
    return this.request(`/api/v1/connections/${connectionId}`)
  }

  async checkConnectionStatus(connectionId: string): Promise<ConnectionStatusResponse> {
    return this.request(`/api/v1/connections/${connectionId}/status`)
  }

  async refreshConnection(connectionId: string): Promise<Connection> {
    return this.request<Connection>(`/api/v1/connections/${connectionId}/refresh`, {
      method: 'POST',
    })
  }

  async revokeConnection(connectionId: string): Promise<void> {
    return this.request(`/api/v1/connections/${connectionId}/revoke`, {
      method: 'POST',
    })
  }

  async deleteConnection(connectionId: string): Promise<void> {
    return this.request(`/api/v1/connections/${connectionId}`, {
      method: 'DELETE',
    })
  }

  async getConnectionTools(data: ConnectionToolsRequest): Promise<ConnectionToolsResponse> {
    return this.request<ConnectionToolsResponse>('/api/v1/connections/tools', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // =============================================================================
  // Enhanced Chat with Composio Tools
  // =============================================================================

  async checkToolAvailability(): Promise<ToolAvailabilityResponse> {
    return this.request<ToolAvailabilityResponse>('/api/v1/connections/tools/availability')
  }

  async enhancedChat(data: EnhancedChatRequest): Promise<EnhancedChatResponse> {
    return this.request<EnhancedChatResponse>('/api/v1/connections/chat', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // ===========================================================================
  // MCP Bridge Token (OpenClaw Connection)
  // ===========================================================================

  async generateMCPToken(): Promise<{ token: string; message: string }> {
    return this.request<{ token: string; message: string }>('/api/v1/settings/mcp-token', {
      method: 'POST',
    })
  }

  async getMCPTokenStatus(): Promise<{ has_token: boolean; token_preview: string | null }> {
    return this.request('/api/v1/settings/mcp-token')
  }

  async revokeMCPToken(): Promise<void> {
    return this.request('/api/v1/settings/mcp-token', { method: 'DELETE' })
  }

  async enhancedChatStream(
    data: EnhancedChatRequest,
    onEvent: (event: StreamEvent) => void,
    signal?: AbortSignal
  ): Promise<void> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
    }

    const token = await this.getToken?.()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${this.baseUrl}/api/v1/connections/chat/stream`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
      signal,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }))
      throw new Error(error.detail || `HTTP ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('No response body')
    }

    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim()
            if (dataStr && dataStr !== '[DONE]') {
              try {
                const event = JSON.parse(dataStr) as StreamEvent
                onEvent(event)
              } catch {
                // Skip malformed events
              }
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }
}

export const api = new ApiClient()
