import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
 import type { AppDispatch } from "../store";

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

export interface DevicesState {
  devices: Device[];
  loading: boolean;
  error: string | null;
}

const initialState: DevicesState = {
  devices: [],
  loading: false,
  error: null,
};

const devicesSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    fetchDevicesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDevicesSuccess: (state, action: PayloadAction<Device[]>) => {
      state.loading = false;
      state.devices = action.payload;
    },
    fetchDevicesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Add device reducers
    addDeviceStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addDeviceSuccess: (state, action: PayloadAction<Device>) => {
      state.loading = false;
      // Prepend newly created device for visibility
      state.devices = [action.payload, ...state.devices];
    },
    addDeviceFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearDevices: (state) => {
      state.devices = [];
      state.error = null;
    },
  },
});

export const {
  fetchDevicesStart,
  fetchDevicesSuccess,
  fetchDevicesFailure,
  addDeviceStart,
  addDeviceSuccess,
  addDeviceFailure,
  clearDevices,
} = devicesSlice.actions;

// ✅ Async action (manual, no createAsyncThunk)
export const fetchDevices = () => async (dispatch: AppDispatch) => {
  dispatch(fetchDevicesStart());
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.get<Device[]>(GET_DEVICES_DATA, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(fetchDevicesSuccess(response.data));
  } catch (error: any) {
    dispatch(
      fetchDevicesFailure(
        error.response?.data?.message || "Failed to fetch devices"
      )
    );
  }
};

// ✅ Create device
export const addDevice = (payload: Partial<Device>) => async (dispatch: AppDispatch) => {
  dispatch(addDeviceStart());
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.post<Device>(GET_DEVICES_DATA, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    dispatch(addDeviceSuccess(response.data));
  } catch (error: any) {
    dispatch(
      addDeviceFailure(
        error.response?.data?.message || "Failed to add device"
      )
    );
  }
};

export default devicesSlice.reducer;
