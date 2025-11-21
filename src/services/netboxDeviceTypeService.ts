/**
 * NetBox Device Type Service
 * Provides a convenient wrapper for NetBox device type operations using the configured NetBox settings
 */

import { NETBOX_CONFIG } from '../config/netbox';
import {
  fetchNetBoxDeviceTypes,
  createNetBoxDeviceType,
  updateNetBoxDeviceType,
  deleteNetBoxDeviceType,
} from '../helpers/api/netboxDevicesApiHelper';
import type { NetBoxDeviceType } from '../helpers/api/netboxDevicesApiHelper';

/**
 * Fetch all device types from NetBox using the configured base URL and token
 */
export async function getNetBoxDeviceTypes(): Promise<NetBoxDeviceType[]> {
  return fetchNetBoxDeviceTypes(NETBOX_CONFIG.BASE_URL, NETBOX_CONFIG.TOKEN);
}

/**
 * Create a new device type in NetBox using the configured base URL and token
 */
export async function addNetBoxDeviceType(deviceTypeData: {
  manufacturer: number;
  model: string;
  slug?: string;
  part_number?: string;
  u_height?: number;
  is_full_depth?: boolean;
  subdevice_role?: string;
  airflow?: string;
  weight?: number;
  weight_unit?: string;
  description?: string;
  comments?: string;
}): Promise<NetBoxDeviceType> {
  return createNetBoxDeviceType(
    NETBOX_CONFIG.BASE_URL,
    NETBOX_CONFIG.TOKEN,
    deviceTypeData
  );
}

/**
 * Update an existing device type in NetBox using the configured base URL and token
 */
export async function updateNetBoxDeviceTypeService(
  deviceTypeId: number,
  deviceTypeData: Partial<{
    manufacturer: number;
    model: string;
    slug?: string;
    part_number?: string;
    u_height?: number;
    is_full_depth?: boolean;
    subdevice_role?: string;
    airflow?: string;
    weight?: number;
    weight_unit?: string;
    description?: string;
    comments?: string;
  }>
): Promise<NetBoxDeviceType> {
  return updateNetBoxDeviceType(
    NETBOX_CONFIG.BASE_URL,
    NETBOX_CONFIG.TOKEN,
    deviceTypeId,
    deviceTypeData
  );
}

/**
 * Delete a device type from NetBox using the configured base URL and token
 */
export async function deleteNetBoxDeviceTypeService(
  deviceTypeId: number
): Promise<void> {
  return deleteNetBoxDeviceType(
    NETBOX_CONFIG.BASE_URL,
    NETBOX_CONFIG.TOKEN,
    deviceTypeId
  );
}

