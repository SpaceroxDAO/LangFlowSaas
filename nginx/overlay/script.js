/**
 * Teach Charlie AI - Langflow Overlay Script
 *
 * Purpose: Hide Langflow branding elements for WHITE-LABELING ONLY
 *
 * IMPORTANT: This script should NOT hide functional UI elements.
 * The connection error issue was fixed at the nginx level.
 * See: docs/LANGFLOW_PROXY_FIX.md
 */

(function() {
    'use strict';

    console.log("[TeachCharlie Overlay] White-label script initialized");

    // =====================================================
    // CONFIGURATION - Elements to hide for white-labeling
    // =====================================================

    // Text content that should trigger hiding (branding/social)
    const HIDDEN_TEXTS = ['GitHub', 'Discord', 'Twitter', 'Langflow'];

    // Track already-hidden elements
    const hiddenElements = new WeakSet();

    // Debounce timer
    let debounceTimer = null;

    // =====================================================
    // WHITE-LABEL HIDING
    // =====================================================

    function hideWhiteLabelElements() {
        // Hide sidebar/nav items with branding text
        const navItems = document.querySelectorAll(
            'nav a, nav button, [class*="sidebar"] a, [class*="sidebar"] button'
        );

        navItems.forEach(el => {
            const text = (el.textContent || '').trim();
            if (HIDDEN_TEXTS.some(t => text.includes(t))) {
                const container = el.closest('li, a, button, [class*="item"]') || el;
                if (container && !hiddenElements.has(container)) {
                    if (container.style.display !== 'none') {
                        container.style.display = 'none';
                        hiddenElements.add(container);
                        console.log(`[TeachCharlie] Hidden branding: ${text}`);
                    }
                }
            }
        });
    }

    // =====================================================
    // DEBOUNCED OBSERVER
    // =====================================================

    function debouncedHide() {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            requestAnimationFrame(hideWhiteLabelElements);
        }, 100);
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                debouncedHide();
                break;
            }
        }
    });

    // =====================================================
    // INITIALIZATION
    // =====================================================

    function init() {
        hideWhiteLabelElements();

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });

        console.log("[TeachCharlie Overlay] Observer started (white-label mode)");
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 0);
    }

})();
