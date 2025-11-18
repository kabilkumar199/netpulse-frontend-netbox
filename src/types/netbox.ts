// NetBox API Response Types
// Based on NetBox v4.x API structure

export interface NetBoxDevice {
  id: number;
  url: string;
  display: string;
  name: string;
  device_type: {
    id: number;
    url: string;
    display: string;
    manufacturer: {
      id: number;
      url: string;
      display: string;
      name: string;
      slug: string;
    };
    model: string;
    slug: string;
  };
  role: {
    id: number;
    url: string;
    display: string;
    name: string;
    slug: string;
  };
  tenant?: {
    id: number;
    url: string;
    display: string;
    name: string;
    slug: string;
  };
  platform?: {
    id: number;
    url: string;
    display: string;
    name: string;
    slug: string;
  };
  serial?: string;
  asset_tag?: string;
  site: {
    id: number;
    url: string;
    display: string;
    name: string;
    slug: string;
  };
  location?: {
    id: number;
    url: string;
    display: string;
    name: string;
    slug: string;
  };
  rack?: {
    id: number;
    url: string;
    display: string;
    name: string;
  };
  position?: number;
  face?: 'front' | 'rear';
  latitude?: number;
  longitude?: number;
  status: {
    value: 'offline' | 'active' | 'planned' | 'staged' | 'failed' | 'inventory' | 'decommissioning';
    label: string;
  };
  airflow?: string;
  primary_ip?: {
    id: number;
    url: string;
    display: string;
    family: number;
    address: string;
  };
  primary_ip4?: {
    id: number;
    url: string;
    display: string;
    family: number;
    address: string;
  };
  primary_ip6?: {
    id: number;
    url: string;
    display: string;
    family: number;
    address: string;
  };
  oob_ip?: {
    id: number;
    url: string;
    display: string;
    address: string;
  };
  cluster?: {
    id: number;
    url: string;
    display: string;
    name: string;
  };
  virtual_chassis?: {
    id: number;
    url: string;
    display: string;
    name: string;
    master: {
      id: number;
      url: string;
      display: string;
      name: string;
    };
  };
  vc_position?: number;
  vc_priority?: number;
  description?: string;
  comments?: string;
  config_template?: {
    id: number;
    url: string;
    display: string;
    name: string;
  };
  local_context_data?: Record<string, any>;
  tags?: Array<{
    id: number;
    url: string;
    display: string;
    name: string;
    slug: string;
    color: string;
  }>;
  custom_fields?: Record<string, any>;
  created: string;
  last_updated: string;
  console_port_count?: number;
  console_server_port_count?: number;
  power_port_count?: number;
  power_outlet_count?: number;
  interface_count?: number;
  front_port_count?: number;
  rear_port_count?: number;
  device_bay_count?: number;
  module_bay_count?: number;
  inventory_item_count?: number;
}

export interface NetBoxInterface {
  id: number;
  url: string;
  display: string;
  device: {
    id: number;
    url: string;
    display: string;
    name: string;
  };
  vdcs?: any[];
  module?: {
    id: number;
    url: string;
    display: string;
  };
  name: string;
  label?: string;
  type: {
    value: string;
    label: string;
  };
  enabled: boolean;
  parent?: {
    id: number;
    url: string;
    display: string;
    name: string;
  };
  bridge?: {
    id: number;
    url: string;
    display: string;
    name: string;
  };
  lag?: {
    id: number;
    url: string;
    display: string;
    name: string;
  };
  mtu?: number;
  mac_address?: string;
  speed?: number;
  duplex?: {
    value: 'half' | 'full' | 'auto';
    label: string;
  };
  wwn?: string;
  mgmt_only: boolean;
  description?: string;
  mode?: {
    value: 'access' | 'tagged' | 'tagged-all';
    label: string;
  };
  rf_role?: string;
  rf_channel?: string;
  poe_mode?: string;
  poe_type?: string;
  rf_channel_frequency?: number;
  rf_channel_width?: number;
  tx_power?: number;
  untagged_vlan?: {
    id: number;
    url: string;
    display: string;
    vid: number;
    name: string;
  };
  tagged_vlans?: Array<{
    id: number;
    url: string;
    display: string;
    vid: number;
    name: string;
  }>;
  mark_connected: boolean;
  cable?: {
    id: number;
    url: string;
    display: string;
    label?: string;
  };
  cable_end?: string;
  wireless_link?: {
    id: number;
    url: string;
    display: string;
  };
  link_peers?: Array<{
    id: number;
    url: string;
    display: string;
    device: {
      id: number;
      url: string;
      display: string;
      name: string;
    };
    name: string;
    cable: number;
  }>;
  link_peers_type?: string;
  wireless_lans?: any[];
  vrf?: {
    id: number;
    url: string;
    display: string;
    name: string;
  };
  l2vpn_termination?: any;
  connected_endpoints?: Array<{
    id: number;
    url: string;
    display: string;
    device: {
      id: number;
      url: string;
      display: string;
      name: string;
    };
    name: string;
  }>;
  connected_endpoints_type?: string;
  connected_endpoints_reachable?: boolean;
  tags?: Array<{
    id: number;
    url: string;
    display: string;
    name: string;
    slug: string;
    color: string;
  }>;
  custom_fields?: Record<string, any>;
  created: string;
  last_updated: string;
  count_ipaddresses: number;
  count_fhrp_groups: number;
  occupied: boolean;
}

