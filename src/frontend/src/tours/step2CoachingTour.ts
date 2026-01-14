import { driver } from 'driver.js';
import type { DriveStep, Config } from 'driver.js';
import 'driver.js/dist/driver.css';
import { injectTourStyles, baseTourConfig } from './tourStyles';

/**
 * Step 2: Coaching Tour
 *
 * Guides users through writing instructions with 3 messages:
 * 1. Welcome to Step 2 - Coaching overview + pre-filled example note
 * 2. Instructions field - How to write good instructions
 * 3. Final guidance - Tips for success
 */

export const step2TourSteps: DriveStep[] = [
  // Message 1: Welcome to Step 2 + Example note
  {
    popover: {
      title: "Time to Coach Your Agent!",
      description: "Great job on Step 1! Now you'll write instructions that tell your agent how to behave. We've pre-filled an example for Charlie - read through it to see the format, then customize for your agent's job.",
      side: 'over',
      align: 'center',
    },
  },
  // Message 2: Instructions field
  {
    element: '[data-tour="agent-rules"]',
    popover: {
      title: "Write Your Training Rules",
      description: "This is where the magic happens! Write clear instructions like:\n\n- What personality should they have?\n- What topics should they focus on?\n- What should they NEVER do?\n- How should they respond to tricky questions?",
      side: 'top',
      align: 'start',
    },
  },
  // Message 3: Final guidance
  {
    popover: {
      title: "Pro Tip: Be Specific!",
      description: "The more specific your instructions, the better your agent will perform. Don't worry about getting it perfect - you can always come back and adjust the training later!",
      side: 'over',
      align: 'center',
    },
  },
];

const tourConfig: Config = {
  ...baseTourConfig,
  showProgress: true,
  progressText: '{{current}} of {{total}}',
  doneBtnText: 'Continue',
};

export function startStep2Tour(onComplete?: () => void) {
  injectTourStyles();

  const driverInstance = driver({
    ...tourConfig,
    steps: step2TourSteps,
    onDestroyStarted: () => {
      onComplete?.();
      driverInstance.destroy();
    },
  });

  driverInstance.drive();
  return driverInstance;
}
