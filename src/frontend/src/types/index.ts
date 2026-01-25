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
  is_embeddable: boolean
  embed_token?: string
  embed_config?: {
    theme?: string
    primary_color?: string
    welcome_message?: string
    placeholder?: string
    allowed_domains?: string[]
  }
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

export type MCPTransportType = 'stdio' | 'sse' | 'http'

export interface MCPServer {
  id: string
  project_id?: string
  name: string
  description?: string
  server_type: string
  transport: MCPTransportType
  // STDIO transport fields
  command?: string
  args: string[]
  // SSE/HTTP transport fields
  url?: string
  headers: Record<string, string>
  ssl_verify: boolean
  use_cache: boolean
  // Common fields
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
  transport?: MCPTransportType
  // STDIO transport fields
  command?: string
  args?: string[]
  // SSE/HTTP transport fields
  url?: string
  headers?: Record<string, string>
  ssl_verify?: boolean
  use_cache?: boolean
  // Common fields
  env?: Record<string, string>
  credentials?: Record<string, string>
  project_id?: string
}

export interface MCPServerCreateFromTemplate {
  template_name: string
  name?: string
  description?: string
  // SSE/HTTP fields
  url?: string
  headers?: Record<string, string>
  ssl_verify?: boolean
  use_cache?: boolean
  // Custom STDIO fields (for 'custom' template)
  command?: string
  args?: string[]
  // Common fields
  env?: Record<string, string>
  credentials?: Record<string, string>
  project_id?: string
}

export interface MCPServerUpdate {
  name?: string
  description?: string
  transport?: MCPTransportType
  command?: string
  args?: string[]
  url?: string
  headers?: Record<string, string>
  ssl_verify?: boolean
  use_cache?: boolean
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
  transport: MCPTransportType
  command: string
  args: string[]
  server_type: string
  env_schema: Record<string, { type: string; description: string; required?: boolean; secret?: boolean }>
  headers_schema?: Record<string, { type: string; description: string; required?: boolean; secret?: boolean }>
}

export interface MCPServerTemplatesResponse {
  templates: MCPServerTemplate[]
}

export interface MCPServerTestConnectionRequest {
  transport: MCPTransportType
  // STDIO fields
  command?: string
  args?: string[]
  env?: Record<string, string>
  // SSE/HTTP fields
  url?: string
  headers?: Record<string, string>
  ssl_verify?: boolean
}

