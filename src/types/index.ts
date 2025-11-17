// Core data models for the topology manager

export interface CredentialScoping {
  ipRanges?: string[];
  deviceTypes?: string[];
  vendors?: string[];
  osTypes?: string[];
  roles?: string[];
}

export interface Credential {
  id: string;
  name: string;
  type:
    | "snmp_v1"
    | "snmp_v2c"
    | "snmp_v3"
    | "ssh"
    | "wmi"
    | "telnet"
    | "vmware"
    | "aws"
    | "azure"
    | "meraki"
    | "rest"
    | "redfish";
  username?: string;
  password?: string;
  community?: string; // SNMP v1/v2c
  authProtocol?: "md5" | "sha" | "sha224" | "sha256" | "sha384" | "sha512";
  authPassword?: string; // SNMP v3
  privProtocol?: "des" | "aes" | "aes192" | "aes256";
  privPassword?: string; // SNMP v3
  engineId?: string; // SNMP v3
  context?: string; // SNMP v3
  vlanContextPattern?: string; // SNMP v3 per-VLAN
  priority: number;
  isActive: boolean;
  scoping: CredentialScoping;
  createdAt: Date;
  updatedAt: Date;
}

export interface Device {
  id: string;
  hostname: string;
  arangoId?: string;
  deviceId?: string;
  fqdn?: string;
  ipAddresses: string[];
  vendor: string;
  model: string;
  os: string;
  osVersion?: string; // OS version for display (can be same as os)
  snmpSysObjectId?: string;
  wmiClass?: string;
  cloudId?: string;
  status: "up" | "down" | "warning" | "unknown";
  location?: Location;
  labels: string[];
  tags: string[];
  lastSeen: Date;
  credentials: Credential[];
  roles: DeviceRole[];
  interfaces: Interface[];
  dependencies: Dependency[];
  monitors: Monitor[];
  // Enhanced inventory fields
  serialNumber?: string;
  macAddress?: string;
  hardwareVersion?: string;
  softwareVersion?: string;
  firmwareVersion?: string;
  uptime?: number;
  deviceType?:
    | "router"
    | "switch"
    | "firewall"
    | "access-point"
    | "cpe"
    | "server"
    | "other";
  isCTC?: boolean; // CTC CPE indicator
  ctcInfo?: CTCInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface Site {
  id: string;
  name: string;
  description?: string;
  location: Location;
  devices: Device[];
  subnets: Subnet[];
  vlans: VLAN[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Interface {
  id: string;
  deviceId: string;
  ifIndex: number;
  name: string;
  description?: string;
  macAddress?: string;
  speed?: number;
  duplex?: "half" | "full" | "auto";
  adminStatus: "up" | "down" | "testing";
  operStatus:
    | "up"
    | "down"
    | "testing"
    | "unknown"
    | "dormant"
    | "notPresent"
    | "lowerLayerDown";
  vlanId?: string;
  lldpLocalInfo?: LLDPInfo;
  lldpRemoteInfo?: LLDPInfo;
  links: Link[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Link {
  id: string;
  sourceDeviceId: string;
  sourceInterfaceId: string;
  targetDeviceId: string;
  targetInterfaceId: string;
  discoverySource:
    | "lldp"
    | "cdp"
    | "arp"
    | "snmp"
    | "bridge"
    | "isis"
    | "ospf"
    | "bgp";
  confidence: number; // 0-1
  lastSeen: Date;
  vlans: string[];
  speed?: number;
  isUp: boolean;
  protocolInfo?: ProtocolInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface LLDPInfo {
  chassisId: string;
  portId: string;
  ttl: number;
  systemName: string;
  systemDescription?: string;
  portDescription?: string;
  systemCapabilities: string[];
  enabledCapabilities: string[];
  managementAddresses: string[];
  lastSeen: Date;
}

// Protocol-specific information
export interface ProtocolInfo {
  lldp?: LLDPInfo;
  cdp?: CDPInfo;
  isis?: ISISInfo;
  ospf?: OSPFInfo;
  bgp?: BGPInfo;
}

export interface CDPInfo {
  deviceId: string;
  portId: string;
  platform: string;
  capabilities: string[];
  version: string;
  vlanId?: string;
  duplex?: string;
  lastSeen: Date;
}

export interface ISISInfo {
  systemId: string;
  hostname: string;
  areaAddress: string[];
  interfaceLevel: "level-1" | "level-2" | "level-1-2";
  circuitId: string;
  metric: number;
  priority: number;
  neighborState: "up" | "down" | "init" | "failed";
  holdTime: number;
  lastSeen: Date;
}

export interface OSPFInfo {
  routerId: string;
  areaId: string;
  neighborState:
    | "down"
    | "attempt"
    | "init"
    | "2-way"
    | "exstart"
    | "exchange"
    | "loading"
    | "full";
  neighborPriority: number;
  deadTime: number;
  interfaceAddress: string;
  interfaceType:
    | "broadcast"
    | "point-to-point"
    | "nbma"
    | "point-to-multipoint";
  cost: number;
  designatedRouter?: string;
  backupDesignatedRouter?: string;
  lastSeen: Date;
}

export interface BGPInfo {
  remoteAS: number;
  localAS: number;
  routerId: string;
  peerAddress: string;
  peerState:
    | "idle"
    | "connect"
    | "active"
    | "opensent"
    | "openconfirm"
    | "established";
  uptime: number;
  receivedPrefixes: number;
  sentPrefixes: number;
  lastSeen: Date;
  addressFamilies: string[];
}

export interface VLAN {
  id: string;
  vlanId: number;
  name: string;
  description?: string;
  siteId: string;
  devices: Device[];
  interfaces: Interface[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Subnet {
  id: string;
  network: string;
  cidr: number;
  gateway?: string;
  siteId: string;
  devices: Device[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DeviceRole {
  id: string;
  name: string;
  subRole?: string;
  description?: string;
  deviceFingerprint: DeviceFingerprint;
  monitors: MonitorTemplate[];
  actions: ActionTemplate[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DeviceFingerprint {
  snmpOids?: string[];
  wmiClasses?: string[];
  banners?: string[];
  ports?: number[];
  services?: string[];
}

export interface MonitorTemplate {
  id: string;
  name: string;
  type:
    | "ping"
    | "snmp"
    | "http"
    | "tcp"
    | "udp"
    | "ssh"
    | "wmi"
    | "performance";
  parameters: Record<string, any>;
  thresholds: Threshold[];
  interval: number; // seconds
  timeout: number; // seconds
  isActive: boolean;
}

export interface Threshold {
  metric: string;
  operator: "gt" | "lt" | "eq" | "gte" | "lte";
  value: number;
  severity: "info" | "warning" | "error" | "critical";
}

export interface ActionTemplate {
  id: string;
  name: string;
  type: "email" | "sms" | "webhook" | "script" | "snmp_trap";
  parameters: Record<string, any>;
  conditions: string[];
  isActive: boolean;
}

export interface Dependency {
  id: string;
  parentDeviceId?: string;
  parentMonitorId?: string;
  childDeviceId?: string;
  childMonitorId?: string;
  direction: "upstream" | "downstream" | "bidirectional";
  suppressionRules: SuppressionRule[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SuppressionRule {
  id: string;
  condition: string;
  action: "suppress" | "reduce" | "delay";
  duration?: number; // seconds
  isActive: boolean;
}

export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  siteHierarchy?: string[];
  mapZoom?: number;
  mapTileReference?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Monitor {
  id: string;
  deviceId: string;
  name: string;
  type:
    | "ping"
    | "snmp"
    | "http"
    | "tcp"
    | "udp"
    | "ssh"
    | "wmi"
    | "performance";
  parameters: Record<string, any>;
  thresholds: Threshold[];
  interval: number;
  timeout: number;
  isActive: boolean;
  lastCheck?: Date;
  lastResult?: MonitorResult;
  createdAt: Date;
  updatedAt: Date;
}

export interface MonitorResult {
  timestamp: Date;
  status: "up" | "down" | "warning" | "unknown";
  responseTime?: number;
  value?: number;
  message?: string;
  details?: Record<string, any>;
}

export interface Event {
  id: string;
  deviceId?: string;
  monitorId?: string;
  type:
    | "device_up"
    | "device_down"
    | "monitor_up"
    | "monitor_down"
    | "threshold_exceeded"
    | "dependency_suppressed";
  severity: "info" | "warning" | "error" | "critical";
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolved: boolean;
  resolvedAt?: Date;
}

export interface Metric {
  id: string;
  deviceId: string;
  monitorId: string;
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  tags?: Record<string, string>;
}

// Discovery and scanning types
export interface DiscoveryScan {
  id: string;
  name: string;
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  startTime: Date;
  endTime?: Date;
  progress: number; // 0-100
  seedDevices: SeedDevice[];
  expansionSettings: ExpansionSettings;
  credentialSettings: CredentialSettings;
  scanOptions: ScanOptions;
  results: DiscoveryResult;
  createdAt: Date;
  updatedAt: Date;
}

export interface SeedDevice {
  id: string;
  type:
    | "ip"
    | "range"
    | "subnet"
    | "cloud"
    | "virtual"
    | "wireless"
    | "storage";
  value: string;
  description?: string;
  isActive: boolean;
}

export interface ExpansionSettings {
  enabled: boolean;
  maxHops: number;
  maxDevices: number;
  includeVirtual: boolean;
  includeCloud: boolean;
  includeWireless: boolean;
  includeStorage: boolean;
}

export interface CredentialSettings {
  selectedCredentials: string[];
  priorityOrder: string[];
  useAllCurrent: boolean;
  useAllFuture: boolean;
}

export interface ScanOptions {
  autoMonitoring: boolean;
  schedule?: Schedule;
  exclusionFilters: ExclusionFilter[];
  timeout: number;
  retries: number;
  parallelScans: number;
}

export interface Schedule {
  id: string;
  name: string;
  cronExpression: string;
  timezone: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExclusionFilter {
  id: string;
  type: "ip" | "os" | "brand" | "role";
  pattern: string;
  isActive: boolean;
}

export interface DiscoveryResult {
  totalDevices: number;
  newDevices: number;
  updatedDevices: number;
  failedDevices: number;
  devices: Device[];
  links: Link[];
  errors: DiscoveryError[];
  summary: DiscoverySummary;
}

export interface DiscoveryError {
  id: string;
  deviceId?: string;
  type: "connection" | "authentication" | "timeout" | "permission" | "unknown";
  message: string;
  timestamp: Date;
  details?: Record<string, any>;
}

export interface DiscoverySummary {
  scanDuration: number; // seconds
  devicesPerSecond: number;
  credentialsUsed: string[];
  protocolsUsed: string[];
  topVendors: Array<{ vendor: string; count: number }>;
  topOS: Array<{ os: string; count: number }>;
  topRoles: Array<{ role: string; count: number }>;
}

// Path and reachability types
export interface PathQuery {
  id: string;
  sourceDeviceId: string;
  targetDeviceId: string;
  sourceIp?: string;
  targetIp?: string;
  options: PathOptions;
  results: PathResult[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PathOptions {
  preferL2: boolean;
  includeL3Hops: boolean;
  maxHops: number;
  vlanFilter?: string[];
  subnetFilter?: string[];
  excludeDownLinks: boolean;
}

export interface PathResult {
  id: string;
  path: PathHop[];
  totalHops: number;
  totalLatency: number;
  isReachable: boolean;
  failureReason?: string;
  failureHop?: number;
  confidence: number;
  createdAt: Date;
}

export interface PathHop {
  deviceId: string;
  deviceName: string;
  interfaceId: string;
  interfaceName: string;
  ipAddress?: string;
  latency: number;
  isUp: boolean;
  vlanId?: string;
  subnetId?: string;
}

export interface ReachabilityQuery {
  id: string;
  sourceDeviceId: string;
  targetDeviceId: string;
  sourceIp?: string;
  targetIp?: string;
  options: ReachabilityOptions;
  results: ReachabilityResult[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ReachabilityOptions {
  includeDependencies: boolean;
  includeSuppressed: boolean;
  checkInterval: number; // seconds
  timeout: number; // seconds
  maxRetries: number;
}

export interface ReachabilityResult {
  id: string;
  isReachable: boolean;
  latency?: number;
  path?: PathHop[];
  failureReason?: string;
  suppressedBy?: string[];
  timestamp: Date;
}

// UI State types
export interface AppState {
  devices: Device[];
  sites: Site[];
  links: Link[];
  credentials: Credential[];
  roles: DeviceRole[];
  dependencies: Dependency[];
  monitors: Monitor[];
  events: Event[];
  metrics: Metric[];
  discoveryScans: DiscoveryScan[];
  pathQueries: PathQuery[];
  reachabilityQueries: ReachabilityQuery[];
  selectedDevice?: Device;
  selectedSite?: Site;
  selectedLink?: Link;
  viewMode: "list" | "map" | "topology";
  filters: Filters;
  isLoading: boolean;
  error?: string;
}

export interface Filters {
  deviceStatus?: string[];
  deviceRoles?: string[];
  deviceVendors?: string[];
  deviceOS?: string[];
  siteIds?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchQuery?: string;
}

// Performance Monitoring Types
export interface PerformanceMetric {
  deviceId: string;
  metricType: "cpu" | "memory" | "disk" | "network" | "temperature";
  value: number;
  unit: string;
  timestamp: Date;
  threshold?: {
    warning: number;
    critical: number;
  };
  baseline?: {
    average: number;
    peak: number;
    trend: "increasing" | "decreasing" | "stable";
  };
}

// Network Traffic Analysis Types
export interface FlowRecord {
  id: string;
  sourceIP: string;
  destinationIP: string;
  sourcePort: number;
  destinationPort: number;
  protocol: string;
  bytes: number;
  packets: number;
  startTime: Date;
  endTime: Date;
  application?: string;
  user?: string;
}

// Wireless Network Types
export interface AccessPoint {
  id: string;
  name: string;
  macAddress: string;
  ipAddress: string;
  ssid: string;
  channel: number;
  frequency: number;
  signalStrength: number;
  clientCount: number;
  maxClients: number;
  location?: Location;
  status: "up" | "down" | "warning";
}

export interface WirelessClient {
  id: string;
  macAddress: string;
  ipAddress?: string;
  deviceName?: string;
  connectedAP: string;
  signalStrength: number;
  bandwidthUsage: number;
  connectedTime: Date;
  lastSeen: Date;
}

// Application Performance Types
export interface ApplicationProfile {
  id: string;
  name: string;
  type: "web" | "database" | "email" | "custom";
  checks: ApplicationCheck[];
  dependencies: string[];
  thresholds: {
    responseTime: number;
    errorRate: number;
    availability: number;
  };
}

export interface AuthenticationConfig {
  username?: string;
  password?: string;
  token?: string;
  certificate?: string;
  method?: "basic" | "bearer" | "certificate" | "api-key";
}

export interface ApplicationCheck {
  type: "http" | "tcp" | "udp" | "database" | "script";
  target: string;
  port?: number;
  timeout: number;
  expectedResponse?: string;
  authentication?: AuthenticationConfig;
}

// Cloud Resources Types
export interface CloudResource {
  id: string;
  provider: "aws" | "azure" | "gcp";
  type: "vm" | "database" | "storage" | "function" | "load-balancer";
  name: string;
  region: string;
  status: "running" | "stopped" | "terminated";
  metrics: CloudMetrics;
  cost: {
    hourly: number;
    monthly: number;
    currency: string;
  };
  tags: Record<string, string>;
}

export interface CloudMetrics {
  cpuUtilization?: number;
  memoryUtilization?: number;
  diskUtilization?: number;
  networkIn?: number;
  networkOut?: number;
  requestCount?: number;
  errorRate?: number;
}

// Log Management Types
export interface LogEntry {
  id: string;
  timestamp: Date;
  source: string;
  facility: string;
  severity:
    | "emergency"
    | "alert"
    | "critical"
    | "error"
    | "warning"
    | "notice"
    | "info"
    | "debug";
  message: string;
  rawMessage: string;
  parsedFields: Record<string, any>;
  tags: string[];
}

// Configuration Management Types
export interface DeviceConfiguration {
  deviceId: string;
  configuration: string;
  version: string;
  timestamp: Date;
  checksum: string;
  backupType: "scheduled" | "manual" | "change-triggered";
  status: "current" | "backup" | "gold-standard";
}

export interface ConfigurationPolicy {
  id: string;
  name: string;
  description: string;
  rules: PolicyRule[];
  devices: string[];
  enabled: boolean;
}

export interface PolicyRule {
  type: "contains" | "not-contains" | "regex" | "equals";
  pattern: string;
  severity: "info" | "warning" | "error" | "critical";
  message: string;
}

// Navigation types
export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  children?: NavigationItem[];
  badge?: number;
  isActive?: boolean;
}

// Map types
export interface MapView {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  mapType: "roadmap" | "satellite" | "hybrid" | "terrain";
  overlays: MapOverlay[];
}

export interface MapOverlay {
  id: string;
  type: "devices" | "sites" | "links" | "alerts";
  visible: boolean;
  opacity: number;
  color?: string;
  size?: number;
}

// Export/Import types
export interface ExportOptions {
  format: "csv" | "excel" | "json" | "xml";
  includeDevices: boolean;
  includeLinks: boolean;
  includeMetrics: boolean;
  includeEvents: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  filters?: Filters;
}

export interface ImportOptions {
  format: "csv" | "excel" | "json" | "xml";
  mapping: Record<string, string>;
  validateData: boolean;
  updateExisting: boolean;
  createMissing: boolean;
}

export interface Region {
  id: number;
  name: string;
  sites: string;
  description: string;
}

// L2 Services Configuration Types
export interface L2ServiceConfig {
  id: string;
  deviceId: string;
  serviceType:
    | "vlan"
    | "stp"
    | "lldp"
    | "cdp"
    | "lacp"
    | "vpc"
    | "port-channel"
    | "trunk";
  name: string;
  description?: string;
  configuration: L2ServiceConfiguration;
  status: "active" | "inactive" | "pending" | "error";
  lastApplied?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface L2ServiceConfiguration {
  vlan?: VLANConfig;
  stp?: STPConfig;
  lldp?: LLDPConfig;
  cdp?: CDPConfig;
  lacp?: LACPConfig;
  vpc?: VPCConfig;
  portChannel?: PortChannelConfig;
  trunk?: TrunkConfig;
}

export interface VLANConfig {
  vlanId: number;
  name: string;
  description?: string;
  state: "active" | "suspend";
  interfaces: string[];
  ipAddress?: string;
  subnet?: string;
  gateway?: string;
}

export interface STPConfig {
  mode: "pvst" | "rapid-pvst" | "mst" | "rstp" | "disabled";
  priority: number;
  helloTime: number;
  forwardDelay: number;
  maxAge: number;
  bridgeId: string;
  rootBridge: boolean;
  interfaces: STPInterfaceConfig[];
}

export interface STPInterfaceConfig {
  interfaceId: string;
  cost: number;
  priority: number;
  state: "forwarding" | "blocking" | "listening" | "learning" | "disabled";
  role: "root" | "designated" | "alternate" | "backup" | "disabled";
}

export interface LLDPConfig {
  enabled: boolean;
  holdTime: number;
  timer: number;
  reinit: number;
  interfaces: LLDPInterfaceConfig[];
}

export interface LLDPInterfaceConfig {
  interfaceId: string;
  enabled: boolean;
  transmit: boolean;
  receive: boolean;
  tlvSelect: string[];
}

export interface CDPConfig {
  enabled: boolean;
  timer: number;
  holdTime: number;
  interfaces: CDPInterfaceConfig[];
}

export interface CDPInterfaceConfig {
  interfaceId: string;
  enabled: boolean;
}

export interface LACPConfig {
  enabled: boolean;
  systemPriority: number;
  interfaces: LACPInterfaceConfig[];
}

export interface LACPInterfaceConfig {
  interfaceId: string;
  channelGroup: number;
  mode: "active" | "passive" | "on";
  priority: number;
}

export interface VPCConfig {
  enabled: boolean;
  domainId: number;
  systemPriority: number;
  peerKeepalive: {
    destination: string;
    source: string;
    vrf: string;
  };
  peerLink: string;
  interfaces: VPCInterfaceConfig[];
}

export interface VPCInterfaceConfig {
  interfaceId: string;
  vpcId: number;
  priority: number;
}

export interface PortChannelConfig {
  channelId: number;
  name: string;
  mode: "active" | "passive" | "on" | "auto" | "desirable";
  minLinks: number;
  maxLinks: number;
  interfaces: string[];
  loadBalance: "src-dst-ip" | "src-dst-port" | "src-ip" | "dst-ip";
}

export interface TrunkConfig {
  encapsulation: "dot1q" | "isl" | "negotiate";
  nativeVlan: number;
  allowedVlans: number[];
  interfaces: TrunkInterfaceConfig[];
}

export interface TrunkInterfaceConfig {
  interfaceId: string;
  mode: "access" | "trunk" | "dynamic-auto" | "dynamic-desirable";
  nativeVlan: number;
  allowedVlans: number[];
}

// Device Performance and Statistics Types
export interface DevicePerformance {
  deviceId: string;
  cpu: {
    usage: number;
    cores: number;
    temperature?: number;
    loadAverage: number[];
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  uptime: number;
  lastUpdated: Date;
}

export interface DevicePortLayout {
  deviceId: string;
  ports: DevicePort[];
  totalPorts: number;
  usedPorts: number;
  availablePorts: number;
}

export interface DevicePort {
  id: string;
  name: string;
  type: "ethernet" | "fiber" | "console" | "aux" | "management";
  status: "up" | "down" | "disabled" | "error";
  speed?: number;
  duplex?: "half" | "full" | "auto";
  vlan?: number;
  description?: string;
  connectedTo?: string;
  utilization?: number;
  // Enhanced port statistics
  bytesIn?: number;
  bytesOut?: number;
  packetsIn?: number;
  packetsOut?: number;
  errorsIn?: number;
  errorsOut?: number;
  discardsIn?: number;
  discardsOut?: number;
  lastUpdated?: Date;
}

export interface CTCInfo {
  cpeId: string;
  customerId: string;
  serviceType: string;
  circuitId: string;
  installationDate: Date;
  lastMaintenance?: Date;
  serviceLevel: "bronze" | "silver" | "gold" | "platinum";
  contactInfo: {
    customerName: string;
    phone: string;
    email: string;
    address: string;
  };
}

export interface ConfigFile {
  id: string;
  deviceId: string;
  filename: string;
  content: string;
  size: number;
  checksum: string;
  uploadedAt: Date;
  uploadedBy: string;
  description?: string;
  isActive: boolean;
}

export interface VPLSConfig {
  name: string;
  state: "up" | "down" | "admin-down";
  veId: number;
  routeDistinguisher: string;
  macLimit: number;
  macLock: "enable" | "disable";
  blockSize: number;
  mtu: number;
  dhcpSnoopingEnable: "v4" | "v6" | "v4,v6" | "disable";
  acInterfaces: VPLSACInterface[];
  pseudowires: VPLSPseudowire[];
  createdAt: Date;
  updatedAt: Date;
}

export interface VPLSACInterface {
  interfaceId: string;
  state: "up" | "down" | "admin-down";
  splitHorizonGroup?: string;
  dhcpSnoopingTrusted: "v4" | "v6" | "v4,v6" | "N";
  dhcpSnReceive: "v4" | "v6" | "v4,v6" | "N";
  dhcpSnOptionInsert: "v4" | "v6" | "v4,v6" | "N";
}

export interface VPLSPseudowire {
  id: string;
  state: "up" | "down" | "admin-down";
  remotePeer: string;
  vcId: number;
  label: number;
  mtu: number;
  encapsulation: "mpls" | "l2tpv3";
}

export interface DHCPSnoopingConfig {
  enabled: boolean;
  version: "v4" | "v6" | "both";
  trustedInterfaces: string[];
  untrustedInterfaces: string[];
  optionInsert: boolean;
  rateLimit: number;
  maxBindings: number;
  bindingTable: DHCPSnoopingBinding[];
}

export interface DHCPSnoopingBinding {
  macAddress: string;
  ipAddress: string;
  vlan: number;
  interface: string;
  leaseTime: number;
  bindingType: "dynamic" | "static";
  createdAt: Date;
}

export interface DevicesApiResponse {
  devices: Device[];
}

export interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface AddDeviceFormData {
  ipAddress: string;
  username: string;
  password: string;
}

export interface AddDeviceFormErrors {
  ipAddress?: string;
  username?: string;
  password?: string;
  general?: string;
}