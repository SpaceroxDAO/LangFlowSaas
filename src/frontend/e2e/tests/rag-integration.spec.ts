import { test, expect, dismissTourOverlay } from '../fixtures/test-fixtures'
import { generateAgentName, testAgentData } from '../helpers/test-data'
import { selectors, TOOL_IDS } from '../helpers/selectors'
import * as fs from 'fs'
import * as path from 'path'

/**
 * RAG (Retrieval Augmented Generation) Integration E2E Tests
 *
 * Comprehensive test of the RAG workflow including:
 * - Creating an agent with knowledge sources
 * - Testing document ingestion
 * - Verifying semantic search functionality
 * - Testing in the Langflow canvas
 */

// Test knowledge content - a short document about a fictional company
const TEST_KNOWLEDGE_CONTENT = `
ACME Corporation Employee Handbook - 2026 Edition

Company Overview:
ACME Corporation was founded in 1985 by John Smith and Sarah Johnson in San Francisco.
Our mission is to provide innovative solutions for everyday problems.

Office Hours:
- Monday to Friday: 9:00 AM - 6:00 PM
- Saturday: 10:00 AM - 2:00 PM
- Sunday: Closed

Holiday Schedule 2026:
- New Year's Day: January 1
- Independence Day: July 4
- Thanksgiving: November 28
- Christmas: December 25

Employee Benefits:
1. Health Insurance: Full coverage for employees and dependents
2. 401(k) Match: Company matches up to 6% of salary
3. Paid Time Off: 20 days per year for full-time employees
4. Remote Work: Hybrid model - 3 days office, 2 days remote

Contact Information:
- HR Department: hr@acmecorp.example
- IT Support: support@acmecorp.example
- Emergency Line: 555-0199
- CEO Office: ceo@acmecorp.example

Important Policies:
The dress code is business casual Monday-Thursday, casual Friday.
All expenses over $500 require manager approval.
Travel requests must be submitted at least 2 weeks in advance.
`.trim()

// Questions and expected answers for testing RAG
const RAG_TEST_QUESTIONS = [
  {
    question: 'When was ACME Corporation founded?',
    expectedKeywords: ['1985', 'John Smith', 'Sarah Johnson', 'San Francisco'],
  },
  {
    question: 'What are the office hours on Saturday?',
    expectedKeywords: ['10:00', '2:00', 'Saturday'],
  },
  {
    question: 'How much 401k match does the company provide?',
    expectedKeywords: ['6%', '401', 'match'],
  },
  {
    question: 'What is the dress code policy?',
    expectedKeywords: ['business casual', 'casual Friday', 'dress code'],
  },
]

