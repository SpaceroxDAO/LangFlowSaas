/**
 * Teach Charlie AI - Langflow Overlay Script
 *
 * Purpose: Replace Langflow branding with Teach Charlie dog logo
 * Flash is acceptable - replacement is the goal
 *
 * IMPORTANT: This script should NOT hide functional UI elements.
 */

(function() {
    'use strict';

    console.log("[TeachCharlie Overlay] White-label script initialized v46 - Added SaveMonitor for unsaved changes detection");

    // Dog icon SVG (from user's dog.svg file)
    const DOG_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.25 16.25h1.5L12 17z"/><path d="M16 14v.5"/><path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309"/><path d="M8 14v.5"/><path d="M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5"/></svg>`;

    // Track already-processed elements
    const processedElements = new WeakSet();

    // Debounce timer
    let debounceTimer = null;

    // =====================================================
    // REPLACE LANGFLOW LOGO WITH DOG ICON
    // =====================================================

    function replaceLangflowLogos() {
        document.querySelectorAll('svg[title="Langflow Logo"]').forEach(svg => {
            if (processedElements.has(svg)) return;

            const parent = svg.parentElement;
            if (!parent || parent.dataset.tcReplaced) return;

            // Hide the original SVG
            svg.style.display = 'none';

            // Create dog icon container
            const dogContainer = document.createElement('div');
            dogContainer.style.cssText = `
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                top: 0;
                left: 0;
                background: white;
                border-radius: 6px;
            `;
            dogContainer.innerHTML = DOG_SVG;

            // Style the inner SVG to fit
            const innerSvg = dogContainer.querySelector('svg');
            if (innerSvg) {
                innerSvg.style.width = '70%';
                innerSvg.style.height = '70%';
            }

            // Make parent position relative if needed
            const parentPosition = window.getComputedStyle(parent).position;
            if (parentPosition === 'static') {
                parent.style.position = 'relative';
            }

            parent.appendChild(dogContainer);
            parent.dataset.tcReplaced = 'true';
            processedElements.add(svg);

            console.log('[TeachCharlie] Replaced Langflow logo with dog icon');
        });
    }

    // =====================================================
    // REPLACE EMPTY STATE LOGO (large centered icon)
    // =====================================================

    function replaceEmptyStateLogo() {
        document.querySelectorAll('[role="dialog"]').forEach(dialog => {
            dialog.querySelectorAll('svg').forEach(svg => {
                if (processedElements.has(svg)) return;
                if (svg.getAttribute('title') === 'Langflow Logo') return;

                const rect = svg.getBoundingClientRect();
                if (rect.width < 40 || rect.height < 40) return;

                const parent = svg.parentElement;
                if (!parent) return;

                const nearbyText = parent.textContent || parent.parentElement?.textContent || '';
                if (!nearbyText.includes('New chat') && !nearbyText.includes('Test your flow')) return;

                // Replace with larger dog icon
                svg.style.display = 'none';
                processedElements.add(svg);

                const dogContainer = document.createElement('div');
                dogContainer.style.cssText = `
                    width: ${rect.width}px;
                    height: ${rect.height}px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;
                dogContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${rect.width}" height="${rect.height}" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.25 16.25h1.5L12 17z"/><path d="M16 14v.5"/><path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309"/><path d="M8 14v.5"/><path d="M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5"/></svg>`;

                parent.insertBefore(dogContainer, svg.nextSibling);
                console.log('[TeachCharlie] Replaced empty state logo with dog icon');
            });
        });
    }

    // =====================================================
    // HIDE TEXT BRANDING (GitHub, Discord, etc.)
    // =====================================================

    function hideTextBranding() {
        const brandingTexts = ['GitHub', 'Discord', 'Twitter'];
        document.querySelectorAll('a, button').forEach(el => {
            if (processedElements.has(el)) return;

            const text = (el.textContent || '').trim();
            if (brandingTexts.some(t => text.includes(t))) {
                const container = el.closest('li') || el;
                container.style.display = 'none';
                processedElements.add(el);
            }
        });
    }

    // =====================================================
    // MAIN FUNCTION
    // =====================================================

    function applyWhiteLabeling() {
        replaceLangflowLogos();
        replaceEmptyStateLogo();
        hideTextBranding();
    }

    // =====================================================
    // MODULE: COMPONENT FILTER (Mission Mode)
    // =====================================================

    const ComponentFilter = {
        // Map component names to Langflow sidebar category data-testid values
        // These map common component names to their sidebar category
        componentToCategory: {
            'ChatInput': 'inputs',
            'ChatOutput': 'outputs',
            'TextInput': 'inputs',
            'TextOutput': 'outputs',
            'Agent': 'agents',
            'OpenAIModel': 'models',
            'AnthropicModel': 'models',
            'GroqModel': 'models',
            'Memory': 'memories',
            'ConversationBufferMemory': 'memories',
            'Prompt': 'prompts',
            'PromptTemplate': 'prompts',
            'APIRequest': 'data',
            'WebScraper': 'data',
            'TextSplitter': 'processing',
            'Embeddings': 'embeddings',
            'VectorStore': 'vector stores',
        },

        // All possible sidebar categories (these may vary by Langflow version)
        allCategories: [
            'inputs', 'outputs', 'agents', 'models', 'memories', 'prompts',
            'data', 'processing', 'embeddings', 'vector stores', 'tools',
            'helpers', 'prototypes', 'bundles'
        ],

        enabled: false,
        allowedComponents: [],
        filterCssId: 'tc-component-filter-css',

        init() {
            const params = new URLSearchParams(window.location.search);
            const filter = params.get('filter_components');

            if (!filter) {
                console.log('[TeachCharlie] No component filter - standard mode');
                return;
            }

            this.enabled = true;
            this.allowedComponents = filter.split(',').map(c => c.trim());
            console.log('[TeachCharlie] Mission Mode - Allowed components:', this.allowedComponents);

            // Add body class for mission mode styling
            document.body.classList.add('tc-mission-mode');

            // Inject CSS to hide non-allowed categories
            this.injectFilterCSS();

            // Set up observer to hide specific components within categories
            this.setupComponentObserver();
        },

        injectFilterCSS() {
            // Determine which categories contain our allowed components
            const allowedCategories = new Set();
            for (const component of this.allowedComponents) {
                const category = this.componentToCategory[component];
                if (category) {
                    allowedCategories.add(category);
                }
            }

            console.log('[TeachCharlie] Allowed categories:', Array.from(allowedCategories));

            // Build CSS to hide non-allowed categories
            let css = '/* Mission Mode - Component Filter */\n';

            // Hide categories not in our allowed list
            for (const category of this.allCategories) {
                if (!allowedCategories.has(category)) {
                    // Try various selector patterns Langflow might use
                    css += `[data-testid="disclosure-${category}"] { display: none !important; }\n`;
                    css += `[data-testid="${category}-disclosure"] { display: none !important; }\n`;
                    // Also try button with text content
                    css += `button[data-testid*="${category}"] { display: none !important; }\n`;
                }
            }

            // Inject the stylesheet
            let styleEl = document.getElementById(this.filterCssId);
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = this.filterCssId;
                document.head.appendChild(styleEl);
            }
            styleEl.textContent = css;

            console.log('[TeachCharlie] Component filter CSS injected');
        },

        setupComponentObserver() {
            // Watch sidebar for individual components and hide non-allowed ones
            const observer = new MutationObserver(() => {
                this.hideNonAllowedComponents();
            });

            // Start observing once sidebar is present
            const checkSidebar = setInterval(() => {
                const sidebar = document.querySelector('[data-testid="sidebar"]') ||
                               document.querySelector('.sidebar') ||
                               document.querySelector('aside');
                if (sidebar) {
                    clearInterval(checkSidebar);
                    observer.observe(sidebar, { childList: true, subtree: true });
                    this.hideNonAllowedComponents();
                    console.log('[TeachCharlie] Sidebar observer started');
                }
            }, 500);

            // Timeout after 10 seconds
            setTimeout(() => clearInterval(checkSidebar), 10000);
        },

        hideNonAllowedComponents() {
            if (!this.enabled) return;

            // Find component items in the sidebar and hide non-allowed ones
            // This targets the individual draggable component items
            document.querySelectorAll('[data-testid*="sidebar-component"]').forEach(el => {
                const testId = el.getAttribute('data-testid') || '';
                const componentName = testId.replace('sidebar-component-', '').replace('sidebar-', '');

                // Check if this component is in our allowed list (case-insensitive)
                const isAllowed = this.allowedComponents.some(
                    allowed => componentName.toLowerCase().includes(allowed.toLowerCase()) ||
                              allowed.toLowerCase().includes(componentName.toLowerCase())
                );

                if (!isAllowed && !el.classList.contains('tc-filtered')) {
                    el.style.display = 'none';
                    el.classList.add('tc-filtered');
                }
            });
        }
    };

    // =====================================================
    // MODULE: FLOW MONITOR (Mission Mode)
    // =====================================================

    const FlowMonitor = {
        enabled: false,
        nodeCache: new Map(),
        edgeCache: new Map(),
        observer: null,

        init() {
            const params = new URLSearchParams(window.location.search);
            if (!params.get('filter_components')) {
                // Only activate in mission mode
                return;
            }

            this.enabled = true;
            console.log('[TeachCharlie] Flow Monitor - Initializing');

            this.waitForCanvas();
        },

        async waitForCanvas() {
            // Wait for React Flow canvas to be ready
            const checkCanvas = setInterval(() => {
                const nodesContainer = document.querySelector('.react-flow__nodes');
                const edgesContainer = document.querySelector('.react-flow__edges');

                if (nodesContainer && edgesContainer) {
                    clearInterval(checkCanvas);
                    this.setupNodeObserver(nodesContainer);
                    this.setupEdgeObserver(edgesContainer);
                    this.cacheInitialState();
                    console.log('[TeachCharlie] Flow Monitor - Canvas observers started');
                }
            }, 500);

            // Timeout after 15 seconds
            setTimeout(() => clearInterval(checkCanvas), 15000);
        },

        setupNodeObserver(container) {
            const observer = new MutationObserver(() => {
                requestAnimationFrame(() => this.detectNodeChanges());
            });

            observer.observe(container, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['data-id', 'class']
            });
        },

        setupEdgeObserver(container) {
            const observer = new MutationObserver(() => {
                requestAnimationFrame(() => this.detectEdgeChanges());
            });

            observer.observe(container, {
                childList: true,
                subtree: true
            });
        },

        cacheInitialState() {
            // Cache current nodes
            document.querySelectorAll('.react-flow__node').forEach(node => {
                const nodeId = node.getAttribute('data-id');
                if (nodeId) {
                    this.nodeCache.set(nodeId, this.extractNodeInfo(node));
                }
            });

            // Cache current edges
            document.querySelectorAll('.react-flow__edge').forEach(edge => {
                const edgeId = edge.getAttribute('data-id') || edge.id;
                if (edgeId) {
                    this.edgeCache.set(edgeId, true);
                }
            });

            console.log('[TeachCharlie] Initial state cached:', this.nodeCache.size, 'nodes,', this.edgeCache.size, 'edges');
        },

        extractNodeInfo(nodeElement) {
            // Try to extract node type from various attributes
            const dataId = nodeElement.getAttribute('data-id') || '';
            const classList = Array.from(nodeElement.classList);

            // Look for type in class names (Langflow adds type-based classes)
            let nodeType = 'unknown';
            for (const className of classList) {
                if (className.includes('type-') || className.includes('node-')) {
                    nodeType = className.replace('type-', '').replace('node-', '');
                    break;
                }
            }

            // Also check for data-type attribute
            const dataType = nodeElement.getAttribute('data-type');
            if (dataType) {
                nodeType = dataType;
            }

            // Try to find type from the node's header/title
            const titleEl = nodeElement.querySelector('[data-testid*="title"]') ||
                           nodeElement.querySelector('.node-title') ||
                           nodeElement.querySelector('h3, h4');
            if (titleEl && titleEl.textContent) {
                nodeType = titleEl.textContent.trim();
            }

            return { id: dataId, type: nodeType };
        },

        detectNodeChanges() {
            if (!this.enabled) return;

            const currentNodes = new Map();

            document.querySelectorAll('.react-flow__node').forEach(node => {
                const nodeId = node.getAttribute('data-id');
                if (nodeId) {
                    currentNodes.set(nodeId, this.extractNodeInfo(node));
                }
            });

            // Check for new nodes
            currentNodes.forEach((info, nodeId) => {
                if (!this.nodeCache.has(nodeId)) {
                    console.log('[TeachCharlie] Node added:', info);
                    this.emitEvent('node_added', {
                        node_id: nodeId,
                        node_type: info.type
                    });
                }
            });

            // Check for removed nodes
            this.nodeCache.forEach((info, nodeId) => {
                if (!currentNodes.has(nodeId)) {
                    console.log('[TeachCharlie] Node removed:', info);
                    this.emitEvent('node_removed', {
                        node_id: nodeId,
                        node_type: info.type
                    });
                }
            });

            // Update cache
            this.nodeCache = currentNodes;
        },

        detectEdgeChanges() {
            if (!this.enabled) return;

            const currentEdges = new Map();

            document.querySelectorAll('.react-flow__edge').forEach(edge => {
                const edgeId = edge.getAttribute('data-id') || edge.id;
                if (edgeId) {
                    currentEdges.set(edgeId, true);
                }
            });

            // Check for new edges
            currentEdges.forEach((_, edgeId) => {
                if (!this.edgeCache.has(edgeId)) {
                    console.log('[TeachCharlie] Edge created:', edgeId);
                    this.emitEvent('edge_created', {
                        edge_id: edgeId
                    });
                }
            });

            // Update cache
            this.edgeCache = currentEdges;
        },

        emitEvent(type, payload) {
            // Send event to parent window (MissionCanvasPage)
            if (window.parent !== window) {
                window.parent.postMessage({
                    source: 'langflow-overlay',
                    event: {
                        type: type,
                        timestamp: Date.now(),
                        ...payload
                    }
                }, '*');
                console.log('[TeachCharlie] Event emitted to parent:', type, payload);
            } else {
                console.log('[TeachCharlie] No parent window - event logged:', type, payload);
            }
        }
    };

    // =====================================================
    // MODULE: MISSION UI CONFIG (Hide Sidebar/Minimap)
    // =====================================================

    const MissionUI = {
        config: null,
        cssId: 'tc-mission-ui-css',

        init() {
            // Get UI config from URL params
            const params = new URLSearchParams(window.location.search);
            const uiConfigParam = params.get('ui_config');

            if (uiConfigParam) {
                try {
                    // URLSearchParams already decodes the value, so just JSON.parse
                    this.config = JSON.parse(uiConfigParam);
                    console.log('[TeachCharlie] Mission UI config:', this.config);
                    this.applyConfig();
                } catch (e) {
                    console.error('[TeachCharlie] Failed to parse ui_config:', e);
                }
            }

            // Also listen for config updates via postMessage
            window.addEventListener('message', (event) => {
                if (event.data?.source === 'teach-charlie-parent' && event.data?.type === 'ui_config') {
                    this.config = event.data.config;
                    console.log('[TeachCharlie] UI config updated via postMessage:', this.config);
                    this.applyConfig();
                }
            });
        },

        applyConfig() {
            if (!this.config) return;

            let css = '/* Mission UI Config */\n';

            // Hide entire sidebar
            if (this.config.hide_sidebar) {
                css += `
                    /* Hide the entire sidebar */
                    aside,
                    [data-testid="sidebar"],
                    .sidebar,
                    [class*="sidebar"],
                    [class*="Sidebar"] {
                        display: none !important;
                        width: 0 !important;
                        min-width: 0 !important;
                        opacity: 0 !important;
                        pointer-events: none !important;
                    }

                    /* Expand the canvas to fill space */
                    .react-flow,
                    [class*="react-flow"],
                    main,
                    [class*="canvas"],
                    [class*="Canvas"] {
                        width: 100% !important;
                        max-width: 100% !important;
                    }
                `;
                console.log('[TeachCharlie] Sidebar hidden');
            }

            // Hide minimap
            if (this.config.hide_minimap) {
                css += `
                    /* Hide the minimap */
                    .react-flow__minimap,
                    [class*="minimap"],
                    [class*="Minimap"] {
                        display: none !important;
                    }
                `;
                console.log('[TeachCharlie] Minimap hidden');
            }

            // Hide toolbar (except play button)
            if (this.config.hide_toolbar) {
                css += `
                    /* Hide toolbar but keep play button */
                    [class*="toolbar"],
                    [class*="Toolbar"] {
                        visibility: hidden !important;
                    }
                    [class*="toolbar"] button[title*="Run"],
                    [class*="toolbar"] button[title*="Play"],
                    [class*="Toolbar"] button[title*="Run"],
                    [class*="Toolbar"] button[title*="Play"],
                    button[data-testid*="run"],
                    button[data-testid*="play"] {
                        visibility: visible !important;
                    }
                `;
                console.log('[TeachCharlie] Toolbar hidden (except play)');
            }

            // Show only custom Actions category
            if (this.config.custom_actions_only) {
                css += `
                    /* Hide all categories except Actions */
                    [data-testid*="disclosure"]:not([data-testid*="actions"]):not([data-testid*="Actions"]) {
                        display: none !important;
                    }
                `;
                console.log('[TeachCharlie] Only showing Actions category');
            }

            // Inject/update stylesheet
            let styleEl = document.getElementById(this.cssId);
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = this.cssId;
                document.head.appendChild(styleEl);
            }
            styleEl.textContent = css;
        }
    };

    // =====================================================
    // MODULE: WALK ME (Driver.js Highlights)
    // =====================================================

    const WalkMe = {
        driverInstance: null,
        currentHighlight: null,
        isCleaningUp: false,  // Prevent re-entrant cleanup
        _overlayClickHandler: null,

        init() {
            // Load driver.js CSS if not already loaded
            if (!document.querySelector('link[href*="driver"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://cdn.jsdelivr.net/npm/driver.js@1.3.1/dist/driver.css';
                document.head.appendChild(link);
            }

            // Load driver.js if not already loaded
            if (typeof window.driver === 'undefined') {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/driver.js@1.3.1/dist/driver.js.iife.js';
                script.onload = () => {
                    console.log('[TeachCharlie] Driver.js loaded');
                    this.setupDriver();
                };
                document.head.appendChild(script);
            } else {
                this.setupDriver();
            }

            // Listen for highlight requests from parent
            window.addEventListener('message', (event) => {
                if (event.data?.source === 'teach-charlie-parent') {
                    if (event.data.type === 'highlight') {
                        this.showHighlight(event.data.highlight);
                    } else if (event.data.type === 'clear_highlight') {
                        this.clearHighlight();
                    }
                }
            });
        },

        setupDriver() {
            if (typeof window.driver !== 'undefined') {
                this.driverInstance = window.driver.js.driver;
                console.log('[TeachCharlie] Driver.js ready');
            }
        },

        resolveElement(highlight) {
            // Resolve element pattern to CSS selector or find element directly
            const element = highlight.element || '';
            let selector = highlight.selector || '';

            if (element.startsWith('node:')) {
                const nodeType = element.replace('node:', '');
                // Try various selectors Langflow might use for node types
                selector = `[data-type="${nodeType}"], [data-node-type="${nodeType}"], .react-flow__node[class*="${nodeType}"], [data-testid*="${nodeType}"]`;
            } else if (element.startsWith('field:')) {
                const fieldName = element.replace('field:', '');
                // Convert underscore to space and title case for label matching
                const labelName = fieldName.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                // Try multiple strategies to find the field
                selector = `[name="${fieldName}"], [data-testid*="${fieldName}"], [class*="${fieldName}"]`;
                // Also try finding by label text - we'll handle this specially in showHighlight
                this._fieldLabel = labelName;
            } else if (element.startsWith('button:')) {
                const buttonId = element.replace('button:', '');
                if (buttonId === 'play') {
                    // Langflow play/run button selectors
                    selector = 'button[title*="Run"], button[title*="Play"], [data-testid*="run-button"], [data-testid*="play"], button:has(svg[class*="play"]), button:has(svg[class*="run"]), [aria-label*="Run"], [aria-label*="Play"]';
                } else if (buttonId === 'playground') {
                    // Playground button in top right corner - opens the chat panel
                    // Use valid CSS selectors only (no :has-text which is Playwright-specific)
                    selector = '[data-testid*="playground"], button[title*="Playground"], [aria-label*="Playground"]';
                    // Use text-based matching as primary strategy
                    this._buttonText = 'Playground';
                } else if (buttonId === 'save') {
                    selector = 'button[title*="Save"], [data-testid*="save"], button[class*="save"]';
                } else {
                    selector = `button[data-testid*="${buttonId}"], button[title*="${buttonId}"]`;
                }
            } else if (element.startsWith('sidebar:')) {
                const category = element.replace('sidebar:', '');
                selector = `[data-testid*="${category}"], [class*="${category}"]`;
            } else if (element.startsWith('panel:')) {
                const panel = element.replace('panel:', '');
                selector = `[data-testid*="${panel}"], [class*="${panel}"]`;
            }

            return selector;
        },

        // Find button by visible text content
        findButtonByText(buttonText) {
            console.log('[TeachCharlie] Searching for button with text:', buttonText);

            // Search for buttons and links that contain the text
            const elements = document.querySelectorAll('button, a, [role="button"]');
            for (const el of elements) {
                const text = el.textContent?.trim();
                if (text && text.toLowerCase().includes(buttonText.toLowerCase())) {
                    console.log('[TeachCharlie] Found button by text:', el.tagName, text);
                    return el;
                }
            }

            // Also try finding by aria-label or title
            const ariaElements = document.querySelectorAll(`[aria-label*="${buttonText}" i], [title*="${buttonText}" i]`);
            if (ariaElements.length > 0) {
                console.log('[TeachCharlie] Found button by aria/title:', ariaElements[0].tagName);
                return ariaElements[0];
            }

            console.log('[TeachCharlie] No button found with text:', buttonText);
            return null;
        },

        // Find field by label text in Langflow UI
        findFieldByLabel(labelText) {
            console.log('[TeachCharlie] Searching for label:', labelText);

            // Strategy: Find containers that have BOTH the label text AND an input
            // This handles cases where label and input are siblings, not parent-child
            const candidates = [];

            // Find all divs that could be field containers
            const containers = document.querySelectorAll('div, section, fieldset, label');
            for (const container of containers) {
                // Check if container has the label text somewhere inside
                const hasLabel = Array.from(container.querySelectorAll('*')).some(
                    el => el.textContent?.trim() === labelText &&
                          !Array.from(el.children).some(c => c.textContent?.trim() === labelText)
                );
                if (!hasLabel) continue;

                // Check if container also has an input
                const input = container.querySelector('input, textarea, [contenteditable="true"]');
                if (!input) continue;

                // Found a container with both label and input
                candidates.push({
                    container,
                    depth: this.getElementDepth(container),
                    size: container.querySelectorAll('*').length
                });
            }

            if (candidates.length === 0) {
                console.log('[TeachCharlie] No field container found for:', labelText);
                return null;
            }

            // Prefer smaller containers (more specific)
            candidates.sort((a, b) => a.size - b.size);
            const best = candidates[0];
            console.log('[TeachCharlie] Found field container:', best.container.tagName, best.container.className?.substring(0, 60));
            return best.container;
        },

        getElementDepth(el) {
            let depth = 0;
            while (el.parentElement) {
                depth++;
                el = el.parentElement;
            }
            return depth;
        },

        async showHighlight(highlight) {
            console.log('[TeachCharlie] WalkMe received highlight:', JSON.stringify(highlight, null, 2));

            if (!this.driverInstance) {
                console.warn('[TeachCharlie] Driver.js not ready yet');
                // Retry after a short delay
                setTimeout(() => this.showHighlight(highlight), 500);
                return;
            }

            const selector = this.resolveElement(highlight);
            console.log('[TeachCharlie] Showing highlight for:', highlight.element, '→', selector);

            // Find the element using CSS selector first
            let el = document.querySelector(selector);

            // If not found and we have a field label, try label-based lookup
            if (!el && this._fieldLabel) {
                console.log('[TeachCharlie] Trying label-based lookup:', this._fieldLabel);
                el = this.findFieldByLabel(this._fieldLabel);
                this._fieldLabel = null; // Clear for next use
            }

            // If not found and we have a button text, try text-based lookup
            if (!el && this._buttonText) {
                console.log('[TeachCharlie] Trying button text lookup:', this._buttonText);
                el = this.findButtonByText(this._buttonText);
                this._buttonText = null; // Clear for next use
            }

            if (!el) {
                console.warn('[TeachCharlie] Element not found:', selector);
                // Try again after a delay (element might not be rendered yet)
                const savedLabel = this._fieldLabel;
                const savedButtonText = this._buttonText;
                setTimeout(() => {
                    let retryEl = document.querySelector(selector);
                    if (!retryEl && savedLabel) {
                        retryEl = this.findFieldByLabel(savedLabel);
                    }
                    if (!retryEl && savedButtonText) {
                        retryEl = this.findButtonByText(savedButtonText);
                    }
                    if (retryEl) {
                        this.performHighlight(retryEl, highlight);
                    } else {
                        console.warn('[TeachCharlie] Element still not found after retry:', selector);
                    }
                }, 1000);
                return;
            }

            this.performHighlight(el, highlight);
        },

        performHighlight(element, highlight) {
            console.log('[TeachCharlie] performHighlight called with element:', element?.tagName, element?.textContent?.substring(0, 30));

            // Clean up any existing highlight first
            this.clearHighlight();

            console.log('[TeachCharlie] After clearHighlight, creating driver');

            const self = this;

            // Create new driver instance
            const driver = this.driverInstance({
                showProgress: false,
                showButtons: [],  // We'll add our own close button
                allowClose: false,  // We handle overlay clicks ourselves
                stagePadding: 4,
                stageRadius: 8,
                overlayColor: 'rgba(0, 0, 0, 0.5)',
                popoverClass: 'tc-walkme-popover',
                onCloseClick: () => {
                    console.log('[TeachCharlie] onCloseClick fired');
                    self.clearHighlight();
                },
                onDestroyStarted: () => {
                    // Driver.js destroy was triggered (e.g., by our clearHighlight calling destroy())
                    console.log('[TeachCharlie] Driver.js onDestroyStarted');
                    // Don't do anything here - clearHighlight handles everything
                },
                onDestroyed: () => {
                    // Driver.js finished cleanup
                    console.log('[TeachCharlie] Driver.js onDestroyed');
                    // Make sure state is clean
                    self.currentHighlight = null;
                    self.removeLeftoverElements();
                }
            });

            // Show the highlight
            console.log('[TeachCharlie] About to call driver.highlight on element');
            try {
                driver.highlight({
                    element: element,
                    popover: {
                        title: highlight.title || '',
                        description: highlight.description || '',
                        side: highlight.position || 'auto',
                        align: 'center',
                    }
                });
                console.log('[TeachCharlie] driver.highlight called successfully');
            } catch (e) {
                console.error('[TeachCharlie] driver.highlight error:', e);
            }

            this.currentHighlight = driver;

            // Add custom close button and overlay click handler after DOM is ready
            setTimeout(() => {
                this.setupCloseHandlers();
            }, 100);

            // Add Escape key handler
            const closeOnEscape = (e) => {
                if (e.key === 'Escape') {
                    self.clearHighlight();
                }
            };
            document.addEventListener('keydown', closeOnEscape);
            this._escapeHandler = closeOnEscape;
        },

        setupCloseHandlers() {
            console.log('[TeachCharlie] setupCloseHandlers called');
            const self = this;

            // Add custom close button to popover
            const popover = document.querySelector('.driver-popover');
            console.log('[TeachCharlie] Popover found:', !!popover);
            if (popover && !popover.querySelector('.tc-close-btn')) {
                const closeBtn = document.createElement('button');
                closeBtn.className = 'tc-close-btn';
                closeBtn.innerHTML = '×';
                closeBtn.style.cssText = `
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: #f3f4f6;
                    border: none;
                    cursor: pointer;
                    font-size: 20px;
                    line-height: 1;
                    color: #374151;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10001;
                `;
                closeBtn.onclick = (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    self.clearHighlight();
                };
                popover.appendChild(closeBtn);
            }

            // Create our own click capture div on top of driver.js overlay
            // This is more reliable than trying to attach to the SVG
            const overlay = document.querySelector('.driver-overlay');
            console.log('[TeachCharlie] Creating click capture overlay');

            if (overlay) {
                // Create transparent click capture div
                const clickCapture = document.createElement('div');
                clickCapture.className = 'tc-click-capture';
                clickCapture.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    z-index: 10001;
                    cursor: pointer;
                    background: transparent;
                    pointer-events: auto;
                `;

                clickCapture.addEventListener('click', (e) => {
                    console.log('[TeachCharlie] Click capture triggered - closing highlight');
                    e.stopPropagation();
                    e.preventDefault();
                    self.clearHighlight();
                });

                document.body.appendChild(clickCapture);

                // Make sure the popover is above our click capture
                if (popover) {
                    popover.style.zIndex = '10002';
                }

                this._overlayClickHandler = {
                    clickCapture: clickCapture,
                    isDocument: false
                };
                console.log('[TeachCharlie] Click capture overlay created and attached');
            } else {
                console.log('[TeachCharlie] WARNING: No driver overlay found');
            }
        },

        // Clean up only our event handlers - don't touch driver.js DOM elements
        cleanupHandlersOnly() {
            console.log('[TeachCharlie] cleanupHandlersOnly');

            // Remove escape handler
            if (this._escapeHandler) {
                document.removeEventListener('keydown', this._escapeHandler);
                this._escapeHandler = null;
            }

            // Remove our click capture overlay
            if (this._overlayClickHandler) {
                try {
                    if (this._overlayClickHandler.clickCapture) {
                        this._overlayClickHandler.clickCapture.remove();
                    }
                } catch (e) {
                    // Element might already be removed
                }
                this._overlayClickHandler = null;
            }

            // Also remove any leftover click capture divs
            document.querySelectorAll('.tc-click-capture').forEach(el => {
                try { el.remove(); } catch (e) {}
            });

            // Remove click handler
            if (this._clickHandler) {
                document.removeEventListener('click', this._clickHandler, true);
                this._clickHandler = null;
            }
        },

        // Remove any leftover driver.js elements (safety net)
        removeLeftoverElements() {
            // Remove the driver-active-element class from target elements
            document.querySelectorAll('.driver-active-element').forEach(el => {
                try {
                    el.classList.remove('driver-active-element');
                } catch (e) {
                    // Element might be in a weird state
                }
            });

            // Remove any leftover overlay/popover (shouldn't exist if driver.js cleaned up properly)
            document.querySelectorAll('.driver-overlay, .driver-popover').forEach(el => {
                try {
                    if (el.parentNode) {
                        el.parentNode.removeChild(el);
                    }
                } catch (e) {
                    // Already removed
                }
            });
        },

        // Public method - can be called from X button clicks, escape key, etc.
        clearHighlight() {
            console.log('[TeachCharlie] clearHighlight called');

            // Clean up our handlers first
            this.cleanupHandlersOnly();

            // If we have an active driver, destroy it (this will trigger onDestroyed)
            if (this.currentHighlight) {
                try {
                    this.currentHighlight.destroy();
                } catch (e) {
                    console.log('[TeachCharlie] Driver destroy error:', e.message);
                    // If destroy failed, do manual cleanup
                    this.currentHighlight = null;
                    this.removeLeftoverElements();
                }
            } else {
                // No active driver, just clean up any leftovers
                this.removeLeftoverElements();
            }

            this.isCleaningUp = false;
            console.log('[TeachCharlie] clearHighlight complete');
        }
    };

    // =====================================================
    // MODULE: THEME SYNC (Dark Mode)
    // Syncs theme with parent Teach Charlie app
    // =====================================================

    const ThemeSync = {
        STORAGE_KEY: 'langflow-theme',
        currentTheme: 'light',

        init() {
            console.log('[TeachCharlie] ThemeSync - Initializing');

            // Check URL params for initial theme
            const params = new URLSearchParams(window.location.search);
            const urlTheme = params.get('theme');
            if (urlTheme === 'dark' || urlTheme === 'light') {
                this.applyTheme(urlTheme);
            } else {
                // Check localStorage for saved theme
                const savedTheme = localStorage.getItem(this.STORAGE_KEY);
                if (savedTheme === 'dark' || savedTheme === 'light') {
                    this.applyTheme(savedTheme);
                }
            }

            // Listen for theme changes from parent window
            window.addEventListener('message', (event) => {
                if (event.data?.source === 'teach-charlie-parent' && event.data?.type === 'theme_change') {
                    const theme = event.data.theme;
                    if (theme === 'dark' || theme === 'light') {
                        console.log('[TeachCharlie] ThemeSync - Received theme change:', theme);
                        this.applyTheme(theme);
                    }
                }
            });

            // Signal to parent that we're ready
            if (window.parent !== window) {
                window.parent.postMessage({
                    source: 'langflow-overlay',
                    type: 'ready'
                }, '*');
            }
        },

        applyTheme(theme) {
            this.currentTheme = theme;
            const root = document.documentElement;

            if (theme === 'dark') {
                root.classList.add('dark');
                // Langflow also uses data-theme attribute
                root.setAttribute('data-theme', 'dark');
            } else {
                root.classList.remove('dark');
                root.setAttribute('data-theme', 'light');
            }

            // Save to localStorage
            localStorage.setItem(this.STORAGE_KEY, theme);
            console.log('[TeachCharlie] ThemeSync - Applied theme:', theme);
        },

        getTheme() {
            return this.currentTheme;
        }
    };

    // =====================================================
    // MODULE: SAVE MONITOR (Unsaved Changes Detection)
    // Detects unsaved changes and communicates with parent
    // =====================================================

    const SaveMonitor = {
        hasUnsavedChanges: false,
        isSaving: false,
        lastSaveTime: null,
        changeDebounceTimer: null,
        initialStateSet: false,

        init() {
            console.log('[TeachCharlie] SaveMonitor - Initializing');

            // Wait for the canvas to be ready
            this.waitForCanvas();

            // Listen for save commands from parent
            window.addEventListener('message', (event) => {
                if (event.data?.source === 'teach-charlie-parent') {
                    if (event.data.type === 'check_unsaved') {
                        this.reportState();
                    } else if (event.data.type === 'request_save') {
                        this.triggerSave();
                    }
                }
            });

            // Handle beforeunload to warn about unsaved changes
            window.addEventListener('beforeunload', (e) => {
                if (this.hasUnsavedChanges) {
                    e.preventDefault();
                    e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
                    return e.returnValue;
                }
            });
        },

        waitForCanvas() {
            const checkCanvas = setInterval(() => {
                const reactFlowPane = document.querySelector('.react-flow__pane');
                const nodesContainer = document.querySelector('.react-flow__nodes');

                if (reactFlowPane && nodesContainer) {
                    clearInterval(checkCanvas);
                    this.setupObservers();
                    // Small delay to let initial render complete
                    setTimeout(() => {
                        this.initialStateSet = true;
                        console.log('[TeachCharlie] SaveMonitor - Initial state set, now tracking changes');
                    }, 2000);
                }
            }, 500);

            // Timeout after 30 seconds
            setTimeout(() => clearInterval(checkCanvas), 30000);
        },

        setupObservers() {
            console.log('[TeachCharlie] SaveMonitor - Setting up observers');

            // Watch for DOM changes that indicate user edits
            const flowContainer = document.querySelector('.react-flow');
            if (flowContainer) {
                const observer = new MutationObserver((mutations) => {
                    if (!this.initialStateSet) return;

                    // Check for meaningful changes (not just style updates)
                    for (const mutation of mutations) {
                        // Node additions/removals
                        if (mutation.type === 'childList') {
                            const hasNodeChange = Array.from(mutation.addedNodes).some(node =>
                                node.classList?.contains('react-flow__node') ||
                                node.querySelector?.('.react-flow__node')
                            ) || Array.from(mutation.removedNodes).some(node =>
                                node.classList?.contains('react-flow__node') ||
                                node.querySelector?.('.react-flow__node')
                            );

                            if (hasNodeChange) {
                                this.markAsChanged('node_change');
                                break;
                            }
                        }
                    }
                });

                observer.observe(flowContainer, {
                    childList: true,
                    subtree: true
                });
            }

            // Watch for input changes (field edits)
            document.addEventListener('input', (e) => {
                if (!this.initialStateSet) return;
                const target = e.target;
                // Check if input is within a node or settings panel
                if (target.closest('.react-flow__node') ||
                    target.closest('[class*="sidebar"]') ||
                    target.closest('[role="dialog"]') ||
                    target.closest('[class*="settings"]')) {
                    this.markAsChanged('input_change');
                }
            }, true);

            // Watch for edge connections (mouse up on handles)
            document.addEventListener('mouseup', (e) => {
                if (!this.initialStateSet) return;
                const target = e.target;
                if (target.closest('.react-flow__handle') ||
                    target.closest('.react-flow__edge')) {
                    // Delay check to allow edge to be created
                    setTimeout(() => this.checkForEdgeChanges(), 100);
                }
            }, true);

            // Watch for keyboard shortcuts (Ctrl+S, Cmd+S)
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                    // User is saving
                    this.onSaveTriggered();
                }
            }, true);

            // Watch for Langflow's save notifications/toasts
            this.watchForSaveNotifications();
        },

        checkForEdgeChanges() {
            // Simple heuristic: if there's an edge being drawn or just connected
            const edges = document.querySelectorAll('.react-flow__edge');
            // This is called after potential edge changes
            this.markAsChanged('edge_change');
        },

        watchForSaveNotifications() {
            // Watch for toast notifications that indicate save status
            const toastObserver = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const text = node.textContent?.toLowerCase() || '';
                            // Detect Langflow save success messages
                            if (text.includes('saved') || text.includes('flow saved') ||
                                text.includes('changes saved') || text.includes('save successful')) {
                                this.onSaveComplete();
                            } else if (text.includes('saving') || text.includes('auto-saving')) {
                                this.onSaveStarted();
                            }
                        }
                    }
                }
            });

            toastObserver.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Also watch for Langflow's auto-save indicator
            const checkAutoSave = setInterval(() => {
                // Look for auto-save status indicators
                const savingIndicator = document.querySelector('[class*="saving"], [data-testid*="saving"]');
                if (savingIndicator) {
                    const text = savingIndicator.textContent?.toLowerCase() || '';
                    if (text.includes('saving')) {
                        this.onSaveStarted();
                    } else if (text.includes('saved') || text.includes('up to date')) {
                        this.onSaveComplete();
                    }
                }
            }, 1000);

            // Clear interval after 5 minutes (auto-save should have kicked in by then)
            setTimeout(() => clearInterval(checkAutoSave), 300000);
        },

        markAsChanged(reason) {
            // Debounce rapid changes
            if (this.changeDebounceTimer) {
                clearTimeout(this.changeDebounceTimer);
            }

            this.changeDebounceTimer = setTimeout(() => {
                if (!this.hasUnsavedChanges) {
                    console.log('[TeachCharlie] SaveMonitor - Changes detected:', reason);
                    this.hasUnsavedChanges = true;
                    this.notifyParent('unsaved_changes', { hasChanges: true, reason });
                }
            }, 300);
        },

        onSaveTriggered() {
            console.log('[TeachCharlie] SaveMonitor - Save triggered');
            this.isSaving = true;
            this.notifyParent('save_started', {});
        },

        onSaveStarted() {
            if (!this.isSaving) {
                console.log('[TeachCharlie] SaveMonitor - Auto-save started');
                this.isSaving = true;
                this.notifyParent('save_started', {});
            }
        },

        onSaveComplete() {
            console.log('[TeachCharlie] SaveMonitor - Save complete');
            this.isSaving = false;
            this.hasUnsavedChanges = false;
            this.lastSaveTime = Date.now();
            this.notifyParent('save_complete', { timestamp: this.lastSaveTime });
        },

        triggerSave() {
            console.log('[TeachCharlie] SaveMonitor - Triggering save via keyboard shortcut');
            // Simulate Ctrl+S / Cmd+S
            const event = new KeyboardEvent('keydown', {
                key: 's',
                code: 'KeyS',
                ctrlKey: navigator.platform.includes('Mac') ? false : true,
                metaKey: navigator.platform.includes('Mac') ? true : false,
                bubbles: true
            });
            document.dispatchEvent(event);
            this.onSaveTriggered();
        },

        reportState() {
            this.notifyParent('save_state', {
                hasUnsavedChanges: this.hasUnsavedChanges,
                isSaving: this.isSaving,
                lastSaveTime: this.lastSaveTime
            });
        },

        notifyParent(type, data) {
            if (window.parent !== window) {
                window.parent.postMessage({
                    source: 'langflow-overlay',
                    type: type,
                    ...data
                }, '*');
                console.log('[TeachCharlie] SaveMonitor - Notified parent:', type, data);
            }
        }
    };

    // =====================================================
    // DEBOUNCED OBSERVER
    // =====================================================

    function debouncedApply() {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            requestAnimationFrame(applyWhiteLabeling);
        }, 150);
    }

    const observer = new MutationObserver((mutations) => {
        // Only react to meaningful DOM changes
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                debouncedApply();
                break;
            }
        }
    });

    // =====================================================
    // INITIALIZATION
    // =====================================================

    function init() {
        applyWhiteLabeling();

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });

        // Initialize mission mode modules
        ComponentFilter.init();
        FlowMonitor.init();
        MissionUI.init();
        WalkMe.init();
        ThemeSync.init();
        SaveMonitor.init();

        console.log("[TeachCharlie Overlay] Observer started - All modules initialized (including SaveMonitor)");
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 0);
    }

})();
