import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { fetchDevices, clearDevices } from '../slices/devicesSlice';

/**
 * useDeviceList - hook aligned with simplified devicesSlice
 * Exposes: devices, loading, error, refresh, clear
 */
export const useDeviceList = () => {
  const dispatch = useDispatch();

  const devices = useSelector((state: RootState) => state.devices.devices);
  const loading = useSelector((state: RootState) => state.devices.loading);
  const error = useSelector((state: RootState) => state.devices.error);

  // Initial fetch
  useEffect(() => {
    dispatch(fetchDevices() as any);
  }, [dispatch]);

  const refresh = useCallback(() => {
    dispatch(fetchDevices() as any);
  }, [dispatch]);

  const clear = useCallback(() => {
    dispatch(clearDevices());
  }, [dispatch]);

  return {
    devices,
    loading,
    error,
    refresh,
    clear,
  };
};

export default useDeviceList;