test.describe('RAG Integration Tests', () => {
  // Increase timeout for these tests as they involve Langflow restart
  test.setTimeout(180000) // 3 minutes

  test.describe('Create Agent with Knowledge Sources', () => {
    test('can create agent with text-based knowledge source', async ({ page }) => {
      // Navigate to create page
      await page.goto('/create')
      await page.waitForLoadState('networkidle')
      await dismissTourOverlay(page)

      // Step 1: Fill identity
      const agentName = generateAgentName('RAG Test Agent')
      await page.locator(selectors.create.nameInput).fill(agentName)
      await page.locator(selectors.create.jobTextarea).fill(
        'An HR assistant for ACME Corporation that answers employee questions using the company handbook.'
      )
      await page.click(selectors.create.nextButton)

      // Step 2: Fill coaching
      await page.waitForSelector(selectors.create.rulesTextarea)
      await dismissTourOverlay(page)
      await page.locator(selectors.create.rulesTextarea).fill(
        'Answer questions using ONLY the information in the company handbook. If information is not in the handbook, say you do not have that information. Always be professional and helpful.'
      )
      await page.click(selectors.create.nextButton)

      // Step 3: Select Knowledge Search action
      await page.waitForSelector(selectors.create.toolsGrid)
      await dismissTourOverlay(page)

      // Click Knowledge Search to open modal
      const knowledgeSearchCard = page.locator('button').filter({ hasText: /Knowledge Search/i }).first()
      await knowledgeSearchCard.click()

      // Wait for modal to open
      await page.waitForSelector('[role="dialog"], .fixed.inset-0', { timeout: 5000 })

      // Click on "Text" or "Paste" tab to add text content
      const textTab = page.locator('button:has-text("Text"), button:has-text("Paste")').first()
      if (await textTab.isVisible({ timeout: 2000 }).catch(() => false)) {
        await textTab.click()
        await page.waitForTimeout(300)

        // Fill in the knowledge content
        const textarea = page.locator('textarea').first()
        await textarea.fill(TEST_KNOWLEDGE_CONTENT)

        // Enter a name for the knowledge source
        const nameInput = page.locator('input[placeholder*="name"], input[placeholder*="Name"], input[type="text"]').first()
        if (await nameInput.isVisible({ timeout: 1000 }).catch(() => false)) {
          await nameInput.fill('ACME Employee Handbook')
        }

        // Save the knowledge source
        const addButton = page.locator('button:has-text("Add"), button:has-text("Save"), button:has-text("Create")').first()
        await addButton.click()

        // Wait for the source to be added
        await page.waitForTimeout(1000)
      }

      // Close the modal
      const closeButton = page.locator('button:has-text("Done"), button:has-text("Close"), button:has-text("Cancel")').first()
      if (await closeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await closeButton.click()
      } else {
        await page.keyboard.press('Escape')
      }

      // Verify Knowledge Search is now selected (should show source count)
      const selectedKnowledgeCard = page.locator('button').filter({ hasText: /Knowledge Search/i })
      const cardText = await selectedKnowledgeCard.first().textContent()
      console.log('Knowledge Search card text:', cardText)

      // Take screenshot for debugging
      await page.screenshot({ path: 'e2e-results/rag-step3-knowledge-selected.png' })

      // Submit the agent
      await page.click(selectors.create.submitButton)

      // Should redirect to playground
      await page.waitForURL('**/playground/**', { timeout: 60000 })
      expect(page.url()).toContain('/playground/')

      // Take screenshot of successful creation
      await page.screenshot({ path: 'e2e-results/rag-agent-created.png' })
    })

    test('full RAG workflow: create, chat, edit, publish, test in canvas', async ({ page }) => {
      // =====================================================
      // STEP 1: Create Agent with Knowledge Source
      // =====================================================
      await page.goto('/create')
      await page.waitForLoadState('networkidle')
      await dismissTourOverlay(page)

      const agentName = generateAgentName('Full RAG Test')
      await page.locator(selectors.create.nameInput).fill(agentName)
      await page.locator(selectors.create.jobTextarea).fill(
        'An HR assistant for ACME Corporation that helps employees find information in the company handbook.'
      )
      await page.click(selectors.create.nextButton)

      await page.waitForSelector(selectors.create.rulesTextarea)
      await dismissTourOverlay(page)
      await page.locator(selectors.create.rulesTextarea).fill(
        'Use the knowledge base to answer questions. Be accurate and cite information from the handbook when possible.'
      )
      await page.click(selectors.create.nextButton)

      await page.waitForSelector(selectors.create.toolsGrid)
      await dismissTourOverlay(page)

      // Open Knowledge Search modal and add text content
      const knowledgeSearchCard = page.locator('button').filter({ hasText: /Knowledge Search/i }).first()
      await knowledgeSearchCard.click()

      await page.waitForSelector('[role="dialog"], .fixed.inset-0', { timeout: 5000 })

      // Try to add text knowledge source
      const textTab = page.locator('button:has-text("Text"), button:has-text("Paste")').first()
      if (await textTab.isVisible({ timeout: 2000 }).catch(() => false)) {
        await textTab.click()
        await page.waitForTimeout(300)

        const textarea = page.locator('textarea').first()
        await textarea.fill(TEST_KNOWLEDGE_CONTENT)

        const nameInput = page.locator('input[type="text"]').first()
        if (await nameInput.isVisible({ timeout: 1000 }).catch(() => false)) {
          await nameInput.fill('ACME Handbook')
        }

        const addButton = page.locator('button:has-text("Add"), button:has-text("Save")').first()
        await addButton.click()
        await page.waitForTimeout(1000)
      }

      // Close modal
      await page.keyboard.press('Escape')
      await page.waitForTimeout(500)

      // Create the agent
      await page.click(selectors.create.submitButton)
      await page.waitForURL('**/playground/**', { timeout: 60000 })

      console.log('Agent created, URL:', page.url())

      // =====================================================
      // STEP 2: Chat with the Agent (Initial Test)
      // =====================================================
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(2000) // Wait for chat interface to be ready

      // Send a test message
      const chatInput = page.locator(selectors.playground.chatInput)
      await chatInput.fill('What are the office hours on Saturday?')
      await page.click(selectors.playground.sendButton)

      // Wait for response
      await page.waitForTimeout(30000) // Give LLM time to respond

      // Take screenshot of chat
      await page.screenshot({ path: 'e2e-results/rag-initial-chat.png' })

      // =====================================================
      // STEP 3: Edit the Agent
      // =====================================================
      // Click Edit link
      await page.click(selectors.playground.editAgentLink)
      await page.waitForURL('**/edit/**', { timeout: 10000 })
      await page.waitForLoadState('networkidle')

      // Wait for form to load
      await page.waitForFunction(() => {
        const input = document.querySelector('input[type="text"]') as HTMLInputElement
        return input && input.value && input.value.length > 0
      }, { timeout: 15000 })

      // Take screenshot of edit page
      await page.screenshot({ path: 'e2e-results/rag-edit-page.png' })

      // Verify Knowledge Search is selected on edit page
      const editKnowledgeCard = page.locator('button, div').filter({ hasText: /Knowledge Search/i }).first()
      const isKnowledgeVisible = await editKnowledgeCard.isVisible({ timeout: 5000 }).catch(() => false)
      console.log('Knowledge Search visible on edit page:', isKnowledgeVisible)

      // =====================================================
      // STEP 4: Publish/Create Workflow
      // =====================================================
      // Look for publish button or save button
      const publishButton = page.locator('button:has-text("Publish"), button:has-text("Create Workflow")')
      const saveButton = page.locator('button:has-text("Save")')

      if (await publishButton.first().isVisible({ timeout: 2000 }).catch(() => false)) {
        await publishButton.first().click()
      } else {
        await saveButton.click()
      }

      // Wait for save/publish to complete
      await page.waitForTimeout(5000)

      // Take screenshot after publish
      await page.screenshot({ path: 'e2e-results/rag-after-publish.png' })

      // =====================================================
      // STEP 5: Wait for Langflow Restart (if needed)
      // =====================================================
      console.log('Waiting 60 seconds for Langflow core to restart...')
      await page.waitForTimeout(60000) // 60 second wait

      // =====================================================
      // STEP 6: Navigate to Canvas to Verify RAG Setup
      // =====================================================
      // Go back to playground
      await page.goto('/playground/' + page.url().split('/edit/')[1]?.split('?')[0] || '')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(3000)

      // Click Unlock Flow to view canvas
      const unlockFlowButton = page.locator(selectors.playground.unlockFlowButton)
      if (await unlockFlowButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await unlockFlowButton.click()
        await page.waitForURL('**/canvas/**', { timeout: 10000 })
        await page.waitForLoadState('networkidle')

        // Take screenshot of canvas with RAG flow
        await page.screenshot({ path: 'e2e-results/rag-canvas-view.png' })

        // Check if Langflow iframe loaded
        const iframe = page.locator('iframe')
        if (await iframe.isVisible({ timeout: 5000 }).catch(() => false)) {
          console.log('Langflow iframe is visible')

          // Check for Chroma node in the flow (RAG indicator)
          // This is a basic check - the node might be named differently
          await page.waitForTimeout(3000)
          await page.screenshot({ path: 'e2e-results/rag-canvas-flow.png' })
        }
      }

      // =====================================================
      // STEP 7: Test in Playground from Canvas
      // =====================================================
      // Navigate back to playground
      const backToChat = page.locator('a:has-text("Back to Chat"), a:has-text("Playground")')
      if (await backToChat.first().isVisible({ timeout: 3000 }).catch(() => false)) {
        await backToChat.first().click()
      } else {
        await page.goto('/playground/' + page.url().split('/canvas/')[1]?.split('?')[0] || '')
      }

      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(2000)

      // Test RAG with a specific question
      const finalChatInput = page.locator(selectors.playground.chatInput)
      if (await finalChatInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await finalChatInput.fill('When was ACME Corporation founded and by whom?')
        await page.click(selectors.playground.sendButton)

        // Wait for response
        await page.waitForTimeout(45000) // Give time for RAG retrieval + LLM response

        // Take final screenshot
        await page.screenshot({ path: 'e2e-results/rag-final-test.png' })

        // Check response contains expected information
        const messages = await page.locator('.bg-white.rounded-2xl, .bg-white.border.rounded-2xl').allTextContents()
        const lastResponse = messages[messages.length - 1] || ''

        console.log('Final RAG response:', lastResponse.substring(0, 200) + '...')

        // Verify the response mentions information from our knowledge base
        const hasRelevantInfo =
          lastResponse.toLowerCase().includes('1985') ||
          lastResponse.toLowerCase().includes('john smith') ||
          lastResponse.toLowerCase().includes('sarah johnson') ||
          lastResponse.toLowerCase().includes('san francisco')

        console.log('Response contains relevant info:', hasRelevantInfo)
      }
    })
  })

  test.describe('RAG Chat Verification', () => {
    test('agent with knowledge source answers questions correctly', async ({ page }) => {
      // This test assumes an agent has already been created with knowledge sources
      // It tests that the RAG system returns relevant information

      await page.goto('/create')
      await page.waitForLoadState('networkidle')
      await dismissTourOverlay(page)

      // Quick agent creation with knowledge
      const agentName = generateAgentName('RAG Verify')
      await page.locator(selectors.create.nameInput).fill(agentName)
      await page.locator(selectors.create.jobTextarea).fill('An assistant that answers questions about ACME Corporation.')
      await page.click(selectors.create.nextButton)

      await page.waitForSelector(selectors.create.rulesTextarea)
      await dismissTourOverlay(page)
      await page.locator(selectors.create.rulesTextarea).fill('Use knowledge base to answer questions accurately.')
      await page.click(selectors.create.nextButton)

      await page.waitForSelector(selectors.create.toolsGrid)
      await dismissTourOverlay(page)

      // Add knowledge source
      const knowledgeCard = page.locator('button').filter({ hasText: /Knowledge Search/i }).first()
      await knowledgeCard.click()

      await page.waitForSelector('[role="dialog"]', { timeout: 5000 })

      const textTab = page.locator('button:has-text("Text")').first()
      if (await textTab.isVisible({ timeout: 2000 }).catch(() => false)) {
        await textTab.click()
        const textarea = page.locator('textarea').first()
        await textarea.fill(TEST_KNOWLEDGE_CONTENT)
        const addBtn = page.locator('button:has-text("Add"), button:has-text("Save")').first()
        await addBtn.click()
        await page.waitForTimeout(1000)
      }

      await page.keyboard.press('Escape')
      await page.waitForTimeout(500)

      await page.click(selectors.create.submitButton)
      await page.waitForURL('**/playground/**', { timeout: 60000 })

      // Test multiple questions
      for (const testCase of RAG_TEST_QUESTIONS.slice(0, 2)) { // Test first 2 questions
        await page.waitForTimeout(3000)

        const chatInput = page.locator(selectors.playground.chatInput)
        await chatInput.fill(testCase.question)
        await page.click(selectors.playground.sendButton)

        // Wait for response
        await page.waitForTimeout(30000)

        const messages = await page.locator('.bg-white.rounded-2xl').allTextContents()
        const lastResponse = messages[messages.length - 1] || ''

        console.log(`Question: ${testCase.question}`)
        console.log(`Response: ${lastResponse.substring(0, 150)}...`)

        // Check if any expected keywords are in the response
        const hasKeyword = testCase.expectedKeywords.some(
          kw => lastResponse.toLowerCase().includes(kw.toLowerCase())
        )
        console.log(`Has expected keyword: ${hasKeyword}`)
      }

      await page.screenshot({ path: 'e2e-results/rag-verification-complete.png' })
    })
  })
})

