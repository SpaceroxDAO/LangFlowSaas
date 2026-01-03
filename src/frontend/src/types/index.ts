export interface Agent {
  id: string
  name: string
  description?: string
  qa_who: string
  qa_rules: string
  qa_tricks: string
  system_prompt: string
  langflow_flow_id: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AgentCreateFromQA {
  who: string
  rules: string
  tricks: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  status?: 'sending' | 'sent' | 'error'
}

export interface ChatRequest {
  message: string
  conversation_id?: string
}

export interface ChatResponse {
  message: string
  conversation_id: string
  message_id: string
}

export interface Conversation {
  id: string
  agent_id: string
  title?: string
  created_at: string
  updated_at: string
}
