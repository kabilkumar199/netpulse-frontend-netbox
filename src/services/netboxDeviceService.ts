/**
 * NetBox Device Service
 * Provides a convenient wrapper for NetBox device operations using the configured NetBox settings
 */

import { NETBOX_CONFIG } from '../config/netbox';
import { createNetBoxDevice, updateNetBoxDevice } from '../helpers/api/netboxDevicesApiHelper';
import type { NetBoxDevice, NetBoxDeviceCreatePayload } from '../types/netbox';

/**
 * Create a new device in NetBox using the configured base URL and token
 * @param deviceData Device creation payload
 * @returns Created NetBox device
 */
export async function addNetBoxDevice(
  deviceData: NetBoxDeviceCreatePayload
): Promise<NetBoxDevice> {
  return createNetBoxDevice(
    NETBOX_CONFIG.BASE_URL,
    NETBOX_CONFIG.TOKEN,
    deviceData
  );
}

/**
 * Update an existing device in NetBox using the configured base URL and token
 * @param deviceId Device ID
 * @param deviceData Partial device update payload
 * @returns Updated NetBox device
 */
export async function updateNetBoxDeviceService(
  deviceId: number,
  deviceData: Partial<NetBoxDeviceCreatePayload>
): Promise<NetBoxDevice> {
  return updateNetBoxDevice(
    NETBOX_CONFIG.BASE_URL,
    NETBOX_CONFIG.TOKEN,
    deviceId,
    deviceData
  );
}

