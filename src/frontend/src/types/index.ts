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
  avatar_url?: string
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

// =============================================================================
// Agent Component Types (Reusable AI Personalities)
// =============================================================================

export interface AgentComponent {
  id: string
  project_id?: string
  name: string
  description?: string
  icon: string
  color: string
  avatar_url?: string
  qa_who: string
  qa_rules: string
  qa_tricks: string
  system_prompt: string
  component_file_path?: string
  component_class_name?: string
  is_published: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AgentComponentCreateFromQA {
  name?: string
  who: string
  rules: string
  tricks?: string
  selected_tools?: string[]
  project_id?: string
  icon?: string
  color?: string
  avatar_url?: string
}

export interface AgentComponentUpdate {
  name?: string
  description?: string
  icon?: string
  color?: string
  avatar_url?: string
  qa_who?: string
  qa_rules?: string
  qa_tricks?: string
  is_active?: boolean
}

export interface AgentComponentListResponse {
  agent_components: AgentComponent[]
  total: number
  page: number
  page_size: number
}

export interface AgentComponentPublishResponse {
  id: string
  name: string
  is_published: boolean
  component_file_path?: string
  needs_restart: boolean
  message: string
}

// =============================================================================
// Workflow Types (Langflow Flows)
// =============================================================================

export interface Workflow {
  id: string
  project_id?: string
  name: string
  description?: string
  langflow_flow_id?: string
  flow_data?: Record<string, unknown>
  agent_component_ids: string[]
  is_active: boolean
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface WorkflowCreate {
  name: string
  description?: string
  project_id?: string
  flow_data?: Record<string, unknown>
}

export interface WorkflowCreateFromAgent {
  agent_component_id: string
  name?: string
  description?: string
  project_id?: string
}

export interface WorkflowCreateFromTemplate {
  template_name: string
  name?: string
  description?: string
  project_id?: string
}

export interface WorkflowUpdate {
  name?: string
  description?: string
  flow_data?: Record<string, unknown>
  is_active?: boolean
  is_public?: boolean
}

export interface WorkflowListResponse {
  workflows: Workflow[]
  total: number
  page: number
  page_size: number
}

export interface WorkflowConversation {
  id: string
  title: string
  created_at: string
  updated_at: string
}

export interface WorkflowConversationsResponse {
  conversations: WorkflowConversation[]
  total: number
}

// =============================================================================
// MCP Server Types (External Tool Integrations)
// =============================================================================

export interface MCPServer {
  id: string
  project_id?: string
  name: string
  description?: string
  server_type: string
  command: string
  args: string[]
  env: Record<string, string>
  is_enabled: boolean
  needs_sync: boolean
  last_health_check?: string
  health_status: string
  created_at: string
  updated_at: string
}

export interface MCPServerCreate {
  name: string
  description?: string
  server_type: string
  command: string
  args?: string[]
  env?: Record<string, string>
  credentials?: Record<string, string>
  project_id?: string
}

export interface MCPServerCreateFromTemplate {
  template_name: string
  name?: string
  description?: string
  env?: Record<string, string>
  credentials?: Record<string, string>
  project_id?: string
}

export interface MCPServerUpdate {
  name?: string
  description?: string
  command?: string
  args?: string[]
  env?: Record<string, string>
  credentials?: Record<string, string>
  is_enabled?: boolean
}

export interface MCPServerListResponse {
  mcp_servers: MCPServer[]
  total: number
  page: number
  page_size: number
}

export interface MCPServerHealthResponse {
  id: string
  name: string
  health_status: string
  last_health_check?: string
  message?: string
}

export interface MCPServerSyncResponse {
  synced_count: number
  needs_restart: boolean
  message: string
}

export interface MCPServerTemplate {
  name: string
  display_name: string
  description: string
  command: string
  args: string[]
  server_type: string
  env_schema: Record<string, { type: string; description: string; required?: boolean }>
}

export interface MCPServerTemplatesResponse {
  templates: MCPServerTemplate[]
}

export interface PendingChange {
  type: 'mcp' | 'component'
  id: string
  name: string
  action: string
  timestamp: string
}

export interface RestartStatusResponse {
  pending_changes: PendingChange[]
  is_restarting: boolean
  last_restart?: string
  langflow_healthy: boolean
}

// =============================================================================
// Project Tab Types
// =============================================================================

export type ProjectTab = 'agents' | 'workflows' | 'mcp-servers'

export interface ProjectTabCounts {
  agents: number
  workflows: number
  mcp_servers: number
}

// =============================================================================
// Dog Avatar Types
// =============================================================================

export interface DogAvatarRequest {
  job: string
  size?: string
  background?: string
  regenerate?: boolean
}

export interface DogAvatarResponse {
  job: string
  size: string
  background: string
  image_url: string
  cached: boolean
  prompt_version: string
  model: string
  needs_review: boolean
}

export interface AvailableJobsResponse {
  jobs: string[]
  count: number
}
