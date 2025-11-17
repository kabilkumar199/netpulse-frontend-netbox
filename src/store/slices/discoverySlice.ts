import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { DiscoveryScan } from '../../types';

interface DiscoveryState {
  scans: DiscoveryScan[];
  selectedScan: DiscoveryScan | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DiscoveryState = {
  scans: [],
  selectedScan: null,
  isLoading: false,
  error: null,
};

const discoverySlice = createSlice({
  name: 'discovery',
  initialState,
  reducers: {
    setScans: (state, action: PayloadAction<DiscoveryScan[]>) => {
      state.scans = action.payload;
    },
    addScan: (state, action: PayloadAction<DiscoveryScan>) => {
      state.scans.unshift(action.payload);
    },
    updateScan: (state, action: PayloadAction<DiscoveryScan>) => {
      const index = state.scans.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.scans[index] = action.payload;
      }
    },
    removeScan: (state, action: PayloadAction<string>) => {
      state.scans = state.scans.filter((s) => s.id !== action.payload);
    },
    setSelectedScan: (state, action: PayloadAction<DiscoveryScan | null>) => {
      state.selectedScan = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setScans,
  addScan,
  updateScan,
  removeScan,
  setSelectedScan,
  setLoading,
  setError,
  clearError,
} = discoverySlice.actions;

export default discoverySlice.reducer;
