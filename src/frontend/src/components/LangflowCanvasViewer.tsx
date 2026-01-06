import { useState, useEffect, useRef, useCallback } from 'react';
import { driver } from 'driver.js';
import type { DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useTour } from '../providers/TourProvider';

// Progressive disclosure levels for the Langflow canvas
// Level 1: Read-only view with heavy overlay - "Peek at Charlie's brain"
// Level 2: Limited editing with simplified sidebar - "Explore mode"
// Level 3: Full editing with some advanced features hidden - "Builder mode"
// Level 4: Full Langflow access - "Expert mode"

interface LangflowCanvasViewerProps {
  flowId: string;
  agentName?: string;
  level?: 1 | 2 | 3 | 4;
  showTour?: boolean;
  onTourComplete?: () => void;
  onLevelChange?: (level: 1 | 2 | 3 | 4) => void;
}

// CSS injection strings for each disclosure level
const levelCSS: Record<number, string> = {
  1: `
    /* Level 1: Peek Mode - Read-only, minimal UI */
    [data-testid="app-header"] { display: none !important; }
    [data-testid="shad-sidebar"] { display: none !important; }
    [data-testid="canvas_controls"] { display: none !important; }
    [data-testid="main_canvas_controls"] { display: none !important; }
    [data-testid="publish-button"] { display: none !important; }
    .react-flow__pane { pointer-events: none !important; }
    .react-flow__node { pointer-events: none !important; }
  `,
  2: `
    /* Level 2: Explore Mode - Limited editing */
    [data-testid="app-header"] { display: none !important; }
    [data-testid="sidebar-nav-mcp"] { display: none !important; }
    [data-testid="sidebar-nav-bundles"] { display: none !important; }
    [data-testid="sidebar-custom-component-button"] { display: none !important; }
    [data-testid="disclosure-llm operations"] { display: none !important; }
    [data-testid="disclosure-processing"] { display: none !important; }
    [data-testid="disclosure-flow control"] { display: none !important; }
    [data-testid="lock-status"] { display: none !important; }
  `,
  3: `
    /* Level 3: Builder Mode - Most features, some advanced hidden */
    [data-testid="sidebar-nav-mcp"] { display: none !important; }
    [data-testid="sidebar-nav-bundles"] { display: none !important; }
    [data-testid="sidebar-custom-component-button"] { display: none !important; }
  `,
  4: `
    /* Level 4: Expert Mode - Full access */
    /* No hiding - full Langflow UI */
  `,
};

// Educational labels for each level
const levelLabels: Record<number, { title: string; description: string }> = {
  1: {
    title: "Charlie's Brain",
    description: "See how Charlie processes your messages (read-only)",
  },
  2: {
    title: "Explore Mode",
    description: "Try adding tricks to Charlie's toolkit",
  },
  3: {
    title: "Builder Mode",
    description: "Full editing with guided assistance",
  },
  4: {
    title: "Expert Mode",
    description: "Full Langflow canvas access",
  },
};

