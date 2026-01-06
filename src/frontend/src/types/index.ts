// Project types
export interface Project {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  is_default: boolean
  is_archived: boolean
  sort_order: number
  agent_count?: number
  created_at: string
  updated_at: string
}

export interface ProjectCreate {
  name: string
  description?: string
  icon?: string
  color?: string
}

export interface ProjectUpdate {
  name?: string
  description?: string
  icon?: string
  color?: string
  sort_order?: number
}

export interface ProjectListResponse {
  projects: Project[]
  total: number
}

export interface ProjectWithAgents {
  project: Project
  agents: Agent[]
  agent_count: number
}

// Agent types
export interface Agent {
  id: string
  project_id?: string
  name: string
  description?: string
  qa_who: string
  qa_rules: string
  qa_tricks: string
  system_prompt: string
  langflow_flow_id: string
  template_name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AgentCreateFromQA {
  name?: string
  who: string
  rules: string
  tricks?: string
  selected_tools?: string[]
  project_id?: string
}

export interface AgentUpdate {
  name?: string
  description?: string
  qa_who?: string
  qa_rules?: string
  qa_tricks?: string
  is_active?: boolean
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

export interface AgentStats {
  total_messages: number
  total_sessions: number
  messages_today: number
  messages_this_week: number
  average_messages_per_session: number
  error?: string
}

export interface MessageRecord {
  id?: string
  session_id?: string
  sender?: string
  sender_name?: string
  text?: string
  timestamp?: string
}

export interface MessagesResponse {
  messages: MessageRecord[]
  total: number
  limit: number
  offset: number
}

// Settings types
export interface ApiKeyInfo {
  provider: string
  is_set: boolean
  last_updated?: string
}

export interface UserSettings {
  default_llm_provider?: string
  theme: 'light' | 'dark'
  sidebar_collapsed: boolean
  onboarding_completed: boolean
  tours_completed: Record<string, boolean>
  api_keys: ApiKeyInfo[]
}

export interface UserSettingsUpdate {
  default_llm_provider?: string
  theme?: 'light' | 'dark'
  sidebar_collapsed?: boolean
  onboarding_completed?: boolean
}

export interface ApiKeyCreate {
  provider: string
  api_key: string
}

export interface TourStatus {
  tour_id: string
  completed: boolean
}
