import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';

// Tour state for tracking user progress through educational content
interface TourState {
  hasSeenCreateTour: boolean;
  hasSeenCanvasTour: boolean;
  hasSeenPlaygroundTour: boolean;
  currentDisclosureLevel: 1 | 2 | 3 | 4; // Progressive complexity levels
  completedTours: string[];
}

interface TourContextValue extends TourState {
  startTour: (tourId: string) => void;
  completeTour: (tourId: string) => void;
  setDisclosureLevel: (level: 1 | 2 | 3 | 4) => void;
  resetTours: () => void;
}

const defaultState: TourState = {
  hasSeenCreateTour: false,
  hasSeenCanvasTour: false,
  hasSeenPlaygroundTour: false,
  currentDisclosureLevel: 1, // Start at beginner level
  completedTours: [],
};

const TourContext = createContext<TourContextValue | null>(null);

const STORAGE_KEY = 'teachcharlie_tour_state';

export function TourProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TourState>(() => {
    // Load from localStorage on init
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultState, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to load tour state from localStorage:', e);
    }
    return defaultState;
  });

  // Persist to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save tour state to localStorage:', e);
    }
  }, [state]);

  const startTour = useCallback((tourId: string) => {
    console.log(`Starting tour: ${tourId}`);
    // Tour logic handled by individual components using Driver.js
  }, []);

  const completeTour = useCallback((tourId: string) => {
    setState(prev => {
      const newState = {
        ...prev,
        completedTours: [...new Set([...prev.completedTours, tourId])],
      };

      // Update specific tour flags
      if (tourId === 'create-agent') {
        newState.hasSeenCreateTour = true;
      } else if (tourId === 'canvas') {
        newState.hasSeenCanvasTour = true;
      } else if (tourId === 'playground') {
        newState.hasSeenPlaygroundTour = true;
      }

      return newState;
    });
  }, []);

  const setDisclosureLevel = useCallback((level: 1 | 2 | 3 | 4) => {
    setState(prev => ({ ...prev, currentDisclosureLevel: level }));
  }, []);

  const resetTours = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <TourContext.Provider
      value={{
        ...state,
        startTour,
        completeTour,
        setDisclosureLevel,
        resetTours,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}

// Hook for checking if a tour should be shown
export function useShouldShowTour(tourId: string): boolean {
  const { completedTours } = useTour();
  return !completedTours.includes(tourId);
}
