import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import i18n from '@/lib/i18n';
import { logger } from '@/lib/logger';

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  autoSave: boolean;
  autoSaveInterval: number;
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
    screenReaderMode: boolean;
  };
}

interface AppState {
  // Settings
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  setLanguage: (language: string) => void;
  
  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  
  // Onboarding
  onboardingCompleted: boolean;
  setOnboardingCompleted: (completed: boolean) => void;
  
  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Notifications
  notifications: Array<{
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: number;
  }>;
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
}

// Get initial language from i18n (which reads from localStorage)
const getInitialLanguage = () => {
  try {
    const storedLang = localStorage.getItem('vizor-language');
    return storedLang || i18n.language || 'en';
  } catch (error) {
    if (error instanceof DOMException && error.name === 'SecurityError') {
      logger.warn('LocalStorage unavailable for language settings', { component: 'appStore' });
    }
    return i18n.language || 'en';
  }
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial settings
      settings: {
        theme: 'system',
        language: getInitialLanguage(),
        autoSave: true,
        autoSaveInterval: 5000,
        accessibility: {
          highContrast: false,
          largeText: false,
          reducedMotion: false,
          screenReaderMode: false,
        },
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      
      // Sync language with i18n
      setLanguage: (language) => {
        i18n.changeLanguage(language);
        localStorage.setItem('vizor-language', language);
        set((state) => ({
          settings: { ...state.settings, language },
        }));
      },
      
      // UI State
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      // Onboarding
      onboardingCompleted: false,
      setOnboardingCompleted: (completed) => set({ onboardingCompleted: completed }),
      
      // Loading
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
      
      // Notifications
      notifications: [],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            ...state.notifications,
            {
              ...notification,
              id: crypto.randomUUID(),
              timestamp: Date.now(),
            },
          ],
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
    }),
    {
      name: 'vizor-app-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        settings: state.settings,
        onboardingCompleted: state.onboardingCompleted,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
