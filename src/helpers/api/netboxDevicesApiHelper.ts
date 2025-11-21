import axios from 'axios';
import type { NetBoxDevice, NetBoxDeviceCreatePayload, NetBoxAPIResponse } from '../../types/netbox';
import { NETBOX_API_ENDPOINTS } from '../url_helper';

// NetBox lookup types
export interface NetBoxDeviceType {
  id: number;
  display: string;
  manufacturer: { id: number; name: string; slug?: string };
  model: string;
  slug?: string;
  part_number?: string;
  u_height?: number;
  is_full_depth?: boolean;
  airflow?: string;
  weight?: number;
  weight_unit?: string;
  description?: string;
  comments?: string;
}

export interface NetBoxDeviceRole {
  id: number;
  display: string;
  name: string;
  slug?: string;
  color?: string;
  description?: string;
  vm_role?: boolean;
  config_template?: any;
}

export interface NetBoxSite {
  id: number;
  url?: string;
  display: string;
  name: string;
  slug: string;
  status?: {
    value: 'active' | 'planned' | 'retired';
    label: string;
  };
  region?: {
    id: number;
    url?: string;
    display: string;
    name: string;
    slug: string;
  };
  group?: {
    id: number;
    url?: string;
    display: string;
    name: string;
    slug: string;
  };
  tenant?: {
    id: number;
    url?: string;
    display: string;
    name: string;
    slug: string;
  };
  facility?: string;
  time_zone?: string;
  description?: string;
  physical_address?: string;
  shipping_address?: string;
  latitude?: number;
  longitude?: number;
  comments?: string;
  device_count?: number;
  prefix_count?: number;
  rack_count?: number;
  virtualmachine_count?: number;
  vlan_count?: number;
}

export interface NetBoxPlatform {
  id: number;
  display: string;
  name: string;
}

export interface NetBoxTenant {
  id: number;
  display: string;
  name: string;
}

export interface NetBoxManufacturer {
  id: number;
  display: string;
  name: string;
  slug: string;
  description?: string;
}

export interface NetBoxRegion {
  id: number;
  display: string;
  name: string;
  slug: string;
  description?: string;
  parent?: {
    id: number;
    display: string;
    name: string;
    slug: string;
  };
  _depth?: number;
}

export interface NetBoxLocation {
  id: number;
  url?: string;
  display: string;
  name: string;
  slug: string;
  description?: string;
  site?: {
    id: number;
    url?: string;
    display: string;
    name: string;
    slug: string;
  };
  parent?: {
    id: number;
    url?: string;
    display: string;
    name: string;
    slug: string;
  };
  status?: {
    value: 'active' | 'planned' | 'retired';
    label: string;
  };
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
  device_count?: number;
  rack_count?: number;
  _depth?: number;
}

export interface NetBoxRack {
  id: number;
  url?: string;
  display: string;
  name: string;
  facility_id?: string;
  site: {
    id: number;
    url?: string;
    display: string;
    name: string;
    slug: string;
  };
  location?: {
    id: number;
    url?: string;
    display: string;
    name: string;
    slug: string;
  };
  tenant?: {
    id: number;
    url?: string;
    display: string;
    name: string;
    slug: string;
  };
  status?: {
    value: 'available' | 'reserved' | 'deprecated' | 'planned';
    label: string;
  };
  role?: {
    id: number;
    url?: string;
    display: string;
    name: string;
    slug: string;
  };
  serial?: string;
  asset_tag?: string;
  type?: {
    value: '2-post-frame' | '4-post-frame' | '4-post-cabinet' | 'wall-frame' | 'wall-cabinet';
    label: string;
  };
  width?: {
    value: number;
    label: string;
  };
  u_height?: number;
  desc_units?: boolean;
  outer_width?: number;
  outer_depth?: number;
  outer_unit?: 'mm' | 'in';
  weight?: number;
  max_weight?: number;
  weight_unit?: 'kg' | 'g' | 'lb' | 'oz';
  mounting_depth?: number;
  airflow?: {
    value: 'front-to-rear' | 'rear-to-front' | 'left-to-right' | 'right-to-left' | 'side-to-rear' | 'passive' | 'mixed';
    label: string;
  };
  description?: string;
  comments?: string;
  device_count?: number;
  powerfeed_count?: number;
}

