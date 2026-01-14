import { useState, useRef, useCallback } from 'react';
import { driver } from 'driver.js';
import type { DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useTour } from '../providers/TourProvider';

// Progressive disclosure levels for the Langflow canvas
// Note: CSS injection is now handled by nginx sub_filter (see nginx/overlay/style.css)
// These levels are kept for Phase 2 progressive disclosure implementation
//
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

// Educational labels for each level (kept for future complexity selector)
// const levelLabels: Record<number, { title: string; description: string }> = {
//   1: { title: "Charlie's Brain", description: "See how Charlie processes your messages (read-only)" },
//   2: { title: "Explore Mode", description: "Try adding tricks to Charlie's toolkit" },
//   3: { title: "Builder Mode", description: "Full editing with guided assistance" },
//   4: { title: "Expert Mode", description: "Full Langflow canvas access" },
// };

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
  // onLevelChange, // Kept for future complexity selector
}: LangflowCanvasViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentLevel = level; // Use prop directly until complexity selector is added
  const { completeTour } = useTour();

  // Langflow URL configuration:
  // ALWAYS use http://localhost:7861 (nginx) for CSS injection/white-label overlay
  // The nginx proxy handles CSS/JS injection to hide Langflow UI elements
  // Use docker-compose.dev.yml to run nginx + langflow for local dev
  const langflowUrl = import.meta.env.VITE_LANGFLOW_URL || 'http://localhost:7861';
  const canvasUrl = `${langflowUrl}/flow/${flowId}`;

  // Handle iframe load
  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);

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
  }, [showTour, completeTour, onTourComplete]);

  // Handle level change (kept for future complexity selector)
  // const handleLevelChange = (newLevel: 1 | 2 | 3 | 4) => {
  //   setCurrentLevel(newLevel);
  //   onLevelChange?.(newLevel);
  // };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Loading state */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500 mx-auto mb-3"></div>
            <p className="text-sm text-gray-600">Loading {agentName}'s brain...</p>
          </div>
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
          console.error('Failed to load Langflow canvas');
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
