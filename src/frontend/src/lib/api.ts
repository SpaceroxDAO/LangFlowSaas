import type { Agent, AgentCreateFromQA, AgentUpdate, ChatRequest, ChatResponse, Conversation } from '@/types'

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

  async listAgents(): Promise<{ agents: Agent[]; total: number }> {
    return this.request('/api/v1/agents')
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
}

export const api = new ApiClient()
