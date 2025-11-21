/**
 * NetBox Site Service
 * Provides a convenient wrapper for NetBox site operations using the configured NetBox settings
 */

import { NETBOX_CONFIG } from '../config/netbox';
import {
  fetchNetBoxSites,
  createNetBoxSite,
  updateNetBoxSite,
  deleteNetBoxSite,
} from '../helpers/api/netboxDevicesApiHelper';
import type { NetBoxSite } from '../helpers/api/netboxDevicesApiHelper';

/**
 * Fetch all sites from NetBox using the configured base URL and token
 */
export async function getNetBoxSites(): Promise<NetBoxSite[]> {
  return fetchNetBoxSites(NETBOX_CONFIG.BASE_URL, NETBOX_CONFIG.TOKEN);
}

/**
 * Create a new site in NetBox using the configured base URL and token
 */
export async function addNetBoxSite(siteData: {
  name: string;
  slug?: string;
  status?: 'active' | 'planned' | 'retired';
  region?: number;
  group?: number;
  tenant?: number;
  facility?: string;
  time_zone?: string;
  description?: string;
  physical_address?: string;
  shipping_address?: string;
  latitude?: number;
  longitude?: number;
  comments?: string;
}): Promise<NetBoxSite> {
  return createNetBoxSite(
    NETBOX_CONFIG.BASE_URL,
    NETBOX_CONFIG.TOKEN,
    siteData
  );
}

/**
 * Update an existing site in NetBox using the configured base URL and token
 */
export async function updateNetBoxSiteService(
  siteId: number,
  siteData: Partial<{
    name: string;
    slug?: string;
    status?: 'active' | 'planned' | 'retired';
    region?: number;
    group?: number;
    tenant?: number;
    facility?: string;
    time_zone?: string;
    description?: string;
    physical_address?: string;
    shipping_address?: string;
    latitude?: number;
    longitude?: number;
    comments?: string;
  }>
): Promise<NetBoxSite> {
  return updateNetBoxSite(
    NETBOX_CONFIG.BASE_URL,
    NETBOX_CONFIG.TOKEN,
    siteId,
    siteData
  );
}

/**
 * Delete a site from NetBox using the configured base URL and token
 */
export async function deleteNetBoxSiteService(
  siteId: number
): Promise<void> {
  return deleteNetBoxSite(
    NETBOX_CONFIG.BASE_URL,
    NETBOX_CONFIG.TOKEN,
    siteId
  );
}


