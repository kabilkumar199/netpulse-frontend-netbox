// NetBox to Internal Data Model Adapter
import type { 
  NetBoxDevice, 
  NetBoxInterface, 
  NetBoxCable,
  NetBoxSite,
  SlurpitTopology 
} from '../types/netbox';
import type { 
  Device, 
  Interface, 
  Link, 
  Site, 
  Location,
  DiscoveryScan 
} from '../types';

/**
 * Convert NetBox device status to internal status
 */
function convertDeviceStatus(netboxStatus: string): 'up' | 'down' | 'warning' | 'unknown' {
  switch (netboxStatus) {
    case 'active':
      return 'up';
    case 'offline':
    case 'failed':
    case 'decommissioning':
      return 'down';
    case 'planned':
    case 'staged':
      return 'warning';
    default:
      return 'unknown';
  }
}

/**
 * Convert NetBox device to internal Device format
 */
export function adaptNetBoxDevice(nbDevice: NetBoxDevice): Device {
  const ipAddresses: string[] = [];
  
  if (nbDevice.primary_ip4) {
    ipAddresses.push(nbDevice.primary_ip4.address.split('/')[0]);
  }
  if (nbDevice.primary_ip6) {
    ipAddresses.push(nbDevice.primary_ip6.address.split('/')[0]);
  }

  // Create location even without lat/long
  const location: Location | undefined = nbDevice.site ? {
    id: `loc-${nbDevice.site.id}`,
    name: nbDevice.site.name,
    latitude: nbDevice.latitude || 0,
    longitude: nbDevice.longitude || 0,
    address: nbDevice.site.display,
    city: nbDevice.location?.name,
    country: '',
    siteHierarchy: [nbDevice.site.name],
    createdAt: new Date(nbDevice.created),
    updatedAt: new Date(nbDevice.last_updated)
  } : undefined;

  // Use primary IP or device ID for deviceId
  const deviceId = ipAddresses.length > 0 ? ipAddresses[0] : nbDevice.id.toString();

  return {
    id: `device-${nbDevice.id}`,
    hostname: nbDevice.name,
    arangoId: nbDevice.name, // Use name as arangoId for display
    deviceId: deviceId, // Use primary IP or device ID
    fqdn: nbDevice.display,
    ipAddresses,
    vendor: nbDevice.device_type.manufacturer.name,
    model: nbDevice.device_type.model,
    os: nbDevice.platform?.name || 'Unknown',
    osVersion: nbDevice.platform?.name || 'Unknown', // Add osVersion for DeviceList compatibility
    snmpSysObjectId: undefined,
    status: convertDeviceStatus(nbDevice.status.value),
    location,
    labels: nbDevice.tags?.map(tag => tag.name) || [],
    tags: nbDevice.tags?.map(tag => tag.slug) || [],
    lastSeen: new Date(nbDevice.last_updated),
    credentials: [],
    roles: [{
      id: `role-${nbDevice.role.id}`,
      name: nbDevice.role.name,
      description: nbDevice.role.display,
      deviceFingerprint: {
        snmpOids: [],
        wmiClasses: [],
        banners: [],
        ports: [],
        services: []
      },
      monitors: [],
      actions: [],
      createdAt: new Date(nbDevice.created),
      updatedAt: new Date(nbDevice.last_updated)
    }],
    interfaces: [],
    dependencies: [],
    monitors: [],
    serialNumber: nbDevice.serial || undefined,
    createdAt: new Date(nbDevice.created),
    updatedAt: new Date(nbDevice.last_updated)
  };
}

/**
 * Convert NetBox interface to internal Interface format
 */
export function adaptNetBoxInterface(nbInterface: NetBoxInterface): Interface {
  return {
    id: `interface-${nbInterface.id}`,
    deviceId: `device-${nbInterface.device.id}`,
    ifIndex: nbInterface.id,
    name: nbInterface.name,
    description: nbInterface.description,
    macAddress: nbInterface.mac_address,
    speed: nbInterface.speed,
    duplex: nbInterface.duplex?.value as 'half' | 'full' | 'auto' | undefined,
    adminStatus: nbInterface.enabled ? 'up' : 'down',
    operStatus: nbInterface.enabled ? 'up' : 'down',
    vlanId: nbInterface.untagged_vlan ? `vlan-${nbInterface.untagged_vlan.id}` : undefined,
    links: [],
    createdAt: new Date(nbInterface.created),
    updatedAt: new Date(nbInterface.last_updated)
  };
}

