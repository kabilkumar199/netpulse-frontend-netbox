/**
 * NetBox Manufacturer Service
 * Provides a convenient wrapper for NetBox manufacturer operations using the configured NetBox settings
 */

import { NETBOX_CONFIG } from '../config/netbox';
import {
  fetchNetBoxManufacturers,
  createNetBoxManufacturer,
  updateNetBoxManufacturer,
  deleteNetBoxManufacturer,
} from '../helpers/api/netboxDevicesApiHelper';
import type { NetBoxManufacturer } from '../helpers/api/netboxDevicesApiHelper';

/**
 * Fetch all manufacturers from NetBox using the configured base URL and token
 */
export async function getNetBoxManufacturers(): Promise<NetBoxManufacturer[]> {
  return fetchNetBoxManufacturers(NETBOX_CONFIG.BASE_URL, NETBOX_CONFIG.TOKEN);
}

/**
 * Create a new manufacturer in NetBox using the configured base URL and token
 */
export async function addNetBoxManufacturer(manufacturerData: {
  name: string;
  slug?: string;
  description?: string;
}): Promise<NetBoxManufacturer> {
  return createNetBoxManufacturer(
    NETBOX_CONFIG.BASE_URL,
    NETBOX_CONFIG.TOKEN,
    manufacturerData
  );
}

/**
 * Update an existing manufacturer in NetBox using the configured base URL and token
 */
export async function updateNetBoxManufacturerService(
  manufacturerId: number,
  manufacturerData: Partial<{
    name: string;
    slug?: string;
    description?: string;
  }>
): Promise<NetBoxManufacturer> {
  return updateNetBoxManufacturer(
    NETBOX_CONFIG.BASE_URL,
    NETBOX_CONFIG.TOKEN,
    manufacturerId,
    manufacturerData
  );
}

/**
 * Delete a manufacturer from NetBox using the configured base URL and token
 */
export async function deleteNetBoxManufacturerService(
  manufacturerId: number
): Promise<void> {
  return deleteNetBoxManufacturer(
    NETBOX_CONFIG.BASE_URL,
    NETBOX_CONFIG.TOKEN,
    manufacturerId
  );
}


