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
} from '@/types'

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
}

export const api = new ApiClient()