/**
 * Convert NetBox cable to internal Link format
 */
export function adaptNetBoxCable(nbCable: NetBoxCable): Link | null {
  if (nbCable.a_terminations.length === 0 || nbCable.b_terminations.length === 0) {
    return null;
  }

  const aTermination = nbCable.a_terminations[0];
  const bTermination = nbCable.b_terminations[0];

  if (!aTermination.object?.device || !bTermination.object?.device) {
    return null;
  }

  return {
    id: `link-${nbCable.id}`,
    sourceDeviceId: `device-${aTermination.object.device.id}`,
    sourceInterfaceId: `interface-${aTermination.object.id}`,
    targetDeviceId: `device-${bTermination.object.device.id}`,
    targetInterfaceId: `interface-${bTermination.object.id}`,
    discoverySource: 'snmp',
    confidence: nbCable.status.value === 'connected' ? 1.0 : 0.5,
    lastSeen: new Date(nbCable.last_updated),
    vlans: [],
    speed: undefined,
    isUp: nbCable.status.value === 'connected',
    createdAt: new Date(nbCable.created),
    updatedAt: new Date(nbCable.last_updated)
  };
}

/**
 * Convert NetBox site to internal Site format
 */
export function adaptNetBoxSite(nbSite: NetBoxSite): Site {
  const location: Location = {
    id: `loc-${nbSite.id}`,
    name: nbSite.name,
    latitude: nbSite.latitude || 0,
    longitude: nbSite.longitude || 0,
    address: nbSite.physical_address,
    city: nbSite.name,
    country: '',
    postalCode: '',
    siteHierarchy: [nbSite.name],
    createdAt: new Date(nbSite.created),
    updatedAt: new Date(nbSite.last_updated)
  };

  return {
    id: `site-${nbSite.id}`,
    name: nbSite.name,
    description: nbSite.description,
    location,
    devices: [],
    subnets: [],
    vlans: [],
    createdAt: new Date(nbSite.created),
    updatedAt: new Date(nbSite.last_updated)
  };
}

/**
 * Convert Slurpit topology data to internal DiscoveryScan format
 */
