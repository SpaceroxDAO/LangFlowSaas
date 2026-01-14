import { driver } from 'driver.js';
import type { DriveStep, Config } from 'driver.js';
import 'driver.js/dist/driver.css';
import { injectTourStyles, baseTourConfig } from './tourStyles';

/**
 * Step 1: Identity Tour
 *
 * Introduces users to agent creation with 3 messages:
 * 1. Welcome - Overview of the process
 * 2. Name field - Why naming matters
 * 3. Job description - Defining the agent's role
 */

export const step1TourSteps: DriveStep[] = [
  // Message 1: Welcome
  {
    popover: {
      title: "Welcome to Agent Creation!",
      description: "Think of this like setting up a new employee or training a puppy. We'll ask you three simple questions to get your AI agent ready for work. Let's start by giving it an identity!",
      side: 'over',
      align: 'center',
    },
  },
  // Message 2: Name field
  {
    element: '[data-tour="agent-name"]',
    popover: {
      title: "Give Your Agent a Name",
      description: "Every good agent needs a name! This is how you'll identify and find this agent later. Pick something memorable that reflects what it does.",
      side: 'bottom',
      align: 'start',
    },
  },
  // Message 3: Job description
  {
    element: '[data-tour="agent-job"]',
    popover: {
      title: "Define the Job Description",
      description: "Describe who your agent is and what job they have. Are they a customer support agent? A friendly assistant? A sales helper? Be specific - this shapes how they'll respond!",
      side: 'bottom',
      align: 'start',
    },
  },
];

const tourConfig: Config = {
  ...baseTourConfig,
  showProgress: true,
  progressText: '{{current}} of {{total}}',
  doneBtnText: 'Got it!',
};

export function startStep1Tour(onComplete?: () => void) {
  injectTourStyles();

  const driverInstance = driver({
    ...tourConfig,
    steps: step1TourSteps,
    onDestroyStarted: () => {
      onComplete?.();
      driverInstance.destroy();
    },
  });

  driverInstance.drive();
  return driverInstance;
}
