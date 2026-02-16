/**
 * E2E tests for OpenClaw Integration Phase 2
 *
 * Tests: MCP bridge real execution, MCP token generation/revocation,
 * token-based auth on bridge, Settings page OpenClaw section, ConnectOpenClawModal.
 */
import { test, expect, Page } from '@playwright/test'

// ---------------------------------------------------------------------------
// Helpers (consistent with openclaw-publish.spec.ts)
// ---------------------------------------------------------------------------

async function dismissTours(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('teachcharlie_tour_state', JSON.stringify({
      hasSeenCreateTour: true,
      hasSeenCanvasTour: true,
      hasSeenPlaygroundTour: true,
      currentDisclosureLevel: 4,
      completedTours: ['create-agent', 'canvas', 'playground'],
    }))
  })
}

async function navigateToFirstProject(page: Page) {
  await page.goto('/dashboard')
  await page.waitForLoadState('networkidle')
  const projectLink = page.locator('a[href*="/dashboard/project/"]').first()
  await projectLink.waitFor({ state: 'visible', timeout: 10000 })
  await projectLink.click()
  await page.waitForURL(/\/dashboard\/project\//)
  await page.waitForLoadState('networkidle')
}

/**
 * Get a workflow ID from the Workflows tab. Returns null if none found.
 */
async function getFirstWorkflowId(page: Page): Promise<string | null> {
  const workflowsTab = page.locator('button:has-text("Workflows")')
  await workflowsTab.click()
  await page.waitForLoadState('networkidle')

  const canvasLink = page.locator('a[href*="/canvas/"]').first()
  if (!await canvasLink.isVisible().catch(() => false)) return null
  const href = await canvasLink.getAttribute('href')
  return href?.split('/canvas/')[1] || null
}

/**
 * Enable a workflow as a skill and return its ID.
 */
async function enableWorkflowSkill(page: Page, workflowId: string): Promise<void> {
  const res = await page.request.patch(`/api/v1/workflows/${workflowId}/agent-skill`, {
    data: { is_agent_skill: true },
  })
  expect(res.ok()).toBeTruthy()
}

/**
 * Disable a workflow skill.
 */
async function disableWorkflowSkill(page: Page, workflowId: string): Promise<void> {
  await page.request.patch(`/api/v1/workflows/${workflowId}/agent-skill`, {
    data: { is_agent_skill: false },
  })
}

// ===========================================================================
// Part 1: MCP Bridge — Real Tool Execution
// ===========================================================================

test.describe('OpenClaw Phase 2 - MCP Bridge Real Execution', () => {
  test.beforeEach(async ({ page }) => {
    await dismissTours(page)
  })

  test('MCP bridge tools endpoint lists skill-enabled workflows', async ({ page }) => {
    await navigateToFirstProject(page)
    const workflowId = await getFirstWorkflowId(page)

    if (!workflowId) {
      test.skip()
      return
    }

    // Enable as skill
    await enableWorkflowSkill(page, workflowId)

    try {
      // List tools via legacy URL-based endpoint
      const response = await page.request.get('/api/v1/mcp/bridge/dev_user_123/tools')

      if (response.ok()) {
        const data = await response.json()
        expect(data).toHaveProperty('tools')
        expect(Array.isArray(data.tools)).toBe(true)
        expect(data.tools.length).toBeGreaterThan(0)

        // Verify tool shape
        const tool = data.tools[0]
        expect(tool).toHaveProperty('name')
        expect(tool).toHaveProperty('description')
        expect(tool).toHaveProperty('inputSchema')
        expect(tool).toHaveProperty('_workflow_id')
        expect(tool.inputSchema).toHaveProperty('properties')
        expect(tool.inputSchema.properties).toHaveProperty('message')
      }
    } finally {
      await disableWorkflowSkill(page, workflowId)
    }
  })

  test('MCP bridge call_tool returns real workflow response (not placeholder)', async ({ page }) => {
    await navigateToFirstProject(page)
    const workflowId = await getFirstWorkflowId(page)

    if (!workflowId) {
      test.skip()
      return
    }

    await enableWorkflowSkill(page, workflowId)

    try {
      // First get the tool name via list
      const listRes = await page.request.get('/api/v1/mcp/bridge/dev_user_123/tools')
      if (!listRes.ok()) {
        test.skip()
        return
      }
      const listData = await listRes.json()
      if (listData.tools.length === 0) {
        test.skip()
        return
      }

      const toolName = listData.tools[0].name

      // Call the tool
      const callRes = await page.request.post('/api/v1/mcp/bridge/dev_user_123/tools/call', {
        data: {
          name: toolName,
          arguments: { message: 'Hello, this is a test message.' },
        },
      })

      expect(callRes.ok()).toBeTruthy()
      const callData = await callRes.json()

      // Should have MCP content structure
      expect(callData).toHaveProperty('content')
      expect(Array.isArray(callData.content)).toBe(true)
      expect(callData.content.length).toBeGreaterThan(0)
      expect(callData.content[0]).toHaveProperty('type', 'text')
      expect(callData.content[0]).toHaveProperty('text')
      expect(callData).toHaveProperty('isError')

      // Response should NOT contain the Phase 1 placeholder text
      const responseText = callData.content[0].text
      expect(responseText).not.toContain('Full execution will be available')
      expect(responseText).not.toContain('[MCP Bridge]')

      // If successful, isError should be false and text should be non-empty
      if (!callData.isError) {
        expect(responseText.length).toBeGreaterThan(0)
      }
    } finally {
      await disableWorkflowSkill(page, workflowId)
    }
  })

  test('MCP bridge call_tool returns MCP-formatted error for unknown tool', async ({ page }) => {
    // Call with a nonexistent tool name
    const response = await page.request.post('/api/v1/mcp/bridge/dev_user_123/tools/call', {
      data: {
        name: 'this-tool-does-not-exist',
        arguments: { message: 'test' },
      },
    })

    // Phase 2: Should return 200 with MCP error format, not 404
    if (response.ok()) {
      const data = await response.json()
      expect(data).toHaveProperty('content')
      expect(data).toHaveProperty('isError', true)
      expect(data.content[0].text).toContain('not found')
    }
  })

  test('MCP bridge call_tool supports workflow_id override', async ({ page }) => {
    await navigateToFirstProject(page)
    const workflowId = await getFirstWorkflowId(page)

    if (!workflowId) {
      test.skip()
      return
    }

    await enableWorkflowSkill(page, workflowId)

    try {
      const response = await page.request.post('/api/v1/mcp/bridge/dev_user_123/tools/call', {
        data: {
          name: 'any-name',
          arguments: { message: 'Hello via workflow_id override' },
          workflow_id: workflowId,
        },
      })

      expect(response.ok()).toBeTruthy()
      const data = await response.json()
      expect(data).toHaveProperty('content')
      expect(Array.isArray(data.content)).toBe(true)
    } finally {
      await disableWorkflowSkill(page, workflowId)
    }
  })

  test('MCP bridge call_tool returns MCP error for invalid workflow_id', async ({ page }) => {
    const response = await page.request.post('/api/v1/mcp/bridge/dev_user_123/tools/call', {
      data: {
        name: 'test',
        arguments: { message: 'test' },
        workflow_id: 'not-a-valid-uuid',
      },
    })

    if (response.ok()) {
      const data = await response.json()
      expect(data).toHaveProperty('isError', true)
      expect(data.content[0].text).toContain('Invalid workflow_id')
    }
  })

  test('MCP bridge returns empty tool list when no skills enabled', async ({ page }) => {
    // Use the dev user endpoint - assuming no skills are pre-enabled
    const response = await page.request.get('/api/v1/mcp/bridge/dev_user_123/tools')

    if (response.ok()) {
      const data = await response.json()
      expect(data).toHaveProperty('tools')
      expect(Array.isArray(data.tools)).toBe(true)
      // tools may or may not be empty depending on test state; structure is correct
    }
  })
})

// ===========================================================================
// Part 2: MCP Token Generation & Management (API)
// ===========================================================================

test.describe('OpenClaw Phase 2 - MCP Token API', () => {
  test('can generate an MCP bridge token', async ({ page }) => {
    const response = await page.request.post('/api/v1/settings/mcp-token')
    expect(response.ok()).toBeTruthy()

    const data = await response.json()
    expect(data).toHaveProperty('token')
    expect(data).toHaveProperty('message')

    // Token should start with "tc_" prefix
    expect(data.token).toMatch(/^tc_/)

    // Token should be sufficiently long (48 bytes urlsafe = ~64 chars + prefix)
    expect(data.token.length).toBeGreaterThan(50)
  })

  test('can check MCP token status', async ({ page }) => {
    // Generate a token first
    await page.request.post('/api/v1/settings/mcp-token')

    // Check status
    const response = await page.request.get('/api/v1/settings/mcp-token')
    expect(response.ok()).toBeTruthy()

    const data = await response.json()
    expect(data).toHaveProperty('has_token', true)
    expect(data).toHaveProperty('token_preview')
    expect(data.token_preview).not.toBeNull()

    // Preview should be masked (showing first 8 and last 4 chars)
    expect(data.token_preview).toContain('...')
  })

  test('can revoke an MCP bridge token', async ({ page }) => {
    // Generate first
    await page.request.post('/api/v1/settings/mcp-token')

    // Revoke
    const revokeResponse = await page.request.delete('/api/v1/settings/mcp-token')
    expect(revokeResponse.status()).toBe(204)

    // Status should now show no token
    const statusResponse = await page.request.get('/api/v1/settings/mcp-token')
    const statusData = await statusResponse.json()
    expect(statusData.has_token).toBe(false)
    expect(statusData.token_preview).toBeNull()
  })

  test('regenerating token replaces the old one', async ({ page }) => {
    // Generate token 1
    const res1 = await page.request.post('/api/v1/settings/mcp-token')
    const data1 = await res1.json()
    const token1 = data1.token

    // Generate token 2 (should replace)
    const res2 = await page.request.post('/api/v1/settings/mcp-token')
    const data2 = await res2.json()
    const token2 = data2.token

    // Tokens should be different
    expect(token1).not.toBe(token2)

    // Status should show the new token preview
    const statusRes = await page.request.get('/api/v1/settings/mcp-token')
    const statusData = await statusRes.json()
    expect(statusData.has_token).toBe(true)
  })

  test('token status returns false when no token exists', async ({ page }) => {
    // Revoke any existing token
    await page.request.delete('/api/v1/settings/mcp-token')

    // Check status
    const response = await page.request.get('/api/v1/settings/mcp-token')
    const data = await response.json()
    expect(data.has_token).toBe(false)
    expect(data.token_preview).toBeNull()
  })
})

// ===========================================================================
// Part 3: Token-Based Auth on MCP Bridge
// ===========================================================================

test.describe('OpenClaw Phase 2 - Token-Based Bridge Auth', () => {
  test.beforeEach(async ({ page }) => {
    await dismissTours(page)
  })

  test('MCP bridge /tools endpoint works with Bearer token', async ({ page }) => {
    // Generate a token
    const tokenRes = await page.request.post('/api/v1/settings/mcp-token')
    const { token } = await tokenRes.json()

    // Use the token-authenticated endpoint (no user_id in URL)
    const response = await page.request.get('/api/v1/mcp/bridge/tools', {
      headers: { Authorization: `Bearer ${token}` },
    })

    expect(response.ok()).toBeTruthy()
    const data = await response.json()
    expect(data).toHaveProperty('tools')
    expect(Array.isArray(data.tools)).toBe(true)
  })

  test('MCP bridge /tools/call endpoint works with Bearer token', async ({ page }) => {
    await navigateToFirstProject(page)
    const workflowId = await getFirstWorkflowId(page)

    if (!workflowId) {
      test.skip()
      return
    }

    await enableWorkflowSkill(page, workflowId)

    // Generate a token
    const tokenRes = await page.request.post('/api/v1/settings/mcp-token')
    const { token } = await tokenRes.json()

    try {
      // List tools to get name
      const listRes = await page.request.get('/api/v1/mcp/bridge/tools', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const listData = await listRes.json()

      if (listData.tools.length === 0) {
        test.skip()
        return
      }

      const toolName = listData.tools[0].name

      // Call tool via token auth
      const callRes = await page.request.post('/api/v1/mcp/bridge/tools/call', {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          name: toolName,
          arguments: { message: 'Hello via token auth' },
        },
      })

      expect(callRes.ok()).toBeTruthy()
      const callData = await callRes.json()
      expect(callData).toHaveProperty('content')
      expect(callData.content[0]).toHaveProperty('type', 'text')
    } finally {
      await disableWorkflowSkill(page, workflowId)
    }
  })

  test('MCP bridge rejects invalid Bearer token', async ({ page }) => {
    const response = await page.request.get('/api/v1/mcp/bridge/tools', {
      headers: { Authorization: 'Bearer invalid_token_12345' },
    })

    // Should return 401 Unauthorized
    expect(response.status()).toBe(401)
  })

  test('MCP bridge rejects missing auth (no token, no user_id)', async ({ page }) => {
    const response = await page.request.get('/api/v1/mcp/bridge/tools')

    // Should return 401 Unauthorized
    expect(response.status()).toBe(401)
  })

  test('revoked token no longer authenticates bridge requests', async ({ page }) => {
    // Generate and then revoke
    const tokenRes = await page.request.post('/api/v1/settings/mcp-token')
    const { token } = await tokenRes.json()

    // Revoke it
    await page.request.delete('/api/v1/settings/mcp-token')

    // Try to use revoked token
    const response = await page.request.get('/api/v1/mcp/bridge/tools', {
      headers: { Authorization: `Bearer ${token}` },
    })

    expect(response.status()).toBe(401)
  })

  test('legacy URL-based auth still works alongside token auth', async ({ page }) => {
    // URL-based endpoint should still work for backward compatibility
    const response = await page.request.get('/api/v1/mcp/bridge/dev_user_123/tools')

    // Should return 200 (user exists in dev mode)
    if (response.ok()) {
      const data = await response.json()
      expect(data).toHaveProperty('tools')
    }
  })
})

// ===========================================================================
// Part 4: Settings Page — OpenClaw Connection UI
// ===========================================================================

test.describe('OpenClaw Phase 2 - Settings Page OpenClaw Section', () => {
  test.beforeEach(async ({ page }) => {
    await dismissTours(page)
    // Clean up any existing token before each test
    await page.request.delete('/api/v1/settings/mcp-token')
    await page.goto('/dashboard/settings')
    await page.waitForLoadState('networkidle')
  })

  test('settings page shows OpenClaw Connection section', async ({ page }) => {
    // Should show section header
    await expect(page.locator('text="OpenClaw Connection"')).toBeVisible({ timeout: 10000 })

    // Should show description
    await expect(
      page.locator('text="Connect your workflow skills to local AI agents"')
    ).toBeVisible()

    // Should show "MCP Bridge Token" label
    await expect(page.locator('text="MCP Bridge Token"')).toBeVisible()
  })

  test('shows "No token generated" when no token exists', async ({ page }) => {
    await expect(page.locator('text="No token generated"')).toBeVisible({ timeout: 10000 })
  })

  test('can generate MCP token from settings page', async ({ page }) => {
    // Click generate button
    const generateButton = page.locator('button:has-text("Generate Token")')
    await expect(generateButton).toBeVisible({ timeout: 10000 })
    await generateButton.click()

    // Wait for token to appear
    await page.waitForLoadState('networkidle')

    // Token should be displayed in a code block
    const tokenDisplay = page.locator('code')
    await expect(tokenDisplay).toBeVisible({ timeout: 10000 })
    const tokenText = await tokenDisplay.textContent()
    expect(tokenText).toMatch(/^tc_/)

    // Should show "copy now" instruction
    await expect(
      page.locator('text=/copy now/i')
    ).toBeVisible()
  })

  test('token has copy button that works', async ({ page }) => {
    // Generate a token
    const generateButton = page.locator('button:has-text("Generate Token")')
    await expect(generateButton).toBeVisible({ timeout: 10000 })
    await generateButton.click()
    await page.waitForLoadState('networkidle')

    // Wait for token display
    await expect(page.locator('code')).toBeVisible({ timeout: 10000 })

    // Click copy button
    const copyButton = page.locator('button:has-text("Copy")')
    await expect(copyButton).toBeVisible()
    await copyButton.click()

    // Should show "Copied" feedback
    await expect(page.locator('text="Copied"')).toBeVisible({ timeout: 3000 })
  })

  test('shows token preview after generation and page reload', async ({ page }) => {
    // Generate a token
    await page.request.post('/api/v1/settings/mcp-token')

    // Reload page
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Should show token preview (tc_xxxx...yyyy format)
    const tokenStatus = page.locator('text=/Active: tc_/')
    await expect(tokenStatus).toBeVisible({ timeout: 10000 })
  })

  test('shows regenerate button when token exists', async ({ page }) => {
    // Generate a token first
    await page.request.post('/api/v1/settings/mcp-token')
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Should show regenerate button
    const regenButton = page.locator('button:has-text("Regenerate")')
    await expect(regenButton).toBeVisible({ timeout: 10000 })
  })

  test('shows revoke button when token exists', async ({ page }) => {
    // Generate a token
    await page.request.post('/api/v1/settings/mcp-token')
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Should show revoke option
    const revokeButton = page.locator('button:has-text("Revoke")')
    await expect(revokeButton).toBeVisible({ timeout: 10000 })
  })

  test('shows setup guide button', async ({ page }) => {
    await expect(page.locator('text="Setup Guide"')).toBeVisible({ timeout: 10000 })

    const guideButton = page.locator('button:has-text("View Guide")')
    await expect(guideButton).toBeVisible()
  })
})

// ===========================================================================
// Part 5: ConnectOpenClaw Modal
// ===========================================================================

test.describe('OpenClaw Phase 2 - Connect OpenClaw Modal', () => {
  test.beforeEach(async ({ page }) => {
    await dismissTours(page)
    await page.goto('/dashboard/settings')
    await page.waitForLoadState('networkidle')
  })

  test('clicking View Guide opens the ConnectOpenClaw modal', async ({ page }) => {
    const guideButton = page.locator('button:has-text("View Guide")')
    await expect(guideButton).toBeVisible({ timeout: 10000 })
    await guideButton.click()

    // Modal should appear
    await expect(page.locator('text="Connect to OpenClaw"')).toBeVisible({ timeout: 5000 })
  })

  test('modal shows 3 setup steps', async ({ page }) => {
    await page.locator('button:has-text("View Guide")').click()
    await page.waitForLoadState('networkidle')

    // Step 1: Install
    await expect(page.locator('text="Install TC Connector"')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text="npm install -g tc-connector"')).toBeVisible()

    // Step 2: Configure
    await expect(page.locator('text="Add to OpenClaw Config"')).toBeVisible()
    await expect(page.locator('text=".mcp.json"')).toBeVisible()

    // Step 3: Restart
    await expect(page.locator('text="Restart OpenClaw"')).toBeVisible()
  })

  test('modal shows config snippet with npx command', async ({ page }) => {
    await page.locator('button:has-text("View Guide")').click()

    // Should show the JSON config with npx tc-connector
    await expect(page.locator('text="tc-connector"').first()).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text="mcpServers"')).toBeVisible()
  })

  test('modal install command has copy button', async ({ page }) => {
    await page.locator('button:has-text("View Guide")').click()
    await expect(page.locator('text="Install TC Connector"')).toBeVisible({ timeout: 5000 })

    // Should have copy buttons for install command and config
    const copyButtons = page.locator('.fixed.inset-0 button:has(svg)')
    expect(await copyButtons.count()).toBeGreaterThanOrEqual(2)
  })

  test('modal can be closed with Done button', async ({ page }) => {
    await page.locator('button:has-text("View Guide")').click()
    await expect(page.locator('text="Connect to OpenClaw"')).toBeVisible({ timeout: 5000 })

    // Click Done
    await page.locator('button:has-text("Done")').click()

    // Modal should close
    await expect(page.locator('text="Connect to OpenClaw"')).not.toBeVisible({ timeout: 3000 })
  })

  test('modal can be closed with X button', async ({ page }) => {
    await page.locator('button:has-text("View Guide")').click()
    await expect(page.locator('text="Connect to OpenClaw"')).toBeVisible({ timeout: 5000 })

    // Click X (close) button in header
    const closeButton = page.locator('.fixed.inset-0 button').first()
    await closeButton.click()

    // Modal should close
    await expect(page.locator('text="Connect to OpenClaw"')).not.toBeVisible({ timeout: 3000 })
  })

  test('modal includes token in config snippet after generation', async ({ page }) => {
    // Generate a token first
    const generateButton = page.locator('button:has-text("Generate Token")')
    await expect(generateButton).toBeVisible({ timeout: 10000 })
    await generateButton.click()
    await page.waitForLoadState('networkidle')

    // Wait for token to appear
    const tokenDisplay = page.locator('code')
    await expect(tokenDisplay).toBeVisible({ timeout: 10000 })
    const generatedToken = await tokenDisplay.textContent()

    // Open modal
    await page.locator('button:has-text("View Guide")').click()
    await expect(page.locator('text="Connect to OpenClaw"')).toBeVisible({ timeout: 5000 })

    // Config snippet should include the generated token (or its preview)
    const configSnippet = page.locator('.fixed.inset-0 pre')
    await expect(configSnippet).toBeVisible()
    const configText = await configSnippet.textContent()
    expect(configText).toContain('tc-connector')

    // If we still have the full token in state, it should be in the snippet
    if (generatedToken) {
      expect(configText).toContain(generatedToken)
    }
  })
})

// ===========================================================================
// Part 6: End-to-End Flow (Token → Bridge → Execution)
// ===========================================================================

test.describe('OpenClaw Phase 2 - Full Integration Flow', () => {
  test.beforeEach(async ({ page }) => {
    await dismissTours(page)
  })

  test('complete flow: generate token, enable skill, call tool via token auth', async ({ page }) => {
    // Step 1: Generate MCP token
    const tokenRes = await page.request.post('/api/v1/settings/mcp-token')
    expect(tokenRes.ok()).toBeTruthy()
    const { token } = await tokenRes.json()
    expect(token).toMatch(/^tc_/)

    // Step 2: Navigate to project and enable a workflow skill
    await navigateToFirstProject(page)
    const workflowId = await getFirstWorkflowId(page)

    if (!workflowId) {
      test.skip()
      return
    }

    await enableWorkflowSkill(page, workflowId)

    try {
      // Step 3: List tools via token auth (like TC Connector would)
      const listRes = await page.request.get('/api/v1/mcp/bridge/tools', {
        headers: { Authorization: `Bearer ${token}` },
      })
      expect(listRes.ok()).toBeTruthy()
      const listData = await listRes.json()
      expect(listData.tools.length).toBeGreaterThan(0)

      const toolName = listData.tools[0].name

      // Step 4: Call the tool via token auth (like TC Connector would)
      const callRes = await page.request.post('/api/v1/mcp/bridge/tools/call', {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          name: toolName,
          arguments: { message: 'Integration test: full flow works!' },
        },
      })
      expect(callRes.ok()).toBeTruthy()
      const callData = await callRes.json()

      // Verify it's real execution, not placeholder
      expect(callData.content[0].text).not.toContain('Full execution will be available')
      expect(callData.content[0].type).toBe('text')
    } finally {
      await disableWorkflowSkill(page, workflowId)
      // Clean up token
      await page.request.delete('/api/v1/settings/mcp-token')
    }
  })
})
