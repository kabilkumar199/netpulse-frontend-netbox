import React, { useState } from "react";
import type { Device } from "../../../types";
import {
  Network,
  RefreshCw,
  Search,
  Filter,
  Link as LinkIcon,
  Activity,
  Clock,
  Trash2,
  Server,
  Router,
} from "lucide-react";

interface LLDPTabProps {
  device: Device;
}

interface LLDPNeighbor {
  id: string;
  localInterface: string; // Port
  remoteChassisId: string; // Chassis ID
  txCount?: number; // TX counter
  rxCount?: number; // RX counter
  remoteSystemName?: string; // System Name
  remotePortId?: string; // Remote Port ID
  managementAddress?: string; // Management Address
  remoteSystemDescription?: string; // System Description
  ttl?: number; // TTL
  remotePortDescription?: string; // Remote Port Description
  status: "up" | "down" | "stale";
  lastUpdate?: Date;
  // Additional fields for reference
  remoteDevice?: string;
  remoteInterface?: string;
  remoteCapabilities?: string[];
}

const LLDPTab: React.FC<LLDPTabProps> = ({ device }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [interfaceFilter, setInterfaceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Mock LLDP data - Generate 30-50 items - Replace with actual API data
  const generateMockLLDP = (): LLDPNeighbor[] => {
    const neighbors: LLDPNeighbor[] = [];
    const capabilities = [
      ["Bridge"],
      ["Router"],
      ["Bridge", "Router"],
      ["Bridge", "WLAN"],
      ["Router", "WLAN"],
    ];
    const vendors = ["Cisco", "Dell", "Juniper", "HPE", "Arista"];
    const statuses: ("up" | "down" | "stale")[] = ["up", "up", "up", "stale", "down"];

    for (let i = 1; i <= 45; i++) {
      const vendor = vendors[i % vendors.length];
      const status = statuses[i % statuses.length];
      const isUp = status === "up";
      const isStale = status === "stale";

      neighbors.push({
        id: `lldp-${i}`,
        localInterface:
          i % 10 === 0
            ? `${Math.floor(i / 10)}/${(i % 10) || 1}`
            : `0/0/${(i % 24) + 1}`,
        remoteChassisId: `${String(i % 256).padStart(2, "0")}:${String((i * 3) % 256).padStart(2, "0")}:${String((i * 5) % 256).padStart(2, "0")}:${String((i * 7) % 256).padStart(2, "0")}:${String((i * 11) % 256).padStart(2, "0")}:${String((i * 13) % 256).padStart(2, "0")}`,
        txCount: 1000 + i * 50 + Math.floor(Math.random() * 500),
        rxCount: 950 + i * 45 + Math.floor(Math.random() * 450),
        remoteSystemName: `${vendor.toLowerCase()}-node-${i}`,
        remotePortId: `Ethernet${(i % 24) + 1}`,
        managementAddress: i % 3 === 0 ? `10.0.${Math.floor(i / 3)}.${(i % 255) + 1}` : undefined,
        remoteSystemDescription: `${vendor} ${i % 2 === 0 ? "IOS Software" : "NX-OS Software"}, Version ${12 + (i % 5)}.${i % 10}`,
        ttl: 120,
        remotePortDescription: i % 2 === 0 ? `Eth${(i % 24) + 1}/2` : `Port ${i}`,
        status,
        lastUpdate: isUp
          ? new Date(Date.now() - (i * 30) * 1000)
          : isStale
          ? new Date(Date.now() - (180 + i * 10) * 1000)
          : new Date(Date.now() - (3600 + i * 60) * 1000),
        // Additional fields for reference
        remoteDevice: `${vendor.toLowerCase()}-${String.fromCharCode(97 + (i % 26))}-${i}.example.com`,
        remoteInterface: `GigabitEthernet${i % 48}/0/${(i % 24) + 1}`,
        remoteCapabilities: capabilities[i % capabilities.length],
      });
    }

    return neighbors;
  };

  const mockLLDP = generateMockLLDP();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "up":
        return "bg-green-900 text-green-300 border-green-700";
      case "down":
        return "bg-red-900 text-red-300 border-red-700";
      case "stale":
        return "bg-yellow-900 text-yellow-300 border-yellow-700";
      default:
        return "bg-gray-700 text-gray-300 border-gray-600";
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const uniqueInterfaces = Array.from(new Set(mockLLDP.map((n) => n.localInterface)));

  const filteredLLDP = mockLLDP.filter((neighbor) => {
    const matchesSearch =
      neighbor.localInterface.toLowerCase().includes(searchTerm.toLowerCase()) ||
      neighbor.remoteChassisId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      neighbor.remoteSystemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      neighbor.remotePortId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      neighbor.managementAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      neighbor.remotePortDescription?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesInterface =
      interfaceFilter === "all" || neighbor.localInterface === interfaceFilter;

    const matchesStatus = statusFilter === "all" || neighbor.status === statusFilter;

    return matchesSearch && matchesInterface && matchesStatus;
  });

  const upCount = mockLLDP.filter((n) => n.status === "up").length;
  const staleCount = mockLLDP.filter((n) => n.status === "stale").length;
  const downCount = mockLLDP.filter((n) => n.status === "down").length;

  const handleClearLLDP = (interfaceName: string, neighborId: string) => {
    // TODO: Implement API call to clear LLDP for specific interface
    console.log(`Clear LLDP for interface: ${interfaceName}, neighbor: ${neighborId}`);
    // This would typically make an API call like:
    // await clearLLDPForInterface(device.id, interfaceName);
    // Then refresh the LLDP data
  };

  return (
    <div className="space-y-3">
      {/* Header with Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
            <Network className="w-4 h-4 text-blue-400" />
            LLDP Network Nodes ({mockLLDP.length})
          </h4>
          <div className="flex gap-3 text-xs">
            <span className="text-green-400">
              Up: <span className="font-semibold">{upCount}</span>
            </span>
            <span className="text-yellow-400">
              Stale: <span className="font-semibold">{staleCount}</span>
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
              placeholder="Search neighbors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <select
              value={interfaceFilter}
              onChange={(e) => setInterfaceFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 appearance-none"
            >
              <option value="all">All Interfaces</option>
              {uniqueInterfaces.map((iface) => (
                <option key={iface} value={iface}>
                  {iface}
                </option>
              ))}
            </select>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="up">Up</option>
            <option value="stale">Stale</option>
            <option value="down">Down</option>
          </select>
        </div>
      </div>

      {/* LLDP Neighbors Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700 border-b border-gray-600">
              <tr>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Port
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Chassis ID
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  TX / RX
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  System Name
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Remote Port ID
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Management Address
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  System Description
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  TTL
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Remote Port Description
                </th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Clear
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredLLDP.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-gray-400 text-sm">
                    No LLDP neighbors found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredLLDP.map((neighbor) => (
                  <tr key={neighbor.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4 text-blue-400" />
                        <div className="text-white font-medium text-sm font-mono">
                          {neighbor.localInterface}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="text-gray-300 text-sm font-mono">
                        {neighbor.remoteChassisId}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5 text-xs">
                        <div className="text-green-400">
                          TX: <span className="font-mono font-semibold">{neighbor.txCount?.toLocaleString() || "N/A"}</span>
                        </div>
                        <div className="text-blue-400">
                          RX: <span className="font-mono font-semibold">{neighbor.rxCount?.toLocaleString() || "N/A"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="text-gray-300 text-sm">
                        {neighbor.remoteSystemName || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="text-gray-300 text-sm font-mono">
                        {neighbor.remotePortId || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="text-gray-300 text-sm font-mono">
                        {neighbor.managementAddress || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="text-gray-300 text-xs max-w-xs truncate" title={neighbor.remoteSystemDescription || "N/A"}>
                        {neighbor.remoteSystemDescription || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="text-gray-300 text-sm">
                        {neighbor.ttl ? `${neighbor.ttl}s` : "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="text-gray-300 text-sm">
                        {neighbor.remotePortDescription || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-center">
                      <button
                        className="p-1.5 rounded hover:bg-red-700/20 text-gray-400 hover:text-red-400 transition-colors"
                        title="Clear LLDP entry for this interface"
                        onClick={() => handleClearLLDP(neighbor.localInterface, neighbor.id)}
                      >
                        <Trash2 className="w-4 h-4" />
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
};

export default LLDPTab;