/**
 * Create a new device in NetBox
 * @param baseUrl NetBox base URL (e.g., "http://172.27.1.69:8000")
 * @param token NetBox API token
 * @param deviceData Device creation payload
 * @returns Created NetBox device
 */
export async function createNetBoxDevice(
  baseUrl: string,
  token: string,
  deviceData: NetBoxDeviceCreatePayload
): Promise<NetBoxDevice> {
  try {
    const response = await axios.post<NetBoxDevice>(
      `${baseUrl}${NETBOX_API_ENDPOINTS.CREATE_DEVICE_URL}`,
      deviceData,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    // Handle NetBox API error format
    if (error.response?.data) {
      const errorData = error.response.data;
      
      // NetBox returns validation errors in a specific format
      if (errorData.detail) {
        throw new Error(Array.isArray(errorData.detail) 
          ? errorData.detail.map((err: any) => 
              typeof err === 'string' ? err : `${err.loc?.join('.')}: ${err.msg}`
            ).join(', ')
          : errorData.detail
        );
      }
      
      // Handle field-specific errors
      if (typeof errorData === 'object') {
        const fieldErrors = Object.entries(errorData)
          .map(([field, messages]) => {
            const msgArray = Array.isArray(messages) ? messages : [messages];
            return `${field}: ${msgArray.join(', ')}`;
          })
          .join('; ');
        
        if (fieldErrors) {
          throw new Error(fieldErrors);
        }
      }
    }
    
    throw new Error(
      error?.message || 
      'Failed to create device in NetBox'
    );
  }
}

/**
 * Update an existing device in NetBox
 * @param baseUrl NetBox base URL
 * @param token NetBox API token
 * @param deviceId Device ID
 * @param deviceData Partial device update payload
 * @returns Updated NetBox device
 */
export async function updateNetBoxDevice(
  baseUrl: string,
  token: string,
  deviceId: number,
  deviceData: Partial<NetBoxDeviceCreatePayload>
): Promise<NetBoxDevice> {
  try {
    const response = await axios.patch<NetBoxDevice>(
      `${baseUrl}${NETBOX_API_ENDPOINTS.DELETE_DEVICE_URL}/${deviceId}/`,
      deviceData,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      const errorData = error.response.data;
      
      if (errorData.detail) {
        throw new Error(Array.isArray(errorData.detail) 
          ? errorData.detail.map((err: any) => 
              typeof err === 'string' ? err : `${err.loc?.join('.')}: ${err.msg}`
            ).join(', ')
          : errorData.detail
        );
      }
    }
    
    throw new Error(
      error?.message || 
      'Failed to update device in NetBox'
    );
  }
}

/**
 * Fetch device types from NetBox
 */
export async function fetchNetBoxDeviceTypes(
  baseUrl: string,
  token: string
): Promise<NetBoxDeviceType[]> {
  try {
    const response = await axios.get<NetBoxAPIResponse<NetBoxDeviceType>>(
      `${baseUrl}/api/dcim/device-types/`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
    return response.data.results || [];
  } catch (error: any) {
    console.error('Error fetching device types:', error);
    throw new Error('Failed to fetch device types');
  }
}

/**
 * Fetch device roles from NetBox
 */
export async function fetchNetBoxDeviceRoles(
  baseUrl: string,
  token: string
): Promise<NetBoxDeviceRole[]> {
  try {
    const response = await axios.get<NetBoxAPIResponse<NetBoxDeviceRole>>(
      `${baseUrl}/api/dcim/device-roles/`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
    return response.data.results || [];
  } catch (error: any) {
    console.error('Error fetching device roles:', error);
    throw new Error('Failed to fetch device roles');
  }
}

/**
 * Fetch sites from NetBox
 */
export async function fetchNetBoxSites(
  baseUrl: string,
  token: string
): Promise<NetBoxSite[]> {
  try {
    const response = await axios.get<NetBoxAPIResponse<NetBoxSite>>(
      `${baseUrl}/api/dcim/sites/`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
    return response.data.results || [];
  } catch (error: any) {
    console.error('Error fetching sites:', error);
    throw new Error('Failed to fetch sites');
  }
}

/**
 * Fetch platforms from NetBox
 */
export async function fetchNetBoxPlatforms(
  baseUrl: string,
  token: string
): Promise<NetBoxPlatform[]> {
  try {
    const response = await axios.get<NetBoxAPIResponse<NetBoxPlatform>>(
      `${baseUrl}/api/dcim/platforms/`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
    return response.data.results || [];
  } catch (error: any) {
    console.error('Error fetching platforms:', error);
    throw new Error('Failed to fetch platforms');
  }
}

/**
 * Fetch tenants from NetBox
 */
export async function fetchNetBoxTenants(
  baseUrl: string,
  token: string
): Promise<NetBoxTenant[]> {
  try {
    const response = await axios.get<NetBoxAPIResponse<NetBoxTenant>>(
      `${baseUrl}/api/tenancy/tenants/`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
    return response.data.results || [];
  } catch (error: any) {
    console.error('Error fetching tenants:', error);
    throw new Error('Failed to fetch tenants');
  }
}

/**
 * Fetch manufacturers from NetBox
 */
export async function fetchNetBoxManufacturers(
  baseUrl: string,
  token: string
): Promise<NetBoxManufacturer[]> {
  try {
    const response = await axios.get<NetBoxAPIResponse<NetBoxManufacturer>>(
      `${baseUrl}/api/dcim/manufacturers/`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
    return response.data.results || [];
  } catch (error: any) {
    console.error('Error fetching manufacturers:', error);
    throw new Error('Failed to fetch manufacturers');
  }
}

/**
 * Create a new device type in NetBox
 */
export async function createNetBoxDeviceType(
  baseUrl: string,
  token: string,
  deviceTypeData: {
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
  }
): Promise<NetBoxDeviceType> {
  try {
    const response = await axios.post<NetBoxDeviceType>(
      `${baseUrl}/api/dcim/device-types/`,
      deviceTypeData,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      const errorData = error.response.data;
      if (errorData.detail) {
        throw new Error(Array.isArray(errorData.detail) 
          ? errorData.detail.map((err: any) => 
              typeof err === 'string' ? err : `${err.loc?.join('.')}: ${err.msg}`
            ).join(', ')
          : errorData.detail
        );
      }
      if (typeof errorData === 'object') {
        const fieldErrors = Object.entries(errorData)
          .map(([field, messages]) => {
            const msgArray = Array.isArray(messages) ? messages : [messages];
            return `${field}: ${msgArray.join(', ')}`;
          })
          .join('; ');
        if (fieldErrors) {
          throw new Error(fieldErrors);
        }
      }
    }
    throw new Error(error?.message || 'Failed to create device type in NetBox');
  }
}

/**
 * Update an existing device type in NetBox
 */
export async function updateNetBoxDeviceType(
  baseUrl: string,
  token: string,
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
  try {
    const response = await axios.patch<NetBoxDeviceType>(
      `${baseUrl}/api/dcim/device-types/${deviceTypeId}/`,
      deviceTypeData,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      const errorData = error.response.data;
      if (errorData.detail) {
        throw new Error(Array.isArray(errorData.detail) 
          ? errorData.detail.map((err: any) => 
              typeof err === 'string' ? err : `${err.loc?.join('.')}: ${err.msg}`
            ).join(', ')
          : errorData.detail
        );
      }
    }
    throw new Error(error?.message || 'Failed to update device type in NetBox');
  }
}

/**
 * Delete a device type from NetBox
 */
export async function deleteNetBoxDeviceType(
  baseUrl: string,
  token: string,
  deviceTypeId: number
): Promise<void> {
  try {
    await axios.delete(
      `${baseUrl}/api/dcim/device-types/${deviceTypeId}/`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error(error?.message || 'Failed to delete device type from NetBox');
  }
}

/**
 * Create a new device role in NetBox
 */
export async function createNetBoxDeviceRole(
  baseUrl: string,
  token: string,
  deviceRoleData: {
    name: string;
    slug?: string;
    color?: string;
    description?: string;
    vm_role?: boolean;
  }
): Promise<NetBoxDeviceRole> {
  try {
    const response = await axios.post<NetBoxDeviceRole>(
      `${baseUrl}/api/dcim/device-roles/`,
      deviceRoleData,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      const errorData = error.response.data;
      if (errorData.detail) {
        throw new Error(Array.isArray(errorData.detail) 
          ? errorData.detail.map((err: any) => 
              typeof err === 'string' ? err : `${err.loc?.join('.')}: ${err.msg}`
            ).join(', ')
          : errorData.detail
        );
      }
      if (typeof errorData === 'object') {
        const fieldErrors = Object.entries(errorData)
          .map(([field, messages]) => {
            const msgArray = Array.isArray(messages) ? messages : [messages];
            return `${field}: ${msgArray.join(', ')}`;
          })
          .join('; ');
        if (fieldErrors) {
          throw new Error(fieldErrors);
        }
      }
    }
    throw new Error(error?.message || 'Failed to create device role in NetBox');
  }
}

/**
 * Update an existing device role in NetBox
 */
export async function updateNetBoxDeviceRole(
  baseUrl: string,
  token: string,
  deviceRoleId: number,
  deviceRoleData: Partial<{
    name: string;
    slug?: string;
    color?: string;
    description?: string;
    vm_role?: boolean;
  }>
): Promise<NetBoxDeviceRole> {
  try {
    const response = await axios.patch<NetBoxDeviceRole>(
      `${baseUrl}/api/dcim/device-roles/${deviceRoleId}/`,
      deviceRoleData,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      const errorData = error.response.data;
      if (errorData.detail) {
        throw new Error(Array.isArray(errorData.detail) 
          ? errorData.detail.map((err: any) => 
              typeof err === 'string' ? err : `${err.loc?.join('.')}: ${err.msg}`
            ).join(', ')
          : errorData.detail
        );
      }
    }
    throw new Error(error?.message || 'Failed to update device role in NetBox');
  }
}

/**
 * Delete a device role from NetBox
 */
export async function deleteNetBoxDeviceRole(
  baseUrl: string,
  token: string,
  deviceRoleId: number
): Promise<void> {
  try {
    await axios.delete(
      `${baseUrl}/api/dcim/device-roles/${deviceRoleId}/`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error(error?.message || 'Failed to delete device role from NetBox');
  }
}

/**
 * Create a new manufacturer in NetBox
 */
export async function createNetBoxManufacturer(
  baseUrl: string,
  token: string,
  manufacturerData: {
    name: string;
    slug?: string;
    description?: string;
  }
): Promise<NetBoxManufacturer> {
  try {
    const response = await axios.post<NetBoxManufacturer>(
      `${baseUrl}/api/dcim/manufacturers/`,
      manufacturerData,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      const errorData = error.response.data;
      if (errorData.detail) {
        throw new Error(Array.isArray(errorData.detail) 
          ? errorData.detail.map((err: any) => 
              typeof err === 'string' ? err : `${err.loc?.join('.')}: ${err.msg}`
            ).join(', ')
          : errorData.detail
        );
      }
      if (typeof errorData === 'object') {
        const fieldErrors = Object.entries(errorData)
          .map(([field, messages]) => {
            const msgArray = Array.isArray(messages) ? messages : [messages];
            return `${field}: ${msgArray.join(', ')}`;
          })
          .join('; ');
        if (fieldErrors) {
          throw new Error(fieldErrors);
        }
      }
    }
    throw new Error(error?.message || 'Failed to create manufacturer in NetBox');
  }
}

/**
 * Update an existing manufacturer in NetBox
 */
export async function updateNetBoxManufacturer(
  baseUrl: string,
  token: string,
  manufacturerId: number,
  manufacturerData: Partial<{
    name: string;
    slug?: string;
    description?: string;
  }>
): Promise<NetBoxManufacturer> {
  try {
    const response = await axios.patch<NetBoxManufacturer>(
      `${baseUrl}/api/dcim/manufacturers/${manufacturerId}/`,
      manufacturerData,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      const errorData = error.response.data;
      if (errorData.detail) {
        throw new Error(Array.isArray(errorData.detail) 
          ? errorData.detail.map((err: any) => 
              typeof err === 'string' ? err : `${err.loc?.join('.')}: ${err.msg}`
            ).join(', ')
          : errorData.detail
        );
      }
    }
    throw new Error(error?.message || 'Failed to update manufacturer in NetBox');
  }
}

/**
 * Delete a manufacturer from NetBox
 */
export async function deleteNetBoxManufacturer(
  baseUrl: string,
  token: string,
  manufacturerId: number
): Promise<void> {
  try {
    await axios.delete(
      `${baseUrl}/api/dcim/manufacturers/${manufacturerId}/`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error(error?.message || 'Failed to delete manufacturer from NetBox');
  }
}

/**
 * Fetch regions from NetBox
 */
export async function fetchNetBoxRegions(
  baseUrl: string,
  token: string
): Promise<NetBoxRegion[]> {
  try {
    const response = await axios.get<NetBoxAPIResponse<NetBoxRegion>>(
      `${baseUrl}/api/dcim/regions/`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
    return response.data.results || [];
  } catch (error: any) {
    console.error('Error fetching regions:', error);
    throw new Error('Failed to fetch regions');
  }
}

/**
 * Create a new region in NetBox
 */
export async function createNetBoxRegion(
  baseUrl: string,
  token: string,
  regionData: {
    name: string;
    slug?: string;
    description?: string;
    parent?: number;
  }
): Promise<NetBoxRegion> {
  try {
    const response = await axios.post<NetBoxRegion>(
      `${baseUrl}/api/dcim/regions/`,
      regionData,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      const errorData = error.response.data;
      if (errorData.detail) {
        throw new Error(Array.isArray(errorData.detail) 
          ? errorData.detail.map((err: any) => 
              typeof err === 'string' ? err : `${err.loc?.join('.')}: ${err.msg}`
            ).join(', ')
          : errorData.detail
        );
      }
      if (typeof errorData === 'object') {
        const fieldErrors = Object.entries(errorData)
          .map(([field, messages]) => {
            const msgArray = Array.isArray(messages) ? messages : [messages];
            return `${field}: ${msgArray.join(', ')}`;
          })
          .join('; ');
        if (fieldErrors) {
          throw new Error(fieldErrors);
        }
      }
    }
    throw new Error(error?.message || 'Failed to create region in NetBox');
  }
}

/**
 * Update an existing region in NetBox
 */
export async function updateNetBoxRegion(
  baseUrl: string,
  token: string,
  regionId: number,
  regionData: Partial<{
    name: string;
    slug?: string;
    description?: string;
    parent?: number;
  }>
): Promise<NetBoxRegion> {
  try {
    const response = await axios.patch<NetBoxRegion>(
      `${baseUrl}/api/dcim/regions/${regionId}/`,
      regionData,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      const errorData = error.response.data;
      if (errorData.detail) {
        throw new Error(Array.isArray(errorData.detail) 
          ? errorData.detail.map((err: any) => 
              typeof err === 'string' ? err : `${err.loc?.join('.')}: ${err.msg}`
            ).join(', ')
          : errorData.detail
        );
      }
    }
    throw new Error(error?.message || 'Failed to update region in NetBox');
  }
}

/**
 * Delete a region from NetBox
 */
export async function deleteNetBoxRegion(
  baseUrl: string,
  token: string,
  regionId: number
): Promise<void> {
  try {
    await axios.delete(
      `${baseUrl}/api/dcim/regions/${regionId}/`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error(error?.message || 'Failed to delete region from NetBox');
  }
}

/**
 * Create a new site in NetBox
 */
export async function createNetBoxSite(
  baseUrl: string,
  token: string,
  siteData: {
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
  }
): Promise<NetBoxSite> {
  try {
    const response = await axios.post<NetBoxSite>(
      `${baseUrl}/api/dcim/sites/`,
      siteData,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      const errorData = error.response.data;
      if (errorData.detail) {
        throw new Error(Array.isArray(errorData.detail) 
          ? errorData.detail.map((err: any) => 
              typeof err === 'string' ? err : `${err.loc?.join('.')}: ${err.msg}`
            ).join(', ')
          : errorData.detail
        );
      }
      if (typeof errorData === 'object') {
        const fieldErrors = Object.entries(errorData)
          .map(([field, messages]) => {
            const msgArray = Array.isArray(messages) ? messages : [messages];
            return `${field}: ${msgArray.join(', ')}`;
          })
          .join('; ');
        if (fieldErrors) {
          throw new Error(fieldErrors);
        }
      }
    }
    throw new Error(error?.message || 'Failed to create site in NetBox');
  }
}

/**
 * Update an existing site in NetBox
 */
export async function updateNetBoxSite(
  baseUrl: string,
  token: string,
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
  try {
    const response = await axios.patch<NetBoxSite>(
      `${baseUrl}/api/dcim/sites/${siteId}/`,
      siteData,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      const errorData = error.response.data;
      if (errorData.detail) {
        throw new Error(Array.isArray(errorData.detail) 
          ? errorData.detail.map((err: any) => 
              typeof err === 'string' ? err : `${err.loc?.join('.')}: ${err.msg}`
            ).join(', ')
          : errorData.detail
        );
      }
    }
    throw new Error(error?.message || 'Failed to update site in NetBox');
  }
}

/**
 * Delete a site from NetBox
 */
export async function deleteNetBoxSite(
  baseUrl: string,
  token: string,
  siteId: number
): Promise<void> {
  try {
    await axios.delete(
      `${baseUrl}/api/dcim/sites/${siteId}/`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error(error?.message || 'Failed to delete site from NetBox');
  }
}

/**
 * Fetch locations from NetBox
 */
export async function fetchNetBoxLocations(
  baseUrl: string,
  token: string
): Promise<NetBoxLocation[]> {
  try {
    const response = await axios.get<NetBoxAPIResponse<NetBoxLocation>>(
      `${baseUrl}/api/dcim/locations/`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
    return response.data.results || [];
  } catch (error: any) {
    console.error('Error fetching locations:', error);
    throw new Error('Failed to fetch locations');
  }
}

/**
 * Create a new location in NetBox
 */
export async function createNetBoxLocation(
  baseUrl: string,
  token: string,
  locationData: {
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
  }
): Promise<NetBoxLocation> {
  try {
    const response = await axios.post<NetBoxLocation>(
      `${baseUrl}/api/dcim/locations/`,
      locationData,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      const errorData = error.response.data;
      if (errorData.detail) {
        throw new Error(Array.isArray(errorData.detail) 
          ? errorData.detail.map((err: any) => 
              typeof err === 'string' ? err : `${err.loc?.join('.')}: ${err.msg}`
            ).join(', ')
          : errorData.detail
        );
      }
      if (typeof errorData === 'object') {
        const fieldErrors = Object.entries(errorData)
          .map(([field, messages]) => {
            const msgArray = Array.isArray(messages) ? messages : [messages];
            return `${field}: ${msgArray.join(', ')}`;
          })
          .join('; ');
        if (fieldErrors) {
          throw new Error(fieldErrors);
        }
      }
    }
    throw new Error(error?.message || 'Failed to create location in NetBox');
  }
}

/**
 * Update an existing location in NetBox
 */
export async function updateNetBoxLocation(
  baseUrl: string,
  token: string,
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
  try {
    const response = await axios.patch<NetBoxLocation>(
      `${baseUrl}/api/dcim/locations/${locationId}/`,
      locationData,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      const errorData = error.response.data;
      if (errorData.detail) {
        throw new Error(Array.isArray(errorData.detail) 
          ? errorData.detail.map((err: any) => 
              typeof err === 'string' ? err : `${err.loc?.join('.')}: ${err.msg}`
            ).join(', ')
          : errorData.detail
        );
      }
    }
    throw new Error(error?.message || 'Failed to update location in NetBox');
  }
}

/**
 * Delete a location from NetBox
 */
export async function deleteNetBoxLocation(
  baseUrl: string,
  token: string,
  locationId: number
): Promise<void> {
  try {
    await axios.delete(
      `${baseUrl}/api/dcim/locations/${locationId}/`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error(error?.message || 'Failed to delete location from NetBox');
  }
}

/**
 * Fetch racks from NetBox
 */
export async function fetchNetBoxRacks(
  baseUrl: string,
  token: string
): Promise<NetBoxRack[]> {
  try {
    const response = await axios.get<NetBoxAPIResponse<NetBoxRack>>(
      `${baseUrl}/api/dcim/racks/`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
    return response.data.results || [];
  } catch (error: any) {
    console.error('Error fetching racks:', error);
    throw new Error('Failed to fetch racks');
  }
}

/**
 * Create a new rack in NetBox
 */
export async function createNetBoxRack(
  baseUrl: string,
  token: string,
  rackData: {
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
  }
): Promise<NetBoxRack> {
  try {
    const response = await axios.post<NetBoxRack>(
      `${baseUrl}/api/dcim/racks/`,
      rackData,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      const errorData = error.response.data;
      if (errorData.detail) {
        throw new Error(Array.isArray(errorData.detail) 
          ? errorData.detail.map((err: any) => 
              typeof err === 'string' ? err : `${err.loc?.join('.')}: ${err.msg}`
            ).join(', ')
          : errorData.detail
        );
      }
      if (typeof errorData === 'object') {
        const fieldErrors = Object.entries(errorData)
          .map(([field, messages]) => {
            const msgArray = Array.isArray(messages) ? messages : [messages];
            return `${field}: ${msgArray.join(', ')}`;
          })
          .join('; ');
        if (fieldErrors) {
          throw new Error(fieldErrors);
        }
      }
    }
    throw new Error(error?.message || 'Failed to create rack in NetBox');
  }
}

/**
 * Update an existing rack in NetBox
 */
export async function updateNetBoxRack(
  baseUrl: string,
  token: string,
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
  try {
    const response = await axios.patch<NetBoxRack>(
      `${baseUrl}/api/dcim/racks/${rackId}/`,
      rackData,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      const errorData = error.response.data;
      if (errorData.detail) {
        throw new Error(Array.isArray(errorData.detail) 
          ? errorData.detail.map((err: any) => 
              typeof err === 'string' ? err : `${err.loc?.join('.')}: ${err.msg}`
            ).join(', ')
          : errorData.detail
        );
      }
    }
    throw new Error(error?.message || 'Failed to update rack in NetBox');
  }
}

/**
 * Delete a rack from NetBox
 */
export async function deleteNetBoxRack(
  baseUrl: string,
  token: string,
  rackId: number
): Promise<void> {
  try {
    await axios.delete(
      `${baseUrl}/api/dcim/racks/${rackId}/`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error(error?.message || 'Failed to delete rack from NetBox');
  }
}

export interface NetBoxRackRole {
  id: number;
  url?: string;
  display: string;
  name: string;
  slug: string;
  color?: string;
  description?: string;
  rack_count?: number;
}

/**
 * Fetch rack roles from NetBox
 */
export async function fetchNetBoxRackRoles(
  baseUrl: string,
  token: string
): Promise<NetBoxRackRole[]> {
  try {
    const response = await axios.get<NetBoxAPIResponse<NetBoxRackRole>>(
      `${baseUrl}/api/dcim/rack-roles/`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
    return response.data.results || [];
  } catch (error: any) {
    console.error('Error fetching rack roles:', error);
    throw new Error('Failed to fetch rack roles');
  }
}

/**
 * Export devices from NetBox in JSON format
 * @param baseUrl NetBox base URL
 * @param token NetBox API token
 * @param filters Optional filters (e.g., { site: 1, status: 'active' })
 * @returns Array of NetBox devices
 */
export async function exportNetBoxDevicesJSON(
  baseUrl: string,
  token: string,
  filters?: Record<string, any>
): Promise<NetBoxDevice[]> {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    params.append('format', 'json');

    const response = await axios.get<NetBoxAPIResponse<NetBoxDevice>>(
      `${baseUrl}/api/dcim/devices/?${params.toString()}`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );

    // Handle pagination - fetch all pages
    const allDevices: NetBoxDevice[] = [...(response.data.results || [])];
    let nextUrl = response.data.next;

    while (nextUrl) {
      const nextResponse = await axios.get<NetBoxAPIResponse<NetBoxDevice>>(
        nextUrl.startsWith('http') ? nextUrl : `${baseUrl}${nextUrl}`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Token ${token}`,
          },
        }
      );
      allDevices.push(...(nextResponse.data.results || []));
      nextUrl = nextResponse.data.next;
    }

    return allDevices;
  } catch (error: any) {
    console.error('Error exporting devices (JSON):', error);
    throw new Error(
      error?.response?.data?.detail ||
      error?.message ||
      'Failed to export devices from NetBox'
    );
  }
}

/**
 * Export devices from NetBox in CSV format
 * @param baseUrl NetBox base URL
 * @param token NetBox API token
 * @param filters Optional filters (e.g., { site: 1, status: 'active' })
 * @returns CSV string
 */
export async function exportNetBoxDevicesCSV(
  baseUrl: string,
  token: string,
  filters?: Record<string, any>
): Promise<string> {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    params.append('format', 'csv');

    const response = await axios.get<string>(
      `${baseUrl}/api/dcim/devices/?${params.toString()}`,
      {
        headers: {
          'Accept': 'text/csv',
          'Authorization': `Token ${token}`,
        },
        responseType: 'text',
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error exporting devices (CSV):', error);
    throw new Error(
      error?.response?.data?.detail ||
      error?.message ||
      'Failed to export devices from NetBox'
    );
  }
}

/**
 * Bulk import devices to NetBox
 * @param baseUrl NetBox base URL
 * @param token NetBox API token
 * @param devices Array of device creation payloads
 * @returns Array of created devices
 */
export async function importNetBoxDevices(
  baseUrl: string,
  token: string,
  devices: NetBoxDeviceCreatePayload[]
): Promise<{ success: NetBoxDevice[]; errors: Array<{ index: number; error: string; data: any }> }> {
  const success: NetBoxDevice[] = [];
  const errors: Array<{ index: number; error: string; data: any }> = [];

  // Import devices sequentially to avoid overwhelming the API
  for (let i = 0; i < devices.length; i++) {
    const deviceData = devices[i];
    try {
      const createdDevice = await createNetBoxDevice(baseUrl, token, deviceData);
      success.push(createdDevice);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        'Unknown error';
      errors.push({
        index: i,
        error: errorMessage,
        data: deviceData,
      });
    }
  }

  return { success, errors };
}

/**
 * Download exported devices as a file
 * @param data Data to export (JSON or CSV string)
 * @param filename Filename for the download
 * @param mimeType MIME type (e.g., 'application/json', 'text/csv')
 */
export function downloadExportFile(
  data: string,
  filename: string,
  mimeType: string = 'application/json'
): void {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

