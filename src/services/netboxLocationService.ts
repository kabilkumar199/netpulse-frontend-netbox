/**
 * NetBox Location Service
 * Provides a convenient wrapper for NetBox location operations using the configured NetBox settings
 */

import { NETBOX_CONFIG } from '../config/netbox';
import {
  fetchNetBoxLocations,
  createNetBoxLocation,
  updateNetBoxLocation,
  deleteNetBoxLocation,
} from '../helpers/api/netboxDevicesApiHelper';
import type { NetBoxLocation } from '../helpers/api/netboxDevicesApiHelper';

/**
 * Fetch all locations from NetBox using the configured base URL and token
 */
export async function getNetBoxLocations(): Promise<NetBoxLocation[]> {
  return fetchNetBoxLocations(NETBOX_CONFIG.BASE_URL, NETBOX_CONFIG.TOKEN);
}

/**
 * Create a new location in NetBox using the configured base URL and token
 */
export async function addNetBoxLocation(locationData: {
  name: string;
  slug?: string;
  site?: number;
  parent?: number;
  status?: 'active' | 'planned' | 'retired';
  description?: string;
  facility?: string;
  time_zone?: string;
  physical_address?: string;
  shipping_address?: string;
  latitude?: number;
  longitude?: number;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  comments?: string;
}): Promise<NetBoxLocation> {
  return createNetBoxLocation(
    NETBOX_CONFIG.BASE_URL,
    NETBOX_CONFIG.TOKEN,
    locationData
  );
}

/**
 * Update an existing location in NetBox using the configured base URL and token
 */
export async function updateNetBoxLocationService(
  locationId: number,
  locationData: Partial<{
    name: string;
    slug?: string;
    site?: number;
    parent?: number;
    status?: 'active' | 'planned' | 'retired';
    description?: string;
    facility?: string;
    time_zone?: string;
    physical_address?: string;
    shipping_address?: string;
    latitude?: number;
    longitude?: number;
    contact_name?: string;
    contact_phone?: string;
    contact_email?: string;
    comments?: string;
  }>
): Promise<NetBoxLocation> {
  return updateNetBoxLocation(
    NETBOX_CONFIG.BASE_URL,
    NETBOX_CONFIG.TOKEN,
    locationId,
    locationData
  );
}

/**
 * Delete a location from NetBox using the configured base URL and token
 */
export async function deleteNetBoxLocationService(
  locationId: number
): Promise<void> {
  return deleteNetBoxLocation(
    NETBOX_CONFIG.BASE_URL,
    NETBOX_CONFIG.TOKEN,
    locationId
  );
}


