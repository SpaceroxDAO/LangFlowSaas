/**
 * E2E Test: Avatar Generation
 * Tests creating an agent and generating an avatar
 */
import { test, expect } from '@playwright/test'

test.describe('Avatar Generation', () => {
  test.setTimeout(180000) // 3 minute timeout

  test('should create agent and generate avatar', async ({ page }) => {
    // Enable console logging for debugging
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warn') {
        console.log(`Browser ${msg.type()}: ${msg.text()}`)
      }
    })

    page.on('requestfailed', request => {
      console.log(`Request failed: ${request.url()} - ${request.failure()?.errorText}`)
    })

    // Step 1: Go to create agent page
    console.log('Step 1: Navigate to create agent page')
    await page.goto('http://localhost:3003/create')
    await page.waitForLoadState('networkidle')

    // Dismiss any tour popups
    await page.keyboard.press('Escape')
    await page.waitForTimeout(500)

    // Step 2: Fill in Step 1 - Identity
    console.log('Step 2: Fill in Step 1 - Identity')

    // Name field
    const nameInput = page.locator('input[type="text"]').first()
    await expect(nameInput).toBeVisible({ timeout: 10000 })
    await nameInput.fill('Aviation Expert')

    // Job Description / Persona field (textarea)
    const personaInput = page.locator('textarea').first()
    await expect(personaInput).toBeVisible({ timeout: 5000 })
    await personaInput.fill('A friendly expert who knows everything about airplanes and aviation history')

    await page.screenshot({ path: 'e2e-results/step1-filled.png' })

    // Click Next Step
    console.log('Clicking Next Step from Step 1')
    await page.getByRole('button', { name: 'Next Step' }).click()
    await page.waitForTimeout(1000)
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)

    // Step 3: Fill in Step 2 - Coaching/Instructions
    console.log('Step 3: Fill in Step 2 - Instructions')
    await page.screenshot({ path: 'e2e-results/step2-before.png' })

    const instructionsInput = page.locator('textarea').first()
    await expect(instructionsInput).toBeVisible({ timeout: 5000 })
    await instructionsInput.fill('Always provide accurate information about aircraft. Be helpful and educational about aviation topics.')

    console.log('Clicking Next Step from Step 2')
    await page.getByRole('button', { name: 'Next Step' }).click()
    await page.waitForTimeout(1000)
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)

    // Step 4: Step 3 - Tools Selection (buttons, not textarea)
    console.log('Step 4: On Step 3 - Tools Selection')
    await page.screenshot({ path: 'e2e-results/step3-tools.png' })

    // Optionally click a tool (Web Search)
    const webSearchButton = page.getByRole('button', { name: /web search/i })
    if (await webSearchButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await webSearchButton.click()
      console.log('Selected Web Search tool')
    }

    // Click "Finish & Create Agent"
    const createButton = page.getByRole('button', { name: /finish.*create|create.*agent/i })
    await expect(createButton).toBeVisible({ timeout: 5000 })
    console.log('Found Create button, clicking...')
    await createButton.click()

    // Step 5: Wait for navigation to playground
    console.log('Step 5: Wait for agent creation and navigation')
    await page.waitForURL(/\/playground\//, { timeout: 60000 })
    console.log(`Navigated to: ${page.url()}`)

    await page.keyboard.press('Escape')
    await page.waitForTimeout(500)
    await page.keyboard.press('Escape')
    await page.waitForTimeout(500)

    await page.screenshot({ path: 'e2e-results/playground.png' })

    // Step 6: Navigate to Edit page
    console.log('Step 6: Navigate to Edit page')
    const currentUrl = page.url()

    const workflowMatch = currentUrl.match(/\/playground\/workflow\/([^/?]+)/)
    if (workflowMatch) {
      const workflowId = workflowMatch[1]
      console.log(`Found workflow ID: ${workflowId}`)

      const workflowResponse = await page.request.get(`http://localhost:8000/api/v1/workflows/${workflowId}`)
      const workflow = await workflowResponse.json()
      console.log(`Workflow: ${JSON.stringify(workflow)}`)

      if (workflow.agent_component_ids && workflow.agent_component_ids.length > 0) {
        const agentComponentId = workflow.agent_component_ids[0]
        console.log(`Navigating to edit page: ${agentComponentId}`)
        await page.goto(`http://localhost:3003/edit/${agentComponentId}`)
      } else {
        throw new Error('No agent component IDs in workflow')
      }
    } else {
      const agentMatch = currentUrl.match(/\/playground\/([^/?]+)/)
      if (agentMatch && !agentMatch[1].includes('workflow')) {
        await page.goto(`http://localhost:3003/edit/${agentMatch[1]}`)
      } else {
        throw new Error(`Could not parse ID from URL: ${currentUrl}`)
      }
    }

    await page.waitForURL(/\/edit\//, { timeout: 10000 })
    console.log(`On edit page: ${page.url()}`)

    await page.keyboard.press('Escape')
    await page.waitForTimeout(500)
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: 'e2e-results/edit-page.png' })

    // Step 7: Click Generate avatar button
    console.log('Step 7: Looking for Generate avatar button')

    // Be specific - look for button with exact text "Generate" or "Regenerate" (not "Generate short")
    const generateButton = page.getByRole('button', { name: 'Generate', exact: true })
      .or(page.getByRole('button', { name: 'Regenerate', exact: true }))
    await expect(generateButton).toBeVisible({ timeout: 10000 })
    console.log('Found Generate button, clicking...')

    const avatarResponsePromise = page.waitForResponse(
      response => response.url().includes('/api/v1/avatars/dog'),
      { timeout: 90000 }
    )

    await generateButton.click()
    console.log('Clicked Generate, waiting for API...')

    // Step 8: Wait for avatar API response
    console.log('Step 8: Waiting for avatar API response...')
    const avatarResponse = await avatarResponsePromise
    const avatarStatus = avatarResponse.status()
    console.log(`Avatar API status: ${avatarStatus}`)

    if (avatarStatus !== 200) {
      const responseText = await avatarResponse.text()
      console.log(`Avatar API error: ${responseText}`)
      throw new Error(`Avatar API failed: ${avatarStatus} - ${responseText}`)
    }

    const responseJson = await avatarResponse.json()
    console.log(`Avatar API success: ${JSON.stringify(responseJson)}`)

    // Step 9: Verify avatar image
    console.log('Step 9: Verifying avatar image')
    await page.waitForTimeout(2000)
    await page.screenshot({ path: 'e2e-results/after-generate.png' })

    const avatarImage = page.locator('img[alt*="avatar" i], img[alt*="Agent" i]').first()
    await expect(avatarImage).toBeVisible({ timeout: 10000 })

    const imgSrc = await avatarImage.getAttribute('src')
    console.log(`Avatar src: ${imgSrc}`)
    expect(imgSrc).toBeTruthy()
    expect(imgSrc).toContain('/static/avatars/')

    if (imgSrc) {
      const imageUrl = imgSrc.startsWith('http') ? imgSrc : `http://localhost:8000${imgSrc}`
      console.log(`Fetching: ${imageUrl}`)
      const imageResponse = await page.request.get(imageUrl)
      console.log(`Image status: ${imageResponse.status()}`)
      expect(imageResponse.status()).toBe(200)
    }

    // Step 10: Verify avatar was saved to database
    console.log('Step 10: Verifying avatar saved to database')
    const agentIdFromUrl = page.url().match(/\/edit\/([^/?]+)/)?.[1]
    if (agentIdFromUrl) {
      const agentResponse = await page.request.get(`http://localhost:8000/api/v1/agent-components/${agentIdFromUrl}`)
      expect(agentResponse.status()).toBe(200)
      const agentData = await agentResponse.json()
      console.log(`Database avatar_url: ${agentData.avatar_url}`)
      expect(agentData.avatar_url).toBeTruthy()
      expect(agentData.avatar_url).toContain('/static/avatars/')
      console.log('✅ Avatar saved to database correctly!')
    }

    console.log('✅ Avatar generation test passed!')
  })
})