// Tour steps for introducing the canvas
const canvasTourSteps: DriveStep[] = [
  {
    popover: {
      title: "Welcome to Charlie's Brain!",
      description: "This is where you can see how Charlie thinks and processes your messages. Let's take a quick tour.",
      side: 'over',
      align: 'center',
    },
  },
  {
    element: '.react-flow__node',
    popover: {
      title: 'These are Components',
      description: "Each box represents a part of Charlie's thinking process. Information flows from one box to another.",
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '.react-flow__edge',
    popover: {
      title: 'Connections (Leashes)',
      description: "These lines show how information flows between components - like a leash connecting different parts of Charlie's training.",
      side: 'top',
      align: 'center',
    },
  },
  {
    popover: {
      title: "You're Ready!",
      description: "As you get more comfortable, you can unlock more editing features. For now, explore and see how Charlie works!",
      side: 'over',
      align: 'center',
    },
  },
];

export function LangflowCanvasViewer({
  flowId,
  agentName = 'Charlie',
  level = 1,
  showTour = false,
  onTourComplete,
  onLevelChange,
}: LangflowCanvasViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLevel, setCurrentLevel] = useState(level);
  const { completeTour } = useTour();

  const langflowHost = import.meta.env.VITE_LANGFLOW_HOST || 'http://localhost:7860';
  const canvasUrl = `${langflowHost}/flow/${flowId}`;

  // Inject CSS into iframe when it loads
  const injectCSS = useCallback(() => {
    if (!iframeRef.current?.contentDocument) return;

    try {
      const doc = iframeRef.current.contentDocument;

      // Remove any previous injected style
      const existingStyle = doc.getElementById('teachcharlie-disclosure-css');
      if (existingStyle) {
        existingStyle.remove();
      }

      // Inject new style for current level
      const style = doc.createElement('style');
      style.id = 'teachcharlie-disclosure-css';
      style.textContent = levelCSS[currentLevel];
      doc.head.appendChild(style);

      console.log(`Injected level ${currentLevel} CSS into Langflow iframe`);
    } catch (e) {
      // Cross-origin will block this - expected in production
      console.warn('Could not inject CSS (cross-origin):', e);
      setError('Canvas loading... If this persists, the canvas may need to be opened in a new tab.');
    }
  }, [currentLevel]);

  // Handle iframe load
  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);

    // Try to inject CSS (may fail due to cross-origin)
    // Give iframe time to render
    setTimeout(injectCSS, 500);

    // Start tour if requested
    if (showTour) {
      setTimeout(() => {
        const driverInstance = driver({
          showProgress: true,
          steps: canvasTourSteps,
          onDestroyStarted: () => {
            completeTour('canvas');
            onTourComplete?.();
            driverInstance.destroy();
          },
        });
        driverInstance.drive();
      }, 1000);
    }
  }, [injectCSS, showTour, completeTour, onTourComplete]);

  // Re-inject CSS when level changes
  useEffect(() => {
    if (!isLoading) {
      injectCSS();
    }
  }, [currentLevel, isLoading, injectCSS]);

  // Handle level change
  const handleLevelChange = (newLevel: 1 | 2 | 3 | 4) => {
    setCurrentLevel(newLevel);
    onLevelChange?.(newLevel);
  };

  const levelInfo = levelLabels[currentLevel];

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
      {/* Header with level controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <div>
          <h3 className="text-sm font-medium text-gray-900">{levelInfo.title}</h3>
          <p className="text-xs text-gray-500">{levelInfo.description}</p>
        </div>

        {/* Level selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Complexity:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleLevelChange(lvl as 1 | 2 | 3 | 4)}
                className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                  currentLevel === lvl
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={levelLabels[lvl].title}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Open in new tab */}
          <a
            href={canvasUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
          >
            Open Full Editor
          </a>
        </div>
      </div>

      {/* Educational overlay for Level 1 */}
      {currentLevel === 1 && (
        <div className="relative">
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg max-w-xs">
              <p className="text-sm text-gray-700">
                <span className="font-medium text-orange-600">Peek Mode:</span> You're viewing {agentName}'s brain in read-only mode. See how messages flow through the components!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto mb-3"></div>
            <p className="text-sm text-gray-600">Loading {agentName}'s brain...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute top-16 right-4 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 max-w-sm z-20">
          <p className="text-xs text-yellow-700">{error}</p>
        </div>
      )}

      {/* Langflow iframe */}
      <iframe
        ref={iframeRef}
        src={canvasUrl}
        className={`flex-1 w-full border-0 ${isLoading ? 'invisible' : 'visible'}`}
        onLoad={handleIframeLoad}
        onError={() => {
          setIsLoading(false);
          setError('Failed to load canvas. Please try opening in a new tab.');
        }}
        title={`${agentName}'s Flow Canvas`}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
      />

      {/* Footer with tips based on level */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          {currentLevel === 1 && "Tip: Click the level buttons above to unlock more editing features as you learn."}
          {currentLevel === 2 && "Tip: Try dragging a tool from the sidebar onto the canvas to teach Charlie a new trick!"}
          {currentLevel === 3 && "Tip: You can connect components by dragging from one handle to another."}
          {currentLevel === 4 && "Tip: You now have full access to all Langflow features. Happy building!"}
        </p>
      </div>
    </div>
  );
}

export default LangflowCanvasViewer;
