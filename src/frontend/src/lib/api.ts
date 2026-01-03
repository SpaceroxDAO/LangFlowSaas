import type { Agent, AgentCreateFromQA, ChatRequest, ChatResponse, Conversation } from '@/types'

class ApiClient {
  private baseUrl: string
  private getToken: (() => Promise<string | null>) | null = null

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl
  }

  setTokenGetter(getter: () => Promise<string | null>) {
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

    if (this.getToken) {
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
