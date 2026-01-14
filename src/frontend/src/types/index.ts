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
  workflow_count?: number
  mcp_server_count?: number
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

export interface ChatAttachment {
  langflow_file_id: string
  name: string
  type: 'text' | 'image' | 'audio'
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  status?: 'sending' | 'sent' | 'error'
  // Extended fields for streaming and editing
  isEdited?: boolean
  editedAt?: string
  feedback?: 'positive' | 'negative' | null
  // File attachments
  attachments?: ChatAttachment[]
}

export interface ChatRequest {
  message: string
  conversation_id?: string
  attachments?: ChatAttachment[]
}

// =============================================================================
// Streaming Types (SSE Events for Real-time Chat)
// =============================================================================

export type StreamEventType =
  | 'text_delta'
  | 'text_complete'
  | 'thinking_start'
  | 'thinking_delta'
  | 'thinking_end'
  | 'tool_call_start'
  | 'tool_call_args'
  | 'tool_call_end'
  | 'content_block_start'
  | 'content_block_delta'
  | 'content_block_end'
  | 'session_start'
  | 'error'
  | 'done'

export type ToolCallStatus = 'pending' | 'running' | 'completed' | 'failed'

export type ContentBlockType = 'code' | 'table' | 'image' | 'file' | 'json' | 'markdown'

export interface StreamEvent {
  event: StreamEventType
  data: Record<string, unknown>
  index?: number
  timestamp?: string
}

export interface ToolCall {
  id: string
  name: string
  input?: Record<string, unknown>
  output?: string
  status: ToolCallStatus
  error?: string
  startedAt?: Date
  completedAt?: Date
}

export interface ThinkingBlock {
  content: string
  isComplete: boolean
}

export interface ContentBlock {
  id: string
  type: ContentBlockType
  content: string
  language?: string
  title?: string
  metadata?: Record<string, unknown>
}

export interface StreamingMessage extends ChatMessage {
  isStreaming: boolean
  toolCalls?: ToolCall[]
  thinking?: ThinkingBlock
  contentBlocks?: ContentBlock[]
}

export interface SessionStartData {
  session_id: string
  conversation_id?: string
  message_id?: string
}

export interface StreamDoneData {
  conversation_id?: string
  message_id?: string
}

export interface StreamErrorData {
  code: string
  message: string
  details?: Record<string, unknown>
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

export interface AgentComponentAdvancedConfig {
  model_provider: string
  model_name: string
  temperature: number
  max_tokens: number
  max_iterations: number
  verbose: boolean
  handle_parsing_errors: boolean
  chat_history_enabled: boolean
}

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
  selected_tools?: string[]
  knowledge_source_ids?: string[]
  system_prompt: string
  advanced_config?: AgentComponentAdvancedConfig
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
  knowledge_source_ids?: string[]
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
  selected_tools?: string[]
  knowledge_source_ids?: string[]
  is_active?: boolean
  advanced_config?: Partial<AgentComponentAdvancedConfig>
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
// Template Types (Workflow Templates)
// =============================================================================

export interface TemplateCategory {
  id: string
  name: string
  icon: string
  group: string | null
}

export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  gradient: string
  icon: string
  is_blank?: boolean
  is_builtin?: boolean
  is_langflow_starter?: boolean
  data?: Record<string, unknown>
}

export interface TemplatesResponse {
  categories: TemplateCategory[]
  templates: WorkflowTemplate[]
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
// Langflow Service Types
// =============================================================================

export interface LangflowHealthResponse {
  healthy: boolean
  message: string
}

export interface LangflowRestartResponse {
  success: boolean
  message: string
}

export interface LangflowLogsResponse {
  logs: string
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

// =============================================================================
// User File Types
// =============================================================================

export interface UserFile {
  id: string
  name: string
  size: number
  type: string
  created_at: string
  url: string
  project_id?: string
  description?: string
}

export interface FileListResponse {
  files: UserFile[]
  total: number
  page: number
  page_size: number
}

export interface StorageStatsResponse {
  file_count: number
  total_size: number
  total_size_mb: number
}

export interface AllowedTypesResponse {
  extensions: string[]
  max_size_bytes: number
  max_size_mb: number
}

// =============================================================================
// Knowledge Source Types (RAG)
// =============================================================================

export interface KnowledgeSource {
  id: string
  project_id?: string
  name: string
  source_type: 'file' | 'url' | 'text'
  file_path?: string
  original_filename?: string
  url?: string
  mime_type?: string
  file_size?: number
  status: 'pending' | 'processing' | 'ready' | 'error'
  error_message?: string
  chunk_count: number
  collection_id?: string
  created_at: string
  updated_at: string
}

export interface KnowledgeSourceCreateFromURL {
  url: string
  name?: string
  project_id?: string
}

export interface KnowledgeSourceCreateFromText {
  content: string
  name?: string
  project_id?: string
}

export interface KnowledgeSourceListResponse {
  knowledge_sources: KnowledgeSource[]
  total: number
  page: number
  page_size: number
}

// =============================================================================
// Agent Preset Types (Template Gallery)
// =============================================================================

export interface AgentPreset {
  id: string
  name: string
  description: string | null
  icon: string
  category: string
  who: string
  rules: string | null
  tools: string[] | null
  system_prompt: string | null
  model_provider: string | null
  model_name: string | null
  temperature: string | null
  gradient: string
  tags: string[]
  is_featured: boolean
  created_at: string | null
}

export interface AgentPresetCategory {
  id: string
  name: string
  icon: string
  count?: number
}

export interface AgentPresetsResponse {
  presets: AgentPreset[]
  categories: AgentPresetCategory[]
  total: number
}

export interface FeaturedPresetsResponse {
  presets: Array<{
    id: string
    name: string
    description: string | null
    icon: string
    gradient: string
    category: string
  }>
}
