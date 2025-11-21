/**
 * Zustand Store for UI State
 * Replaces Redux uiSlice
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Site, Link } from '../types';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
}

interface UIState {
  currentView: string;
  sidebarOpen: boolean;
  selectedSite: Site | null;
  selectedLink: Link | null;
  viewMode: 'list' | 'map' | 'topology';
  theme: 'light' | 'dark';
  notifications: Notification[];
}

interface UIActions {
  setCurrentView: (view: string) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSelectedSite: (site: Site | null) => void;
  setSelectedLink: (link: Link | null) => void;
  setViewMode: (mode: 'list' | 'map' | 'topology') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      currentView: 'nav-dashboard',
      sidebarOpen: false,
      selectedSite: null,
      selectedLink: null,
      viewMode: 'topology',
      theme: 'dark',
      notifications: [],

      setCurrentView: (view) => set({ currentView: view }),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSelectedSite: (site) => set({ selectedSite: site }),

      setSelectedLink: (link) => set({ selectedLink: link }),

      setViewMode: (mode) => set({ viewMode: mode }),

      setTheme: (theme) => set({ theme }),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: Date.now().toString(),
              timestamp: new Date(),
            },
            ...state.notifications,
          ],
        })),

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({
        currentView: state.currentView,
        sidebarOpen: state.sidebarOpen,
        viewMode: state.viewMode,
        theme: state.theme,
      }),
    }
  )
);

