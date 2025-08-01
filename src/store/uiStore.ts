import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIState {
  // Navigation
  activeTab: number;
  
  // Loading states (for optimistic updates)
  isVoting: Record<string, boolean>;
  
  // Error states
  globalError: string | null;
}

interface UIActions {
  // Navigation
  setActiveTab: (tab: number) => void;
  
  // Loading states
  setVoting: (imageId: string, isVoting: boolean) => void;
  
  // Error handling
  setGlobalError: (error: string | null) => void;
  clearGlobalError: () => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()(
  devtools(
    (set) => ({
      // Initial state
      activeTab: 0,
      isVoting: {},
      globalError: null,

      // Actions
      setActiveTab: (tab: number) => set({ activeTab: tab }),
      
      setVoting: (imageId: string, isVoting: boolean) =>
        set((state) => ({
          isVoting: {
            ...state.isVoting,
            [imageId]: isVoting,
          },
        })),
      
      setGlobalError: (error: string | null) => set({ globalError: error }),
      clearGlobalError: () => set({ globalError: null }),
    }),
    {
      name: 'ui-store',
    }
  )
);