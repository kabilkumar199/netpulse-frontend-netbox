// Mock data simulating NetBox/Slurpit JSON output
// This represents what the microfrontend will receive from NetBox
import type { SlurpitTopology } from '../types/netbox';

export const scanMetadata = {
  scan_id: "netbox-scan-001",
  scan_name: "Production Network - Main Office",
  scan_timestamp: "2025-01-15T10:30:00Z",
  netbox_version: "4.1.3",
  slurpit_version: "1.2.0",
  total_devices: 5,
  total_interfaces: 20,
  total_links: 8
};

export const netboxTopologyData: SlurpitTopology = {
  "devices": [
    {
      "id": 1,
      "url": "https://netbox.example.com/api/dcim/devices/1/",
      "display": "core-sw-01",
      "name": "core-sw-01",
      "device_type": {
        "id": 1,
        "url": "https://netbox.example.com/api/dcim/device-types/1/",
        "display": "Catalyst 3850-48P",
        "manufacturer": {
          "id": 1,
          "url": "https://netbox.example.com/api/dcim/manufacturers/1/",
          "display": "Cisco",
          "name": "Cisco",
          "slug": "cisco"
        },
        "model": "Catalyst 3850-48P",
        "slug": "catalyst-3850-48p"
      },
      "role": {
        "id": 1,
        "url": "https://netbox.example.com/api/dcim/device-roles/1/",
        "display": "Core Switch",
        "name": "Core Switch",
        "slug": "core-switch"
      },
      "platform": {
        "id": 1,
        "url": "https://netbox.example.com/api/dcim/platforms/1/",
        "display": "Cisco IOS",
        "name": "Cisco IOS",
        "slug": "cisco-ios"
      },
      "serial": "FOC2145G0XY",
      "asset_tag": "NET-001",
      "site": {
        "id": 1,
        "url": "https://netbox.example.com/api/dcim/sites/1/",
        "display": "Main Office",
        "name": "Main Office",
        "slug": "main-office"
      },
      "location": {
        "id": 1,
        "url": "https://netbox.example.com/api/dcim/locations/1/",
        "display": "Server Room A",
        "name": "Server Room A",
        "slug": "server-room-a"
      },
      "rack": {
        "id": 1,
        "url": "https://netbox.example.com/api/dcim/racks/1/",
        "display": "Rack-01",
        "name": "Rack-01"
      },
      "position": 42,
      "face": "front",
      "latitude": 37.7749,
      "longitude": -122.4194,
      "status": {
        "value": "active",
        "label": "Active"
      },
      "primary_ip4": {
        "id": 1,
        "url": "https://netbox.example.com/api/ipam/ip-addresses/1/",
        "display": "192.168.1.1/24",
        "family": 4,
        "address": "192.168.1.1/24"
      },
      "tags": [
        {
          "id": 1,
          "url": "https://netbox.example.com/api/extras/tags/1/",
          "display": "critical",
          "name": "critical",
          "slug": "critical",
          "color": "f44336"
        }
      ],
      "created": "2024-01-01T00:00:00Z",
      "last_updated": "2025-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "url": "https://netbox.example.com/api/dcim/devices/2/",
      "display": "access-sw-01",
      "name": "access-sw-01",
      "device_type": {
        "id": 2,
        "url": "https://netbox.example.com/api/dcim/device-types/2/",
        "display": "Catalyst 2960X-48FPS",
        "manufacturer": {
          "id": 1,
          "url": "https://netbox.example.com/api/dcim/manufacturers/1/",
          "display": "Cisco",
          "name": "Cisco",
          "slug": "cisco"
        },
        "model": "Catalyst 2960X-48FPS",
        "slug": "catalyst-2960x-48fps"
      },
      "role": {
        "id": 2,
        "url": "https://netbox.example.com/api/dcim/device-roles/2/",
        "display": "Access Switch",
        "name": "Access Switch",
        "slug": "access-switch"
      },
      "platform": {
        "id": 1,
        "url": "https://netbox.example.com/api/dcim/platforms/1/",
        "display": "Cisco IOS",
        "name": "Cisco IOS",
        "slug": "cisco-ios"
      },
      "serial": "FOC2145G0AB",
      "asset_tag": "NET-002",
      "site": {
        "id": 1,
        "url": "https://netbox.example.com/api/dcim/sites/1/",
        "display": "Main Office",
        "name": "Main Office",
        "slug": "main-office"
      },
      "latitude": 37.7749,
      "longitude": -122.4194,
      "status": {
        "value": "active",
        "label": "Active"
      },
      "primary_ip4": {
        "id": 2,
        "url": "https://netbox.example.com/api/ipam/ip-addresses/2/",
        "display": "192.168.1.10/24",
        "family": 4,
        "address": "192.168.1.10/24"
      },
      "tags": [],
      "created": "2024-01-01T00:00:00Z",
      "last_updated": "2025-01-15T10:30:00Z"
    },
    {
      "id": 3,
      "url": "https://netbox.example.com/api/dcim/devices/3/",
      "display": "access-sw-02",
      "name": "access-sw-02",
      "device_type": {
        "id": 2,
        "url": "https://netbox.example.com/api/dcim/device-types/2/",
        "display": "Catalyst 2960X-48FPS",
        "manufacturer": {
          "id": 1,
          "url": "https://netbox.example.com/api/dcim/manufacturers/1/",
          "display": "Cisco",
          "name": "Cisco",
          "slug": "cisco"
        },
        "model": "Catalyst 2960X-48FPS",
        "slug": "catalyst-2960x-48fps"
      },
      "role": {
        "id": 2,
        "url": "https://netbox.example.com/api/dcim/device-roles/2/",
        "display": "Access Switch",
        "name": "Access Switch",
        "slug": "access-switch"
      },
      "platform": {
        "id": 1,
        "url": "https://netbox.example.com/api/dcim/platforms/1/",
        "display": "Cisco IOS",
        "name": "Cisco IOS",
        "slug": "cisco-ios"
      },
      "serial": "FOC2145G0CD",
      "asset_tag": "NET-003",
      "site": {
        "id": 1,
        "url": "https://netbox.example.com/api/dcim/sites/1/",
        "display": "Main Office",
        "name": "Main Office",
        "slug": "main-office"
      },
      "latitude": 37.7749,
      "longitude": -122.4194,
      "status": {
        "value": "active",
        "label": "Active"
      },
      "primary_ip4": {
        "id": 3,
        "url": "https://netbox.example.com/api/ipam/ip-addresses/3/",
        "display": "192.168.1.11/24",
        "family": 4,
        "address": "192.168.1.11/24"
      },
      "tags": [],
      "created": "2024-01-01T00:00:00Z",
      "last_updated": "2025-01-15T10:30:00Z"
    },
    {
      "id": 4,
      "url": "https://netbox.example.com/api/dcim/devices/4/",
      "display": "fw-01",
      "name": "fw-01",
      "device_type": {
        "id": 3,
        "url": "https://netbox.example.com/api/dcim/device-types/3/",
        "display": "FortiGate 200F",
        "manufacturer": {
          "id": 2,
          "url": "https://netbox.example.com/api/dcim/manufacturers/2/",
          "display": "Fortinet",
          "name": "Fortinet",
          "slug": "fortinet"
        },
        "model": "FortiGate 200F",
        "slug": "fortigate-200f"
      },
      "role": {
        "id": 3,
        "url": "https://netbox.example.com/api/dcim/device-roles/3/",
        "display": "Firewall",
        "name": "Firewall",
        "slug": "firewall"
      },
      "platform": {
        "id": 2,
        "url": "https://netbox.example.com/api/dcim/platforms/2/",
        "display": "FortiOS",
        "name": "FortiOS",
        "slug": "fortios"
      },
      "serial": "FG200F1234567890",
      "asset_tag": "NET-004",
      "site": {
        "id": 1,
        "url": "https://netbox.example.com/api/dcim/sites/1/",
        "display": "Main Office",
        "name": "Main Office",
        "slug": "main-office"
      },
      "latitude": 37.7749,
      "longitude": -122.4194,
      "status": {
        "value": "active",
        "label": "Active"
      },
      "primary_ip4": {
        "id": 4,
        "url": "https://netbox.example.com/api/ipam/ip-addresses/4/",
        "display": "192.168.1.254/24",
        "family": 4,
        "address": "192.168.1.254/24"
      },
      "tags": [
        {
          "id": 1,
          "url": "https://netbox.example.com/api/extras/tags/1/",
          "display": "critical",
          "name": "critical",
          "slug": "critical",
          "color": "f44336"
        }
      ],
      "created": "2024-01-01T00:00:00Z",
      "last_updated": "2025-01-15T10:30:00Z"
    },
    {
      "id": 5,
      "url": "https://netbox.example.com/api/dcim/devices/5/",
      "display": "server-01",
      "name": "server-01",
      "device_type": {
        "id": 4,
        "url": "https://netbox.example.com/api/dcim/device-types/4/",
        "display": "PowerEdge R640",
        "manufacturer": {
          "id": 3,
          "url": "https://netbox.example.com/api/dcim/manufacturers/3/",
          "display": "Dell",
          "name": "Dell",
          "slug": "dell"
        },
        "model": "PowerEdge R640",
        "slug": "poweredge-r640"
      },
      "role": {
        "id": 4,
        "url": "https://netbox.example.com/api/dcim/device-roles/4/",
        "display": "Server",
        "name": "Server",
        "slug": "server"
      },
      "platform": {
        "id": 3,
        "url": "https://netbox.example.com/api/dcim/platforms/3/",
        "display": "Windows Server 2022",
        "name": "Windows Server 2022",
        "slug": "windows-server-2022"
      },
      "serial": "DELL12345",
      "asset_tag": "SRV-001",
      "site": {
        "id": 1,
        "url": "https://netbox.example.com/api/dcim/sites/1/",
        "display": "Main Office",
        "name": "Main Office",
        "slug": "main-office"
      },
      "latitude": 37.7749,
      "longitude": -122.4194,
      "status": {
        "value": "active",
        "label": "Active"
      },
      "primary_ip4": {
        "id": 5,
        "url": "https://netbox.example.com/api/ipam/ip-addresses/5/",
        "display": "192.168.1.100/24",
        "family": 4,
        "address": "192.168.1.100/24"
      },
      "tags": [],
      "created": "2024-01-01T00:00:00Z",
      "last_updated": "2025-01-15T10:30:00Z"
    }
  ],
  "interfaces": [
    {
      "id": 1,
      "url": "https://netbox.example.com/api/dcim/interfaces/1/",
      "display": "GigabitEthernet1/0/1",
      "device": {
        "id": 1,
        "url": "https://netbox.example.com/api/dcim/devices/1/",
        "display": "core-sw-01",
        "name": "core-sw-01"
      },
      "name": "GigabitEthernet1/0/1",
      "type": {
        "value": "1000base-t",
        "label": "1000BASE-T (1GE)"
      },
      "enabled": true,
      "mtu": 1500,
      "mac_address": "00:1A:2B:3C:4D:01",
      "speed": 1000000,
      "duplex": {
        "value": "full",
        "label": "Full"
      },
      "mgmt_only": false,
      "mode": {
        "value": "access",
        "label": "Access"
      },
      "mark_connected": true,
      "cable": {
        "id": 1,
        "url": "https://netbox.example.com/api/dcim/cables/1/",
        "display": "Cable #1"
      },
      "created": "2024-01-01T00:00:00Z",
      "last_updated": "2025-01-15T10:30:00Z",
      "count_ipaddresses": 1,
      "count_fhrp_groups": 0,
      "occupied": true
    },
    {
      "id": 2,
      "url": "https://netbox.example.com/api/dcim/interfaces/2/",
      "display": "GigabitEthernet1/0/2",
      "device": {
        "id": 1,
        "url": "https://netbox.example.com/api/dcim/devices/1/",
        "display": "core-sw-01",
        "name": "core-sw-01"
      },
      "name": "GigabitEthernet1/0/2",
      "type": {
        "value": "1000base-t",
        "label": "1000BASE-T (1GE)"
      },
      "enabled": true,
      "mtu": 1500,
      "mac_address": "00:1A:2B:3C:4D:02",
      "speed": 1000000,
      "duplex": {
        "value": "full",
        "label": "Full"
      },
      "mgmt_only": false,
      "mark_connected": true,
      "cable": {
        "id": 2,
        "url": "https://netbox.example.com/api/dcim/cables/2/",
        "display": "Cable #2"
      },
      "created": "2024-01-01T00:00:00Z",
      "last_updated": "2025-01-15T10:30:00Z",
      "count_ipaddresses": 0,
      "count_fhrp_groups": 0,
      "occupied": false
    },
    {
      "id": 3,
      "url": "https://netbox.example.com/api/dcim/interfaces/3/",
      "display": "GigabitEthernet1/0/24",
      "device": {
        "id": 1,
        "url": "https://netbox.example.com/api/dcim/devices/1/",
        "display": "core-sw-01",
        "name": "core-sw-01"
      },
      "name": "GigabitEthernet1/0/24",
      "type": {
        "value": "1000base-t",
        "label": "1000BASE-T (1GE)"
      },
      "enabled": true,
      "mtu": 1500,
      "mac_address": "00:1A:2B:3C:4D:18",
      "speed": 1000000,
      "duplex": {
        "value": "full",
        "label": "Full"
      },
      "mgmt_only": false,
      "mark_connected": true,
      "cable": {
        "id": 3,
        "url": "https://netbox.example.com/api/dcim/cables/3/",
        "display": "Cable #3"
      },
      "created": "2024-01-01T00:00:00Z",
      "last_updated": "2025-01-15T10:30:00Z",
      "count_ipaddresses": 0,
      "count_fhrp_groups": 0,
      "occupied": false
    },
    {
      "id": 4,
      "url": "https://netbox.example.com/api/dcim/interfaces/4/",
      "display": "GigabitEthernet1/0/1",
      "device": {
        "id": 2,
        "url": "https://netbox.example.com/api/dcim/devices/2/",
        "display": "access-sw-01",
        "name": "access-sw-01"
      },
      "name": "GigabitEthernet1/0/1",
      "type": {
        "value": "1000base-t",
        "label": "1000BASE-T (1GE)"
      },
      "enabled": true,
      "mtu": 1500,
      "mac_address": "00:1B:2C:3D:4E:01",
      "speed": 1000000,
      "duplex": {
        "value": "full",
        "label": "Full"
      },
      "mgmt_only": false,
      "mark_connected": true,
      "cable": {
        "id": 1,
        "url": "https://netbox.example.com/api/dcim/cables/1/",
        "display": "Cable #1"
      },
      "created": "2024-01-01T00:00:00Z",
      "last_updated": "2025-01-15T10:30:00Z",
      "count_ipaddresses": 1,
      "count_fhrp_groups": 0,
      "occupied": true
    },
    {
      "id": 5,
      "url": "https://netbox.example.com/api/dcim/interfaces/5/",
      "display": "GigabitEthernet1/0/1",
      "device": {
        "id": 3,
        "url": "https://netbox.example.com/api/dcim/devices/3/",
        "display": "access-sw-02",
        "name": "access-sw-02"
      },
      "name": "GigabitEthernet1/0/1",
      "type": {
        "value": "1000base-t",
        "label": "1000BASE-T (1GE)"
      },
      "enabled": true,
      "mtu": 1500,
      "mac_address": "00:1C:2D:3E:4F:01",
      "speed": 1000000,
      "duplex": {
        "value": "full",
        "label": "Full"
      },
      "mgmt_only": false,
      "mark_connected": true,
      "cable": {
        "id": 2,
        "url": "https://netbox.example.com/api/dcim/cables/2/",
        "display": "Cable #2"
      },
      "created": "2024-01-01T00:00:00Z",
      "last_updated": "2025-01-15T10:30:00Z",
      "count_ipaddresses": 0,
      "count_fhrp_groups": 0,
      "occupied": false
    },
    {
      "id": 6,
      "url": "https://netbox.example.com/api/dcim/interfaces/6/",
      "display": "port1",
      "device": {
        "id": 4,
        "url": "https://netbox.example.com/api/dcim/devices/4/",
        "display": "fw-01",
        "name": "fw-01"
      },
      "name": "port1",
      "type": {
        "value": "1000base-t",
        "label": "1000BASE-T (1GE)"
      },
      "enabled": true,
      "mtu": 1500,
      "mac_address": "00:1D:2E:3F:4G:01",
      "speed": 1000000,
      "duplex": {
        "value": "full",
        "label": "Full"
      },
      "mgmt_only": false,
      "mark_connected": true,
      "cable": {
        "id": 3,
        "url": "https://netbox.example.com/api/dcim/cables/3/",
        "display": "Cable #3"
      },
      "created": "2024-01-01T00:00:00Z",
      "last_updated": "2025-01-15T10:30:00Z",
      "count_ipaddresses": 0,
      "count_fhrp_groups": 0,
      "occupied": false
    },
    {
      "id": 7,
      "url": "https://netbox.example.com/api/dcim/interfaces/7/",
      "display": "eth0",
      "device": {
        "id": 5,
        "url": "https://netbox.example.com/api/dcim/devices/5/",
        "display": "server-01",
        "name": "server-01"
      },
      "name": "eth0",
      "type": {
        "value": "1000base-t",
        "label": "1000BASE-T (1GE)"
      },
      "enabled": true,
      "mtu": 1500,
      "mac_address": "00:1E:2F:3G:4H:01",
      "speed": 1000000,
      "duplex": {
        "value": "full",
        "label": "Full"
      },
      "mgmt_only": false,
      "mark_connected": true,
      "cable": {
        "id": 4,
        "url": "https://netbox.example.com/api/dcim/cables/4/",
        "display": "Cable #4"
      },
      "created": "2024-01-01T00:00:00Z",
      "last_updated": "2025-01-15T10:30:00Z",
      "count_ipaddresses": 0,
      "count_fhrp_groups": 0,
      "occupied": false
    }
  ],
  "cables": [
    {
      "id": 1,
      "url": "https://netbox.example.com/api/dcim/cables/1/",
      "display": "Cable #1",
      "type": {
        "value": "cat6",
        "label": "CAT6"
      },
      "a_terminations": [
        {
          "id": 1,
          "url": "https://netbox.example.com/api/dcim/interfaces/1/",
          "display": "core-sw-01: GigabitEthernet1/0/1",
          "object_type": "dcim.interface",
          "object": {
            "id": 1,
            "url": "https://netbox.example.com/api/dcim/interfaces/1/",
            "display": "GigabitEthernet1/0/1",
            "device": {
              "id": 1,
              "url": "https://netbox.example.com/api/dcim/devices/1/",
              "display": "core-sw-01",
              "name": "core-sw-01"
            },
            "name": "GigabitEthernet1/0/1",
            "cable": 1
          },
          "cable": 1
        }
      ],
      "b_terminations": [
        {
          "id": 4,
          "url": "https://netbox.example.com/api/dcim/interfaces/4/",
          "display": "access-sw-01: GigabitEthernet1/0/1",
          "object_type": "dcim.interface",
          "object": {
            "id": 4,
            "url": "https://netbox.example.com/api/dcim/interfaces/4/",
            "display": "GigabitEthernet1/0/1",
            "device": {
              "id": 2,
              "url": "https://netbox.example.com/api/dcim/devices/2/",
              "display": "access-sw-01",
              "name": "access-sw-01"
            },
            "name": "GigabitEthernet1/0/1",
            "cable": 1
          },
          "cable": 1
        }
      ],
      "status": {
        "value": "connected",
        "label": "Connected"
      },
      "label": "core-to-access-01",
      "length": 5,
      "length_unit": {
        "value": "m",
        "label": "Meters"
      },
      "created": "2024-01-01T00:00:00Z",
      "last_updated": "2025-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "url": "https://netbox.example.com/api/dcim/cables/2/",
      "display": "Cable #2",
      "type": {
        "value": "cat6",
        "label": "CAT6"
      },
      "a_terminations": [
        {
          "id": 2,
          "url": "https://netbox.example.com/api/dcim/interfaces/2/",
          "display": "core-sw-01: GigabitEthernet1/0/2",
          "object_type": "dcim.interface",
          "object": {
            "id": 2,
            "url": "https://netbox.example.com/api/dcim/interfaces/2/",
            "display": "GigabitEthernet1/0/2",
            "device": {
              "id": 1,
              "url": "https://netbox.example.com/api/dcim/devices/1/",
              "display": "core-sw-01",
              "name": "core-sw-01"
            },
            "name": "GigabitEthernet1/0/2",
            "cable": 2
          },
          "cable": 2
        }
      ],
      "b_terminations": [
        {
          "id": 5,
          "url": "https://netbox.example.com/api/dcim/interfaces/5/",
          "display": "access-sw-02: GigabitEthernet1/0/1",
          "object_type": "dcim.interface",
          "object": {
            "id": 5,
            "url": "https://netbox.example.com/api/dcim/interfaces/5/",
            "display": "GigabitEthernet1/0/1",
            "device": {
              "id": 3,
              "url": "https://netbox.example.com/api/dcim/devices/3/",
              "display": "access-sw-02",
              "name": "access-sw-02"
            },
            "name": "GigabitEthernet1/0/1",
            "cable": 2
          },
          "cable": 2
        }
      ],
      "status": {
        "value": "connected",
        "label": "Connected"
      },
      "label": "core-to-access-02",
      "length": 7,
      "length_unit": {
        "value": "m",
        "label": "Meters"
      },
      "created": "2024-01-01T00:00:00Z",
      "last_updated": "2025-01-15T10:30:00Z"
    },
    {
      "id": 3,
      "url": "https://netbox.example.com/api/dcim/cables/3/",
      "display": "Cable #3",
      "type": {
        "value": "cat6",
        "label": "CAT6"
      },
      "a_terminations": [
        {
          "id": 3,
          "url": "https://netbox.example.com/api/dcim/interfaces/3/",
          "display": "core-sw-01: GigabitEthernet1/0/24",
          "object_type": "dcim.interface",
          "object": {
            "id": 3,
            "url": "https://netbox.example.com/api/dcim/interfaces/3/",
            "display": "GigabitEthernet1/0/24",
            "device": {
              "id": 1,
              "url": "https://netbox.example.com/api/dcim/devices/1/",
              "display": "core-sw-01",
              "name": "core-sw-01"
            },
            "name": "GigabitEthernet1/0/24",
            "cable": 3
          },
          "cable": 3
        }
      ],
      "b_terminations": [
        {
          "id": 6,
          "url": "https://netbox.example.com/api/dcim/interfaces/6/",
          "display": "fw-01: port1",
          "object_type": "dcim.interface",
          "object": {
            "id": 6,
            "url": "https://netbox.example.com/api/dcim/interfaces/6/",
            "display": "port1",
            "device": {
              "id": 4,
              "url": "https://netbox.example.com/api/dcim/devices/4/",
              "display": "fw-01",
              "name": "fw-01"
            },
            "name": "port1",
            "cable": 3
          },
          "cable": 3
        }
      ],
      "status": {
        "value": "connected",
        "label": "Connected"
      },
      "label": "core-to-firewall",
      "length": 3,
      "length_unit": {
        "value": "m",
        "label": "Meters"
      },
      "created": "2024-01-01T00:00:00Z",
      "last_updated": "2025-01-15T10:30:00Z"
    },
    {
      "id": 4,
      "url": "https://netbox.example.com/api/dcim/cables/4/",
      "display": "Cable #4",
      "type": {
        "value": "cat6",
        "label": "CAT6"
      },
      "a_terminations": [
        {
          "id": 4,
          "url": "https://netbox.example.com/api/dcim/interfaces/4/",
          "display": "access-sw-01: GigabitEthernet1/0/10",
          "object_type": "dcim.interface",
          "object": {
            "id": 4,
            "url": "https://netbox.example.com/api/dcim/interfaces/4/",
            "display": "GigabitEthernet1/0/10",
            "device": {
              "id": 2,
              "url": "https://netbox.example.com/api/dcim/devices/2/",
              "display": "access-sw-01",
              "name": "access-sw-01"
            },
            "name": "GigabitEthernet1/0/10",
            "cable": 4
          },
          "cable": 4
        }
      ],
      "b_terminations": [
        {
          "id": 7,
          "url": "https://netbox.example.com/api/dcim/interfaces/7/",
          "display": "server-01: eth0",
          "object_type": "dcim.interface",
          "object": {
            "id": 7,
            "url": "https://netbox.example.com/api/dcim/interfaces/7/",
            "display": "eth0",
            "device": {
              "id": 5,
              "url": "https://netbox.example.com/api/dcim/devices/5/",
              "display": "server-01",
              "name": "server-01"
            },
            "name": "eth0",
            "cable": 4
          },
          "cable": 4
        }
      ],
      "status": {
        "value": "connected",
        "label": "Connected"
      },
      "label": "access-to-server",
      "length": 10,
      "length_unit": {
        "value": "m",
        "label": "Meters"
      },
      "created": "2024-01-01T00:00:00Z",
      "last_updated": "2025-01-15T10:30:00Z"
    }
  ],
  "sites": [
    {
      "id": 1,
      "url": "https://netbox.example.com/api/dcim/sites/1/",
      "display": "Main Office",
      "name": "Main Office",
      "slug": "main-office",
      "status": {
        "value": "active",
        "label": "Active"
      },
      "facility": "Building A",
      "time_zone": "America/Los_Angeles",
      "description": "Primary office location",
      "physical_address": "123 Main Street, San Francisco, CA 94105",
      "latitude": 37.7749,
      "longitude": -122.4194,
      "created": "2024-01-01T00:00:00Z",
      "last_updated": "2025-01-15T10:30:00Z",
      "device_count": 5,
      "rack_count": 2,
      "circuit_count": 0,
      "prefix_count": 0,
      "virtualmachine_count": 0,
      "vlan_count": 0
    }
  ],
  "ip_addresses": [],
  "lldp_neighbors": [
    {
      "local_device": "core-sw-01",
      "local_interface": "GigabitEthernet1/0/1",
      "remote_device": "access-sw-01",
      "remote_interface": "GigabitEthernet1/0/1",
      "remote_platform": "Cisco IOS",
      "remote_port_description": "Uplink to Core"
    },
    {
      "local_device": "core-sw-01",
      "local_interface": "GigabitEthernet1/0/2",
      "remote_device": "access-sw-02",
      "remote_interface": "GigabitEthernet1/0/1",
      "remote_platform": "Cisco IOS",
      "remote_port_description": "Uplink to Core"
    },
    {
      "local_device": "core-sw-01",
      "local_interface": "GigabitEthernet1/0/24",
      "remote_device": "fw-01",
      "remote_interface": "port1",
      "remote_platform": "FortiOS",
      "remote_port_description": "LAN Interface"
    },
    {
      "local_device": "access-sw-01",
      "local_interface": "GigabitEthernet1/0/10",
      "remote_device": "server-01",
      "remote_interface": "eth0",
      "remote_platform": "Windows Server",
      "remote_port_description": "Primary NIC"
    }
  ]
};

