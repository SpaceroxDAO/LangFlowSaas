/**
 * Centralized selectors for E2E tests.
 * Uses data-testid attributes and reliable selectors for test stability.
 */

export const selectors = {
  // ========================================
  // Create Agent Page
  // ========================================
  create: {
    // Step 1: Identity
    nameInput: '[data-tour="agent-name"]',
    jobTextarea: '[data-tour="agent-job"]',

    // Step 2: Coaching
    rulesTextarea: '[data-tour="agent-rules"]',

    // Step 3: Actions (was Tools)
    toolsGrid: '[data-tour="agent-actions"]',
    actionsGrid: '[data-tour="agent-actions"]',
    toolCard: (toolId: string) => `[data-tour="agent-actions"] button:has-text("${toolId}")`,

    // Navigation
    nextButton: 'button:has-text("Next Step")',
    backButton: 'button:has-text("Back")',
    submitButton: 'button:has-text("Finish & Create Agent")',
    helpButton: 'button:has-text("Help")',

    // Step indicators
    stepIndicator: (step: number) => `text=Step ${step} of 3`,
  },

  // ========================================
  // Playground Page
  // ========================================
  playground: {
    // Header actions
    unlockFlowButton: 'a:has-text("Unlock Flow")',
    editAgentLink: 'a:has-text("Edit")',
    shareButton: 'button:has-text("Share")',
    clearChatButton: 'button:has-text("Clear chat")',
    backButton: 'a[href="/dashboard"]',

    // Chat interface
    chatInput: 'textarea[placeholder*="Type a message"]',
    sendButton: 'button.bg-violet-500:has(svg)',

    // Messages
    userMessage: '.bg-violet-500.rounded-2xl', // User messages are violet
    assistantMessage: '.bg-white.border.rounded-2xl', // Assistant messages are white with border
    loadingIndicator: '.animate-bounce', // Bouncing dots indicator
    emptyState: 'text=Start a conversation',

    // Sidebar
    sidebar: '.border-r.bg-gray-50',
    sidebarToggle: 'button:has(svg path[d="M4 6h16M4 12h16M4 18h16"])',
    newChatButton: 'button:has-text("New Chat")',
    conversationList: '.overflow-y-auto.p-2',
    conversationItem: '.w-full.text-left.px-3.py-2\\.5.rounded-lg',
    activeConversation: '.bg-violet-100.text-violet-900',
    noConversationsMessage: 'text=No conversations yet',

    // Message actions (appear on hover)
    messageTimestamp: '.text-xs.text-gray-400',
    copyButton: 'button[title="Copy message"]',
    regenerateButton: 'button[title="Regenerate response"]',
    copiedIcon: 'svg.text-green-500',

    // Message states
    sendingStatus: 'text=Sending...',
    errorStatus: 'text=Failed to send',

    // Header elements
    entityName: 'h1.text-base.font-semibold',
    headerSubtitle: 'text=Chat Playground',
    headerAvatar: '.w-9.h-9.rounded-full',
  },

  // ========================================
  // Canvas Viewer Page
  // ========================================
  canvas: {
    // Header
    header: 'h1:has-text("Brain")',
    backToChat: 'a:has-text("Back to Chat")',
    editAgent: 'a:has-text("Edit Agent")',
    openFullEditor: 'a:has-text("Open Full Editor")',

    // Level selector
    levelButton: (level: number) => `button:has-text("${level}")`,
    levelHeader: 'h3',

    // Educational overlay
    educationalTip: 'p:has-text("Tip:")',

    // Tour
    tourDialog: '.driver-popover',
    tourCloseButton: 'button:has-text("Close")',

    // iframe
    langflowIframe: 'iframe',
  },

  // ========================================
  // Dashboard Page
  // ========================================
  dashboard: {
    createAgentButton: 'a[href="/create"]',
    agentCard: '.rounded-xl',
    agentCardByName: (name: string) => `.rounded-xl:has-text("${name}")`,
    chatButton: 'a:has-text("Chat")',
    menuButton: 'button[aria-label="More options"], button:has(svg.lucide-more-vertical)',
    editMenuItem: 'text=Edit',
    deleteMenuItem: 'text=Delete',
    shareMenuItem: 'text=Share',
    emptyState: 'text=No agents yet',
  },

  // ========================================
  // Edit Agent Page
  // ========================================
  edit: {
    nameInput: 'input[placeholder*="name"], input:near(:text("Name"))',
    personaTextarea: 'textarea:near(:text("Persona"))',
    instructionsTextarea: 'textarea:near(:text("Instructions"))',
    toolsGrid: '[data-tour="agent-actions"]',
    actionsGrid: '[data-tour="agent-actions"]',
    saveButton: 'button:has-text("Save")',
    backToChat: 'a:has-text("Back to Chat")',
  },

  // ========================================
  // Common / Shared
  // ========================================
  common: {
    loadingSpinner: '.animate-spin',
    errorMessage: '.text-red-600, .bg-red-50',
    successMessage: '.text-green-600, .bg-green-50',
    modal: '[role="dialog"]',
    modalClose: 'button:has-text("Close")',
    toast: '[role="alert"]',
  },

  // ========================================
  // Tool Cards
  // ========================================
  tools: {
    calculator: 'button:has-text("Calculator")',
    webSearch: 'button:has-text("Web Search")',
    urlReader: 'button:has-text("URL Reader")',
    googleMaps: 'button:has-text("Google Maps")',
    weather: 'button:has-text("Get Weather")',
    knowledgeSearch: 'button:has-text("Knowledge Search")',
    // Selected state has orange border
    selectedCard: '.border-orange-500',
  },

  // ========================================
  // Knowledge Sources Modal
  // ========================================
  knowledgeModal: {
    modal: '[role="dialog"], .fixed.inset-0',
    closeButton: 'button:has-text("Cancel"), button:has-text("Close")',
    browseTab: 'button:has-text("Browse")',
    uploadTab: 'button:has-text("Upload")',
    urlTab: 'button:has-text("URL")',
    textTab: 'button:has-text("Text"), button:has-text("Paste")',
    saveButton: 'button:has-text("Done"), button:has-text("Save")',
    sourceItem: '.knowledge-source-item',
    emptyState: 'text=No knowledge sources',
  },
}

