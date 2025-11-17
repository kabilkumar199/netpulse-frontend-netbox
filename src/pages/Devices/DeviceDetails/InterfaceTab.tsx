import React, { useState } from "react";
import type { Device } from "../../../types";
import {
  RefreshCw,
  Search,
  Filter,
  Network,
  Activity,
  Server,
  Globe,
  Settings,
  Wifi,
  Edit,
} from "lucide-react";

interface InterfaceTabProps {
  device: Device;
}

interface ManagementInterface {
  interfaceName: string;
  operationalState: "up" | "down" | "warning" | "unknown";
  macAddress: string;
  ipv4PrimaryAddress: string;
  ipv6Status: "enabled" | "disabled" | "unknown";
  ipv6Address?: string;
}

interface IPInterface {
  id: string;
  interfaceName: string;
  vrfName: string;
  interfaceIdentifier: string;
  administrativeStatus: "up" | "down" | "testing";
  operationalStatus: "up" | "down" | "testing" | "unknown";
  addressType: "IPv4" | "IPv6" | "Dual";
  ipAddresses: string[];
  subnetMask?: string;
  gateway?: string;
  mtu?: number;
  speed?: number;
  duplex?: string;
}

const InterfaceTab: React.FC<InterfaceTabProps> = ({ device }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [addressTypeFilter, setAddressTypeFilter] = useState<string>("all");
  const [activeSection, setActiveSection] = useState<"management" | "ip">("management");

  // Mock Management Interface data - Generate 2-5 items - Replace with actual API data
  const generateMockManagementInterfaces = (): ManagementInterface[] => {
    const interfaces: ManagementInterface[] = [
      {
        interfaceName: "Management0/0",
        operationalState: "up",
        macAddress: "aa:bb:cc:dd:ee:ff",
        ipv4PrimaryAddress: "192.168.1.10",
        ipv6Status: "enabled",
        ipv6Address: "2001:db8::10",
      },
      {
        interfaceName: "Management0/1",
        operationalState: "up",
        macAddress: "aa:bb:cc:dd:ee:00",
        ipv4PrimaryAddress: "192.168.1.11",
        ipv6Status: "enabled",
        ipv6Address: "2001:db8::11",
      },
      {
        interfaceName: "Management1/0",
        operationalState: "down",
        macAddress: "aa:bb:cc:dd:ee:01",
        ipv4PrimaryAddress: "192.168.1.12",
        ipv6Status: "disabled",
      },
    ];
    return interfaces;
  };

  const mockManagementInterfaces = generateMockManagementInterfaces();

  // Mock IP Interfaces data - Generate 30-50 items - Replace with actual API data
  const generateMockIPInterfaces = (): IPInterface[] => {
    const interfaces: IPInterface[] = [];
    const types = ["IPv4", "IPv6", "Dual"] as const;
    const statuses = ["up", "down", "testing"] as const;
    const vrfs = ["default", "management", "customer-vrf", "test-vrf"] as const;

    for (let i = 1; i <= 45; i++) {
      const addressType = types[i % 3];
      const operStatus = i % 10 === 0 ? "down" : i % 5 === 0 ? "testing" : "up";
      const adminStatus = i % 15 === 0 ? "down" : "up";

      interfaces.push({
        id: `ip-if-${i}`,
        interfaceName:
          i % 10 === 0
            ? `TenGigabitEthernet${Math.floor(i / 10)}/${i % 10 || 1}`
            : i % 5 === 0
            ? `Loopback${Math.floor(i / 5)}`
            : `GigabitEthernet${Math.floor(i / 10)}/${i % 10 || 1}`,
        vrfName: vrfs[i % vrfs.length],
        interfaceIdentifier:
          i % 10 === 0
            ? `Te${Math.floor(i / 10)}/${i % 10 || 1}`
            : i % 5 === 0
            ? `Lo${Math.floor(i / 5)}`
            : `Gi${Math.floor(i / 10)}/${i % 10 || 1}`,
        administrativeStatus: adminStatus as any,
        operationalStatus: operStatus as any,
        addressType: addressType as any,
        ipAddresses:
          addressType === "Dual"
            ? [`10.0.${i}.1`, `2001:db8::${i}`]
            : addressType === "IPv6"
            ? [`2001:db8::${i}`]
            : [`10.0.${i}.1`],
        subnetMask: "255.255.255.0",
        gateway: i % 5 !== 0 ? `10.0.${i}.254` : undefined,
        mtu: 1500,
        speed: i % 10 === 0 ? 10000000000 : 1000000000,
        duplex: "full",
      });
    }

    return interfaces;
  };

  const mockIPInterfaces = generateMockIPInterfaces();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "up":
      case "enabled":
        return "bg-green-900 text-green-300 border-green-700";
      case "down":
      case "disabled":
        return "bg-red-900 text-red-300 border-red-700";
      case "warning":
        return "bg-yellow-900 text-yellow-300 border-yellow-700";
      case "testing":
        return "bg-blue-900 text-blue-300 border-blue-700";
      case "unknown":
        return "bg-gray-700 text-gray-300 border-gray-600";
      default:
        return "bg-gray-700 text-gray-300 border-gray-600";
    }
  };

  const filteredIPInterfaces = mockIPInterfaces.filter((iface) => {
    const matchesSearch =
      iface.interfaceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      iface.vrfName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      iface.interfaceIdentifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      iface.ipAddresses.some((ip) =>
        ip.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "all" || iface.operationalStatus === statusFilter;

    const matchesAddressType =
      addressTypeFilter === "all" || iface.addressType === addressTypeFilter;

    return matchesSearch && matchesStatus && matchesAddressType;
  });

  const upCount = mockIPInterfaces.filter((i) => i.operationalStatus === "up").length;
  const downCount = mockIPInterfaces.filter((i) => i.operationalStatus === "down").length;
  const totalCount = mockIPInterfaces.length;

  const renderManagementInterface = () => (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
            <Settings className="w-4 h-4 text-blue-400" />
            Management Interfaces ({mockManagementInterfaces.length})
          </h4>
          <div className="flex gap-3 text-xs">
            <span className="text-green-400">
              Up: <span className="font-semibold">
                {mockManagementInterfaces.filter((i) => i.operationalState === "up").length}
              </span>
            </span>
            <span className="text-red-400">
              Down: <span className="font-semibold">
                {mockManagementInterfaces.filter((i) => i.operationalState === "down").length}
              </span>
            </span>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Management Interface Table List */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700 border-b border-gray-600">
              <tr>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Interface Name
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Operational State
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  MAC Address
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  IPv4 Primary Address
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  IPv6 Status
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  IPv6 Address
                </th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {mockManagementInterfaces.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-400 text-sm"
                  >
                    No management interfaces found.
                  </td>
                </tr>
              ) : (
                mockManagementInterfaces.map((iface, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="text-white font-medium text-sm">
                        {iface.interfaceName}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                          iface.operationalState
                        )}`}
                      >
                        {iface.operationalState.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="text-gray-300 text-sm font-mono">
                        {iface.macAddress}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="text-gray-300 text-sm font-mono">
                        {iface.ipv4PrimaryAddress}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                          iface.ipv6Status
                        )}`}
                      >
                        {iface.ipv6Status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="text-gray-300 text-sm font-mono">
                        {iface.ipv6Address || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-center">
                      <button
                        className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-blue-400 transition-colors"
                        title="Edit Management Interface"
                        onClick={() => {
                          // TODO: Implement edit functionality
                          console.log("Edit:", iface.interfaceName);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderIPInterfaces = () => (
    <div className="space-y-3">
      {/* Header with Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
            <Network className="w-4 h-4 text-blue-400" />
            IP Interfaces ({totalCount})
          </h4>
          <div className="flex gap-3 text-xs">
            <span className="text-green-400">
              Up: <span className="font-semibold">{upCount}</span>
            </span>
            <span className="text-red-400">
              Down: <span className="font-semibold">{downCount}</span>
            </span>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search interfaces..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 appearance-none"
            >
              <option value="all">All Status</option>
              <option value="up">Up</option>
              <option value="down">Down</option>
              <option value="testing">Testing</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
          <select
            value={addressTypeFilter}
            onChange={(e) => setAddressTypeFilter(e.target.value)}
            className="px-3 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Address Types</option>
            <option value="IPv4">IPv4</option>
            <option value="IPv6">IPv6</option>
            <option value="Dual">Dual Stack</option>
          </select>
        </div>
      </div>

      {/* IP Interface Table List */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700 border-b border-gray-600">
              <tr>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Interface Name
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  VRF Name
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Interface ID
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Admin Status
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Operational Status
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Address Type
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  IP Addresses
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Subnet Mask
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Gateway
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  MTU
                </th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredIPInterfaces.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-8 text-center text-gray-400 text-sm"
                  >
                    No IP interfaces found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredIPInterfaces.map((iface) => (
                  <tr
                    key={iface.id}
                    className="hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="text-white font-medium text-sm">
                        {iface.interfaceName}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="text-gray-300 text-sm">{iface.vrfName}</div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="text-gray-300 text-sm font-mono">
                        {iface.interfaceIdentifier}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                          iface.administrativeStatus
                        )}`}
                      >
                        {iface.administrativeStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                          iface.operationalStatus
                        )}`}
                      >
                        {iface.operationalStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          iface.addressType === "Dual"
                            ? "bg-purple-900 text-purple-300"
                            : iface.addressType === "IPv6"
                            ? "bg-blue-900 text-blue-300"
                            : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {iface.addressType}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {iface.ipAddresses.map((ip, idx) => (
                          <span
                            key={idx}
                            className="text-white font-mono text-xs bg-gray-700 px-1.5 py-0.5 rounded"
                          >
                            {ip}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="text-gray-300 text-xs font-mono">
                        {iface.subnetMask || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="text-gray-300 text-xs font-mono">
                        {iface.gateway || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="text-gray-300 text-sm">{iface.mtu || "N/A"}</div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-center">
                      <button
                        className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-blue-400 transition-colors"
                        title="Edit Interface"
                        onClick={() => {
                          // TODO: Implement edit functionality
                          console.log("Edit:", iface.id);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination - Optional for large datasets */}
      {filteredIPInterfaces.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-t border-gray-700 rounded-b-lg">
          <div className="text-sm text-gray-400">
            Showing <span className="font-semibold text-white">{filteredIPInterfaces.length}</span> of{" "}
            <span className="font-semibold text-white">{totalCount}</span> interfaces
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <button className="px-3 py-1.5 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Section Tabs */}
      <div className="border-b border-gray-700">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveSection("management")}
            className={`flex items-center space-x-1.5 px-3 py-2 border-b-2 font-medium text-sm transition-colors ${
              activeSection === "management"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Management Interface</span>
          </button>
          <button
            onClick={() => setActiveSection("ip")}
            className={`flex items-center space-x-1.5 px-3 py-2 border-b-2 font-medium text-sm transition-colors ${
              activeSection === "ip"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>IP Interfaces ({totalCount})</span>
          </button>
        </nav>
      </div>

      {/* Section Content */}
      <div className="pt-3">
        {activeSection === "management" ? renderManagementInterface() : renderIPInterfaces()}
      </div>
    </div>
  );
};

export default InterfaceTab;
