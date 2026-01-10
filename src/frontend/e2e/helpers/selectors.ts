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
