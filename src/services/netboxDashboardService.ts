/**
 * NetBox Dashboard Service
 * Provides dashboard statistics and data from NetBox
 */

import { NETBOX_CONFIG } from '../config/netbox';
import axios from 'axios';
import type { NetBoxDevice, NetBoxSite, NetBoxCable, NetBoxAPIResponse } from '../types/netbox';

export interface DashboardStats {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  warningDevices: number;
  unknownDevices: number;
  totalSites: number;
  activeSites: number;
  totalLinks: number;
  connectedLinks: number;
  deviceStatusData: {
    up: number;
    down: number;
    warning: number;
    unknown: number;
  };
  osDistributionData: { [key: string]: number };
  platformDistributionData: { [key: string]: number };
}

/**
 * Fetch all devices from NetBox
 */
async function fetchNetBoxDevices(): Promise<NetBoxDevice[]> {
  try {
    const response = await axios.get<NetBoxAPIResponse<NetBoxDevice>>(
      `${NETBOX_CONFIG.BASE_URL}/api/dcim/devices/`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Token ${NETBOX_CONFIG.TOKEN}`,
        },
      }
    );
    return response.data.results || [];
  } catch (error: any) {
    console.error('Error fetching devices:', error);
    throw new Error('Failed to fetch devices from NetBox');
  }
}

/**
 * Fetch all sites from NetBox
 */
async function fetchNetBoxSites(): Promise<NetBoxSite[]> {
  try {
    const response = await axios.get<NetBoxAPIResponse<NetBoxSite>>(
      `${NETBOX_CONFIG.BASE_URL}/api/dcim/sites/`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Token ${NETBOX_CONFIG.TOKEN}`,
        },
      }
    );
    return response.data.results || [];
  } catch (error: any) {
    console.error('Error fetching sites:', error);
    throw new Error('Failed to fetch sites from NetBox');
  }
}

/**
 * Fetch all cables from NetBox
 */
async function fetchNetBoxCables(): Promise<NetBoxCable[]> {
  try {
    const response = await axios.get<NetBoxAPIResponse<NetBoxCable>>(
      `${NETBOX_CONFIG.BASE_URL}/api/dcim/cables/`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Token ${NETBOX_CONFIG.TOKEN}`,
        },
      }
    );
    return response.data.results || [];
  } catch (error: any) {
    console.error('Error fetching cables:', error);
    throw new Error('Failed to fetch cables from NetBox');
  }
}

/**
 * Map NetBox device status to dashboard status
 */
function mapDeviceStatus(netboxStatus: string): 'up' | 'down' | 'warning' | 'unknown' {
  const status = netboxStatus.toLowerCase();
  switch (status) {
    case 'active':
      return 'up';
    case 'offline':
    case 'failed':
    case 'decommissioning':
      return 'down';
    case 'planned':
    case 'staged':
    case 'inventory':
      return 'warning';
    default:
      return 'unknown';
  }
}

/**
 * Get dashboard statistics from NetBox
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [devices, sites, cables] = await Promise.all([
      fetchNetBoxDevices(),
      fetchNetBoxSites(),
      fetchNetBoxCables(),
    ]);

    // Calculate device statistics
    const deviceStatusData = {
      up: 0,
      down: 0,
      warning: 0,
      unknown: 0,
    };

    const osDistributionData: { [key: string]: number } = {};
    const platformDistributionData: { [key: string]: number } = {};

    devices.forEach((device) => {
      const status = mapDeviceStatus(device.status?.value || 'unknown');
      deviceStatusData[status] += 1;

      // OS Distribution (using platform name if available, otherwise "Unknown")
      const os = device.platform?.name || 'Unknown';
      osDistributionData[os] = (osDistributionData[os] || 0) + 1;

      // Platform Distribution (using device role)
      const platform = device.role?.name || 'Unknown';
      platformDistributionData[platform] = (platformDistributionData[platform] || 0) + 1;
    });

    // Calculate site statistics
    const activeSites = sites.filter(
      (site) => site.status?.value === 'active'
    ).length;

    // Calculate cable/link statistics
    const connectedLinks = cables.filter(
      (cable) => cable.status?.value === 'connected'
    ).length;

    return {
      totalDevices: devices.length,
      onlineDevices: deviceStatusData.up,
      offlineDevices: deviceStatusData.down,
      warningDevices: deviceStatusData.warning,
      unknownDevices: deviceStatusData.unknown,
      totalSites: sites.length,
      activeSites,
      totalLinks: cables.length,
      connectedLinks,
      deviceStatusData,
      osDistributionData,
      platformDistributionData,
    };
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}

/**
 * Get devices for dashboard (with status mapping)
 */
export async function getDashboardDevices(): Promise<NetBoxDevice[]> {
  return fetchNetBoxDevices();
}


