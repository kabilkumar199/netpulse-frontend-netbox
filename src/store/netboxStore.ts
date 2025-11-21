/**
 * Zustand Store for NetBox Device Management
 * Manages device types, roles, sites, and created devices
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  NetBoxDevice,
  NetBoxDeviceCreatePayload,
} from '../types/netbox';
import type {
  NetBoxDeviceType,
  NetBoxDeviceRole,
  NetBoxSite,
} from '../helpers/api/netboxDevicesApiHelper';
import {
  fetchNetBoxDeviceTypes,
  fetchNetBoxDeviceRoles,
  fetchNetBoxSites,
} from '../helpers/api/netboxDevicesApiHelper';
import { addNetBoxDevice } from '../services/netboxDeviceService';
import { NETBOX_CONFIG } from '../config/netbox';

interface NetBoxStore {
  // Device Options (from API)
  deviceTypes: NetBoxDeviceType[];
  deviceRoles: NetBoxDeviceRole[];
  sites: NetBoxSite[];
  
  // Created Devices
  createdDevices: NetBoxDevice[];
  
  // Loading States
  isLoadingOptions: boolean;
  isCreatingDevice: boolean;
  
  // Error States
  optionsError: string | null;
  createError: string | null;
  
  // Last fetch timestamps (for cache invalidation)
  lastFetchedOptions: number | null;
  
  // Actions
  fetchDeviceOptions: () => Promise<void>;
  createDevice: (deviceData: NetBoxDeviceCreatePayload) => Promise<NetBoxDevice>;
  addCreatedDevice: (device: NetBoxDevice) => void;
  clearCreatedDevices: () => void;
  clearErrors: () => void;
  setDeviceTypes: (types: NetBoxDeviceType[]) => void;
  setDeviceRoles: (roles: NetBoxDeviceRole[]) => void;
  setSites: (sites: NetBoxSite[]) => void;
}

export const useNetBoxStore = create<NetBoxStore>()(
  persist(
    (set, get) => ({
      // Initial State
      deviceTypes: [],
      deviceRoles: [],
      sites: [],
      createdDevices: [],
      isLoadingOptions: false,
      isCreatingDevice: false,
      optionsError: null,
      createError: null,
      lastFetchedOptions: null,

      // Fetch device options (types, roles, sites)
      fetchDeviceOptions: async () => {
        const state = get();
        
        // Check if we have cached data (less than 5 minutes old)
        const fiveMinutes = 5 * 60 * 1000;
        if (
          state.lastFetchedOptions &&
          Date.now() - state.lastFetchedOptions < fiveMinutes &&
          state.deviceTypes.length > 0 &&
          state.deviceRoles.length > 0 &&
          state.sites.length > 0
        ) {
          // Use cached data
          return;
        }

        set({ isLoadingOptions: true, optionsError: null });

        try {
          const [types, roles, sites] = await Promise.all([
            fetchNetBoxDeviceTypes(NETBOX_CONFIG.BASE_URL, NETBOX_CONFIG.TOKEN),
            fetchNetBoxDeviceRoles(NETBOX_CONFIG.BASE_URL, NETBOX_CONFIG.TOKEN),
            fetchNetBoxSites(NETBOX_CONFIG.BASE_URL, NETBOX_CONFIG.TOKEN),
          ]);

          set({
            deviceTypes: types,
            deviceRoles: roles,
            sites: sites,
            isLoadingOptions: false,
            optionsError: null,
            lastFetchedOptions: Date.now(),
          });
        } catch (error: any) {
          console.error('Error fetching NetBox options:', error);
          set({
            isLoadingOptions: false,
            optionsError: error?.message || 'Failed to fetch device options',
          });
          throw error;
        }
      },

      // Create a new device
      createDevice: async (deviceData: NetBoxDeviceCreatePayload) => {
        set({ isCreatingDevice: true, createError: null });

        try {
          const device = await addNetBoxDevice(deviceData);
          
          // Add to created devices list
          set((state) => ({
            createdDevices: [device, ...state.createdDevices],
            isCreatingDevice: false,
            createError: null,
          }));

          return device;
        } catch (error: any) {
          console.error('Error creating device:', error);
          set({
            isCreatingDevice: false,
            createError: error?.message || 'Failed to create device',
          });
          throw error;
        }
      },

      // Manually add a created device (for external use)
      addCreatedDevice: (device: NetBoxDevice) => {
        set((state) => ({
          createdDevices: [device, ...state.createdDevices],
        }));
      },

      // Clear created devices list
      clearCreatedDevices: () => {
        set({ createdDevices: [] });
      },

      // Clear all errors
      clearErrors: () => {
        set({ optionsError: null, createError: null });
      },

      // Manual setters (for flexibility)
      setDeviceTypes: (types: NetBoxDeviceType[]) => {
        set({ deviceTypes: types });
      },

      setDeviceRoles: (roles: NetBoxDeviceRole[]) => {
        set({ deviceRoles: roles });
      },

      setSites: (sites: NetBoxSite[]) => {
        set({ sites: sites });
      },
    }),
    {
      name: 'netbox-store', // localStorage key
      partialize: (state) => ({
        // Only persist certain fields
        deviceTypes: state.deviceTypes,
        deviceRoles: state.deviceRoles,
        sites: state.sites,
        createdDevices: state.createdDevices,
        lastFetchedOptions: state.lastFetchedOptions,
      }),
    }
  )
);