export interface NetBoxCable {
  id: number;
  url: string;
  display: string;
  type: {
    value: string;
    label: string;
  };
  a_terminations: Array<{
    id: number;
    url: string;
    display: string;
    object_type: string;
    object: {
      id: number;
      url: string;
      display: string;
      device: {
        id: number;
        url: string;
        display: string;
        name: string;
      };
      name: string;
      cable: number;
    };
    cable: number;
  }>;
  b_terminations: Array<{
    id: number;
    url: string;
    display: string;
    object_type: string;
    object: {
      id: number;
      url: string;
      display: string;
      device: {
        id: number;
        url: string;
        display: string;
        name: string;
      };
      name: string;
      cable: number;
    };
    cable: number;
  }>;
  status: {
    value: 'connected' | 'planned' | 'decommissioning';
    label: string;
  };
  tenant?: {
    id: number;
    url: string;
    display: string;
    name: string;
    slug: string;
  };
  label?: string;
  color?: string;
  length?: number;
  length_unit?: {
    value: string;
    label: string;
  };
  description?: string;
  comments?: string;
  tags?: Array<{
    id: number;
    url: string;
    display: string;
    name: string;
    slug: string;
    color: string;
  }>;
  custom_fields?: Record<string, any>;
  created: string;
  last_updated: string;
}

export interface NetBoxIPAddress {
  id: number;
  url: string;
  display: string;
  family: {
    value: 4 | 6;
    label: string;
  };
  address: string;
  vrf?: {
    id: number;
    url: string;
    display: string;
    name: string;
  };
  tenant?: {
    id: number;
    url: string;
    display: string;
    name: string;
    slug: string;
  };
  status: {
    value: 'active' | 'reserved' | 'deprecated' | 'dhcp' | 'slaac';
    label: string;
  };
  role?: {
    value: string;
    label: string;
  };
  assigned_object_type?: string;
  assigned_object_id?: number;
  assigned_object?: {
    id: number;
    url: string;
    display: string;
    device: {
      id: number;
      url: string;
      display: string;
      name: string;
    };
    name: string;
  };
  nat_inside?: {
    id: number;
    url: string;
    display: string;
    address: string;
  };
  nat_outside?: Array<{
    id: number;
    url: string;
    display: string;
    address: string;
    family: number;
  }>;
  dns_name?: string;
  description?: string;
  comments?: string;
  tags?: Array<{
    id: number;
    url: string;
    display: string;
    name: string;
    slug: string;
    color: string;
  }>;
  custom_fields?: Record<string, any>;
  created: string;
  last_updated: string;
}

export interface NetBoxSite {
  id: number;
  url: string;
  display: string;
  name: string;
  slug: string;
  status: {
    value: 'active' | 'planned' | 'retired';
    label: string;
  };
  region?: {
    id: number;
    url: string;
    display: string;
    name: string;
    slug: string;
  };
  group?: {
    id: number;
    url: string;
    display: string;
    name: string;
    slug: string;
  };
  tenant?: {
    id: number;
    url: string;
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
  asns?: Array<{
    id: number;
    url: string;
    display: string;
    asn: number;
  }>;
  tags?: Array<{
    id: number;
    url: string;
    display: string;
    name: string;
    slug: string;
    color: string;
  }>;
  custom_fields?: Record<string, any>;
  created: string;
  last_updated: string;
  circuit_count: number;
  device_count: number;
  prefix_count: number;
  rack_count: number;
  virtualmachine_count: number;
  vlan_count: number;
}

export interface NetBoxAPIResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Slurpit Plugin Response Types
export interface SlurpitTopology {
  devices: NetBoxDevice[];
  interfaces: NetBoxInterface[];
  cables: NetBoxCable[];
  ip_addresses: NetBoxIPAddress[];
  sites: NetBoxSite[];
  lldp_neighbors: Array<{
    local_device: string;
    local_interface: string;
    remote_device: string;
    remote_interface: string;
    remote_platform?: string;
    remote_port_description?: string;
  }>;
  cdp_neighbors?: Array<{
    local_device: string;
    local_interface: string;
    remote_device: string;
    remote_interface: string;
    remote_platform?: string;
  }>;
}

// NetBox Device Creation Payload
export interface NetBoxDeviceCreatePayload {
  name: string;
  device_type: number; // Device type ID
  role: number; // Device role ID
  tenant?: number; // Tenant ID (optional)
  platform?: number; // Platform ID (optional)
  serial?: string;
  asset_tag?: string;
  site: number; // Site ID (required)
  location?: number; // Location ID (optional)
  rack?: number; // Rack ID (optional)
  position?: number; // Rack position (optional, max 999)
  face?: 'front' | 'rear'; // Rack face (optional)
  latitude?: number;
  longitude?: number;
  status?: 'offline' | 'active' | 'planned' | 'staged' | 'failed' | 'inventory' | 'decommissioning';
  airflow?: 'front-to-rear' | 'rear-to-front' | 'left-to-right' | 'right-to-left' | 'side-to-rear' | 'passive' | 'mixed';
  primary_ip4?: number; // IP address ID (optional)
  primary_ip6?: number; // IPv6 address ID (optional)
  oob_ip?: number; // Out-of-band IP address ID (optional)
  cluster?: number; // Cluster ID (optional)
  virtual_chassis?: number; // Virtual chassis ID (optional)
  vc_position?: number; // Virtual chassis position (optional, max 255)
  vc_priority?: number; // Virtual chassis priority (optional, max 255)
  description?: string;
  comments?: string;
  config_template?: number; // Config template ID (optional)
  local_context_data?: string | Record<string, any>;
  tags?: Array<{
    name?: string;
    slug?: string;
    color?: string;
  }>;
  custom_fields?: Record<string, any>;
}

