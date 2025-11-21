/**
 * NetBox Device Role Service
 * Provides a convenient wrapper for NetBox device role operations using the configured NetBox settings
 */

import { NETBOX_CONFIG } from '../config/netbox';
import {
  fetchNetBoxDeviceRoles,
  createNetBoxDeviceRole,
  updateNetBoxDeviceRole,
  deleteNetBoxDeviceRole,
} from '../helpers/api/netboxDevicesApiHelper';
import type { NetBoxDeviceRole } from '../helpers/api/netboxDevicesApiHelper';

/**
 * Fetch all device roles from NetBox using the configured base URL and token
 */
export async function getNetBoxDeviceRoles(): Promise<NetBoxDeviceRole[]> {
  return fetchNetBoxDeviceRoles(NETBOX_CONFIG.BASE_URL, NETBOX_CONFIG.TOKEN);
}

/**
 * Create a new device role in NetBox using the configured base URL and token
 */
export async function addNetBoxDeviceRole(deviceRoleData: {
  name: string;
  slug?: string;
  color?: string;
  description?: string;
  vm_role?: boolean;
}): Promise<NetBoxDeviceRole> {
  return createNetBoxDeviceRole(
    NETBOX_CONFIG.BASE_URL,
    NETBOX_CONFIG.TOKEN,
    deviceRoleData
  );
}

/**
 * Update an existing device role in NetBox using the configured base URL and token
 */
export async function updateNetBoxDeviceRoleService(
  deviceRoleId: number,
  deviceRoleData: Partial<{
    name: string;
    slug?: string;
    color?: string;
    description?: string;
    vm_role?: boolean;
  }>
): Promise<NetBoxDeviceRole> {
  return updateNetBoxDeviceRole(
    NETBOX_CONFIG.BASE_URL,
    NETBOX_CONFIG.TOKEN,
    deviceRoleId,
    deviceRoleData
  );
}

/**
 * Delete a device role from NetBox using the configured base URL and token
 */
export async function deleteNetBoxDeviceRoleService(
  deviceRoleId: number
): Promise<void> {
  return deleteNetBoxDeviceRole(
    NETBOX_CONFIG.BASE_URL,
    NETBOX_CONFIG.TOKEN,
    deviceRoleId
  );
}


