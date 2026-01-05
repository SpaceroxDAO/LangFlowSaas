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
