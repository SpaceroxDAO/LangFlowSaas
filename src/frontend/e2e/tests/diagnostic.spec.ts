import { test as baseTest, expect } from '@playwright/test'
import { test as fixtureTest } from '../fixtures/test-fixtures'
import { selectors, TOOL_IDS } from '../helpers/selectors'

/**
 * Diagnostic test to understand why headless mode fails.
 * This captures console logs, errors, and network requests.
 */

// Test using base Playwright (no custom fixtures)
baseTest.describe('Headless Diagnostic - Base Playwright', () => {
  baseTest('capture everything during page load', async ({ page }) => {
    const consoleLogs: string[] = []
    const consoleErrors: string[] = []
    const networkRequests: string[] = []
    const networkFailures: string[] = []

    // Capture all console messages
    page.on('console', (msg) => {
      const text = `[${msg.type()}] ${msg.text()}`
      consoleLogs.push(text)
      if (msg.type() === 'error') {
        consoleErrors.push(text)
      }
    })

    // Capture page errors (uncaught exceptions)
    page.on('pageerror', (error) => {
      consoleErrors.push(`[PAGE ERROR] ${error.message}`)
    })

    // Capture network requests
    page.on('request', (request) => {
      networkRequests.push(`[REQ] ${request.method()} ${request.url()}`)
    })

    // Capture network failures
    page.on('requestfailed', (request) => {
      networkFailures.push(`[FAIL] ${request.url()} - ${request.failure()?.errorText}`)
    })

    // Navigate to the create page
    console.log('\n=== NAVIGATING TO /create ===\n')
    await page.goto('/create')

    // Take immediate screenshot
    await page.screenshot({ path: 'test-results/diagnostic-immediate.png' })
    console.log('Screenshot taken immediately after navigation')

    // Wait a bit for any async loading
    await page.waitForTimeout(2000)

    // Take another screenshot
    await page.screenshot({ path: 'test-results/diagnostic-after-2s.png' })
    console.log('Screenshot taken after 2s wait')

    // Check page content
    const htmlContent = await page.content()
    const bodyText = await page.locator('body').textContent().catch(() => 'FAILED TO GET BODY TEXT')
    const rootContent = await page.locator('#root').innerHTML().catch(() => 'FAILED TO GET ROOT CONTENT')

    // Print diagnostics
    console.log('\n=== DIAGNOSTIC RESULTS ===\n')

    console.log('--- HTML Length ---')
    console.log(`HTML length: ${htmlContent.length} chars`)

    console.log('\n--- Body Text ---')
    console.log(bodyText?.substring(0, 500) || '(empty)')

    console.log('\n--- React Root Content ---')
    console.log(rootContent?.substring(0, 500) || '(empty)')

    console.log('\n--- Console Logs ---')
    consoleLogs.forEach(log => console.log(log))

    console.log('\n--- Console Errors ---')
    if (consoleErrors.length === 0) {
      console.log('(no errors)')
    } else {
      consoleErrors.forEach(err => console.log(err))
    }

    console.log('\n--- Network Requests ---')
    networkRequests.slice(0, 20).forEach(req => console.log(req))
    if (networkRequests.length > 20) {
      console.log(`... and ${networkRequests.length - 20} more requests`)
    }

    console.log('\n--- Network Failures ---')
    if (networkFailures.length === 0) {
      console.log('(no failures)')
    } else {
      networkFailures.forEach(fail => console.log(fail))
    }

    // Check if React root has content
    const reactMounted = await page.evaluate(() => {
      const root = document.getElementById('root')
      return {
        exists: !!root,
        hasChildren: root ? root.children.length > 0 : false,
        childCount: root ? root.children.length : 0,
        innerHTML: root ? root.innerHTML.substring(0, 200) : 'no root'
      }
    })

    console.log('\n--- React Mount Status ---')
    console.log(`Root exists: ${reactMounted.exists}`)
    console.log(`Has children: ${reactMounted.hasChildren}`)
    console.log(`Child count: ${reactMounted.childCount}`)
    console.log(`innerHTML preview: ${reactMounted.innerHTML}`)

    // Wait for networkidle
    console.log('\n--- Waiting for networkidle ---')
    await page.waitForLoadState('networkidle').catch(e => console.log(`networkidle failed: ${e.message}`))

    // Final screenshot
    await page.screenshot({ path: 'test-results/diagnostic-final.png' })
    console.log('Final screenshot taken')

    // Final React check
    const finalReactCheck = await page.evaluate(() => {
      const root = document.getElementById('root')
      return root ? root.children.length : 0
    })
    console.log(`\nFinal React root child count: ${finalReactCheck}`)

    // Try to find the name input
    const nameInputExists = await page.locator('[data-tour="agent-name"]').count()
    console.log(`\nName input [data-tour="agent-name"] count: ${nameInputExists}`)

    // This test always "passes" - it's just for diagnostics
    expect(true).toBe(true)
  })

  baseTest('check Vite client connection', async ({ page }) => {
    const wsMessages: string[] = []

    // Try to intercept WebSocket
    page.on('websocket', ws => {
      console.log(`WebSocket opened: ${ws.url()}`)
      ws.on('framereceived', frame => {
        wsMessages.push(`[WS RECV] ${frame.payload?.toString().substring(0, 100)}`)
      })
      ws.on('framesent', frame => {
        wsMessages.push(`[WS SENT] ${frame.payload?.toString().substring(0, 100)}`)
      })
      ws.on('close', () => {
        console.log('WebSocket closed')
      })
    })

    await page.goto('/create')
    await page.waitForTimeout(3000)

    console.log('\n=== WebSocket Activity ===')
    if (wsMessages.length === 0) {
      console.log('No WebSocket messages captured')
    } else {
      wsMessages.forEach(msg => console.log(msg))
    }

    expect(true).toBe(true)
  })
})

