import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Site, Link } from '../../types';

interface UIState {
  currentView: string;
  sidebarOpen: boolean;
  selectedSite: Site | null;
  selectedLink: Link | null;
  viewMode: 'list' | 'map' | 'topology';
  theme: 'light' | 'dark';
  notifications: Notification[];
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
}

const initialState: UIState = {
  currentView: 'nav-dashboard',
  sidebarOpen: false,
  selectedSite: null,
  selectedLink: null,
  viewMode: 'topology',
  theme: 'dark',
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrentView: (state, action: PayloadAction<string>) => {
      state.currentView = action.payload;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSelectedSite: (state, action: PayloadAction<Site | null>) => {
      state.selectedSite = action.payload;
    },
    setSelectedLink: (state, action: PayloadAction<Link | null>) => {
      state.selectedLink = action.payload;
    },
    setViewMode: (state, action: PayloadAction<'list' | 'map' | 'topology'>) => {
      state.viewMode = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  setCurrentView,
  setSidebarOpen,
  toggleSidebar,
  setSelectedSite,
  setSelectedLink,
  setViewMode,
  setTheme,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;
