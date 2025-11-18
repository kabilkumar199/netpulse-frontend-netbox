import axios from 'axios';
import type { NetBoxDevice, NetBoxDeviceCreatePayload, NetBoxAPIResponse } from '../../types/netbox';
import { NETBOX_API_ENDPOINTS } from '../url_helper';

// NetBox lookup types
export interface NetBoxDeviceType {
  id: number;
  display: string;
  manufacturer: { id: number; name: string };
  model: string;
}

export interface NetBoxDeviceRole {
  id: number;
  display: string;
  name: string;
}

export interface NetBoxSite {
  id: number;
  display: string;
  name: string;
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