// Test using CUSTOM fixtures (same as smoke tests)
fixtureTest.describe('Headless Diagnostic - Custom Fixtures', () => {
  fixtureTest('test with createAgentWithTools fixture', async ({ page, createAgentWithTools }) => {
    console.log('\n=== TESTING WITH CUSTOM FIXTURES ===\n')

    // Add console capture
    page.on('console', (msg) => {
      console.log(`[BROWSER ${msg.type()}] ${msg.text()}`)
    })
    page.on('pageerror', (error) => {
      console.log(`[PAGE ERROR] ${error.message}`)
    })

    console.log('About to call createAgentWithTools...')

    try {
      const agent = await createAgentWithTools([TOOL_IDS.calculator])
      console.log(`Agent created successfully: ${agent.id}`)
      expect(agent.id).toBeTruthy()
    } catch (error) {
      console.log(`createAgentWithTools failed: ${error}`)
      // Take screenshot on failure
      await page.screenshot({ path: 'test-results/diagnostic-fixture-failure.png' })
      throw error
    }
  })

  fixtureTest('simple page navigation with fixture', async ({ page }) => {
    console.log('\n=== SIMPLE NAVIGATION WITH FIXTURE PAGE ===\n')

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log(`[BROWSER ERROR] ${msg.text()}`)
      }
    })

    console.log('Navigating to /create...')
    await page.goto('/create')

    console.log('Waiting for networkidle...')
    await page.waitForLoadState('networkidle')

    // Check what's on the page
    const rootContent = await page.locator('#root').innerHTML().catch(() => 'FAILED')
    console.log(`Root content length: ${rootContent.length}`)
    console.log(`Root content preview: ${rootContent.substring(0, 200)}`)

    // Try to find elements
    const nameInput = await page.locator('[data-tour="agent-name"]').count()
    console.log(`Name input count: ${nameInput}`)

    await page.screenshot({ path: 'test-results/diagnostic-fixture-simple.png' })

    expect(nameInput).toBeGreaterThan(0)
  })
})
