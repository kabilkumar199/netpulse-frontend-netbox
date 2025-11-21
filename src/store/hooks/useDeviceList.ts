import { useCallback, useEffect } from 'react';
import { useDevicesStore } from '../devicesStore';

/**
 * useDeviceList - hook using Zustand devicesStore
 * Exposes: devices, loading, error, refresh, clear
 */
export const useDeviceList = () => {
  const { devices, loading, error, fetchDevices, clearDevices } = useDevicesStore();

  // Initial fetch
  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const refresh = useCallback(() => {
    fetchDevices();
  }, [fetchDevices]);

  const clear = useCallback(() => {
    clearDevices();
  }, [clearDevices]);

  return {
    devices,
    loading,
    error,
    refresh,
    clear,
  };
};

export default useDeviceList;
