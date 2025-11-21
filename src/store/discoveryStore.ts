/**
 * Zustand Store for Discovery Scans
 * Replaces Redux discoverySlice
 */

import { create } from 'zustand';
import type { DiscoveryScan } from '../types';

interface DiscoveryState {
  scans: DiscoveryScan[];
  selectedScan: DiscoveryScan | null;
  isLoading: boolean;
  error: string | null;
}

interface DiscoveryActions {
  setScans: (scans: DiscoveryScan[]) => void;
  addScan: (scan: DiscoveryScan) => void;
  updateScan: (scan: DiscoveryScan) => void;
  removeScan: (id: string) => void;
  setSelectedScan: (scan: DiscoveryScan | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type DiscoveryStore = DiscoveryState & DiscoveryActions;

export const useDiscoveryStore = create<DiscoveryStore>((set) => ({
  scans: [],
  selectedScan: null,
  isLoading: false,
  error: null,

  setScans: (scans) => set({ scans }),

  addScan: (scan) =>
    set((state) => ({
      scans: [scan, ...state.scans],
    })),

  updateScan: (scan) =>
    set((state) => {
      const index = state.scans.findIndex((s) => s.id === scan.id);
      if (index === -1) return state;
      const newScans = [...state.scans];
      newScans[index] = scan;
      return { scans: newScans };
    }),

  removeScan: (id) =>
    set((state) => ({
      scans: state.scans.filter((s) => s.id !== id),
    })),

  setSelectedScan: (scan) => set({ selectedScan: scan }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}));

