/**
 * Tour exports for Teach Charlie guided experiences
 *
 * The agent creation flow is split into step-specific tours:
 * - Step 1: Identity (3 messages)
 * - Step 2: Coaching (4 messages)
 * - Step 3: Actions (5 messages)
 * - Playground: Welcome message after creation
 */

export { startStep1Tour, step1TourSteps } from './step1IdentityTour';
export { startStep2Tour, step2TourSteps } from './step2CoachingTour';
export { startStep3Tour, step3TourSteps } from './step3ActionsTour';
export { startPlaygroundTour, playgroundTourSteps } from './playgroundTour';
export { injectTourStyles, baseTourConfig } from './tourStyles';

// Legacy export for backwards compatibility (combines all steps)
export { startCreateAgentTour, createAgentTourSteps, highlightElement } from './createAgentTour';