export interface MCPServerTestConnectionResponse {
  success: boolean
  message: string
  latency_ms?: number
  server_info?: Record<string, unknown>
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

// ===========================================================================
// Billing Types
// ===========================================================================

export type PlanId = 'free' | 'individual' | 'business'

export interface Plan {
  id: PlanId
  name: string
  price_monthly: number
  price_display: string
  price_yearly: number
  yearly_price_display: string
  yearly_savings_display: string
  description: string
  features: string[]
  limits: PlanLimits
  is_custom: boolean
  highlight: boolean
}

export interface PlanLimits {
  agents: number
  workflows: number
  mcp_servers: number
  projects: number
  file_storage_mb: number
  monthly_credits: number
  knowledge_files: number
  team_members: number
}

export interface Subscription {
  plan_id: PlanId
  plan_name: string
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  is_paid: boolean
  stripe_subscription_id: string | null
  stripe_customer_id: string | null
}

// AI Credits Types
export interface CreditBalance {
  balance: number
  monthly_credits: number
  purchased_credits: number
  credits_used_this_month: number
  credits_remaining: number
  reset_date: string | null
  using_byo_key: boolean
}

export interface CreditPack {
  id: string
  name: string
  credits: number
  price_cents: number
  price_display: string
  price_per_credit: number
  popular: boolean
}

export interface CreditUsageItem {
  id: string
  timestamp: string
  model: string
  model_display_name: string
  input_tokens: number
  output_tokens: number
  credits_used: number
  agent_id: string | null
  agent_name: string | null
  workflow_id: string | null
  workflow_name: string | null
}

export interface CreditUsageResponse {
  items: CreditUsageItem[]
  total_credits_used: number
  total_items: number
  page: number
  page_size: number
  has_more: boolean
}

export interface PurchaseCreditsRequest {
  pack_id: string
  success_url: string
  cancel_url: string
}

export interface PurchaseCreditsResponse {
  checkout_url: string
  session_id: string
}

// Auto Top-Up Types
export interface AutoTopUpSettings {
  enabled: boolean
  threshold_credits: number
  top_up_pack_id: string
  top_up_pack_name: string
  top_up_credits: number
  top_up_price_display: string
  max_monthly_top_ups: number
  top_ups_this_month: number
  can_top_up: boolean
}

export interface AutoTopUpRequest {
  enabled: boolean
  threshold_credits: number
  top_up_pack_id: string
  max_monthly_top_ups: number
}

// Spend Cap Types
export interface SpendCapSettings {
  enabled: boolean
  max_monthly_spend_cents: number
  max_monthly_spend_display: string
  current_month_spend_cents: number
  current_month_spend_display: string
  spend_remaining_cents: number
  spend_remaining_display: string
  at_limit: boolean
}

export interface SpendCapRequest {
  enabled: boolean
  max_monthly_spend_cents: number
}

// Model Cost Types
export interface ModelCost {
  model_id: string
  display_name: string
  provider: string
  credits_per_1k_input: number
  credits_per_1k_output: number
  supports_byo_key: boolean
}

// Usage Types (updated)
export interface UsageItem {
  used: number
  limit: number
  percent: number
}

export interface UsageStats {
  agents: UsageItem
  workflows: UsageItem
  credits: UsageItem
}

// Feature Access
export interface FeatureAccess {
  can_buy_credits: boolean
  can_use_auto_top_up: boolean
  canvas_editor: boolean
  export_agents: boolean
  team_collaboration: boolean
  sso: boolean
}

// Billing Overview (combined response)
export interface BillingOverview {
  subscription: Subscription
  plan: Plan
  credits: CreditBalance
  usage: UsageStats
  auto_top_up: AutoTopUpSettings
  spend_cap: SpendCapSettings
  feature_access: FeatureAccess
}

// Pricing Comparison Types
export interface PricingFeature {
  name: string
  free: boolean | string
  individual: boolean | string
  business: boolean | string
}

export interface PricingCategory {
  category: string
  features: PricingFeature[]
}

export interface PricingComparison {
  categories: PricingCategory[]
  plans: Plan[]
}

// Checkout Types
export interface CheckoutRequest {
  plan_id: string
  success_url: string
  cancel_url: string
  billing_cycle?: 'monthly' | 'yearly'
}

export interface CheckoutResponse {
  checkout_url: string
}

export interface PortalRequest {
  return_url: string
}

export interface PortalResponse {
  portal_url: string
}

// Invoice Types
export interface Invoice {
  id: string
  number: string | null
  date: string
  amount_cents: number
  amount_display: string
  status: string
  description: string
  pdf_url: string | null
  hosted_invoice_url: string | null
}

export interface InvoiceListResponse {
  invoices: Invoice[]
  has_more: boolean
}

// ===========================================================================
// Dashboard Analytics Types
// ===========================================================================

export interface DailyMetric {
  date: string
  conversations: number
  messages: number
  tokens: number
}

export interface DashboardTotals {
  agents: number
  agent_components: number
  workflows: number
  conversations: number
  messages_this_month: number
  tokens_this_month: number
}

export interface RecentConversation {
  id: string
  title: string
  agent_id: string | null
  workflow_id: string | null
  updated_at: string | null
}

export interface AgentStat {
  id: string
  name: string
  conversations: number
}

export interface PeriodComparison {
  messages_change: number
  conversations_change: number
  tokens_change: number
  previous_period: {
    start: string
    end: string
    messages: number
    conversations: number
    tokens: number
  }
  current_period: {
    messages: number
    conversations: number
    tokens: number
  }
}

export interface DashboardStats {
  period: {
    start: string
    end: string
    days: number
  }
  totals: DashboardTotals
  daily: DailyMetric[]
  recent_conversations: RecentConversation[]
  agent_stats: AgentStat[]
  comparison?: PeriodComparison
}

// ===========================================================================
// Mission Types (Guided Learning)
// ===========================================================================

export interface StepHighlight {
  element?: string
  selector?: string
  title?: string
  description?: string
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto'
  auto_trigger?: boolean
  allow_click?: boolean
}

export interface MissionStep {
  id: number
  title: string
  description: string
  type: 'action' | 'info' | 'quiz'
  phase?: string
  highlight?: StepHighlight
  hints?: string[]
  show_me_text?: string
  validation?: Record<string, unknown>
}

export interface ComponentPack {
  allowed_components?: string[]
  allowed_categories?: string[]
  validation_rules?: {
    require_chat_input?: boolean
    require_chat_output?: boolean
    max_nodes?: number
  }
}

export interface UIConfig {
  hide_sidebar?: boolean
  hide_minimap?: boolean
  hide_toolbar?: boolean
  custom_actions_only?: boolean
  show_only?: string[]
}

export interface Mission {
  id: string
  name: string
  description: string | null
  category: string
  difficulty: string
  estimated_minutes: number
  icon: string | null
  steps: MissionStep[]
  prerequisites: string[] | null
  outcomes: string[] | null
  // Canvas integration fields
  canvas_mode: boolean
  template_id: string | null
  component_pack: ComponentPack | null
  ui_config: UIConfig | null
}

export interface MissionProgress {
  status: 'not_started' | 'in_progress' | 'completed'
  current_step: number
  completed_steps: number[]
  started_at: string | null
  completed_at: string | null
}

export interface MissionWithProgress {
  mission: Mission
  progress: MissionProgress
}

export interface MissionCategory {
  id: string
  name: string
  description: string
}

export interface MissionStats {
  total_missions: number
  completed: number
  in_progress: number
  not_started: number
  completion_percent: number
}

export interface MissionListResponse {
  missions: MissionWithProgress[]
  categories: MissionCategory[]
  stats: MissionStats
}

export interface MissionProgressResponse {
  mission_id: string
  status: 'not_started' | 'in_progress' | 'completed'
  current_step: number
  completed_steps: number[]
  is_completed: boolean
}

export interface CompleteStepRequest {
  step_id: number
  artifacts?: Record<string, unknown>
}

// Canvas integration types
export interface CanvasStartResponse {
  mission_id: string
  status: 'not_started' | 'in_progress' | 'completed'
  current_step: number
  completed_steps: number[]
  is_completed: boolean
  canvas_url: string | null
  flow_id: string | null
  workflow_id: string | null  // Our workflow ID for navigation
  component_filter: string | null
}

export interface CanvasEvent {
  event_type: 'node_added' | 'node_removed' | 'edge_created' | 'node_configured'
  node_type?: string
  node_id?: string
  flow_state?: Record<string, unknown>
}

export interface CanvasEventResponse {
  event_processed: boolean
  step_completed: boolean
  current_step: number
}

// ===========================================================================
// Connection Types (Composio OAuth Integrations)
// ===========================================================================

export type ConnectionStatus = 'pending' | 'active' | 'expired' | 'revoked' | 'error'

export interface Connection {
  id: string
  app_name: string
  app_display_name: string
  status: ConnectionStatus
  account_identifier: string | null
  scopes: string[] | null
  available_actions: Array<{ name: string; description?: string }> | null
  connected_at: string | null
  last_used_at: string | null
  expires_at: string | null
  last_error: string | null
  created_at: string
  updated_at: string
}

export interface ConnectionInitiateRequest {
  app_name: string
  redirect_url?: string
}

export interface ConnectionInitiateResponse {
  connection_id: string
  composio_connection_id: string
  redirect_url: string
  expires_in: number
}

export interface ConnectionCallbackRequest {
  connection_id?: string           // Our internal connection ID
  composio_connection_id?: string  // Composio's connectedAccountId from callback
  app_name?: string                // App name from callback (for lookup)
}

export interface ConnectionListResponse {
  connections: Connection[]
  total: number
  page: number
  page_size: number
}

export interface ConnectionStatusResponse {
  id: string
  app_name: string
  status: ConnectionStatus
  is_active: boolean
  needs_reconnection: boolean
  last_error: string | null
}

export interface ComposioAppInfo {
  app_name: string
  display_name: string
  description: string
  icon: string
  category: string
  actions: string[]
  is_connected: boolean
  connection_id: string | null
  connection_status: ConnectionStatus | null
}

export interface ComposioAppsResponse {
  apps: ComposioAppInfo[]
  categories: string[]
}

export interface ConnectionToolsRequest {
  app_names: string[]
}

export interface ConnectionToolInfo {
  name: string
  description: string
  app_name: string
  parameters?: Record<string, unknown>
}

export interface ConnectionToolsResponse {
  tools: ConnectionToolInfo[]
  total: number
}

// Tool Availability (for playground indicators)
export interface ToolAvailabilityResponse {
  has_tools: boolean
  tool_count: number
  connected_apps: string[]
  tools: {
    name: string
    description: string
    app_name: string
    parameters?: Record<string, unknown>
  }[]
}

// Enhanced Chat with Composio Tools
export interface EnhancedChatRequest {
  message: string
  conversation_id?: string
  workflow_id?: string
  app_names?: string[]
}

export interface EnhancedChatResponse {
  text: string
  session_id: string
  tools_used: string[]
  metadata: Record<string, unknown>
}