export function adaptSlurpitTopology(
  slurpitData: SlurpitTopology,
  scanName: string = 'NetBox Import'
): DiscoveryScan {
  // Convert devices
  const devices = slurpitData.devices.map(adaptNetBoxDevice);
  
  // Convert interfaces and assign to devices
  const interfaceMap = new Map<string, Interface[]>();
  slurpitData.interfaces.forEach(nbInterface => {
    const deviceId = `device-${nbInterface.device.id}`;
    if (!interfaceMap.has(deviceId)) {
      interfaceMap.set(deviceId, []);
    }
    interfaceMap.get(deviceId)!.push(adaptNetBoxInterface(nbInterface));
  });

  // Assign interfaces to devices
  devices.forEach(device => {
    device.interfaces = interfaceMap.get(device.id) || [];
  });

  // Convert cables to links
  const links = slurpitData.cables
    .map(adaptNetBoxCable)
    .filter((link): link is Link => link !== null);

  // Add LLDP discovered links
  slurpitData.lldp_neighbors?.forEach((neighbor, idx) => {
    // Find matching devices by name
    const sourceDevice = devices.find(d => d.hostname === neighbor.local_device);
    const targetDevice = devices.find(d => d.hostname === neighbor.remote_device);

    if (sourceDevice && targetDevice) {
      const sourceInterface = sourceDevice.interfaces.find(i => i.name === neighbor.local_interface);
      const targetInterface = targetDevice.interfaces.find(i => i.name === neighbor.remote_interface);

      if (sourceInterface && targetInterface) {
        links.push({
          id: `lldp-link-${idx}`,
          sourceDeviceId: sourceDevice.id,
          sourceInterfaceId: sourceInterface.id,
          targetDeviceId: targetDevice.id,
          targetInterfaceId: targetInterface.id,
          discoverySource: 'lldp',
          confidence: 0.9,
          lastSeen: new Date(),
          vlans: [],
          isUp: true,
          protocolInfo: {
            lldp: {
              chassisId: targetDevice.id,
              portId: targetInterface.name,
              ttl: 120,
              systemName: targetDevice.hostname,
              systemDescription: neighbor.remote_platform,
              portDescription: neighbor.remote_port_description,
              systemCapabilities: [],
              enabledCapabilities: [],
              managementAddresses: targetDevice.ipAddresses,
              lastSeen: new Date()
            }
          },
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
  });

  // Calculate vendor summary
  const vendorCounts = new Map<string, number>();
  devices.forEach(device => {
    vendorCounts.set(device.vendor, (vendorCounts.get(device.vendor) || 0) + 1);
  });
  const topVendors = Array.from(vendorCounts.entries())
    .map(([vendor, count]) => ({ vendor, count }))
    .sort((a, b) => b.count - a.count);

  // Calculate OS summary
  const osCounts = new Map<string, number>();
  devices.forEach(device => {
    osCounts.set(device.os, (osCounts.get(device.os) || 0) + 1);
  });
  const topOS = Array.from(osCounts.entries())
    .map(([os, count]) => ({ os, count }))
    .sort((a, b) => b.count - a.count);

  // Calculate role summary
  const roleCounts = new Map<string, number>();
  devices.forEach(device => {
    device.roles.forEach(role => {
      roleCounts.set(role.name, (roleCounts.get(role.name) || 0) + 1);
    });
  });
  const topRoles = Array.from(roleCounts.entries())
    .map(([role, count]) => ({ role, count }))
    .sort((a, b) => b.count - a.count);

  const now = new Date();

  return {
    id: `scan-netbox-${Date.now()}`,
    name: scanName,
    status: 'completed',
    startTime: now,
    endTime: now,
    progress: 100,
    seedDevices: [{
      id: 'seed-netbox',
      type: 'cloud',
      value: 'NetBox API',
      description: 'Imported from NetBox via Slurpit',
      isActive: true
    }],
    expansionSettings: {
      enabled: true,
      maxHops: 10,
      maxDevices: devices.length,
      includeVirtual: false,
      includeCloud: false,
      includeWireless: true,
      includeStorage: false
    },
    credentialSettings: {
      selectedCredentials: [],
      priorityOrder: [],
      useAllCurrent: false,
      useAllFuture: false
    },
    scanOptions: {
      autoMonitoring: false,
      timeout: 30,
      retries: 3,
      parallelScans: 1,
      exclusionFilters: []
    },
    results: {
      totalDevices: devices.length,
      newDevices: devices.length,
      updatedDevices: 0,
      failedDevices: 0,
      devices,
      links,
      errors: [],
      summary: {
        scanDuration: 0,
        devicesPerSecond: 0,
        credentialsUsed: [],
        protocolsUsed: ['netbox', 'lldp', 'snmp'],
        topVendors,
        topOS,
        topRoles
      }
    },
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Fetch topology data from NetBox API
 */
export async function fetchNetBoxTopology(
  baseUrl: string,
  apiToken: string
): Promise<SlurpitTopology> {
  const headers = {
    'Authorization': `Token ${apiToken}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  try {
    // Fetch devices
    const devicesResponse = await fetch(`${baseUrl}/api/dcim/devices/`, { headers });
    const devicesData = await devicesResponse.json();

    // Fetch interfaces
    const interfacesResponse = await fetch(`${baseUrl}/api/dcim/interfaces/`, { headers });
    const interfacesData = await interfacesResponse.json();

    // Fetch cables
    const cablesResponse = await fetch(`${baseUrl}/api/dcim/cables/`, { headers });
    const cablesData = await cablesResponse.json();

    // Fetch IP addresses
    const ipAddressesResponse = await fetch(`${baseUrl}/api/ipam/ip-addresses/`, { headers });
    const ipAddressesData = await ipAddressesResponse.json();

    // Fetch sites
    const sitesResponse = await fetch(`${baseUrl}/api/dcim/sites/`, { headers });
    const sitesData = await sitesResponse.json();

    return {
      devices: devicesData.results || [],
      interfaces: interfacesData.results || [],
      cables: cablesData.results || [],
      ip_addresses: ipAddressesData.results || [],
      sites: sitesData.results || [],
      lldp_neighbors: []
    };
  } catch (error) {
    console.error('Error fetching NetBox topology:', error);
    throw error;
  }
}

