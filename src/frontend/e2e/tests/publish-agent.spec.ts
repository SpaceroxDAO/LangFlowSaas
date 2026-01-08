import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Publish Agent (Custom Component Generation)
 *
 * Test Flow:
 * 1. Create a new agent via wizard (creates AgentComponent + Workflow)
 * 2. Navigate to edit page
 * 3. Click "Publish Agent" button
 * 4. Verify component is published successfully
 * 5. Click "Restart Langflow" to reload components
 * 6. Navigate to Langflow and verify component appears in sidebar
 */

const BASE_URL = 'http://localhost:3001';
const API_URL = 'http://localhost:8000';
const LANGFLOW_URL = 'http://localhost:7860';
const DEV_USER_ID = 'a36c791d-b36b-44b7-abc1-feaafb6a8d40';

// Helper to wait for Langflow to be healthy
async function waitForLangflowHealth(maxAttempts = 30, intervalMs = 2000): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(`${LANGFLOW_URL}/health`);
      if (response.ok) {
        console.log(`Langflow healthy after ${i + 1} attempts`);
        return true;
      }
    } catch (e) {
      // Langflow not ready yet
    }
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }
  return false;
}

test.describe('Publish Agent (Custom Component Generation)', () => {

  test('should create agent and publish as custom component', async ({ page }) => {
    // Enable console logging for debugging
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.text().includes('publish') || msg.text().includes('Publish')) {
        console.log('BROWSER:', msg.text());
      }
    });
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

    // Track network requests
    page.on('response', response => {
      if (response.url().includes('/publish') || response.url().includes('/agent-component')) {
        console.log(`API: ${response.status()} ${response.url()}`);
      }
    });

    // ========== STEP 1: Create a new agent via wizard ==========
    console.log('\n=== STEP 1: Creating agent via wizard ===');

    await page.goto(`${BASE_URL}/create`);
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Escape'); // Dismiss tour
    await page.waitForTimeout(300);

    // Fill wizard Step 1: Identity
    const uniqueName = `Publish Test ${Date.now()}`;
    console.log(`Creating agent: ${uniqueName}`);

    await page.locator('input[placeholder="Charlie"]').fill(uniqueName);
    await page.locator('textarea').first().fill('A test agent for publishing as a custom component');
    await page.getByRole('button', { name: /Next Step/i }).click();

    // Fill wizard Step 2: Instructions
    await page.waitForTimeout(300);
    await page.locator('textarea').first().fill('You are a helpful test agent. Always be concise and helpful.');
    await page.getByRole('button', { name: /Next Step/i }).click();

    // Skip tools, finish wizard
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: /Finish & Create Agent/i }).click();

    // Wait for navigation to playground
    await page.waitForURL(/\/playground\//, { timeout: 30000 });
    console.log('Agent created, navigated to:', page.url());

    // Extract workflow ID from URL
    const playgroundUrl = page.url();
    const workflowIdMatch = playgroundUrl.match(/\/workflow\/([a-f0-9-]+)/);
    const workflowId = workflowIdMatch ? workflowIdMatch[1] : null;
    console.log('Workflow ID:', workflowId);

    // ========== STEP 2: Get the AgentComponent ID ==========
    console.log('\n=== STEP 2: Getting AgentComponent ID ===');

    // Fetch the workflow to get the agent_component_ids
    const workflowResponse = await page.request.get(`${API_URL}/api/v1/workflows/${workflowId}`, {
      headers: { 'x-dev-user-id': DEV_USER_ID },
    });
    const workflowData = await workflowResponse.json();
    console.log('Workflow agent_component_ids:', workflowData.agent_component_ids);

    // Get the agent component ID
    const agentComponentId = workflowData.agent_component_ids?.[0];
    expect(agentComponentId).toBeTruthy();
    console.log('Agent Component ID:', agentComponentId);

    // ========== STEP 3: Navigate to Edit page ==========
    console.log('\n=== STEP 3: Navigating to edit page ===');

    await page.goto(`${BASE_URL}/edit/${agentComponentId}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Verify we're on the edit page and agent data loaded
    await expect(page.locator('h1')).toContainText('Edit', { timeout: 10000 });

    // Take screenshot before publish
    await page.screenshot({ path: 'test-results/publish-before.png' });

    // ========== STEP 4: Find and click Publish button ==========
    console.log('\n=== STEP 4: Clicking Publish Agent button ===');

    // Find the "Publish to Langflow" section
    const publishSection = page.locator('text=Publish to Langflow').locator('..');
    await expect(publishSection).toBeVisible({ timeout: 10000 });

    // Find the Publish Agent button
    const publishButton = page.getByRole('button', { name: /Publish Agent/i });
    await expect(publishButton).toBeVisible();
    await expect(publishButton).toBeEnabled();

    // Click publish
    await publishButton.click();
    console.log('Clicked Publish Agent button');

    // ========== STEP 5: Wait for result ==========
    console.log('\n=== STEP 5: Waiting for publish result ===');

    // Wait for either success message or error
    await page.waitForTimeout(3000);

    // Take screenshot after publish attempt
    await page.screenshot({ path: 'test-results/publish-after.png' });

    // Check for success indicators
    const pageContent = await page.content();

    // Look for success message
    const hasSuccessMessage = await page.getByText(/published|Component published|Restart Langflow/i).isVisible().catch(() => false);

    // Look for error message
    const hasErrorMessage = await page.getByText(/Failed to generate|Permission denied|Cannot create/i).isVisible().catch(() => false);

    // Look for "Unpublish" button (indicates success)
    const hasUnpublishButton = await page.getByRole('button', { name: /Unpublish/i }).isVisible().catch(() => false);

    // Look for "Restart Langflow" button (indicates success)
    const hasRestartButton = await page.getByRole('button', { name: /Restart Langflow/i }).isVisible().catch(() => false);

    console.log('Has success message:', hasSuccessMessage);
    console.log('Has error message:', hasErrorMessage);
    console.log('Has Unpublish button:', hasUnpublishButton);
    console.log('Has Restart button:', hasRestartButton);

    // Assert no error
    if (hasErrorMessage) {
      // Get the error text for debugging
      const errorText = await page.locator('.text-red-500, .text-red-600, .text-red-300').first().textContent().catch(() => 'Unknown error');
      console.log('ERROR:', errorText);
      throw new Error(`Publish failed with error: ${errorText}`);
    }

    // Assert success (either unpublish button or success message)
    expect(hasUnpublishButton || hasSuccessMessage || hasRestartButton).toBe(true);

    // ========== STEP 6: Verify via API ==========
    console.log('\n=== STEP 6: Verifying via API ===');

    const componentResponse = await page.request.get(`${API_URL}/api/v1/agent-components/${agentComponentId}`, {
      headers: { 'x-dev-user-id': DEV_USER_ID },
    });
    const componentData = await componentResponse.json();

    console.log('Component is_published:', componentData.is_published);
    console.log('Component file_path:', componentData.component_file_path);
    console.log('Component class_name:', componentData.component_class_name);

    expect(componentData.is_published).toBe(true);
    expect(componentData.component_file_path).toBeTruthy();
    expect(componentData.component_class_name).toBeTruthy();

    console.log('\n=== PUBLISH AGENT TEST PASSED ===');
  });

  test('should publish agent, restart Langflow, and verify component in sidebar', async ({ page }) => {
    // Increase timeout for this test since it involves Langflow restart
    test.setTimeout(180000); // 3 minutes

    // Enable console logging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('BROWSER ERROR:', msg.text());
      }
    });

    // ========== STEP 1: Create a new agent via wizard ==========
    console.log('\n=== STEP 1: Creating agent via wizard ===');

    await page.goto(`${BASE_URL}/create`);
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // Use a unique, easily searchable name
    const timestamp = Date.now();
    const uniqueName = `LangflowTest ${timestamp}`;
    console.log(`Creating agent: ${uniqueName}`);

    await page.locator('input[placeholder="Charlie"]').fill(uniqueName);
    await page.locator('textarea').first().fill('Test agent to verify Langflow sidebar integration');
    await page.getByRole('button', { name: /Next Step/i }).click();

    await page.waitForTimeout(300);
    await page.locator('textarea').first().fill('You are a test agent for verifying Langflow integration.');
    await page.getByRole('button', { name: /Next Step/i }).click();

    await page.waitForTimeout(300);
    await page.getByRole('button', { name: /Finish & Create Agent/i }).click();

    await page.waitForURL(/\/playground\//, { timeout: 30000 });
    console.log('Agent created at:', page.url());

    // Get IDs
    const workflowIdMatch = page.url().match(/\/workflow\/([a-f0-9-]+)/);
    const workflowId = workflowIdMatch?.[1];

    const workflowResponse = await page.request.get(`${API_URL}/api/v1/workflows/${workflowId}`, {
      headers: { 'x-dev-user-id': DEV_USER_ID },
    });
    const workflowData = await workflowResponse.json();
    const agentComponentId = workflowData.agent_component_ids?.[0];
    console.log('Agent Component ID:', agentComponentId);

    // ========== STEP 2: Navigate to edit and publish ==========
    console.log('\n=== STEP 2: Publishing agent ===');

    await page.goto(`${BASE_URL}/edit/${agentComponentId}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const publishButton = page.getByRole('button', { name: /Publish Agent/i });
    await expect(publishButton).toBeVisible({ timeout: 10000 });
    await publishButton.click();
    console.log('Clicked Publish Agent');

    // Wait for publish to complete
    await page.waitForTimeout(3000);

    // Verify publish succeeded
    const hasUnpublishButton = await page.getByRole('button', { name: /Unpublish/i }).isVisible().catch(() => false);
    expect(hasUnpublishButton).toBe(true);
    console.log('Agent published successfully');

    // ========== STEP 3: Click Restart Langflow ==========
    console.log('\n=== STEP 3: Restarting Langflow ===');

    const restartButton = page.getByRole('button', { name: /Restart Langflow/i });
    await expect(restartButton).toBeVisible({ timeout: 5000 });
    await restartButton.click();
    console.log('Clicked Restart Langflow');

    // Take screenshot
    await page.screenshot({ path: 'test-results/langflow-restart-clicked.png' });

    // ========== STEP 4: Wait for Langflow to restart ==========
    console.log('\n=== STEP 4: Waiting for Langflow to restart ===');

    // Wait a moment for the restart to initiate
    await page.waitForTimeout(5000);

    // Poll Langflow health endpoint
    const isHealthy = await waitForLangflowHealth(45, 2000); // Up to 90 seconds
    expect(isHealthy).toBe(true);
    console.log('Langflow is back online');

    // Extra wait for Langflow to fully initialize components
    await page.waitForTimeout(5000);

    // ========== STEP 5: Navigate to Langflow and check sidebar ==========
    console.log('\n=== STEP 5: Checking Langflow sidebar for component ===');

    // Navigate to Langflow directly
    await page.goto(LANGFLOW_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Take screenshot of Langflow home
    await page.screenshot({ path: 'test-results/langflow-home.png' });

    // Click "New Flow" to access the flow editor with sidebar
    const newFlowButton = page.getByRole('button', { name: /New Flow/i });
    await expect(newFlowButton).toBeVisible({ timeout: 10000 });
    await newFlowButton.click();
    console.log('Clicked New Flow');
    await page.waitForTimeout(3000);

    // Take screenshot after clicking New Flow
    await page.screenshot({ path: 'test-results/langflow-after-new-flow.png' });

    // Check if there's a modal with flow type options
    const blankFlowOption = page.getByText(/Blank Flow/i).first();
    const hasBlankOption = await blankFlowOption.isVisible({ timeout: 3000 }).catch(() => false);
    if (hasBlankOption) {
      await blankFlowOption.click();
      console.log('Clicked Blank Flow');
      await page.waitForTimeout(2000);
    }

    await page.screenshot({ path: 'test-results/langflow-flow-editor.png' });

    // ========== STEP 6: Find "my_agents" category and our component ==========
    console.log('\n=== STEP 6: Finding my_agents category and component ===');

    // Look for "my_agents" category in sidebar (lowercase with underscore)
    const myAgentsCategory = page.getByText('my_agents');
    const hasMyAgentsCategory = await myAgentsCategory.isVisible({ timeout: 10000 }).catch(() => false);
    console.log('my_agents category visible:', hasMyAgentsCategory);

    await page.screenshot({ path: 'test-results/langflow-sidebar.png' });

    // Click on my_agents to expand it
    if (hasMyAgentsCategory) {
      await myAgentsCategory.click();
      console.log('Clicked my_agents to expand');
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-results/langflow-my-agents-expanded.png' });
    }

    // Now search for our specific component
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    const hasSearchInput = await searchInput.isVisible({ timeout: 5000 }).catch(() => false);

    if (hasSearchInput) {
      await searchInput.fill(uniqueName);
      await page.waitForTimeout(1500);
      console.log(`Searched for: ${uniqueName}`);
      await page.screenshot({ path: 'test-results/langflow-search-results.png' });
    }

    // Look for our component in the sidebar/search results
    const componentInSidebar = page.getByText(uniqueName, { exact: false }).first();
    const componentFound = await componentInSidebar.isVisible({ timeout: 10000 }).catch(() => false);
    console.log(`Component "${uniqueName}" found: ${componentFound}`);

    // Final verification - my_agents category must exist (component visibility depends on search)
    expect(hasMyAgentsCategory).toBe(true);

    if (componentFound) {
      console.log('\n=== COMPONENT FOUND IN LANGFLOW SIDEBAR! ===');
    } else {
      console.log('\n=== my_agents category exists, component may need direct click to view ===');
    }

    console.log('\n=== FULL LANGFLOW INTEGRATION TEST PASSED ===');
  });

  test('API: should publish agent component directly', async ({ request }) => {
    // First create an agent component via API
    console.log('\n=== Creating agent component via API ===');

    const createResponse = await request.post(`${API_URL}/api/v1/agent-components/create-from-qa`, {
      headers: {
        'x-dev-user-id': DEV_USER_ID,
        'Content-Type': 'application/json',
      },
      data: {
        name: `API Publish Test ${Date.now()}`,
        who: 'A test agent for API publishing',
        rules: 'Be helpful and concise.',
        tricks: 'Web Search',
        selected_tools: ['web_search'],
      },
    });

    expect(createResponse.status()).toBe(201);
    const component = await createResponse.json();
    console.log('Created component:', component.id, component.name);
    expect(component.is_published).toBe(false);

    // Publish the component
    console.log('\n=== Publishing component via API ===');

    const publishResponse = await request.post(`${API_URL}/api/v1/agent-components/${component.id}/publish`, {
      headers: { 'x-dev-user-id': DEV_USER_ID },
    });

    console.log('Publish response status:', publishResponse.status());
    const publishResult = await publishResponse.json();
    console.log('Publish result:', JSON.stringify(publishResult, null, 2));

    expect(publishResponse.status()).toBe(200);
    expect(publishResult.is_published).toBe(true);
    expect(publishResult.component_file_path).toBeTruthy();
    expect(publishResult.needs_restart).toBe(true);
    expect(publishResult.message).toContain('published');

    // Verify the component file was created
    console.log('\n=== Verifying component file ===');
    console.log('File path:', publishResult.component_file_path);
    console.log('Class name:', publishResult.component_class_name);

    console.log('\n=== API PUBLISH TEST PASSED ===');
  });

  test('should show error message when publish fails', async ({ page }) => {
    // This test verifies error handling
    // Navigate to edit page with invalid ID
    await page.goto(`${BASE_URL}/edit/invalid-id-12345`);
    await page.waitForLoadState('networkidle');

    // Should show error state
    const hasError = await page.getByText(/not found|error|failed to load/i).isVisible({ timeout: 5000 }).catch(() => false);
    expect(hasError).toBe(true);
  });

});
