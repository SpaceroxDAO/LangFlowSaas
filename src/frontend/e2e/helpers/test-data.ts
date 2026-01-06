/**
 * Test data generators for E2E tests.
 * Provides consistent, unique test data for agent creation and testing.
 */

/**
 * Generate a unique test agent name with timestamp.
 */
export function generateAgentName(prefix = 'Test Charlie'): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 6)
  return `${prefix} ${timestamp}-${random}`
}

/**
 * Standard Q&A answers for creating test agents.
 * Each field meets the 10-character minimum requirement.
 */
export const testAgentData = {
  /** Step 1: Who is Charlie? */
  who: {
    valid: 'A friendly test assistant named Charlie who helps users with questions and provides helpful responses during testing.',
    minimal: 'Test bot that helps with questions.',
    bakery: 'A friendly bakery assistant named Charlie who helps customers with orders, answers questions about our menu, and provides excellent customer service.',
  },

  /** Step 2: What are the rules? */
  rules: {
    valid: 'Always be polite and helpful. Provide accurate information. If unsure, say so honestly. Keep responses concise but complete.',
    minimal: 'Be helpful and polite always.',
    bakery: 'Always be polite. Know our menu: croissants $3, sourdough bread $5, chocolate cake $20. Store hours are 7am-6pm daily. We accept cash and cards.',
  },

  /** Step 3: What tricks can Charlie do? */
  tricks: {
    valid: 'Answer questions about the system. Provide helpful suggestions. Guide users through common tasks. Escalate complex issues appropriately.',
    minimal: 'Answer questions and help users.',
    bakery: 'Take orders from customers. Answer questions about ingredients and allergens. Provide store hours. Recommend popular items. Help with special orders.',
  },
}

/**
 * Invalid test data for error testing.
 */
export const invalidAgentData = {
  /** Too short (less than 10 characters) */
  tooShort: 'Short',

  /** Empty string */
  empty: '',

  /** Only whitespace */
  whitespace: '          ',

  /** XSS attempt */
  xss: '<script>alert("xss")</script>',

  /** Very long text (10000+ chars) */
  veryLong: 'A'.repeat(10000),
}

/**
 * Chat messages for testing playground.
 */
export const testMessages = {
  greeting: 'Hello! How are you today?',
  question: 'What can you help me with?',
  bakeryOrder: 'I would like to order 2 croissants please.',
  longMessage: 'This is a longer message that contains multiple sentences. It should be processed correctly by the agent and a meaningful response should be returned. Please acknowledge this message.',
}

/**
 * Tool execution test data (Phase 6 verification).
 * These tests verify that tools actually execute, not just inject text.
 */
export const toolTestData = {
  calculator: {
    // Simple multiplication
    simple: {
      question: 'What is 847 * 23?',
      expectedContains: ['19481', '19,481'], // Accept with or without comma
    },
    // Division to test memory
    followup: {
      question: 'Now divide that result by 7',
      expectedContains: ['2783', '2,783'],
    },
    // Complex expression
    complex: {
      question: 'What is (100 + 50) / 3?',
      expectedContains: ['50'],
    },
    // Simple for quick tests
    quickTest: {
      question: 'What is 15 * 8?',
      expectedContains: ['120'],
    },
  },
  webSearch: {
    capitals: {
      question: 'What is the capital of France?',
      expectedContains: ['Paris'],
    },
  },
}

/**
 * Memory/context retention test data (Phase 7 verification).
 */
export const memoryTestData = {
  // Math context retention
  calculation: {
    setup: 'What is 100 * 5?',
    setupExpected: ['500'],
    followup: 'Now divide that by 2',
    followupExpected: ['250'],
  },
  // Name recall
  nameRecall: {
    setup: 'My name is TestUser123',
    followup: 'What is my name?',
    expectedContains: ['TestUser123'],
  },
  // Multi-turn context
  multiTurn: {
    messages: [
      { text: 'Remember this number: 42', expectResponse: true },
      { text: 'Add 8 to the number I told you', expectContains: ['50'] },
      { text: 'What was the original number?', expectContains: ['42'] },
    ],
  },
}

/**
 * Canvas viewer test data (Phase 5 verification).
 */
export const canvasTestData = {
  levels: {
    1: {
      title: "Charlie's Brain",
      description: 'read-only',
      mode: 'Peek Mode',
    },
    2: {
      title: 'Explore Mode',
      description: 'adding tricks',
      mode: 'Explore Mode',
    },
    3: {
      title: 'Builder Mode',
      description: 'guided assistance',
      mode: 'Builder Mode',
    },
    4: {
      title: 'Expert Mode',
      description: 'Full Langflow',
      mode: 'Expert Mode',
    },
  },
  tourSteps: [
    "Welcome to Charlie's Brain",
    'Flow Components',
    'Connections',
  ],
}

/**
 * Agent data for specific tool configurations.
 */
export const toolAgentData = {
  /** Calculator agent - for math tests */
  calculator: {
    name: 'Math Assistant',
    who: 'A helpful math assistant that can perform calculations and solve arithmetic problems using the calculator tool.',
    rules: 'When users ask you to perform calculations, USE YOUR CALCULATOR TOOL to compute the answer. Always show your work and provide accurate results. If you cannot calculate something, explain why.',
    tools: ['calculator'],
  },
  /** Search agent - for web search tests */
  webSearch: {
    name: 'Research Assistant',
    who: 'A knowledgeable research assistant that can search the web for current information and answer questions.',
    rules: 'Use the web search tool to find up-to-date information. Cite your sources when possible. Be clear about what information comes from search results.',
    tools: ['web_search'],
  },
  /** Multi-tool agent */
  multiTool: {
    name: 'All-Purpose Assistant',
    who: 'A versatile assistant that can calculate numbers and search the web for information.',
    rules: 'Use the calculator for math questions and web search for current information. Always choose the right tool for the task.',
    tools: ['calculator', 'web_search'],
  },
}

/**
 * Error messages expected in friendly language.
 */
export const expectedErrors = {
  validation: {
    nameRequired: 'Please give your agent a name',
    whoRequired: 'Please provide a job description',
    rulesRequired: 'Please provide instructions',
    tooShort: 'at least 10 characters',
  },
  chat: {
    failed: /error|trouble|problem|sorry|failed/i,
  },
  agent: {
    notFound: 'not found',
    createFailed: 'Failed to create',
  },
}
