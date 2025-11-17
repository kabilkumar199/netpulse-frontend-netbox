import type {
  Device,
  Site,
  Link,
  Credential,
  DeviceRole,
  Dependency,
  Monitor,
  Event,
  Metric,
  DiscoveryScan,
  PathQuery,
  ReachabilityQuery,
  Location,
  Interface,
  VLAN,
  Subnet,
  Schedule,
  NavigationItem,
  LogEntry,
} from "../types";

// Mock Locations
export const mockLocations: Location[] = [
  {
    id: "loc-1",
    name: "Headquarters",
    latitude: 37.7749,
    longitude: -122.4194,
    address: "123 Main St, San Francisco, CA 94105",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    postalCode: "94105",
    siteHierarchy: ["North America", "USA", "California", "San Francisco"],
    mapZoom: 12,
    mapTileReference: "sf-hq",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "loc-2",
    name: "Data Center West",
    latitude: 37.7849,
    longitude: -122.4094,
    address: "456 Data Center Blvd, San Francisco, CA 94107",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    postalCode: "94107",
    siteHierarchy: ["North America", "USA", "California", "San Francisco"],
    mapZoom: 14,
    mapTileReference: "sf-dc-west",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "loc-3",
    name: "Branch Office NYC",
    latitude: 40.7128,
    longitude: -74.006,
    address: "789 Broadway, New York, NY 10003",
    city: "New York",
    state: "NY",
    country: "USA",
    postalCode: "10003",
    siteHierarchy: ["North America", "USA", "New York", "New York City"],
    mapZoom: 13,
    mapTileReference: "nyc-branch",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
];

// Mock Sites
export const mockSites: Site[] = [
  {
    id: "site-1",
    name: "San Francisco HQ",
    description: "Main headquarters office",
    location: mockLocations[0],
    devices: [],
    subnets: [],
    vlans: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "site-2",
    name: "Data Center West",
    description: "Primary data center",
    location: mockLocations[1],
    devices: [],
    subnets: [],
    vlans: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "site-3",
    name: "NYC Branch",
    description: "New York branch office",
    location: mockLocations[2],
    devices: [],
    subnets: [],
    vlans: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
];

// Mock VLANs
export const mockVLANs: VLAN[] = [
  {
    id: "vlan-1",
    vlanId: 10,
    name: "Management",
    description: "Network management VLAN",
    siteId: "site-1",
    devices: [],
    interfaces: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "vlan-2",
    vlanId: 20,
    name: "Servers",
    description: "Server infrastructure VLAN",
    siteId: "site-1",
    devices: [],
    interfaces: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "vlan-3",
    vlanId: 30,
    name: "Users",
    description: "User workstations VLAN",
    siteId: "site-1",
    devices: [],
    interfaces: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
];

// Mock Subnets
export const mockSubnets: Subnet[] = [
  {
    id: "subnet-1",
    network: "192.168.1.0",
    cidr: 24,
    gateway: "192.168.1.1",
    siteId: "site-1",
    devices: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "subnet-2",
    network: "192.168.2.0",
    cidr: 24,
    gateway: "192.168.2.1",
    siteId: "site-1",
    devices: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "subnet-3",
    network: "10.0.1.0",
    cidr: 24,
    gateway: "10.0.1.1",
    siteId: "site-2",
    devices: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
];

// Mock Credentials
export const mockCredentials: Credential[] = [
  {
    id: "cred-1",
    name: "SNMP v2c Public",
    type: "snmp_v2c",
    community: "public",
    priority: 1,
    isActive: true,
    scoping: {
      ipRanges: ["192.168.0.0/16", "10.0.0.0/8"],
      deviceTypes: ["router", "switch", "firewall"],
    },
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "cred-2",
    name: "SNMP v3 Admin",
    type: "snmp_v3",
    username: "admin",
    authProtocol: "sha",
    authPassword: "authpass123",
    privProtocol: "aes",
    privPassword: "privpass123",
    priority: 2,
    isActive: true,
    scoping: {
      ipRanges: ["192.168.1.0/24"],
      deviceTypes: ["router", "switch"],
    },
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "cred-3",
    name: "SSH Admin",
    type: "ssh",
    username: "admin",
    password: "adminpass123",
    priority: 3,
    isActive: true,
    scoping: {
      deviceTypes: ["router", "switch", "firewall"],
    },
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "cred-4",
    name: "Windows WMI",
    type: "wmi",
    username: "domain\\admin",
    password: "wmpass123",
    priority: 4,
    isActive: true,
    scoping: {
      deviceTypes: ["server", "workstation"],
      osTypes: ["windows"],
    },
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
];

// Mock Device Roles
export const mockDeviceRoles: DeviceRole[] = [
  {
    id: "role-1",
    name: "Core Router",
    subRole: "Cisco ASR",
    description: "Core network router",
    deviceFingerprint: {
      snmpOids: ["1.3.6.1.4.1.9.1.1"],
      banners: ["Cisco IOS Software"],
      ports: [22, 23, 80, 443, 161],
    },
    monitors: [],
    actions: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "role-2",
    name: "Access Switch",
    subRole: "Cisco Catalyst",
    description: "Access layer switch",
    deviceFingerprint: {
      snmpOids: ["1.3.6.1.4.1.9.1.1"],
      banners: ["Cisco IOS Software"],
      ports: [22, 23, 80, 443, 161],
    },
    monitors: [],
    actions: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "role-3",
    name: "Server",
    subRole: "Windows Server",
    description: "Windows server",
    deviceFingerprint: {
      wmiClasses: ["Win32_ComputerSystem"],
      banners: ["Microsoft Windows Server"],
      ports: [80, 443, 3389, 5985, 5986],
    },
    monitors: [],
    actions: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
];

// Mock Interfaces
export const mockInterfaces: Interface[] = [
  {
    id: "if-1",
    deviceId: "device-1",
    ifIndex: 1,
    name: "GigabitEthernet0/0/1",
    description: "Uplink to Core Router",
    macAddress: "00:1A:2B:3C:4D:5E",
    speed: 1000000000,
    duplex: "full",
    adminStatus: "up",
    operStatus: "up",
    vlanId: "vlan-1",
    lldpLocalInfo: {
      chassisId: "00:1A:2B:3C:4D:5E",
      portId: "GigabitEthernet0/0/1",
      ttl: 120,
      systemName: "SW-ACCESS-01",
      systemDescription: "Cisco IOS Software, C2960 Software",
      portDescription: "Uplink to Core Router",
      systemCapabilities: ["bridge", "router"],
      enabledCapabilities: ["bridge"],
      managementAddresses: ["192.168.1.10"],
      lastSeen: new Date("2024-01-15T10:30:00Z"),
    },
    lldpRemoteInfo: {
      chassisId: "00:1A:2B:3C:4D:6F",
      portId: "GigabitEthernet0/0/1",
      ttl: 120,
      systemName: "CORE-ROUTER-01",
      systemDescription: "Cisco IOS Software, ASR1000 Software",
      portDescription: "Downlink to Access Switch",
      systemCapabilities: ["bridge", "router"],
      enabledCapabilities: ["router"],
      managementAddresses: ["192.168.1.1"],
      lastSeen: new Date("2024-01-15T10:30:00Z"),
    },
    links: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
];

// Mock Devices
export const mockDevices: Device[] = [
  {
    id: "device-1",
    hostname: "SW-ACCESS-01",
    fqdn: "sw-access-01.company.com",
    ipAddresses: ["192.168.1.10", "10.0.1.10"],
    vendor: "Cisco",
    model: "Catalyst 2960",
    os: "Cisco IOS 15.2",
    snmpSysObjectId: "1.3.6.1.4.1.9.1.1",
    status: "up",
    location: mockLocations[0],
    labels: ["access", "switch", "production"],
    tags: ["network", "infrastructure"],
    lastSeen: new Date("2024-01-15T10:30:00Z"),
    credentials: [mockCredentials[0], mockCredentials[2]],
    roles: [mockDeviceRoles[1]],
    interfaces: [mockInterfaces[0]],
    dependencies: [],
    monitors: [],
    // Enhanced inventory fields
    serialNumber: "FOC1234A5B6",
    macAddress: "00:1A:2B:3C:4D:5E",
    hardwareVersion: "V02",
    softwareVersion: "15.2(4)M12a",
    firmwareVersion: "15.2(4)M12a",
    uptime: 86400 * 30, // 30 days
    deviceType: "switch",
    isCTC: false,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "device-2",
    hostname: "CORE-ROUTER-01",
    fqdn: "core-router-01.company.com",
    ipAddresses: ["192.168.1.1", "10.0.1.1"],
    vendor: "Cisco",
    model: "ASR 1001-X",
    os: "Cisco IOS XE 16.12",
    snmpSysObjectId: "1.3.6.1.4.1.9.1.1",
    status: "up",
    location: mockLocations[0],
    labels: ["core", "router", "production"],
    tags: ["network", "infrastructure", "critical"],
    lastSeen: new Date("2024-01-15T10:30:00Z"),
    credentials: [mockCredentials[1], mockCredentials[2]],
    roles: [mockDeviceRoles[0]],
    interfaces: [],
    dependencies: [],
    monitors: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "device-3",
    hostname: "SRV-WEB-01",
    fqdn: "srv-web-01.company.com",
    ipAddresses: ["192.168.2.10"],
    vendor: "Dell",
    model: "PowerEdge R740",
    os: "Windows Server 2019",
    wmiClass: "Win32_ComputerSystem",
    status: "up",
    location: mockLocations[1],
    labels: ["server", "web", "production"],
    tags: ["compute", "infrastructure"],
    lastSeen: new Date("2024-01-15T10:30:00Z"),
    credentials: [mockCredentials[3]],
    roles: [mockDeviceRoles[2]],
    interfaces: [],
    dependencies: [],
    monitors: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "device-4",
    hostname: "FW-PERIMETER-01",
    fqdn: "fw-perimeter-01.company.com",
    ipAddresses: ["192.168.1.254", "203.0.113.1"],
    vendor: "Fortinet",
    model: "FortiGate 100F",
    os: "FortiOS 7.0",
    status: "up",
    location: mockLocations[0],
    labels: ["firewall", "security", "production"],
    tags: ["security", "infrastructure", "critical"],
    lastSeen: new Date("2024-01-15T10:30:00Z"),
    credentials: [mockCredentials[0], mockCredentials[2]],
    roles: [],
    interfaces: [],
    dependencies: [],
    monitors: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "device-5",
    hostname: "SW-DIST-01",
    fqdn: "sw-dist-01.company.com",
    ipAddresses: ["192.168.2.1"],
    vendor: "Cisco",
    model: "Catalyst 3850",
    os: "Cisco IOS XE 16.12",
    snmpSysObjectId: "1.3.6.1.4.1.9.1.1",
    status: "warning",
    location: mockLocations[1],
    labels: ["distribution", "switch", "production"],
    tags: ["network", "infrastructure"],
    lastSeen: new Date("2024-01-15T09:45:00Z"),
    credentials: [mockCredentials[0], mockCredentials[2]],
    roles: [mockDeviceRoles[1]],
    interfaces: [],
    dependencies: [],
    monitors: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
];

// Mock Links
export const mockLinks: Link[] = [
  {
    id: "link-1",
    sourceDeviceId: "device-1",
    sourceInterfaceId: "if-1",
    targetDeviceId: "device-2",
    targetInterfaceId: "if-2",
    discoverySource: "lldp",
    confidence: 0.95,
    lastSeen: new Date("2024-01-15T10:30:00Z"),
    vlans: ["vlan-1", "vlan-2"],
    speed: 1000000000,
    isUp: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
];

// Mock Dependencies
export const mockDependencies: Dependency[] = [
  {
    id: "dep-1",
    parentDeviceId: "device-2",
    childDeviceId: "device-1",
    direction: "downstream",
    suppressionRules: [],
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
];

// Mock Monitors
export const mockMonitors: Monitor[] = [
  {
    id: "mon-1",
    deviceId: "device-1",
    name: "Ping Monitor",
    type: "ping",
    parameters: {
      target: "192.168.1.10",
      interval: 60,
    },
    thresholds: [
      {
        metric: "response_time",
        operator: "gt",
        value: 1000,
        severity: "warning",
      },
    ],
    interval: 60,
    timeout: 5,
    isActive: true,
    lastCheck: new Date("2024-01-15T10:30:00Z"),
    lastResult: {
      timestamp: new Date("2024-01-15T10:30:00Z"),
      status: "up",
      responseTime: 15,
      message: "Ping successful",
    },
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
];

// Mock Events
export const mockEvents: Event[] = [
  {
    id: "event-1",
    deviceId: "device-5",
    type: "device_down",
    severity: "error",
    message: "Device SW-DIST-01 is down",
    timestamp: new Date("2024-01-15T09:45:00Z"),
    acknowledged: false,
    resolved: false,
  },
  {
    id: "event-2",
    deviceId: "device-1",
    type: "monitor_up",
    severity: "info",
    message: "Ping monitor for SW-ACCESS-01 is up",
    timestamp: new Date("2024-01-15T10:30:00Z"),
    acknowledged: true,
    acknowledgedBy: "admin",
    acknowledgedAt: new Date("2024-01-15T10:35:00Z"),
    resolved: true,
    resolvedAt: new Date("2024-01-15T10:35:00Z"),
  },
];

// Mock Metrics
export const mockMetrics: Metric[] = [
  {
    id: "metric-1",
    deviceId: "device-1",
    monitorId: "mon-1",
    name: "ping_response_time",
    value: 15,
    unit: "ms",
    timestamp: new Date("2024-01-15T10:30:00Z"),
    tags: {
      interface: "GigabitEthernet0/0/1",
      vlan: "10",
    },
  },
];

// Mock Regions
export const mockRegions = [
  {
    id: 1,
    name: "North Region",
    sites: "5 Sites",
    description: "Handles data centers and branches in the northern zone.",
  },
  {
    id: 2,
    name: "South Region",
    sites: "3 Sites",
    description: "Covers coastal and southern metro locations.",
  },
  {
    id: 3,
    name: "East Region",
    sites: "4 Sites",
    description:
      "Responsible for industrial hub connections and cloud edge nodes.",
  },
  {
    id: 4,
    name: "West Region",
    sites: "2 Sites",
    description: "Focuses on rural deployments and IoT gateways.",
  },
];

// Mock Discovery Scans
export const mockDiscoveryScans: DiscoveryScan[] = [
  {
    id: "scan-1",
    name: "Initial Network Discovery",
    status: "completed",
    startTime: new Date("2024-01-01T09:00:00Z"),
    endTime: new Date("2024-01-01T10:30:00Z"),
    progress: 100,
    seedDevices: [
      {
        id: "seed-1",
        type: "ip",
        value: "192.168.1.1",
        description: "Core router IP",
        isActive: true,
      },
    ],
    expansionSettings: {
      enabled: true,
      maxHops: 3,
      maxDevices: 100,
      includeVirtual: false,
      includeCloud: false,
      includeWireless: true,
      includeStorage: false,
    },
    credentialSettings: {
      selectedCredentials: ["cred-1", "cred-2"],
      priorityOrder: ["cred-2", "cred-1"],
      useAllCurrent: true,
      useAllFuture: false,
    },
    scanOptions: {
      autoMonitoring: true,
      timeout: 30,
      retries: 3,
      parallelScans: 5,
      exclusionFilters: [],
    },
    results: {
      totalDevices: 5,
      newDevices: 5,
      updatedDevices: 0,
      failedDevices: 0,
      devices: mockDevices,
      links: mockLinks,
      errors: [],
      summary: {
        scanDuration: 5400,
        devicesPerSecond: 0.0009,
        credentialsUsed: ["cred-1", "cred-2"],
        protocolsUsed: ["snmp", "lldp", "ping"],
        topVendors: [
          { vendor: "Cisco", count: 3 },
          { vendor: "Dell", count: 1 },
          { vendor: "Fortinet", count: 1 },
        ],
        topOS: [
          { os: "Cisco IOS", count: 3 },
          { os: "Windows Server", count: 1 },
          { os: "FortiOS", count: 1 },
        ],
        topRoles: [
          { role: "Access Switch", count: 2 },
          { role: "Core Router", count: 1 },
          { role: "Server", count: 1 },
        ],
      },
    },
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

// Mock Path Queries
export const mockPathQueries: PathQuery[] = [
  {
    id: "path-1",
    sourceDeviceId: "device-1",
    targetDeviceId: "device-3",
    options: {
      preferL2: true,
      includeL3Hops: true,
      maxHops: 10,
      excludeDownLinks: true,
    },
    results: [
      {
        id: "path-result-1",
        path: [
          {
            deviceId: "device-1",
            deviceName: "SW-ACCESS-01",
            interfaceId: "if-1",
            interfaceName: "GigabitEthernet0/0/1",
            ipAddress: "192.168.1.10",
            latency: 1,
            isUp: true,
            vlanId: "vlan-1",
          },
          {
            deviceId: "device-2",
            deviceName: "CORE-ROUTER-01",
            interfaceId: "if-2",
            interfaceName: "GigabitEthernet0/0/1",
            ipAddress: "192.168.1.1",
            latency: 2,
            isUp: true,
          },
        ],
        totalHops: 2,
        totalLatency: 3,
        isReachable: true,
        confidence: 0.95,
        createdAt: new Date("2024-01-15T10:30:00Z"),
      },
    ],
    createdAt: new Date("2024-01-15T10:30:00Z"),
    updatedAt: new Date("2024-01-15T10:30:00Z"),
  },
];

// Mock Reachability Queries
export const mockReachabilityQueries: ReachabilityQuery[] = [
  {
    id: "reach-1",
    sourceDeviceId: "device-1",
    targetDeviceId: "device-3",
    options: {
      includeDependencies: true,
      includeSuppressed: false,
      checkInterval: 60,
      timeout: 30,
      maxRetries: 3,
    },
    results: [
      {
        id: "reach-result-1",
        isReachable: true,
        latency: 3,
        timestamp: new Date("2024-01-15T10:30:00Z"),
      },
    ],
    createdAt: new Date("2024-01-15T10:30:00Z"),
    updatedAt: new Date("2024-01-15T10:30:00Z"),
  },
];

// Mock Schedules
export const mockSchedules: Schedule[] = [
  {
    id: "schedule-1",
    name: "Daily Discovery",
    cronExpression: "0 2 * * *",
    timezone: "UTC",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
];

// Mock Racks
export const mockRacks = [
  {
    id: 1,
    site: "San Francisco HQ",
    location: "Data Center Floor 1",
    name: "Rack-001",
    status: "Active",
    role: "Compute",
    rackType: "Standard 42U",
    description: "Primary compute rack",
    airflow: "Front-to-Back",
    tags: ["core", "production"],
    facilityId: "FAC-001",
    serialNumber: "SN12345",
    assetTag: "AST-001",
    tenantGroup: "Finance",
    tenant: "Accounts",
    formFactor: "19 inches",
    width: "600mm",
    railWidth: "19 inches",
    startUnit: "1",
    height: "42",
    outerWidth: "600mm",
    outerHeight: "2000mm",
    outerDepth: "1070mm",
    outerUnit: "mm",
    weight: "150kg",
    maxWeight: "500kg",
    weightUnit: "kg",
    mountingDepth: "1000mm",
  },
  {
    id: 2,
    site: "Data Center West",
    location: "Row B",
    name: "Rack-002",
    status: "Active",
    role: "Network",
    rackType: "Standard 42U",
    description: "Network equipment rack",
    airflow: "Front-to-Back",
    tags: ["network", "production"],
    facilityId: "FAC-002",
    serialNumber: "SN12346",
    assetTag: "AST-002",
    tenantGroup: "IT",
    tenant: "Network",
    formFactor: "19 inches",
    width: "600mm",
    railWidth: "19 inches",
    startUnit: "1",
    height: "42",
    outerWidth: "600mm",
    outerHeight: "2000mm",
    outerDepth: "1070mm",
    outerUnit: "mm",
    weight: "120kg",
    maxWeight: "500kg",
    weightUnit: "kg",
    mountingDepth: "1000mm",
  },
  {
    id: 3,
    site: "NYC Branch",
    location: "Server Room",
    name: "Rack-003",
    status: "Maintenance",
    role: "Storage",
    rackType: "Standard 42U",
    description: "Storage equipment rack",
    airflow: "Front-to-Back",
    tags: ["storage", "backup"],
    facilityId: "FAC-003",
    serialNumber: "SN12347",
    assetTag: "AST-003",
    tenantGroup: "IT",
    tenant: "Storage",
    formFactor: "19 inches",
    width: "600mm",
    railWidth: "19 inches",
    startUnit: "1",
    height: "42",
    outerWidth: "600mm",
    outerHeight: "2000mm",
    outerDepth: "1070mm",
    outerUnit: "mm",
    weight: "200kg",
    maxWeight: "500kg",
    weightUnit: "kg",
    mountingDepth: "1000mm",
  },
];

// Mock Log Entries
export const mockLogEntries: LogEntry[] = [
  {
    id: "log-1",
    timestamp: new Date(Date.now() - 300000),
    source: "192.168.1.10",
    facility: "kernel",
    severity: "warning",
    message: "Interface eth0: link up",
    rawMessage: "Jan 15 10:25:00 router kernel: [12345.678] eth0: link up",
    parsedFields: {
      timestamp: "Jan 15 10:25:00",
      hostname: "router",
      process: "kernel",
      pid: "12345.678",
      interface: "eth0",
      event: "link up",
    },
    tags: ["network", "interface", "link"],
  },
  {
    id: "log-2",
    timestamp: new Date(Date.now() - 600000),
    source: "192.168.1.1",
    facility: "daemon",
    severity: "error",
    message: "SSH connection failed from 203.0.113.1",
    rawMessage:
      "Jan 15 10:20:00 firewall sshd[1234]: Failed password for root from 203.0.113.1 port 22 ssh2",
    parsedFields: {
      timestamp: "Jan 15 10:20:00",
      hostname: "firewall",
      process: "sshd",
      pid: "1234",
      user: "root",
      source_ip: "203.0.113.1",
      port: "22",
      protocol: "ssh2",
    },
    tags: ["security", "ssh", "authentication"],
  },
  {
    id: "log-3",
    timestamp: new Date(Date.now() - 900000),
    source: "192.168.2.10",
    facility: "local0",
    severity: "info",
    message: "Backup completed successfully",
    rawMessage:
      'Jan 15 10:15:00 server backup[5678]: Backup job "daily_backup" completed successfully. 2.5GB transferred.',
    parsedFields: {
      timestamp: "Jan 15 10:15:00",
      hostname: "server",
      process: "backup",
      pid: "5678",
      job_name: "daily_backup",
      status: "completed successfully",
      size: "2.5GB",
    },
    tags: ["backup", "system", "maintenance"],
  },
  {
    id: "log-4",
    timestamp: new Date(Date.now() - 1200000),
    source: "192.168.1.5",
    facility: "mail",
    severity: "critical",
    message: "Mail server disk space critical",
    rawMessage:
      "Jan 15 10:10:00 mailserver postfix[9012]: warning: /var/spool/mail: disk space low (95% full)",
    parsedFields: {
      timestamp: "Jan 15 10:10:00",
      hostname: "mailserver",
      process: "postfix",
      pid: "9012",
      path: "/var/spool/mail",
      usage: "95% full",
    },
    tags: ["mail", "disk", "critical"],
  },
  {
    id: "log-5",
    timestamp: new Date(Date.now() - 1500000),
    source: "192.168.3.1",
    facility: "cron",
    severity: "notice",
    message: "Scheduled task executed",
    rawMessage:
      "Jan 15 10:05:00 webserver CRON[3456]: (www-data) CMD (/usr/bin/php /var/www/cleanup.php)",
    parsedFields: {
      timestamp: "Jan 15 10:05:00",
      hostname: "webserver",
      process: "CRON",
      pid: "3456",
      user: "www-data",
      command: "/usr/bin/php /var/www/cleanup.php",
    },
    tags: ["cron", "scheduled", "maintenance"],
  },
];

// Mock Users
export const mockUsers = [
  {
    id: "1",
    firstName: "John",
    lastName: "Carter",
    email: "john.carter@company.com",
    role: "Super Admin",
    status: "active" as const,
    lastLogin: new Date("2024-01-15T10:30:00Z"),
    phone: "+1 (555) 123-4567",
    department: "IT",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@company.com",
    role: "Network Admin",
    status: "active" as const,
    lastLogin: new Date("2024-01-15T09:15:00Z"),
    phone: "+1 (555) 234-5678",
    department: "Network Operations",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Chen",
    email: "mike.chen@company.com",
    role: "Network Engineer",
    status: "active" as const,
    lastLogin: new Date("2024-01-14T16:45:00Z"),
    phone: "+1 (555) 345-6789",
    department: "Network Operations",
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-14"),
  },
  {
    id: "4",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@company.com",
    role: "Security Admin",
    status: "inactive" as const,
    lastLogin: new Date("2024-01-10T14:20:00Z"),
    phone: "+1 (555) 456-7890",
    department: "Security",
    createdAt: new Date("2024-01-04"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Wilson",
    email: "david.wilson@company.com",
    role: "Read Only",
    status: "pending" as const,
    lastLogin: undefined,
    phone: "+1 (555) 567-8901",
    department: "Finance",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
];

// Mock Manufacturers
export const mockManufacturers = [
  {
    id: 1,
    name: "Cisco Systems",
    slug: "cisco-systems",
    description: "Leading manufacturer of networking equipment",
  },
  {
    id: 2,
    name: "Juniper Networks",
    slug: "juniper-networks",
    description: "Enterprise-grade routers and switches",
  },
  {
    id: 3,
    name: "Arista Networks",
    slug: "arista-networks",
    description: "Cloud networking hardware manufacturer",
  },
  {
    id: 4,
    name: "Extreme Networks",
    slug: "extreme-networks",
    description: "Provider of high-performance network solutions",
  },
  {
    id: 5,
    name: "Dell Technologies",
    slug: "dell-technologies",
    description: "Server and storage solutions provider",
  },
  {
    id: 6,
    name: "Fortinet",
    slug: "fortinet",
    description: "Cybersecurity and network security solutions",
  },
];

// Mock Navigation Items
export const mockNavigationItems: NavigationItem[] = [
  {
    id: "nav-dashboard",
    label: "Dashboard",
    icon: "dashboard",
    path: "/dashboard",
  },
  {
    id: "nav-organization",
    label: "Organization",
    icon: "building",
    path: "/organization",
    children: [
      {
        id: "nav-organization-regions",
        label: "Regions",
        icon: "map",
        path: "/organization/regions",
      },
      {
        id: "nav-organization-sites",
        label: "Sites",
        icon: "building-2",
        path: "/organization/sites",
      },
      {
        id: "nav-organization-locations",
        label: "Locations",
        icon: "map-pin",
        path: "/organization/locations",
      },
      {
        id: "nav-organization-ManufacturersPage",
        label: "Manufacturers",
        icon: "factory",
        path: "/organization/Manufacturers",
      },
      {
        id: "nav-organization-DeviceRole",
        label: "Device Role",
        icon: "user-check",
        path: "/organization/DeviceRole",
      },
      {
        id: "nav-organization-racks",
        label: "Racks",
        icon: "server-rack",
        path: "/organization/racks",
      },
    ],
  },
  {
    id: "nav-discover",
    label: "Discover",
    icon: "search",
    path: "/discover",
    children: [
      {
        id: "nav-discover-scan",
        label: "New Scan",
        icon: "play",
        path: "/discover/scan",
      },
      // {
      //   id: 'nav-netbox-import',
      //   label: 'Import from NetBox',
      //   icon: 'cloud',
      //   path: '/discover/netbox'
      // },
      {
        id: "nav-discover-history",
        label: "Scan History",
        icon: "history",
        path: "/discover/history",
      },
    ],
  },
  {
    id: "nav-inventory",
    label: "Inventory",
    icon: "server",
    path: "/inventory",
    children: [
      {
        id: "nav-inventory-devices",
        label: "Devices",
        icon: "server",
        path: "/inventory/devices",
      },
    ],
  },
  {
    id: "nav-topology-manager",
    label: "Topology Manager",
    icon: "share",
    path: "/topology-manager",
    children: [
      {
        id: "nav-topology",
        label: "Topology",
        icon: "share",
        path: "/topology-manager/topology",
      },
      {
        id: "nav-lldp-ingestion",
        label: "Protocol Ingestion",
        icon: "link",
        path: "/topology-manager/protocols",
      },
      {
        id: "nav-analyze-paths",
        label: "Path Analysis",
        icon: "route",
        path: "/topology-manager/paths",
      },
      {
        id: "nav-analyze-reachability",
        label: "Reachability",
        icon: "check-circle",
        path: "/topology-manager/reachability",
      },
      {
        id: "nav-analyze-reports",
        label: "Reports",
        icon: "file-text",
        path: "/topology-manager/reports",
      },
    ],
  },
  {
    id: "nav-monitoring",
    label: "Monitoring",
    icon: "activity",
    path: "/monitoring",
    children: [
      {
        id: "nav-monitoring-performance",
        label: "Performance",
        icon: "trending-up",
        path: "/monitoring/performance",
      },
      {
        id: "nav-monitoring-traffic",
        label: "Traffic Analysis",
        icon: "bar-chart",
        path: "/monitoring/traffic",
      },
      {
        id: "nav-monitoring-wireless",
        label: "Wireless",
        icon: "wifi",
        path: "/monitoring/wireless",
      },
      {
        id: "nav-monitoring-applications",
        label: "Applications",
        icon: "layers",
        path: "/monitoring/applications",
      },
      {
        id: "nav-monitoring-cloud",
        label: "Cloud Resources",
        icon: "cloud",
        path: "/monitoring/cloud",
      },
      {
        id: "nav-alert-management",
        label: "Alerts",
        icon: "bell",
        path: "/monitoring/alerts",
      },
      {
        id: "nav-monitoring-logs",
        label: "Logs",
        icon: "file-text",
        path: "/monitoring/logs",
      },
    ],
  },
  {
    id: "nav-management",
    label: "Management",
    icon: "settings",
    path: "/management",
    children: [
      {
        id: "nav-config-management",
        label: "Configuration",
        icon: "settings",
        path: "/management/configuration",
      },
      {
        id: "nav-backups-management",
        label: "Backups",
        icon: "database",
        path: "/management/backups",
      },
      {
        id: "nav-firmware-management",
        label: "Firmware",
        icon: "harddrive",
        path: "/management/firmware",
      },
    ],
  },
  {
    id: "nav-settings",
    label: "Settings",
    icon: "settings",
    path: "/settings",
    children: [
      {
        id: "nav-settings-credentials",
        label: "Credentials",
        icon: "key",
        path: "/settings/credentials",
      },
      {
        id: "nav-settings-roles",
        label: "Device Roles",
        icon: "tag",
        path: "/settings/roles",
      },
      {
        id: "nav-settings-dependencies",
        label: "Dependencies",
        icon: "link",
        path: "/settings/dependencies",
      },
      {
        id: "nav-settings-schedules",
        label: "Schedules",
        icon: "clock",
        path: "/settings/schedules",
      },
      {
        id: "nav-user-management",
        label: "User Management",
        icon: "users",
        path: "/settings/users",
        children: [
          {
            id: "nav-user-list",
            label: "User List",
            icon: "users",
            path: "/settings/users/list",
          },
          {
            id: "nav-user-roles",
            label: "User Roles",
            icon: "shield",
            path: "/settings/users/roles",
          },
        ],
      },
      {
        id: "nav-settings-grafana",
        label: "Grafana",
        icon: "chart",
        path: "/settings/grafana",
      },
    ],
  },
];

// Update site references
mockSites[0].devices = mockDevices.filter((d) => d.location?.id === "loc-1");
mockSites[1].devices = mockDevices.filter((d) => d.location?.id === "loc-2");
mockSites[2].devices = mockDevices.filter((d) => d.location?.id === "loc-3");

mockSites[0].subnets = mockSubnets.filter((s) => s.siteId === "site-1");
mockSites[1].subnets = mockSubnets.filter((s) => s.siteId === "site-2");

mockSites[0].vlans = mockVLANs.filter((v) => v.siteId === "site-1");

// Update device references
mockDevices.forEach((device) => {
  device.interfaces = mockInterfaces.filter(
    (iface) => iface.deviceId === device.id
  );
  device.dependencies = mockDependencies.filter(
    (dep) => dep.parentDeviceId === device.id || dep.childDeviceId === device.id
  );
  device.monitors = mockMonitors.filter((mon) => mon.deviceId === device.id);
});

// Update interface references
mockInterfaces.forEach((iface) => {
  iface.links = mockLinks.filter(
    (link) =>
      link.sourceInterfaceId === iface.id || link.targetInterfaceId === iface.id
  );
});

// Update VLAN and Subnet references
mockVLANs.forEach((vlan) => {
  vlan.devices = mockDevices.filter((device) =>
    device.interfaces.some((iface) => iface.vlanId === vlan.id)
  );
  vlan.interfaces = mockInterfaces.filter((iface) => iface.vlanId === vlan.id);
});

mockSubnets.forEach((subnet) => {
  subnet.devices = mockDevices.filter((device) =>
    device.ipAddresses.some((ip) => {
      const [ipPart] = ip.split("/");
      const [a, b, c] = ipPart.split(".").map(Number);
      const [subnetA, subnetB, subnetC] = subnet.network.split(".").map(Number);
      return a === subnetA && b === subnetB && c === subnetC;
    })
  );
});
