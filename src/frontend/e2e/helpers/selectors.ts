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

    // Step 3: Tools
    toolsGrid: '[data-tour="agent-tools"]',
    toolCard: (toolId: string) => `[data-tour="agent-tools"] button:has-text("${toolId}")`,

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
    editAgentLink: 'a:has-text("Edit Agent")',
    shareButton: 'button:has-text("Share")',
    clearChatButton: 'button:has-text("Clear chat")',
    backButton: 'a[href="/dashboard"]',

    // Chat interface
    chatInput: 'textarea[placeholder*="Type a message"]',
    sendButton: '.border-t button.bg-orange-500, .p-4 button.w-12.h-12',

    // Messages
    userMessage: '.bg-orange-500, .bg-\\[\\#F97316\\]', // User messages are orange
    assistantMessage: '.bg-white', // Assistant messages are white
    loadingIndicator: 'text=Thinking...',
    emptyState: 'text=Start a conversation',
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
    toolsGrid: '[data-tour="agent-tools"]',
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
    // Selected state has orange border
    selectedCard: '.border-orange-500',
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
} as const

export type ToolId = typeof TOOL_IDS[keyof typeof TOOL_IDS]
