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

/**
 * Phase D Selectors: Missions, Billing, Analytics, Embed
 */
export const phaseDSelectors = {
  // ========================================
  // Missions Page
  // ========================================
  missions: {
    // Page layout
    pageHeader: 'h1:has-text("Your Missions")',
    pageSubtitle: 'text=Guided challenges',

    // Stats bar
    statsBar: '.grid.grid-cols-4',
    completedStat: 'text=/\\d+\\s*Completed/',
    inProgressStat: 'text=/\\d+\\s*In Progress/',
    totalStat: 'text=/\\d+\\s*Total/',

    // Category tabs
    categoryTabs: '.flex.gap-2',
    allTab: 'button:has-text("All")',
    skillSprintTab: 'button:has-text("Skill Sprint")',
    appliedBuildTab: 'button:has-text("Applied Build")',
    weeklyQuestTab: 'button:has-text("Weekly Quest")',
    activeTab: '.bg-violet-600.text-white',

    // Mission cards
    missionGrid: '.grid.gap-6',
    missionCard: '.bg-white.rounded-2xl',
    missionCardByName: (name: string) => `.bg-white.rounded-2xl:has-text("${name}")`,
    missionIcon: '.w-12.h-12.rounded-xl',
    missionTitle: '.font-semibold.text-gray-900',
    missionDescription: '.text-sm.text-gray-500',
    missionDifficulty: '.text-xs.font-medium',
    missionDuration: '.text-sm.text-gray-500:has-text("min")',
    missionProgress: '.bg-gray-200.rounded-full',
    missionProgressFill: '.bg-violet-600.rounded-full',

    // Status badges
    notStartedBadge: 'span:has-text("Not Started")',
    inProgressBadge: 'span:has-text("In Progress")',
    completedBadge: 'span:has-text("Completed")',
    lockedBadge: 'span:has-text("Locked")',

    // Action buttons
    startButton: 'button:has-text("Start")',
    continueButton: 'button:has-text("Continue")',
    viewButton: 'button:has-text("View")',

    // Empty state
    emptyState: 'text=No missions match',

    // Step guide panel (slide-out)
    stepGuidePanel: '.fixed.right-0.top-0.h-full.w-96',
    stepGuideClose: 'button:has(svg.lucide-x)',
    stepGuideTitle: '.text-xl.font-bold',
    stepGuideSteps: '.space-y-4',
    stepGuideStep: '.border.rounded-xl',
    stepGuideStepNumber: '.w-8.h-8.rounded-full',
    stepGuideStepTitle: '.font-medium',
    stepGuideStepDescription: '.text-sm.text-gray-500',
    stepGuideCompleteButton: 'button:has-text("Complete Step")',
    stepGuideNextButton: 'button:has-text("Next")',
    stepGuideResetButton: 'button:has-text("Reset")',

    // Mission detail
    prerequisiteWarning: 'text=Complete these missions first',
    outcomesList: '.space-y-2',
  },

  // ========================================
  // Billing Page
  // ========================================
  billing: {
    // Page layout
    pageHeader: 'h1:has-text("Billing")',
    currentPlanSection: '.bg-white.rounded-2xl',

    // Plan cards
    planCard: '.border.rounded-2xl',
    freePlanCard: '.border.rounded-2xl:has-text("Free")',
    proPlanCard: '.border.rounded-2xl:has-text("Pro")',
    teamPlanCard: '.border.rounded-2xl:has-text("Team")',
    currentPlanBadge: 'span:has-text("Current Plan")',
    recommendedBadge: 'span:has-text("Recommended")',

    // Plan details
    planName: '.text-2xl.font-bold',
    planPrice: '.text-4xl.font-bold',
    planPeriod: 'text=/\\/month/',
    planFeatures: '.space-y-3',
    planFeatureItem: '.flex.items-center.gap-2',

    // Upgrade buttons
    upgradeButton: 'button:has-text("Upgrade")',
    downgradeButton: 'button:has-text("Downgrade")',
    manageButton: 'button:has-text("Manage Subscription")',
    cancelButton: 'button:has-text("Cancel Subscription")',

    // Usage section
    usageSection: 'h2:has-text("Usage")',
    usageBar: '.bg-gray-200.rounded-full',
    usageFill: '.bg-violet-600.rounded-full',
    usageLabel: '.text-sm.text-gray-600',
    usageCount: '.font-semibold',
    usageLimit: 'text=/of \\d+/',

    // Usage metrics
    messagesUsage: 'text=Messages',
    tokensUsage: 'text=Tokens',
    agentsUsage: 'text=Agents',
    storageUsage: 'text=Storage',

    // Billing history
    billingHistory: 'h2:has-text("Billing History")',
    invoiceRow: '.border-b.py-4',
    invoiceDate: '.text-gray-500',
    invoiceAmount: '.font-semibold',
    invoiceStatus: 'span.rounded-full',
    downloadInvoice: 'button:has-text("Download")',

    // Modals
    upgradeModal: '[role="dialog"]:has-text("Upgrade")',
    cancelModal: '[role="dialog"]:has-text("Cancel")',
    confirmButton: 'button:has-text("Confirm")',

    // Stripe elements
    stripeCheckout: '.stripe-checkout, iframe[src*="stripe"]',

    // Alerts
    limitWarning: '.bg-yellow-50:has-text("approaching"), .bg-amber-50',
    limitExceeded: '.bg-red-50:has-text("exceeded")',

    // Loading states
    loading: '.animate-pulse',
  },

  // ========================================
  // Analytics Dashboard Page
  // ========================================
  analytics: {
    // Page layout
    pageHeader: 'h1:has-text("Analytics")',
    dateRangePicker: 'button:has-text("Last 7 days")',
    refreshButton: 'button:has(svg.lucide-refresh-cw)',

    // Stats cards
    statsGrid: '.grid.grid-cols-4',
    statCard: '.bg-white.rounded-2xl.shadow',
    totalConversations: 'text=Total Conversations',
    totalMessages: 'text=Total Messages',
    avgResponseTime: 'text=Avg Response Time',
    userSatisfaction: 'text=User Satisfaction',
    statValue: '.text-3xl.font-bold',
    statChange: '.text-sm',
    positiveChange: '.text-green-600',
    negativeChange: '.text-red-600',

    // Charts
    chartContainer: '.recharts-responsive-container',
    conversationChart: 'h3:has-text("Conversations Over Time")',
    messageChart: 'h3:has-text("Messages by Agent")',
    usageChart: 'h3:has-text("Usage Breakdown")',

    // Chart elements
    chartLine: '.recharts-line',
    chartBar: '.recharts-bar',
    chartPie: '.recharts-pie',
    chartLegend: '.recharts-legend-wrapper',
    chartTooltip: '.recharts-tooltip-wrapper',

    // Filters
    agentFilter: 'select:has-text("All Agents")',
    periodFilter: 'select:has-text("7 days")',

    // Tables
    topAgentsTable: 'h3:has-text("Top Agents")',
    recentConversations: 'h3:has-text("Recent Conversations")',
    tableRow: 'tr.border-b',
    tableHeader: 'th.text-gray-500',

    // Empty state
    noDataMessage: 'text=No data available',

    // Export
    exportButton: 'button:has-text("Export")',
    exportCSV: 'button:has-text("CSV")',
    exportPDF: 'button:has-text("PDF")',
  },

  // ========================================
  // Embed Widget Modal
  // ========================================
  embed: {
    // Modal
    modal: '.fixed.inset-0:has-text("Embed Widget")',
    modalHeader: 'h2:has-text("Embed Widget")',
    modalClose: 'button:has(svg.lucide-x)',

    // Enable/Disable toggle
    embedToggle: '.relative.inline-flex.h-6.w-11',
    toggleEnabled: '.bg-violet-600',
    toggleDisabled: '.bg-gray-300',
    statusText: 'text=Widget is active',
    disabledText: 'text=Enable to get embed code',

    // Configuration section
    configSection: 'h4:has-text("Widget Settings")',
    welcomeMessageInput: 'input[placeholder*="welcome"], input[placeholder*="Hi!"]',
    primaryColorInput: 'input[type="color"]',
    primaryColorText: 'input.font-mono',

    // Embed code
    embedCodeSection: '.relative',
    embedCode: 'pre.bg-gray-900',
    copyButton: 'button[title="Copy to clipboard"]',
    copiedIcon: 'svg.text-green-400',
    copiedMessage: 'text=Copied to clipboard',

    // Footer buttons
    closeButton: 'button:has-text("Close")',
    copyCodeButton: 'button:has-text("Copy Code")',

    // Tips section
    tipsSection: '.bg-blue-50',
    tipsList: 'ul.text-sm.text-blue-800',

    // Agent card embed trigger
    embedMenuOption: 'button:has-text("Embed")',
    shareMenuOption: 'button:has-text("Share")',
  },

  // ========================================
  // Sidebar Navigation
  // ========================================
  sidebar: {
    // Main sidebar
    sidebar: 'aside',
    sidebarCollapsed: '.w-16',
    sidebarExpanded: '.w-64',
    toggleButton: 'button:has(svg.lucide-chevron-left), button:has(svg.lucide-chevron-right)',

    // Navigation links
    dashboardLink: 'a[href="/dashboard"]',
    createAgentLink: 'a[href="/create"]',
    missionsLink: 'a[href="/missions"]',
    analyticsLink: 'a[href="/analytics"]',
    billingLink: 'a[href="/billing"]',
    settingsLink: 'a[href="/settings"]',

    // Active state
    activeLink: '.bg-violet-100, .bg-violet-50, .text-violet-600',

    // Icons
    dashboardIcon: 'svg.lucide-layout-dashboard',
    createIcon: 'svg.lucide-plus',
    missionsIcon: 'svg.lucide-target',
    analyticsIcon: 'svg.lucide-bar-chart-3',
    billingIcon: 'svg.lucide-credit-card',
    settingsIcon: 'svg.lucide-settings',

    // Footer
    footer: '.mt-auto',
    userMenu: '.flex.items-center.gap-2',
    helpLink: 'a:has-text("Help")',
  },

  // ========================================
  // Settings Page
  // ========================================
  settings: {
    // Page layout
    pageHeader: 'h1:has-text("Settings")',

    // Tabs
    tabList: '[role="tablist"]',
    profileTab: 'button:has-text("Profile")',
    apiKeysTab: 'button:has-text("API Keys")',
    notificationsTab: 'button:has-text("Notifications")',

    // Profile section
    profileSection: 'h2:has-text("Profile")',
    nameInput: 'input[name="name"]',
    emailInput: 'input[name="email"]',
    avatarUpload: 'input[type="file"]',
    saveProfileButton: 'button:has-text("Save Profile")',

    // API Keys section
    apiKeysSection: 'h2:has-text("API Keys")',
    openaiKeyInput: 'input[name="openai_key"]',
    anthropicKeyInput: 'input[name="anthropic_key"]',
    showKeyButton: 'button:has(svg.lucide-eye)',
    hideKeyButton: 'button:has(svg.lucide-eye-off)',
    saveKeysButton: 'button:has-text("Save Keys")',
    keyMasked: 'text=••••••••',

    // Notifications section
    notificationsSection: 'h2:has-text("Notifications")',
    emailNotifications: 'input[name="email_notifications"]',
    pushNotifications: 'input[name="push_notifications"]',

    // Danger zone
    dangerZone: 'h2:has-text("Danger Zone")',
    deleteAccountButton: 'button:has-text("Delete Account")',
    deleteConfirmInput: 'input[placeholder*="DELETE"]',

    // Success/Error states
    saveSuccess: 'text=Settings saved',
    saveError: 'text=Failed to save',
  },
}
