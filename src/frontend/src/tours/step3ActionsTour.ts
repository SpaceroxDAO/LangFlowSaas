import { driver } from 'driver.js';
import type { DriveStep, Config } from 'driver.js';
import 'driver.js/dist/driver.css';
import { injectTourStyles, baseTourConfig } from './tourStyles';

/**
 * Step 3: Actions Tour
 *
 * Guides users through selecting tools with 5 messages:
 * 1. Welcome to Step 3 - Actions overview
 * 2. Tools grid introduction
 * 3. Web Search & Calculator tools
 * 4. Knowledge Search highlight
 * 5. Ready to create message
 */

export const step3TourSteps: DriveStep[] = [
  // Message 1: Welcome to Step 3
  {
    popover: {
      title: "Give Your Agent Superpowers!",
      description: "Almost done! Now let's give your agent some special abilities. These tools are like teaching a dog new tricks - fetch data from the web, do math, check the weather, and more!",
      side: 'over',
      align: 'center',
    },
  },
  // Message 2: Tools grid introduction
  {
    element: '[data-tour="agent-actions"]',
    popover: {
      title: "Available Tools",
      description: "Here are all the tools your agent can use. Click on any tool to enable it. You can select as many or as few as you need - or none at all!",
      side: 'top',
      align: 'center',
    },
  },
  // Message 3: Basic tools
  {
    element: '[data-tour="tool-web-search"]',
    popover: {
      title: "Information at Your Fingertips",
      description: "Web Search lets your agent find current information online. Great for answering questions about recent news, facts, or anything that changes over time.",
      side: 'bottom',
      align: 'start',
    },
  },
  // Message 4: Knowledge Search
  {
    element: '[data-tour="tool-knowledge-search"]',
    popover: {
      title: "Your Own Knowledge Base",
      description: "This is powerful! Upload your own documents (PDFs, docs, text files) and your agent will search through them to answer questions. Perfect for FAQs, manuals, or company info.",
      side: 'bottom',
      align: 'start',
    },
  },
  // Message 5: Ready to create
  {
    element: '[data-tour="create-button"]',
    popover: {
      title: "You're All Set!",
      description: "When you're ready, click this button to create your agent. Don't worry - you can always come back and adjust the tools later!",
      side: 'top',
      align: 'end',
    },
  },
];

const tourConfig: Config = {
  ...baseTourConfig,
  showProgress: true,
  progressText: '{{current}} of {{total}}',
  doneBtnText: 'Let\'s Create!',
};

export function startStep3Tour(onComplete?: () => void) {
  injectTourStyles();

  const driverInstance = driver({
    ...tourConfig,
    steps: step3TourSteps,
    onDestroyStarted: () => {
      onComplete?.();
      driverInstance.destroy();
    },
  });

  driverInstance.drive();
  return driverInstance;
}
