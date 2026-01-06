import { driver } from 'driver.js';
import type { DriveStep, Config } from 'driver.js';
import 'driver.js/dist/driver.css';

// Tour configuration for the Create Agent 3-step wizard
// Introduces users to the "Dog Trainer" metaphor and guides them through agent creation

export const createAgentTourSteps: DriveStep[] = [
  // Welcome
  {
    popover: {
      title: "Let's Train Your First Charlie!",
      description: "Think of this like setting up a new employee or training a puppy. We'll ask you three simple questions to get Charlie ready for work.",
      side: 'over',
      align: 'center',
    },
  },
  // Step 1: Identity
  {
    element: '[data-tour="agent-name"]',
    popover: {
      title: "Give Charlie a Name",
      description: "Every good dog needs a name! This is how you'll identify this agent later.",
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="agent-job"]',
    popover: {
      title: "Charlie's Job Description",
      description: "Describe who Charlie is and what job they have. Are they a customer support agent? A friendly assistant? A sales helper? Be specific!",
      side: 'bottom',
      align: 'start',
    },
  },
  // Step 2: Rules
  {
    element: '[data-tour="agent-rules"]',
    popover: {
      title: "Training Instructions",
      description: "What are the rules of Charlie's job? What should they know? What should they NOT do? Write these like you're training a new team member.",
      side: 'bottom',
      align: 'start',
    },
  },
  // Step 3: Tools
  {
    element: '[data-tour="agent-tools"]',
    popover: {
      title: "Teach Charlie Tricks!",
      description: "Does Charlie need special skills? Select the tools that will help Charlie do their job better. These are like teaching a dog to fetch or roll over!",
      side: 'top',
      align: 'start',
    },
  },
  // Completion
  {
    popover: {
      title: "That's All!",
      description: "After you finish these steps, Charlie will be ready to chat. You can always come back and adjust the training if Charlie isn't quite getting it right.",
      side: 'over',
      align: 'center',
    },
  },
];

// Driver.js configuration
const tourConfig: Config = {
  showProgress: true,
  showButtons: ['next', 'previous', 'close'],
  nextBtnText: 'Next →',
  prevBtnText: '← Back',
  doneBtnText: 'Start Training!',
  progressText: '{{current}} of {{total}}',
  popoverClass: 'teachcharlie-tour-popover',
};

// Custom styles for the tour (inject once)
const tourStyles = `
  .teachcharlie-tour-popover {
    background: linear-gradient(135deg, #fff 0%, #fff9f5 100%);
    border: 2px solid #f97316;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(249, 115, 22, 0.2);
  }

  .teachcharlie-tour-popover .driver-popover-title {
    color: #c2410c;
    font-weight: 600;
  }

  .teachcharlie-tour-popover .driver-popover-description {
    color: #374151;
    line-height: 1.5;
  }

  .teachcharlie-tour-popover .driver-popover-navigation-btns button {
    background: #f97316;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    font-weight: 500;
  }

  .teachcharlie-tour-popover .driver-popover-navigation-btns button:hover {
    background: #ea580c;
  }

  .teachcharlie-tour-popover .driver-popover-close-btn {
    color: #9ca3af;
  }

  .teachcharlie-tour-popover .driver-popover-close-btn:hover {
    color: #4b5563;
  }
`;

let stylesInjected = false;

function injectTourStyles() {
  if (stylesInjected) return;

  const style = document.createElement('style');
  style.textContent = tourStyles;
  document.head.appendChild(style);
  stylesInjected = true;
}

// Start the create agent tour
export function startCreateAgentTour(onComplete?: () => void) {
  injectTourStyles();

  const driverInstance = driver({
    ...tourConfig,
    steps: createAgentTourSteps,
    onDestroyStarted: () => {
      onComplete?.();
      driverInstance.destroy();
    },
  });

  driverInstance.drive();
  return driverInstance;
}

// Highlight a specific element (for contextual help)
export function highlightElement(selector: string, title: string, description: string) {
  injectTourStyles();

  const driverInstance = driver({
    ...tourConfig,
    steps: [
      {
        element: selector,
        popover: {
          title,
          description,
          side: 'bottom',
          align: 'start',
        },
      },
    ],
  });

  driverInstance.drive();
  return driverInstance;
}
