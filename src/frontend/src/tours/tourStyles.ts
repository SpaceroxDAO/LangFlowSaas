import type { Config } from 'driver.js';

/**
 * Shared tour styles and configuration for all Teach Charlie tours.
 * Uses the orange/amber theme consistent with the app's educational UX.
 */

// Custom styles for all tours
const tourStyles = `
  .teachcharlie-tour-popover {
    background: white;
    border: 2px solid transparent;
    background-image: linear-gradient(white, white), linear-gradient(90deg, #f97316, #ec4899, #9333ea);
    background-origin: border-box;
    background-clip: padding-box, border-box;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(147, 51, 234, 0.15);
    max-width: 340px;
  }

  .teachcharlie-tour-popover .driver-popover-title {
    color: #111827;
    font-weight: 600;
    font-size: 1.1rem;
  }

  .teachcharlie-tour-popover .driver-popover-description {
    color: #374151;
    line-height: 1.6;
    font-size: 0.95rem;
  }

  .teachcharlie-tour-popover .driver-popover-navigation-btns {
    gap: 8px;
  }

  .teachcharlie-tour-popover .driver-popover-navigation-btns button {
    background: #111827;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 18px;
    font-weight: 500;
    font-style: normal;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    transition: background 0.2s;
    text-shadow: none;
    -webkit-font-smoothing: antialiased;
  }

  .teachcharlie-tour-popover .driver-popover-navigation-btns button:hover {
    background: #1f2937;
  }

  .teachcharlie-tour-popover .driver-popover-prev-btn {
    background: #f3f4f6 !important;
    color: #374151 !important;
  }

  .teachcharlie-tour-popover .driver-popover-prev-btn:hover {
    background: #e5e7eb !important;
  }

  .teachcharlie-tour-popover .driver-popover-close-btn {
    color: #9ca3af;
  }

  .teachcharlie-tour-popover .driver-popover-close-btn:hover {
    color: #4b5563;
  }

  .teachcharlie-tour-popover .driver-popover-progress-text {
    color: #9ca3af;
    font-size: 0.8rem;
  }
`;

let stylesInjected = false;

export function injectTourStyles() {
  if (stylesInjected) return;

  const style = document.createElement('style');
  style.textContent = tourStyles;
  document.head.appendChild(style);
  stylesInjected = true;
}

// Base configuration shared by all tours
export const baseTourConfig: Partial<Config> = {
  showButtons: ['next', 'previous', 'close'],
  nextBtnText: 'Next',
  prevBtnText: 'Back',
  doneBtnText: 'Done',
  popoverClass: 'teachcharlie-tour-popover',
  animate: true,
  smoothScroll: true,
  allowClose: true,
  overlayOpacity: 0.6,
};
