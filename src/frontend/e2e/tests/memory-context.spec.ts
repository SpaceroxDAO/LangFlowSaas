import { test, expect, responseContains } from '../fixtures/test-fixtures'
import { memoryTestData, toolAgentData } from '../helpers/test-data'
import { selectors, TOOL_IDS } from '../helpers/selectors'

/**
 * Phase 7 Verification: Memory/Context Retention Tests
 *
 * These tests verify that the agent maintains conversation context
 * across multiple messages within a session.
 *
 * Key verification: Agent remembers previous calculation result for follow-up questions
 */
test.describe('Memory/Context Journey', () => {
  test.describe('Single Conversation Context', () => {
    test('agent remembers previous calculation result', async ({ page, createAgentWithTools, sendChatMessage }) => {
      // Create agent with calculator for verifiable context
      const agent = await createAgentWithTools([TOOL_IDS.calculator], toolAgentData.calculator)
      console.log(`Created agent for memory test: ${agent.name}`)

      // First message: Ask a math question
      const firstResponse = await sendChatMessage(page, memoryTestData.calculation.setup)
      console.log(`First response (100 * 5): ${firstResponse}`)

      // Verify first answer is correct (500)
      expect(responseContains(firstResponse, memoryTestData.calculation.setupExpected)).toBeTruthy()

      // Second message: Follow-up that requires remembering the result
      const secondResponse = await sendChatMessage(page, memoryTestData.calculation.followup)
      console.log(`Follow-up response (divide by 2): ${secondResponse}`)

      // Verify agent remembered 500 and divided by 2 to get 250
      expect(responseContains(secondResponse, memoryTestData.calculation.followupExpected)).toBeTruthy()
    })

    test('agent remembers user-provided name', async ({ page, createAgentWithTools, sendChatMessage }) => {
      // Create a basic agent
      const agent = await createAgentWithTools([], {
        name: 'Memory Test Agent',
        who: 'A friendly assistant that remembers details about the conversation.',
        rules: 'Remember what users tell you and use that information in your responses. Be conversational and friendly.',
        tools: [],
      })

      // First message: Tell the agent our name
      const firstResponse = await sendChatMessage(page, memoryTestData.nameRecall.setup)
      console.log(`Introduction response: ${firstResponse}`)

      // Wait a moment for the system to process
      await page.waitForTimeout(500)

      // Second message: Ask what our name is
      const secondResponse = await sendChatMessage(page, memoryTestData.nameRecall.followup)
      console.log(`Name recall response: ${secondResponse}`)

      // Verify the agent remembers the name
      expect(responseContains(secondResponse, memoryTestData.nameRecall.expectedContains)).toBeTruthy()
    })

    test('agent maintains context across 3+ messages', async ({ page, createAgentWithTools, sendChatMessage }) => {
      // Create agent with calculator for verifiable calculations
      const agent = await createAgentWithTools([TOOL_IDS.calculator], {
        name: 'Context Chain Agent',
        who: 'A math assistant that tracks calculations across a conversation.',
        rules: 'Keep track of all calculations in the conversation. When asked to continue, use the most recent result.',
        tools: ['calculator'],
      })

      // Message 1: Start with a calculation
      const response1 = await sendChatMessage(page, 'What is 10 * 10?')
      console.log(`Message 1 response: ${response1}`)
      expect(responseContains(response1, ['100'])).toBeTruthy()

      // Message 2: Build on it
      const response2 = await sendChatMessage(page, 'Add 50 to that')
      console.log(`Message 2 response: ${response2}`)
      expect(responseContains(response2, ['150'])).toBeTruthy()

      // Message 3: Continue the chain
      const response3 = await sendChatMessage(page, 'Now divide by 3')
      console.log(`Message 3 response: ${response3}`)
      expect(responseContains(response3, ['50'])).toBeTruthy()
    })
  })

  test.describe('Conversation Boundaries', () => {
    test('clear chat resets conversation context', async ({ page, createAgentWithTools, sendChatMessage }) => {
      // Create agent
      const agent = await createAgentWithTools([TOOL_IDS.calculator], toolAgentData.calculator)

      // Establish context
      const firstResponse = await sendChatMessage(page, 'Remember that my favorite number is 777')
      console.log(`Context setup response: ${firstResponse}`)

      // Clear chat
      await page.click(selectors.playground.clearChatButton)

      // Wait for chat to clear
      await page.waitForTimeout(500)

      // Verify messages are cleared
      const emptyState = page.locator(selectors.playground.emptyState)
      await expect(emptyState).toBeVisible({ timeout: 5000 })

      // Ask about the context (should not remember)
      const afterClearResponse = await sendChatMessage(page, 'What is my favorite number?')
      console.log(`After clear response: ${afterClearResponse}`)

      // The agent should NOT know the number (context was cleared)
      // It might say "I don't know" or ask what it is
      const stillRemembers = responseContains(afterClearResponse, ['777'])

      // If it still remembers, the clear didn't work properly
      // We expect it to NOT remember
      expect(stillRemembers).toBeFalsy()
    })

    test('messages persist during conversation', async ({ page, createAgentWithTools, sendChatMessage }) => {
      // Create agent
      const agent = await createAgentWithTools([], {
        name: 'Persistence Test',
        who: 'A simple assistant for testing message persistence.',
        rules: 'Be helpful and conversational.',
        tools: [],
      })

      // Send first message
      await sendChatMessage(page, 'Hello, this is message one')

      // Send second message
      await sendChatMessage(page, 'This is message two')

      // Verify both user messages are visible in the chat
      const userMessages = page.locator('.bg-orange-500, .bg-\\[\\#F97316\\]')
      const messageCount = await userMessages.count()

      // Should have at least 2 user messages visible
      expect(messageCount).toBeGreaterThanOrEqual(2)
    })
  })

  test.describe('Context Quality', () => {
    test('agent uses context appropriately in responses', async ({ page, createAgentWithTools, sendChatMessage }) => {
      // Create a conversational agent
      const agent = await createAgentWithTools([], {
        name: 'Context Quality Agent',
        who: 'A helpful assistant that pays attention to conversation details.',
        rules: 'Listen carefully to what users say. Reference previous parts of the conversation when relevant.',
        tools: [],
      })

      // Provide some context
      await sendChatMessage(page, 'I am planning a trip to Paris next month')

      // Ask a follow-up that requires context
      const response = await sendChatMessage(page, 'What should I pack for my trip?')
      console.log(`Context-aware response: ${response}`)

      // The response should reference Paris or France or the trip
      // Not just give generic packing advice
      const isContextAware = responseContains(response, ['Paris', 'France', 'trip', 'travel'])
      expect(isContextAware).toBeTruthy()
    })
  })
})

/**
 * Smoke test for memory - can be run quickly
 */
test.describe('Memory Smoke Test', () => {
  test('basic context retention works', async ({ page, createAgentWithTools, sendChatMessage }) => {
    const agent = await createAgentWithTools([TOOL_IDS.calculator])

    // Quick context test with math
    await sendChatMessage(page, 'What is 5 + 5?')
    const response = await sendChatMessage(page, 'Double that number')

    // Should get 20 (10 * 2)
    expect(responseContains(response, ['20'])).toBeTruthy()
  })
})
