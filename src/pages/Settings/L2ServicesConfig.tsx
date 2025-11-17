import React, { useState, useEffect } from "react";
import type {
  L2ServiceConfig,
  Device,
  L2ServiceConfiguration,
  VPLSConfig,
  DHCPSnoopingConfig,
} from "../../types";
import { mockDevices } from "../../data/mockData";

interface L2ServicesConfigProps {
  onClose?: () => void;
  selectedDevice?: Device;
}

const L2ServicesConfig: React.FC<L2ServicesConfigProps> = ({
  onClose,
  selectedDevice,
}) => {
  const [selectedView, setSelectedView] = useState<
    | "overview"
    | "vlan"
    | "stp"
    | "lldp"
    | "cdp"
    | "lacp"
    | "vpc"
    | "port-channel"
    | "trunk"
    | "vpls"
    | "dhcp-snooping"
  >("overview");
  const [l2Configs, setL2Configs] = useState<L2ServiceConfig[]>([]);
  const [vplsConfigs, setVplsConfigs] = useState<VPLSConfig[]>([]);
  const [dhcpSnoopingConfigs, setDhcpSnoopingConfigs] = useState<
    DHCPSnoopingConfig[]
  >([]);
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(
    selectedDevice?.id || ""
  );
  const [isLoading, setIsLoading] = useState(false);

  // Generate mock L2 configuration data
  useEffect(() => {
    const generateMockL2Configs = () => {
      setIsLoading(true);

      const mockL2Configs: L2ServiceConfig[] = [
        // VLAN Configurations
        {
          id: "l2-vlan-1",
          deviceId: "device-1",
          serviceType: "vlan",
          name: "Management VLAN",
          description: "VLAN for network management traffic",
          configuration: {
            vlan: {
              vlanId: 10,
              name: "MGMT",
              description: "Management VLAN",
              state: "active",
              interfaces: ["if-1", "if-2"],
              ipAddress: "192.168.10.1",
              subnet: "192.168.10.0/24",
              gateway: "192.168.10.1",
            },
          },
          status: "active",
          lastApplied: new Date(Date.now() - 3600000),
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-15"),
        },
        {
          id: "l2-vlan-2",
          deviceId: "device-1",
          serviceType: "vlan",
          name: "Server VLAN",
          description: "VLAN for server infrastructure",
          configuration: {
            vlan: {
              vlanId: 20,
              name: "SERVERS",
              description: "Server VLAN",
              state: "active",
              interfaces: ["if-3", "if-4"],
              ipAddress: "192.168.20.1",
              subnet: "192.168.20.0/24",
              gateway: "192.168.20.1",
            },
          },
          status: "active",
          lastApplied: new Date(Date.now() - 7200000),
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-15"),
        },
        // STP Configuration
        {
          id: "l2-stp-1",
          deviceId: "device-1",
          serviceType: "stp",
          name: "Rapid PVST+",
          description: "Rapid Per-VLAN Spanning Tree Plus configuration",
          configuration: {
            stp: {
              mode: "rapid-pvst",
              priority: 32768,
              helloTime: 2,
              forwardDelay: 15,
              maxAge: 20,
              bridgeId: "00:1A:2B:3C:4D:5E",
              rootBridge: false,
              interfaces: [
                {
                  interfaceId: "if-1",
                  cost: 4,
                  priority: 128,
                  state: "forwarding",
                  role: "designated",
                },
                {
                  interfaceId: "if-2",
                  cost: 4,
                  priority: 128,
                  state: "blocking",
                  role: "alternate",
                },
              ],
            },
          },
          status: "active",
          lastApplied: new Date(Date.now() - 1800000),
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-15"),
        },
        // LLDP Configuration
        {
          id: "l2-lldp-1",
          deviceId: "device-1",
          serviceType: "lldp",
          name: "LLDP Global",
          description: "Link Layer Discovery Protocol configuration",
          configuration: {
            lldp: {
              enabled: true,
              holdTime: 120,
              timer: 30,
              reinit: 2,
              interfaces: [
                {
                  interfaceId: "if-1",
                  enabled: true,
                  transmit: true,
                  receive: true,
                  tlvSelect: [
                    "system-name",
                    "system-description",
                    "system-capabilities",
                    "management-address",
                  ],
                },
                {
                  interfaceId: "if-2",
                  enabled: true,
                  transmit: true,
                  receive: true,
                  tlvSelect: [
                    "system-name",
                    "system-description",
                    "system-capabilities",
                  ],
                },
              ],
            },
          },
          status: "active",
          lastApplied: new Date(Date.now() - 900000),
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-15"),
        },
        // CDP Configuration
        {
          id: "l2-cdp-1",
          deviceId: "device-1",
          serviceType: "cdp",
          name: "CDP Global",
          description: "Cisco Discovery Protocol configuration",
          configuration: {
            cdp: {
              enabled: true,
              timer: 60,
              holdTime: 180,
              interfaces: [
                {
                  interfaceId: "if-1",
                  enabled: true,
                },
                {
                  interfaceId: "if-2",
                  enabled: true,
                },
              ],
            },
          },
          status: "active",
          lastApplied: new Date(Date.now() - 600000),
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-15"),
        },
        // LACP Configuration
        {
          id: "l2-lacp-1",
          deviceId: "device-1",
          serviceType: "lacp",
          name: "LACP Channel Group 1",
          description: "Link Aggregation Control Protocol configuration",
          configuration: {
            lacp: {
              enabled: true,
              systemPriority: 32768,
              interfaces: [
                {
                  interfaceId: "if-3",
                  channelGroup: 1,
                  mode: "active",
                  priority: 128,
                },
                {
                  interfaceId: "if-4",
                  channelGroup: 1,
                  mode: "active",
                  priority: 128,
                },
              ],
            },
          },
          status: "active",
          lastApplied: new Date(Date.now() - 300000),
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-15"),
        },
        // Port Channel Configuration
        {
          id: "l2-portchannel-1",
          deviceId: "device-1",
          serviceType: "port-channel",
          name: "Port-Channel 1",
          description: "Port Channel configuration for link aggregation",
          configuration: {
            portChannel: {
              channelId: 1,
              name: "Port-Channel1",
              mode: "active",
              minLinks: 1,
              maxLinks: 8,
              interfaces: ["if-3", "if-4"],
              loadBalance: "src-dst-ip",
            },
          },
          status: "active",
          lastApplied: new Date(Date.now() - 150000),
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-15"),
        },
        // Trunk Configuration
        {
          id: "l2-trunk-1",
          deviceId: "device-1",
          serviceType: "trunk",
          name: "Trunk Configuration",
          description: "802.1Q trunk configuration",
          configuration: {
            trunk: {
              encapsulation: "dot1q",
              nativeVlan: 1,
              allowedVlans: [10, 20, 30, 40, 50],
              interfaces: [
                {
                  interfaceId: "if-1",
                  mode: "trunk",
                  nativeVlan: 1,
                  allowedVlans: [10, 20, 30, 40, 50],
                },
              ],
            },
          },
          status: "active",
          lastApplied: new Date(Date.now() - 120000),
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-15"),
        },
      ];

      // Generate mock VPLS configurations
      const mockVplsConfigs: VPLSConfig[] = [
        {
          name: "SnoopDog",
          state: "up",
          veId: 666,
          routeDistinguisher: "0:0",
          macLimit: 65520,
          macLock: "disable",
          blockSize: 8,
          mtu: 1500,
          dhcpSnoopingEnable: "v4,v6",
          acInterfaces: [
            {
              interfaceId: "x-eth0/0/4",
              state: "up",
              dhcpSnoopingTrusted: "N",
              dhcpSnReceive: "v4,v6",
              dhcpSnOptionInsert: "v4,v6",
            },
            {
              interfaceId: "x-eth0/0/6",
              state: "up",
              dhcpSnoopingTrusted: "N",
              dhcpSnReceive: "v4,v6",
              dhcpSnOptionInsert: "v4,v6",
            },
            {
              interfaceId: "x-eth0/0/7",
              state: "up",
              dhcpSnoopingTrusted: "N",
              dhcpSnReceive: "v4,v6",
              dhcpSnOptionInsert: "v4,v6",
            },
            {
              interfaceId: "x-eth0/0/30",
              state: "up",
              dhcpSnoopingTrusted: "v4,v6",
              dhcpSnReceive: "v4,v6",
              dhcpSnOptionInsert: "v4,v6",
            },
            {
              interfaceId: "x-eth0/0/44",
              state: "up",
              dhcpSnoopingTrusted: "N",
              dhcpSnReceive: "v4,v6",
              dhcpSnOptionInsert: "v4,v6",
            },
          ],
          pseudowires: [
            {
              id: "pw-1",
              state: "up",
              remotePeer: "10.3.62.2",
              vcId: 100,
              label: 1001,
              mtu: 1500,
              encapsulation: "mpls",
            },
          ],
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-15"),
        },
      ];

      // Generate mock DHCP Snooping configurations
      const mockDhcpSnoopingConfigs: DHCPSnoopingConfig[] = [
        {
          enabled: true,
          version: "both",
          trustedInterfaces: ["x-eth0/0/30"],
          untrustedInterfaces: [
            "x-eth0/0/4",
            "x-eth0/0/6",
            "x-eth0/0/7",
            "x-eth0/0/44",
          ],
          optionInsert: true,
          rateLimit: 100,
          maxBindings: 1000,
          bindingTable: [
            {
              macAddress: "00:1A:2B:3C:4D:5E",
              ipAddress: "192.168.10.100",
              vlan: 10,
              interface: "x-eth0/0/4",
              leaseTime: 3600,
              bindingType: "dynamic",
              createdAt: new Date(Date.now() - 1800000),
            },
            {
              macAddress: "00:1A:2B:3C:4D:6F",
              ipAddress: "192.168.10.101",
              vlan: 10,
              interface: "x-eth0/0/6",
              leaseTime: 3600,
              bindingType: "dynamic",
              createdAt: new Date(Date.now() - 900000),
            },
          ],
        },
      ];

      setL2Configs(mockL2Configs);
      setVplsConfigs(mockVplsConfigs);
      setDhcpSnoopingConfigs(mockDhcpSnoopingConfigs);
      setIsLoading(false);
    };

    generateMockL2Configs();
  }, []);

  const getDeviceById = (deviceId: string) => {
    return devices.find((d) => d.id === deviceId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400";
      case "inactive":
        return "text-gray-400";
      case "pending":
        return "text-yellow-400";
      case "error":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getServiceTypeIcon = (serviceType: string) => {
    switch (serviceType) {
      case "vlan":
        return "🏷️";
      case "stp":
        return "🌳";
      case "lldp":
        return "🔍";
      case "cdp":
        return "📡";
      case "lacp":
        return "🔗";
      case "vpc":
        return "⚡";
      case "port-channel":
        return "🔌";
      case "trunk":
        return "📦";
      case "vpls":
        return "🌐";
      case "dhcp-snooping":
        return "🛡️";
      default:
        return "⚙️";
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const handleApplyConfig = (configId: string) => {
    console.log(`Applying L2 configuration: ${configId}`);
    // Simulate applying configuration
  };

  const handleEditConfig = (configId: string) => {
    console.log(`Editing L2 configuration: ${configId}`);
    // Simulate editing configuration
  };

  const handleDeleteConfig = (configId: string) => {
    console.log(`Deleting L2 configuration: ${configId}`);
    // Simulate deleting configuration
  };

  const filteredConfigs = selectedDeviceId
    ? l2Configs.filter((config) => config.deviceId === selectedDeviceId)
    : l2Configs;

  const configsByType = filteredConfigs.reduce((acc, config) => {
    if (!acc[config.serviceType]) {
      acc[config.serviceType] = [];
    }
    acc[config.serviceType].push(config);
    return acc;
  }, {} as Record<string, L2ServiceConfig[]>);

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Device Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Select Device
        </label>
        <select
          value={selectedDeviceId}
          onChange={(e) => setSelectedDeviceId(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Devices</option>
          {devices.map((device) => (
            <option key={device.id} value={device.id}>
              {device.hostname} ({device.vendor} {device.model})
            </option>
          ))}
        </select>
      </div>

      {/* View Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(
          [
            { key: "overview", label: "Overview", icon: "📊" },
            { key: "vlan", label: "VLANs", icon: "🏷️" },
            { key: "stp", label: "STP", icon: "🌳" },
            { key: "lldp", label: "LLDP", icon: "🔍" },
            { key: "cdp", label: "CDP", icon: "📡" },
            { key: "lacp", label: "LACP", icon: "🔗" },
            { key: "vpc", label: "VPC", icon: "⚡" },
            { key: "port-channel", label: "Port Channels", icon: "🔌" },
            { key: "trunk", label: "Trunks", icon: "📦" },
            { key: "vpls", label: "VPLS", icon: "🌐" },
            { key: "dhcp-snooping", label: "DHCP Snooping", icon: "🛡️" },
          ] as const
        ).map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setSelectedView(key)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              selectedView === key
                ? "bg-blue-600 text-white"
                : "bg-gray-600 text-gray-300 hover:bg-gray-500"
            }`}
          >
             <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-300">
              Loading L2 configuration data...
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      {!isLoading && (
        <div className="space-y-6">
          {/* Overview */}
          {selectedView === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(configsByType).map(([serviceType, configs]) => (
                <div key={serviceType} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                      <span>{getServiceTypeIcon(serviceType)}</span>
                      <span>{serviceType.toUpperCase()}</span>
                    </h3>
                    <span className="text-2xl font-bold text-blue-400">
                      {configs.length}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {configs.filter((c) => c.status === "active").length} active
                  </div>
                  <div className="mt-2">
                    <button
                      onClick={() => setSelectedView(serviceType as any)}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Service Type Views */}
          {selectedView !== "overview" && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <span>{getServiceTypeIcon(selectedView)}</span>
                <span>{selectedView.toUpperCase()} Configurations</span>
              </h3>

              {configsByType[selectedView]?.length > 0 ? (
                <div className="space-y-4">
                  {configsByType[selectedView].map((config) => {
                    const device = getDeviceById(config.deviceId);
                    return (
                      <div
                        key={config.id}
                        className="bg-gray-700 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-2xl">
                              {getServiceTypeIcon(config.serviceType)}
                            </div>
                            <div>
                              <div className="font-medium text-white">
                                {config.name}
                              </div>
                              <div className="text-sm text-gray-400">
                                {device?.hostname} • {config.description}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="text-sm text-gray-400">
                                Status
                              </div>
                              <div
                                className={`font-medium ${getStatusColor(
                                  config.status
                                )}`}
                              >
                                {config.status.toUpperCase()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-400">
                                Last Applied
                              </div>
                              <div className="font-medium text-white">
                                {config.lastApplied
                                  ? formatTimeAgo(config.lastApplied)
                                  : "Never"}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleApplyConfig(config.id)}
                                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                              >
                                Apply
                              </button>
                              <button
                                onClick={() => handleEditConfig(config.id)}
                                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteConfig(config.id)}
                                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">
                    {getServiceTypeIcon(selectedView)}
                  </div>
                  <div className="text-lg font-medium text-white mb-2">
                    No {selectedView.toUpperCase()} Configurations
                  </div>
                  <div className="text-gray-400">
                    No {selectedView} configurations found for the selected
                    device
                  </div>
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Create {selectedView.toUpperCase()} Configuration
                  </button>
                </div>
              )}
            </div>
          )}

          {/* VPLS View */}
          {selectedView === "vpls" && (
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <span>🌐</span>
                  <span>VPLS Configurations</span>
                </h3>
                <div className="text-sm text-gray-400">
                  Last updated: {new Date().toLocaleString()}
                </div>
              </div>

              {vplsConfigs.length > 0 ? (
                <div className="space-y-6">
                  {vplsConfigs.map((vpls) => (
                    <div key={vpls.name} className="bg-gray-700 rounded-lg p-4">
                      {/* VPLS Instance Details */}
                      <div className="mb-4">
                        <h4 className="text-md font-semibold text-white mb-3">
                          VPLS Instance: {vpls.name}
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-gray-400">State</div>
                            <div
                              className={`font-medium ${
                                vpls.state === "up"
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {vpls.state.toUpperCase()}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400">VE-ID</div>
                            <div className="font-medium text-white">
                              {vpls.veId}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400">
                              Route Distinguisher
                            </div>
                            <div className="font-medium text-white">
                              {vpls.routeDistinguisher}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400">MAC Limit</div>
                            <div className="font-medium text-white">
                              {vpls.macLimit}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400">MAC Lock</div>
                            <div className="font-medium text-white">
                              {vpls.macLock}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400">Block Size</div>
                            <div className="font-medium text-white">
                              {vpls.blockSize}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400">MTU</div>
                            <div className="font-medium text-white">
                              {vpls.mtu}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400">DHCP Snooping</div>
                            <div className="font-medium text-white">
                              {vpls.dhcpSnoopingEnable}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* AC Interfaces */}
                      <div>
                        <div className="flex items-center space-x-4 mb-3">
                          <h5 className="text-md font-semibold text-white">
                            AC Interfaces
                          </h5>
                          <div className="flex space-x-2">
                            <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                              Add Interface
                            </button>
                            <button className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700">
                              Apply Config
                            </button>
                          </div>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-600">
                                <th className="text-left py-2 text-gray-300">
                                  Interface
                                </th>
                                <th className="text-left py-2 text-gray-300">
                                  State
                                </th>
                                <th className="text-left py-2 text-gray-300">
                                  Split Horizon Group
                                </th>
                                <th className="text-left py-2 text-gray-300">
                                  DHCP Snooping Trusted
                                </th>
                                <th className="text-left py-2 text-gray-300">
                                  DHCP SN Receive
                                </th>
                                <th className="text-left py-2 text-gray-300">
                                  DHCP SN Option Insert
                                </th>
                                <th className="text-left py-2 text-gray-300">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {vpls.acInterfaces.map((ac, index) => (
                                <tr
                                  key={index}
                                  className="border-b border-gray-700"
                                >
                                  <td className="py-2 text-white">
                                    {ac.interfaceId}
                                  </td>
                                  <td className="py-2">
                                    <span
                                      className={`px-2 py-1 rounded text-xs ${
                                        ac.state === "up"
                                          ? "bg-green-900 text-green-300"
                                          : "bg-red-900 text-red-300"
                                      }`}
                                    >
                                      {ac.state.toUpperCase()}
                                    </span>
                                  </td>
                                  <td className="py-2 text-gray-400">
                                    {ac.splitHorizonGroup || "-"}
                                  </td>
                                  <td className="py-2 text-white">
                                    {ac.dhcpSnoopingTrusted}
                                  </td>
                                  <td className="py-2 text-white">
                                    {ac.dhcpSnReceive}
                                  </td>
                                  <td className="py-2 text-white">
                                    {ac.dhcpSnOptionInsert}
                                  </td>
                                  <td className="py-2">
                                    <div className="flex space-x-1">
                                      <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                                        Edit
                                      </button>
                                      <button className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">
                                        Remove
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">🌐</div>
                  <div className="text-lg font-medium text-white mb-2">
                    No VPLS Configurations
                  </div>
                  <div className="text-gray-400">
                    No VPLS configurations found
                  </div>
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Create VPLS Configuration
                  </button>
                </div>
              )}
            </div>
          )}

          {/* DHCP Snooping View */}
          {selectedView === "dhcp-snooping" && (
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <span>🛡️</span>
                  <span>DHCP Snooping Configuration</span>
                </h3>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                    Apply Config
                  </button>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                    Edit Settings
                  </button>
                </div>
              </div>

              {dhcpSnoopingConfigs.length > 0 ? (
                <div className="space-y-6">
                  {dhcpSnoopingConfigs.map((config, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4">
                      {/* DHCP Snooping Settings */}
                      <div className="mb-6">
                        <h4 className="text-md font-semibold text-white mb-3">
                          DHCP Snooping Settings
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-gray-400">Status</div>
                            <div
                              className={`font-medium ${
                                config.enabled
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {config.enabled ? "ENABLED" : "DISABLED"}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400">Version</div>
                            <div className="font-medium text-white">
                              {config.version.toUpperCase()}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400">Rate Limit</div>
                            <div className="font-medium text-white">
                              {config.rateLimit} pps
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400">Max Bindings</div>
                            <div className="font-medium text-white">
                              {config.maxBindings}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Trusted Interfaces */}
                      <div className="mb-6">
                        <h5 className="text-md font-semibold text-white mb-3">
                          Trusted Interfaces
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {config.trustedInterfaces.map((iface, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-green-900 text-green-300 rounded-full text-sm"
                            >
                              {iface}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Untrusted Interfaces */}
                      <div className="mb-6">
                        <h5 className="text-md font-semibold text-white mb-3">
                          Untrusted Interfaces
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {config.untrustedInterfaces.map((iface, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-red-900 text-red-300 rounded-full text-sm"
                            >
                              {iface}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Binding Table */}
                      <div>
                        <h5 className="text-md font-semibold text-white mb-3">
                          DHCP Snooping Binding Table
                        </h5>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-600">
                                <th className="text-left py-2 text-gray-300">
                                  MAC Address
                                </th>
                                <th className="text-left py-2 text-gray-300">
                                  IP Address
                                </th>
                                <th className="text-left py-2 text-gray-300">
                                  VLAN
                                </th>
                                <th className="text-left py-2 text-gray-300">
                                  Interface
                                </th>
                                <th className="text-left py-2 text-gray-300">
                                  Lease Time
                                </th>
                                <th className="text-left py-2 text-gray-300">
                                  Type
                                </th>
                                <th className="text-left py-2 text-gray-300">
                                  Created
                                </th>
                                <th className="text-left py-2 text-gray-300">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {config.bindingTable.map((binding, idx) => (
                                <tr
                                  key={idx}
                                  className="border-b border-gray-700"
                                >
                                  <td className="py-2 text-white font-mono">
                                    {binding.macAddress}
                                  </td>
                                  <td className="py-2 text-white">
                                    {binding.ipAddress}
                                  </td>
                                  <td className="py-2 text-white">
                                    {binding.vlan}
                                  </td>
                                  <td className="py-2 text-white">
                                    {binding.interface}
                                  </td>
                                  <td className="py-2 text-white">
                                    {binding.leaseTime}s
                                  </td>
                                  <td className="py-2">
                                    <span
                                      className={`px-2 py-1 rounded text-xs ${
                                        binding.bindingType === "static"
                                          ? "bg-blue-900 text-blue-300"
                                          : "bg-gray-900 text-gray-300"
                                      }`}
                                    >
                                      {binding.bindingType.toUpperCase()}
                                    </span>
                                  </td>
                                  <td className="py-2 text-gray-400">
                                    {formatTimeAgo(binding.createdAt)}
                                  </td>
                                  <td className="py-2">
                                    <div className="flex space-x-1">
                                      <button className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">
                                        Delete
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">🛡️</div>
                  <div className="text-lg font-medium text-white mb-2">
                    No DHCP Snooping Configuration
                  </div>
                  <div className="text-gray-400">
                    DHCP Snooping is not configured
                  </div>
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Enable DHCP Snooping
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default L2ServicesConfig;
