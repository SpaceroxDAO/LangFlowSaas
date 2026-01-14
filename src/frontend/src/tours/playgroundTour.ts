import { driver } from 'driver.js';
import type { DriveStep, Config } from 'driver.js';
import 'driver.js/dist/driver.css';
import { injectTourStyles, baseTourConfig } from './tourStyles';

/**
 * Playground Tour
 *
 * Welcomes users to the playground after creating an agent:
 * 1. Congratulations message
 * 2. Chat interface introduction
 * 3. Input area explanation
 * 4. Tips for testing
 */

export const playgroundTourSteps: DriveStep[] = [
  // Message 1: Congratulations!
  {
    popover: {
      title: "Your Agent is Ready!",
      description: "Congratulations! You've successfully created your AI agent. This is the Playground where you can chat with your agent and test how it responds to different questions.",
      side: 'over',
      align: 'center',
    },
  },
  // Message 2: Messages area
  {
    element: '[data-tour="playground-messages"]',
    popover: {
      title: "Chat History",
      description: "Your conversations will appear here. Each message shows who sent it - you or your agent. Try sending a message to see your agent in action!",
      side: 'bottom',
      align: 'center',
    },
  },
  // Message 3: Input area
  {
    element: '[data-tour="playground-input"]',
    popover: {
      title: "Start Chatting",
      description: "Type your message here and press Enter or click the send button. You can also attach files or use voice input!",
      side: 'top',
      align: 'center',
    },
  },
  // Message 4: Tips
  {
    popover: {
      title: "Pro Tips for Testing",
      description: "Try different types of questions to see how your agent responds. If something doesn't work right, you can go back and adjust the training instructions. Happy chatting!",
      side: 'over',
      align: 'center',
    },
  },
];

const tourConfig: Config = {
  ...baseTourConfig,
  showProgress: true,
  progressText: '{{current}} of {{total}}',
  doneBtnText: 'Start Chatting!',
};

export function startPlaygroundTour(onComplete?: () => void) {
  injectTourStyles();

  const driverInstance = driver({
    ...tourConfig,
    steps: playgroundTourSteps,
    onDestroyStarted: () => {
      onComplete?.();
      driverInstance.destroy();
    },
  });

  driverInstance.drive();
  return driverInstance;
}
