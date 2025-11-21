/**
 * Zustand Store for Devices
 * Replaces Redux devicesSlice
 */

import { create } from 'zustand';
import axios from 'axios';

export const GET_DEVICES_DATA = `http://10.4.160.240:8081/device`;

// Define device type based on your backend response
export interface Device {
  id: string;
  hostname: string;
  ipAddress?: string;
  vendor?: string;
  model?: string;
  [key: string]: any; // fallback for additional dynamic keys
}

interface DevicesState {
  devices: Device[];
  loading: boolean;
  error: string | null;
}

interface DevicesActions {
  fetchDevices: () => Promise<void>;
  addDevice: (payload: Partial<Device>) => Promise<void>;
  clearDevices: () => void;
  setDevices: (devices: Device[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

type DevicesStore = DevicesState & DevicesActions;

export const useDevicesStore = create<DevicesStore>((set, get) => ({
  devices: [],
  loading: false,
  error: null,

  fetchDevices: async () => {
    set({ loading: true, error: null });
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get<Device[]>(GET_DEVICES_DATA, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ devices: response.data, loading: false });
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || 'Failed to fetch devices',
      });
      throw error;
    }
  },

  addDevice: async (payload) => {
    set({ loading: true, error: null });
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post<Device>(GET_DEVICES_DATA, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      set((state) => ({
        devices: [response.data, ...state.devices],
        loading: false,
      }));
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || 'Failed to add device',
      });
      throw error;
    }
  },

  clearDevices: () => set({ devices: [], error: null }),

  setDevices: (devices) => set({ devices }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),
}));

