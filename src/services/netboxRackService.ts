/**
 * NetBox Rack Service
 * Provides a convenient wrapper for NetBox rack operations using the configured NetBox settings
 */

import { NETBOX_CONFIG } from '../config/netbox';
import {
  fetchNetBoxRacks,
  createNetBoxRack,
  updateNetBoxRack,
  deleteNetBoxRack,
} from '../helpers/api/netboxDevicesApiHelper';
import type { NetBoxRack } from '../helpers/api/netboxDevicesApiHelper';

/**
 * Fetch all racks from NetBox using the configured base URL and token
 */
export async function getNetBoxRacks(): Promise<NetBoxRack[]> {
  return fetchNetBoxRacks(NETBOX_CONFIG.BASE_URL, NETBOX_CONFIG.TOKEN);
}

/**
 * Create a new rack in NetBox using the configured base URL and token
 */
export async function addNetBoxRack(rackData: {
  name: string;
  site: number;
  location?: number;
  tenant?: number;
  status?: 'available' | 'reserved' | 'deprecated' | 'planned';
  role?: number;
  serial?: string;
  asset_tag?: string;
  type?: '2-post-frame' | '4-post-frame' | '4-post-cabinet' | 'wall-frame' | 'wall-cabinet';
  width?: number;
  u_height?: number;
  desc_units?: boolean;
  outer_width?: number;
  outer_depth?: number;
  outer_unit?: 'mm' | 'in';
  weight?: number;
  max_weight?: number;
  weight_unit?: 'kg' | 'g' | 'lb' | 'oz';
  mounting_depth?: number;
  airflow?: 'front-to-rear' | 'rear-to-front' | 'left-to-right' | 'right-to-left' | 'side-to-rear' | 'passive' | 'mixed';
  facility_id?: string;
  description?: string;
  comments?: string;
}): Promise<NetBoxRack> {
  return createNetBoxRack(
    NETBOX_CONFIG.BASE_URL,
    NETBOX_CONFIG.TOKEN,
    rackData
  );
}

/**
 * Update an existing rack in NetBox using the configured base URL and token
 */
export async function updateNetBoxRackService(
  rackId: number,
  rackData: Partial<{
    name: string;
    site: number;
    location?: number;
    tenant?: number;
    status?: 'available' | 'reserved' | 'deprecated' | 'planned';
    role?: number;
    serial?: string;
    asset_tag?: string;
    type?: '2-post-frame' | '4-post-frame' | '4-post-cabinet' | 'wall-frame' | 'wall-cabinet';
    width?: number;
    u_height?: number;
    desc_units?: boolean;
    outer_width?: number;
    outer_depth?: number;
    outer_unit?: 'mm' | 'in';
    weight?: number;
    max_weight?: number;
    weight_unit?: 'kg' | 'g' | 'lb' | 'oz';
    mounting_depth?: number;
    airflow?: 'front-to-rear' | 'rear-to-front' | 'left-to-right' | 'right-to-left' | 'side-to-rear' | 'passive' | 'mixed';
    facility_id?: string;
    description?: string;
    comments?: string;
  }>
): Promise<NetBoxRack> {
  return updateNetBoxRack(
    NETBOX_CONFIG.BASE_URL,
    NETBOX_CONFIG.TOKEN,
    rackId,
    rackData
  );
}

/**
 * Delete a rack from NetBox using the configured base URL and token
 */
export async function deleteNetBoxRackService(
  rackId: number
): Promise<void> {
  return deleteNetBoxRack(
    NETBOX_CONFIG.BASE_URL,
    NETBOX_CONFIG.TOKEN,
    rackId
  );
}