/**
 * Helper to build a URL path with the base.
 */
export function buildUrl(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

/**
 * Tool IDs matching backend template mapping.
 */
export const TOOL_IDS = {
  calculator: 'calculator',
  webSearch: 'web_search',
  urlReader: 'url_reader',
  googleMaps: 'google_maps',
  weather: 'weather',
  knowledgeSearch: 'knowledge_search',
} as const

export type ToolId = typeof TOOL_IDS[keyof typeof TOOL_IDS]

/**
 * Phase 2 Selectors: Publish, Workflow, Tool Visibility
 */
export const phase2Selectors = {
  // ========================================
  // Publish Feature
  // ========================================
  publish: {
    publishButton: 'button:has-text("Publish")',
    publishUpdatesButton: 'button:has-text("Publish Updates")',
    unpublishButton: 'button:has-text("Unpublish")',
    publishedBadge: 'text=Published',
    publishedStatus: '.text-green-600:has-text("Published")',
    restartRequiredMessage: 'text=Restart required',

    // Publish modal
    publishModal: '[role="dialog"]:has-text("Agent Published")',
    restartNowButton: 'button:has-text("Restart Now")',
    restartLaterButton: 'button:has-text("Restart Later")',
    publishSuccessMessage: 'text=Agent Published Successfully',
  },

  // ========================================
  // Create New Workflow
  // ========================================
  workflow: {
    createNewWorkflowButton: 'button:has-text("Create New Workflow"), a:has-text("Create New Workflow")',
    createNewWorkflowLink: 'a:has-text("Create New Workflow")',

    // Canvas page
    canvasIframe: 'iframe',
    canvasHeader: 'h1:has-text("Brain")',
    backToPlayground: 'a:has-text("Playground"), a:has-text("Back to Chat")',
    openInLangflow: 'a:has-text("Open Full Editor")',

    // Workflow nodes (in canvas)
    agentNode: '[data-testid="agent-node"]',
    toolNode: '[data-testid="tool-node"]',
    ragNode: '[data-testid="rag-node"], [data-testid="retriever-node"]',
  },

  // ========================================
  // Tool Call Visibility / Agent Thinking
  // ========================================
  toolCalls: {
    // Tool call panel in chat messages
    toolCallSection: '.tool-call, [data-testid="tool-call"]',
    toolCallExpander: 'button:has-text("Show tool calls"), button:has-text("View details")',

    // Individual tool call display
    toolCallName: '.tool-call-name, [data-testid="tool-name"]',
    toolCallInput: '.tool-call-input, [data-testid="tool-input"]',
    toolCallResult: '.tool-call-result, [data-testid="tool-result"]',
    toolCallError: '.tool-call-error, [data-testid="tool-error"]',
    toolCallTiming: '.tool-call-timing, [data-testid="tool-timing"]',

    // Specific tool indicators
    calculatorTool: 'text=Calculator',
    webSearchTool: 'text=Web Search',
    weatherTool: 'text=Weather',
    knowledgeSearchTool: 'text=Knowledge Search',

    // Thinking indicator
    thinkingIndicator: '.animate-pulse, text=Thinking',
    toolExecutingIndicator: 'text=Executing',
  },

  // ========================================
  // Advanced Settings
  // ========================================
  advancedSettings: {
    advancedSettingsButton: 'button:has-text("Advanced Settings")',
    settingsPanel: '[data-testid="advanced-settings"]',
    temperatureSlider: 'input[type="range"]:near(:text("Temperature"))',
    maxTokensInput: 'input:near(:text("Max Tokens"))',
    modelSelector: 'select:near(:text("Model"))',
  },

  // ========================================
  // Save Draft
  // ========================================
  saveDraft: {
    saveDraftButton: 'button:has-text("Save Draft")',
    draftSavedMessage: 'text=Draft saved',
    unsavedChangesIndicator: 'text=Unsaved changes',
  },

  // ========================================
  // Tool Combination Test Helpers
  // ========================================
  toolTestQueries: {
    calculatorOnly: 'What is 156 * 87?',
    webSearchOnly: 'What is the latest news about artificial intelligence?',
    weatherOnly: 'What is the weather in Tokyo?',
    knowledgeOnly: 'What is the vacation policy?',
    calculatorPlusKnowledge: 'If vacation is 15 days and I use 3, how many left?',
    allTools: 'Based on the dress code in the handbook, what should I wear if it is 72°F outside and I need to calculate 15% tip on my lunch?',
  },
}

/**
 * Tool combination configurations for matrix testing
 */
export const TOOL_COMBINATIONS = {
  // No tools
  none: [],

  // Single tools
  calculatorOnly: ['calculator'],
  webSearchOnly: ['web_search'],
  weatherOnly: ['weather'],
  knowledgeOnly: ['knowledge_search'],

  // Two tool combos
  calcPlusWeb: ['calculator', 'web_search'],
  calcPlusWeather: ['calculator', 'weather'],
  calcPlusKnowledge: ['calculator', 'knowledge_search'],
  webPlusWeather: ['web_search', 'weather'],
  webPlusKnowledge: ['web_search', 'knowledge_search'],
  weatherPlusKnowledge: ['weather', 'knowledge_search'],

  // Three tool combos
  calcWebWeather: ['calculator', 'web_search', 'weather'],
  calcWebKnowledge: ['calculator', 'web_search', 'knowledge_search'],
  calcWeatherKnowledge: ['calculator', 'weather', 'knowledge_search'],
  webWeatherKnowledge: ['web_search', 'weather', 'knowledge_search'],

  // All tools
  allTools: ['calculator', 'web_search', 'weather', 'knowledge_search'],
} as const

export type ToolCombination = keyof typeof TOOL_COMBINATIONS