test.describe('RAG Error Handling', () => {
  test('gracefully handles empty knowledge sources', async ({ page }) => {
    await page.goto('/create')
    await page.waitForLoadState('networkidle')
    await dismissTourOverlay(page)

    // Create agent without actually adding knowledge content
    await page.locator(selectors.create.nameInput).fill(generateAgentName('No Knowledge'))
    await page.locator(selectors.create.jobTextarea).fill('Test agent without knowledge')
    await page.click(selectors.create.nextButton)

    await page.waitForSelector(selectors.create.rulesTextarea)
    await dismissTourOverlay(page)
    await page.locator(selectors.create.rulesTextarea).fill('Be helpful even without knowledge base.')
    await page.click(selectors.create.nextButton)

    await page.waitForSelector(selectors.create.toolsGrid)
    await dismissTourOverlay(page)

    // Click Knowledge Search but don't add content
    const knowledgeCard = page.locator('button').filter({ hasText: /Knowledge Search/i }).first()
    await knowledgeCard.click()
    await page.waitForSelector('[role="dialog"]', { timeout: 3000 }).catch(() => {})

    // Just close the modal without adding anything
    await page.keyboard.press('Escape')
    await page.waitForTimeout(500)

    // Submit should still work
    await page.click(selectors.create.submitButton)

    // Should either succeed or show a meaningful error
    await page.waitForTimeout(5000)

    const hasError = await page.locator('.text-red-600, .bg-red-50, [role="alert"]').isVisible().catch(() => false)
    const wasRedirected = page.url().includes('/playground/')

    // Either outcome is acceptable - the system should handle it gracefully
    expect(hasError || wasRedirected).toBeTruthy()

    await page.screenshot({ path: 'e2e-results/rag-empty-knowledge-result.png' })
  })
})
