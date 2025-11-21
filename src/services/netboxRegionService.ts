/**
 * NetBox Region Service
 * Provides a convenient wrapper for NetBox region operations using the configured NetBox settings
 */

import { NETBOX_CONFIG } from '../config/netbox';
import {
  fetchNetBoxRegions,
  createNetBoxRegion,
  updateNetBoxRegion,
  deleteNetBoxRegion,
} from '../helpers/api/netboxDevicesApiHelper';
import type { NetBoxRegion } from '../helpers/api/netboxDevicesApiHelper';

/**
 * Fetch all regions from NetBox using the configured base URL and token
 */
export async function getNetBoxRegions(): Promise<NetBoxRegion[]> {
  return fetchNetBoxRegions(NETBOX_CONFIG.BASE_URL, NETBOX_CONFIG.TOKEN);
}

/**
 * Create a new region in NetBox using the configured base URL and token
 */
export async function addNetBoxRegion(regionData: {
  name: string;
  slug?: string;
  description?: string;
  parent?: number;
}): Promise<NetBoxRegion> {
  return createNetBoxRegion(
    NETBOX_CONFIG.BASE_URL,
    NETBOX_CONFIG.TOKEN,
    regionData
  );
}

/**
 * Update an existing region in NetBox using the configured base URL and token
 */
export async function updateNetBoxRegionService(
  regionId: number,
  regionData: Partial<{
    name: string;
    slug?: string;
    description?: string;
    parent?: number;
  }>
): Promise<NetBoxRegion> {
  return updateNetBoxRegion(
    NETBOX_CONFIG.BASE_URL,
    NETBOX_CONFIG.TOKEN,
    regionId,
    regionData
  );
}

/**
 * Delete a region from NetBox using the configured base URL and token
 */
export async function deleteNetBoxRegionService(
  regionId: number
): Promise<void> {
  return deleteNetBoxRegion(
    NETBOX_CONFIG.BASE_URL,
    NETBOX_CONFIG.TOKEN,
    regionId
  );
}


