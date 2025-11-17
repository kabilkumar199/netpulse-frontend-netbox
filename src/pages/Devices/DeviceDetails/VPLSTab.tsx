import React, { useState } from "react";
import type { Device } from "../../../types";
import {
  Network,
  RefreshCw,
  Search,
  Filter,
  Activity,
  Settings,
  Edit,
  Database,
  Link,
} from "lucide-react";

interface VPLSTabProps {
  device: Device;
}

interface VPLSInstance {
  id: string;
  name: string;
  vpnId: string;
  routeDistinguisher: string;
  routeTarget: string[];
  status: "up" | "down" | "warning";
  vcId?: number;
  interfaces: string[];
  sites: string[];
  customer?: string;
  description?: string;
}

interface ACInterface {
  id: string;
  interfaceName: string;
  interfaceIdentifier: string;
  state: "up" | "down" | "admin-down";
  vplsInstance: string;
  splitHorizonGroup?: string;
  vlanId?: number;
  dhcpSnoopingTrusted: "v4" | "v6" | "v4,v6" | "N";
  dhcpSnReceive: "v4" | "v6" | "v4,v6" | "N";
  dhcpSnOptionInsert: "v4" | "v6" | "v4,v6" | "N";
}

interface Pseudowire {
  id: string;
  name: string;
  remotePeer: string;
  vcId: number;
  label: number;
  state: "up" | "down" | "admin-down";
  vplsInstance: string;
  mtu: number;
  encapsulation: "mpls" | "l2tpv3";
  pwType?: "static" | "ldp" | "bgp";
}

interface FIBACEntry {
  id: string;
  macAddress: string;
  vlanId: number;
  interfaceName: string;
  interfaceIdentifier: string;
  ingressVlanOp: string;
  egressVlanOp: string;
  flags: string[];
  vplsInstance: string;
  learnedType: "static" | "dynamic" | "local";
  age?: number;
}

interface FIBPWEntry {
  id: string;
  macAddress: string;
  vlanId: number;
  pseudowireId: string;
  pseudowireName: string;
  remotePeer: string;
  remoteVEId?: number;
  tunnelId?: number;
  pwState: "up" | "down" | "admin-down";
  vplsInstance: string;
  learnedType: "dynamic" | "static";
  age?: number;
}

interface DHCPSnoopingStats {
  id: string;
  vplsInstance: string;
  totalPackets: number;
  trustedPackets: number;
  untrustedPackets: number;
  blockedPackets: number;
  relayedPackets: number;
  v4Packets: number;
  v6Packets: number;
  spoofingAttempts: number;
  lastUpdated: Date;
}

interface DHCPBinding {
  id: string;
  macAddress: string;
  ipAddress: string;
  vlanId: number;
  interfaceName: string;
  vplsInstance: string;
  bindingType: "dynamic" | "static";
  leaseTime: number;
  remainingTime: number;
  serverAddress?: string;
  clientHostname?: string;
  createdAt: Date;
}

interface MACEntry {
  id: string;
  macAddress: string;
  vlanId: number;
  vplsInstance: string;
  sourceType: "AC" | "PW";
  sourceInterface: string;
  pseudowireId?: string;
  flags: string[];
  learnedType: "dynamic" | "static" | "local";
  age: number;
  lastSeen: Date;
}

const VPLSTab: React.FC<VPLSTabProps> = ({ device }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeSection, setActiveSection] = useState<"instances" | "ac" | "pw" | "fib" | "fibpw" | "dhcp" | "mac">("instances");

  // Mock VPLS Instances data - Replace with actual API data
  const generateMockVPLSInstances = (): VPLSInstance[] => {
    const instances: VPLSInstance[] = [];
    for (let i = 1; i <= 15; i++) {
      instances.push({
        id: `vpls-${i}`,
        name: `VPLS-Instance-${i}`,
        vpnId: `${100 + i}:1`,
        routeDistinguisher: `${100 + i}:1`,
        routeTarget: [`${100 + i}:1`, `${100 + i}:2`],
        status: i % 10 === 0 ? "down" : i % 5 === 0 ? "warning" : "up",
        vcId: 100 + i,
        interfaces: [`GigabitEthernet${i}/1`, `GigabitEthernet${i}/2`],
        sites: [`Site-${String.fromCharCode(64 + i)}`],
        customer: i % 3 === 0 ? `Customer-${Math.floor(i / 3)}` : undefined,
        description: `VPLS instance ${i} description`,
      });
    }
    return instances;
  };

  const mockVPLSInstances = generateMockVPLSInstances();

  // Mock AC Interfaces data - Replace with actual API data
  const generateMockACInterfaces = (): ACInterface[] => {
    const interfaces: ACInterface[] = [];
    for (let i = 1; i <= 40; i++) {
      interfaces.push({
        id: `ac-if-${i}`,
        interfaceName: `GigabitEthernet${Math.floor(i / 4) + 1}/${(i % 4) + 1}`,
        interfaceIdentifier: `Gi${Math.floor(i / 4) + 1}/${(i % 4) + 1}`,
        state: i % 10 === 0 ? "down" : i % 5 === 0 ? "admin-down" : "up",
        vplsInstance: `VPLS-Instance-${Math.floor(i / 4) + 1}`,
        splitHorizonGroup: i % 3 === 0 ? `SHG-${Math.floor(i / 3)}` : undefined,
        vlanId: 100 + (i % 50),
        dhcpSnoopingTrusted: i % 4 === 0 ? "v4" : i % 4 === 1 ? "v6" : i % 4 === 2 ? "v4,v6" : "N",
        dhcpSnReceive: i % 4 === 0 ? "v4" : i % 4 === 1 ? "v6" : i % 4 === 2 ? "v4,v6" : "N",
        dhcpSnOptionInsert: i % 4 === 0 ? "v4" : i % 4 === 1 ? "v6" : i % 4 === 2 ? "v4,v6" : "N",
      });
    }
    return interfaces;
  };

  const mockACInterfaces = generateMockACInterfaces();

  // Mock Pseudowires data - Replace with actual API data
  const generateMockPseudowires = (): Pseudowire[] => {
    const pws: Pseudowire[] = [];
    for (let i = 1; i <= 30; i++) {
      pws.push({
        id: `pw-${i}`,
        name: `PW-${i}`,
        remotePeer: `10.0.${i}.1`,
        vcId: 200 + i,
        label: 100000 + i,
        state: i % 10 === 0 ? "down" : i % 5 === 0 ? "admin-down" : "up",
        vplsInstance: `VPLS-Instance-${Math.floor(i / 3) + 1}`,
        mtu: 1500,
        encapsulation: i % 2 === 0 ? "mpls" : "l2tpv3",
        pwType: i % 3 === 0 ? "static" : i % 3 === 1 ? "ldp" : "bgp",
      });
    }
    return pws;
  };

  const mockPseudowires = generateMockPseudowires();

  // Mock FIB AC Entries data - Replace with actual API data
  const generateMockFIBACEntries = (): FIBACEntry[] => {
    const entries: FIBACEntry[] = [];
    const flagsOptions = ["L", "G", "H", "R", "D"];
    for (let i = 1; i <= 50; i++) {
      const numFlags = (i % 3) + 1;
      const selectedFlags = flagsOptions.slice(0, numFlags);
      entries.push({
        id: `fib-${i}`,
        macAddress: `aa:bb:cc:dd:ee:${String(i).padStart(2, "0")}`,
        vlanId: 100 + (i % 50),
        interfaceName: `GigabitEthernet${Math.floor(i / 5) + 1}/${(i % 5) + 1}`,
        interfaceIdentifier: `Gi${Math.floor(i / 5) + 1}/${(i % 5) + 1}`,
        ingressVlanOp: i % 3 === 0 ? "Add" : i % 3 === 1 ? "Remove" : "None",
        egressVlanOp: i % 3 === 0 ? "Remove" : i % 3 === 1 ? "Add" : "None",
        flags: selectedFlags,
        vplsInstance: `VPLS-Instance-${Math.floor(i / 5) + 1}`,
        learnedType: i % 4 === 0 ? "static" : i % 4 === 1 ? "dynamic" : "local",
        age: i % 10 === 0 ? undefined : Math.floor(Math.random() * 3600),
      });
    }
    return entries;
  };

  const mockFIBACEntries = generateMockFIBACEntries();

  // Mock FIB PW Entries data - Replace with actual API data
  const generateMockFIBPWEntries = (): FIBPWEntry[] => {
    const entries: FIBPWEntry[] = [];
    for (let i = 1; i <= 45; i++) {
      entries.push({
        id: `fibpw-${i}`,
        macAddress: `bb:cc:dd:ee:ff:${String(i).padStart(2, "0")}`,
        vlanId: 100 + (i % 50),
        pseudowireId: `pw-${Math.floor(i / 3) + 1}`,
        pseudowireName: `PW-${Math.floor(i / 3) + 1}`,
        remotePeer: `10.0.${Math.floor(i / 3) + 1}.1`,
        remoteVEId: i % 2 === 0 ? 100 + Math.floor(i / 3) : undefined,
        tunnelId: i % 3 === 0 ? 1000 + i : undefined,
        pwState: i % 10 === 0 ? "down" : i % 5 === 0 ? "admin-down" : "up",
        vplsInstance: `VPLS-Instance-${Math.floor(i / 5) + 1}`,
        learnedType: i % 4 === 0 ? "static" : "dynamic",
        age: i % 10 === 0 ? undefined : Math.floor(Math.random() * 3600),
      });
    }
    return entries;
  };

  const mockFIBPWEntries = generateMockFIBPWEntries();

  // Mock DHCP Snooping Stats data - Replace with actual API data
  const generateMockDHCPSnoopingStats = (): DHCPSnoopingStats[] => {
    const stats: DHCPSnoopingStats[] = [];
    for (let i = 1; i <= 15; i++) {
      const totalPackets = Math.floor(Math.random() * 10000) + 1000;
      const trustedPackets = Math.floor(totalPackets * 0.6);
      const untrustedPackets = Math.floor(totalPackets * 0.35);
      const blockedPackets = Math.floor(totalPackets * 0.05);
      stats.push({
        id: `dhcp-stats-${i}`,
        vplsInstance: `VPLS-Instance-${i}`,
        totalPackets,
        trustedPackets,
        untrustedPackets,
        blockedPackets,
        relayedPackets: Math.floor(totalPackets * 0.4),
        v4Packets: Math.floor(totalPackets * 0.8),
        v6Packets: Math.floor(totalPackets * 0.2),
        spoofingAttempts: Math.floor(Math.random() * 10),
        lastUpdated: new Date(),
      });
    }
    return stats;
  };

  const mockDHCPSnoopingStats = generateMockDHCPSnoopingStats();

  // Mock DHCP Bindings data - Replace with actual API data
  const generateMockDHCPBindings = (): DHCPBinding[] => {
    const bindings: DHCPBinding[] = [];
    for (let i = 1; i <= 50; i++) {
      bindings.push({
        id: `dhcp-binding-${i}`,
        macAddress: `cc:dd:ee:ff:aa:${String(i).padStart(2, "0")}`,
        ipAddress: `192.168.${Math.floor(i / 255) + 1}.${(i % 255) + 1}`,
        vlanId: 100 + (i % 50),
        interfaceName: `GigabitEthernet${Math.floor(i / 5) + 1}/${(i % 5) + 1}`,
        vplsInstance: `VPLS-Instance-${Math.floor(i / 5) + 1}`,
        bindingType: i % 4 === 0 ? "static" : "dynamic",
        leaseTime: i % 4 === 0 ? 0 : 86400,
        remainingTime: i % 4 === 0 ? 0 : Math.floor(Math.random() * 86400),
        serverAddress: `10.0.${Math.floor(i / 10) + 1}.1`,
        clientHostname: i % 3 === 0 ? `client-${i}` : undefined,
        createdAt: new Date(Date.now() - Math.random() * 86400000),
      });
    }
    return bindings;
  };

  const mockDHCPBindings = generateMockDHCPBindings();

  // Mock MAC Entries data - Replace with actual API data
  const generateMockMACEntries = (): MACEntry[] => {
    const entries: MACEntry[] = [];
    const flagsOptions = ["L", "G", "H", "R", "D", "P"];
    for (let i = 1; i <= 60; i++) {
      const sourceType: "AC" | "PW" = i % 2 === 0 ? "AC" : "PW";
      const numFlags = (i % 4) + 1;
      const selectedFlags = flagsOptions.slice(0, numFlags);
      entries.push({
        id: `mac-${i}`,
        macAddress: `dd:ee:ff:aa:bb:${String(i).padStart(2, "0")}`,
        vlanId: 100 + (i % 50),
        vplsInstance: `VPLS-Instance-${Math.floor(i / 5) + 1}`,
        sourceType,
        sourceInterface:
          sourceType === "AC"
            ? `GigabitEthernet${Math.floor(i / 5) + 1}/${(i % 5) + 1}`
            : `PW-${Math.floor(i / 3) + 1}`,
        pseudowireId: sourceType === "PW" ? `pw-${Math.floor(i / 3) + 1}` : undefined,
        flags: selectedFlags,
        learnedType: i % 5 === 0 ? "static" : i % 5 === 1 ? "local" : "dynamic",
        age: Math.floor(Math.random() * 3600),
        lastSeen: new Date(Date.now() - Math.random() * 3600000),
      });
    }
    return entries;
  };

  const mockMACEntries = generateMockMACEntries();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "up":
        return "bg-green-900 text-green-300 border-green-700";
      case "down":
        return "bg-red-900 text-red-300 border-red-700";
      case "admin-down":
      case "warning":
        return "bg-yellow-900 text-yellow-300 border-yellow-700";
      default:
        return "bg-gray-700 text-gray-300 border-gray-600";
    }
  };

  const getFlagColor = (flag: string) => {
    switch (flag) {
      case "L":
        return "bg-blue-900 text-blue-300";
      case "G":
        return "bg-green-900 text-green-300";
      case "H":
        return "bg-purple-900 text-purple-300";
      case "R":
        return "bg-red-900 text-red-300";
      case "D":
        return "bg-yellow-900 text-yellow-300";
      default:
        return "bg-gray-700 text-gray-300";
    }
  };

  const filteredVPLS = mockVPLSInstances.filter((vpls) => {
    const matchesSearch =
      vpls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vpls.vpnId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vpls.customer?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || vpls.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredACInterfaces = mockACInterfaces.filter((ac) => {
    const matchesSearch =
      ac.interfaceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ac.interfaceIdentifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ac.vplsInstance.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || ac.state === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredPseudowires = mockPseudowires.filter((pw) => {
    const matchesSearch =
      pw.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pw.remotePeer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pw.vplsInstance.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || pw.state === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredFIBAC = mockFIBACEntries.filter((fib) => {
    const matchesSearch =
      fib.macAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fib.interfaceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fib.vplsInstance.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const filteredFIBPW = mockFIBPWEntries.filter((fibpw) => {
    const matchesSearch =
      fibpw.macAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fibpw.pseudowireName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fibpw.remotePeer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fibpw.vplsInstance.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || fibpw.pwState === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredDHCPStats = mockDHCPSnoopingStats.filter((stat) => {
    return stat.vplsInstance.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredDHCPBindings = mockDHCPBindings.filter((binding) => {
    const matchesSearch =
      binding.macAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      binding.ipAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      binding.interfaceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      binding.vplsInstance.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const filteredMAC = mockMACEntries.filter((mac) => {
    const matchesSearch =
      mac.macAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mac.sourceInterface.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mac.vplsInstance.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const renderVPLSInstances = () => {
    const upCount = mockVPLSInstances.filter((v) => v.status === "up").length;
    const warningCount = mockVPLSInstances.filter((v) => v.status === "warning").length;
    const downCount = mockVPLSInstances.filter((v) => v.status === "down").length;

    return (
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
              <Network className="w-4 h-4 text-blue-400" />
              VPLS Instances ({mockVPLSInstances.length})
            </h4>
            <div className="flex gap-3 text-xs">
              <span className="text-green-400">
                Up: <span className="font-semibold">{upCount}</span>
              </span>
              <span className="text-yellow-400">
                Warning: <span className="font-semibold">{warningCount}</span>
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

        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700 border-b border-gray-600">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Instance Name
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    VPN ID
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Route Distinguisher
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    VC ID
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Route Targets
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Interfaces
                  </th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredVPLS.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-400 text-sm">
                      No VPLS instances found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredVPLS.map((vpls) => (
                    <tr key={vpls.id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-white font-medium text-sm">{vpls.name}</div>
                        {vpls.description && (
                          <div className="text-xs text-gray-400">{vpls.description}</div>
                        )}
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm font-mono">{vpls.vpnId}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm font-mono">
                          {vpls.routeDistinguisher}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm font-mono">
                          {vpls.vcId || "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                            vpls.status
                          )}`}
                        >
                          {vpls.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {vpls.routeTarget.map((rt, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-gray-700 text-white text-xs rounded font-mono"
                            >
                              {rt}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {vpls.interfaces.map((iface, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-gray-700 text-white text-xs rounded font-mono"
                            >
                              {iface}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap text-center">
                        <button
                          className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-blue-400 transition-colors"
                          title="Edit VPLS Instance"
                          onClick={() => {
                            console.log("Edit:", vpls.id);
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
  };

  const renderACInterfaces = () => {
    const upCount = mockACInterfaces.filter((ac) => ac.state === "up").length;
    const downCount = mockACInterfaces.filter((ac) => ac.state === "down").length;
    const adminDownCount = mockACInterfaces.filter((ac) => ac.state === "admin-down").length;

    return (
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
              <Link className="w-4 h-4 text-blue-400" />
              AC Interfaces ({mockACInterfaces.length})
            </h4>
            <div className="flex gap-3 text-xs">
              <span className="text-green-400">
                Up: <span className="font-semibold">{upCount}</span>
              </span>
              <span className="text-red-400">
                Down: <span className="font-semibold">{downCount}</span>
              </span>
              <span className="text-yellow-400">
                Admin-Down: <span className="font-semibold">{adminDownCount}</span>
              </span>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700 border-b border-gray-600">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Interface Name
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Interface ID
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    VPLS Instance
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    State
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    VLAN ID
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Split Horizon Group
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    DHCP Snooping
                  </th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredACInterfaces.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-400 text-sm">
                      No AC interfaces found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredACInterfaces.map((ac) => (
                    <tr key={ac.id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-white font-medium text-sm">{ac.interfaceName}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm font-mono">
                          {ac.interfaceIdentifier}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm">{ac.vplsInstance}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                            ac.state
                          )}`}
                        >
                          {ac.state.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm">{ac.vlanId || "N/A"}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm">
                          {ac.splitHorizonGroup || "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-gray-400">Trusted: {ac.dhcpSnoopingTrusted}</span>
                          <span className="text-xs text-gray-400">Receive: {ac.dhcpSnReceive}</span>
                          <span className="text-xs text-gray-400">Option: {ac.dhcpSnOptionInsert}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap text-center">
                        <button
                          className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-blue-400 transition-colors"
                          title="Edit AC Interface"
                          onClick={() => {
                            console.log("Edit:", ac.id);
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
  };

  const renderPseudowires = () => {
    const upCount = mockPseudowires.filter((pw) => pw.state === "up").length;
    const downCount = mockPseudowires.filter((pw) => pw.state === "down").length;
    const adminDownCount = mockPseudowires.filter((pw) => pw.state === "admin-down").length;

    return (
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
              <Network className="w-4 h-4 text-blue-400" />
              Pseudowires ({mockPseudowires.length})
            </h4>
            <div className="flex gap-3 text-xs">
              <span className="text-green-400">
                Up: <span className="font-semibold">{upCount}</span>
              </span>
              <span className="text-red-400">
                Down: <span className="font-semibold">{downCount}</span>
              </span>
              <span className="text-yellow-400">
                Admin-Down: <span className="font-semibold">{adminDownCount}</span>
              </span>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700 border-b border-gray-600">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    PW Name
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Remote Peer
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    VPLS Instance
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    VC ID
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Label
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    State
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Encapsulation
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    PW Type
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
                {filteredPseudowires.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-gray-400 text-sm">
                      No pseudowires found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredPseudowires.map((pw) => (
                    <tr key={pw.id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-white font-medium text-sm">{pw.name}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm font-mono">{pw.remotePeer}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm">{pw.vplsInstance}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm font-mono">{pw.vcId}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm font-mono">{pw.label}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                            pw.state
                          )}`}
                        >
                          {pw.state.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span className="px-2 py-1 rounded text-xs font-medium bg-gray-700 text-gray-300">
                          {pw.encapsulation.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm">
                          {pw.pwType ? pw.pwType.toUpperCase() : "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm">{pw.mtu}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap text-center">
                        <button
                          className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-blue-400 transition-colors"
                          title="Edit Pseudowire"
                          onClick={() => {
                            console.log("Edit:", pw.id);
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
  };

  const renderFIBAC = () => {
    const staticCount = mockFIBACEntries.filter((fib) => fib.learnedType === "static").length;
    const dynamicCount = mockFIBACEntries.filter((fib) => fib.learnedType === "dynamic").length;
    const localCount = mockFIBACEntries.filter((fib) => fib.learnedType === "local").length;

    return (
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" />
              FIB AC Entries ({mockFIBACEntries.length})
            </h4>
            <div className="flex gap-3 text-xs">
              <span className="text-blue-400">
                Static: <span className="font-semibold">{staticCount}</span>
              </span>
              <span className="text-green-400">
                Dynamic: <span className="font-semibold">{dynamicCount}</span>
              </span>
              <span className="text-purple-400">
                Local: <span className="font-semibold">{localCount}</span>
              </span>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700 border-b border-gray-600">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    MAC Address
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    VLAN ID
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Interface Name
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Interface ID
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    VPLS Instance
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Ingress VLAN Op
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Egress VLAN Op
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Flags
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Learned Type
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Age (sec)
                  </th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredFIBAC.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-8 text-center text-gray-400 text-sm">
                      No FIB AC entries found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredFIBAC.map((fib) => (
                    <tr key={fib.id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-white font-mono text-sm">{fib.macAddress}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm">{fib.vlanId}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm">{fib.interfaceName}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm font-mono">
                          {fib.interfaceIdentifier}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm">{fib.vplsInstance}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            fib.ingressVlanOp === "Add"
                              ? "bg-green-900 text-green-300"
                              : fib.ingressVlanOp === "Remove"
                              ? "bg-red-900 text-red-300"
                              : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {fib.ingressVlanOp}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            fib.egressVlanOp === "Add"
                              ? "bg-green-900 text-green-300"
                              : fib.egressVlanOp === "Remove"
                              ? "bg-red-900 text-red-300"
                              : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {fib.egressVlanOp}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {fib.flags.map((flag, idx) => (
                            <span
                              key={idx}
                              className={`px-1.5 py-0.5 rounded text-xs font-medium ${getFlagColor(
                                flag
                              )}`}
                            >
                              {flag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            fib.learnedType === "static"
                              ? "bg-blue-900 text-blue-300"
                              : fib.learnedType === "dynamic"
                              ? "bg-green-900 text-green-300"
                              : "bg-purple-900 text-purple-300"
                          }`}
                        >
                          {fib.learnedType.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm">{fib.age || "N/A"}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap text-center">
                        <button
                          className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-blue-400 transition-colors"
                          title="Edit FIB AC Entry"
                          onClick={() => {
                            console.log("Edit:", fib.id);
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
  };

    const renderFIBPW = () => {
    const staticCount = mockFIBPWEntries.filter((fibpw) => fibpw.learnedType === "static").length;
    const dynamicCount = mockFIBPWEntries.filter((fibpw) => fibpw.learnedType === "dynamic").length;
    const upCount = mockFIBPWEntries.filter((fibpw) => fibpw.pwState === "up").length;

    return (
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" />
              FIB PW Entries ({mockFIBPWEntries.length})
            </h4>
            <div className="flex gap-3 text-xs">
              <span className="text-blue-400">
                Static: <span className="font-semibold">{staticCount}</span>
              </span>
              <span className="text-green-400">
                Dynamic: <span className="font-semibold">{dynamicCount}</span>
              </span>
              <span className="text-green-400">
                PW Up: <span className="font-semibold">{upCount}</span>
              </span>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700 border-b border-gray-600">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    MAC Address
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    VLAN ID
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Pseudowire Name
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Remote Peer
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Remote VE-ID
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Tunnel ID
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    PW State
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    VPLS Instance
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Learned Type
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Age (sec)
                  </th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredFIBPW.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-8 text-center text-gray-400 text-sm">
                      No FIB PW entries found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredFIBPW.map((fibpw) => (
                    <tr key={fibpw.id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-white font-mono text-sm">{fibpw.macAddress}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm">{fibpw.vlanId}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm">{fibpw.pseudowireName}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm font-mono">{fibpw.remotePeer}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm">
                          {fibpw.remoteVEId || "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm">
                          {fibpw.tunnelId || "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                            fibpw.pwState
                          )}`}
                        >
                          {fibpw.pwState.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm">{fibpw.vplsInstance}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            fibpw.learnedType === "static"
                              ? "bg-blue-900 text-blue-300"
                              : "bg-green-900 text-green-300"
                          }`}
                        >
                          {fibpw.learnedType.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm">{fibpw.age || "N/A"}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap text-center">
                        <button
                          className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-blue-400 transition-colors"
                          title="Edit FIB PW Entry"
                          onClick={() => {
                            console.log("Edit:", fibpw.id);
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
  };

  const renderDHCP = () => {
    const totalPackets = mockDHCPSnoopingStats.reduce((sum, stat) => sum + stat.totalPackets, 0);
    const totalBlocked = mockDHCPSnoopingStats.reduce((sum, stat) => sum + stat.blockedPackets, 0);
    const totalSpoofing = mockDHCPSnoopingStats.reduce((sum, stat) => sum + stat.spoofingAttempts, 0);

    return (
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-400" />
              DHCP Snooping & Relay ({mockDHCPSnoopingStats.length} Instances)
            </h4>
            <div className="flex gap-3 text-xs">
              <span className="text-blue-400">
                Total Packets: <span className="font-semibold">{totalPackets.toLocaleString()}</span>
              </span>
              <span className="text-red-400">
                Blocked: <span className="font-semibold">{totalBlocked.toLocaleString()}</span>
              </span>
              <span className="text-yellow-400">
                Spoofing: <span className="font-semibold">{totalSpoofing}</span>
              </span>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        {/* DHCP Snooping Stats Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-700">
            <h5 className="font-semibold text-white text-sm">DHCP Snooping Statistics</h5>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700 border-b border-gray-600">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    VPLS Instance
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Total Packets
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Trusted
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Untrusted
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Blocked
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Relayed
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    IPv4
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    IPv6
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Spoofing Attempts
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredDHCPStats.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-400 text-sm">
                      No DHCP statistics found.
                    </td>
                  </tr>
                ) : (
                  filteredDHCPStats.map((stat) => (
                    <tr key={stat.id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-white font-medium text-sm">{stat.vplsInstance}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm font-semibold">
                          {stat.totalPackets.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-green-400 text-sm">
                          {stat.trustedPackets.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-yellow-400 text-sm">
                          {stat.untrustedPackets.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-red-400 text-sm font-semibold">
                          {stat.blockedPackets.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-blue-400 text-sm">
                          {stat.relayedPackets.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm">{stat.v4Packets.toLocaleString()}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm">{stat.v6Packets.toLocaleString()}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            stat.spoofingAttempts > 0
                              ? "bg-red-900 text-red-300"
                              : "bg-green-900 text-green-300"
                          }`}
                        >
                          {stat.spoofingAttempts}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* DHCP Bindings Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-700">
            <h5 className="font-semibold text-white text-sm">DHCP Bindings ({mockDHCPBindings.length})</h5>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700 border-b border-gray-600">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    MAC Address
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    VLAN ID
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Interface
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    VPLS Instance
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Binding Type
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Lease Time
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Remaining Time
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Server Address
                  </th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredDHCPBindings.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-gray-400 text-sm">
                      No DHCP bindings found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredDHCPBindings.map((binding) => (
                    <tr key={binding.id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-white font-mono text-sm">{binding.macAddress}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm font-mono">{binding.ipAddress}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm">{binding.vlanId}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm">{binding.interfaceName}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm">{binding.vplsInstance}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            binding.bindingType === "static"
                              ? "bg-blue-900 text-blue-300"
                              : "bg-green-900 text-green-300"
                          }`}
                        >
                          {binding.bindingType.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm">
                          {binding.leaseTime === 0 ? "Infinite" : `${binding.leaseTime}s`}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm">
                          {binding.remainingTime === 0
                            ? "N/A"
                            : `${Math.floor(binding.remainingTime / 3600)}h ${Math.floor((binding.remainingTime % 3600) / 60)}m`}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm font-mono">
                          {binding.serverAddress || "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap text-center">
                        <button
                          className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-blue-400 transition-colors"
                          title="Edit DHCP Binding"
                          onClick={() => {
                            console.log("Edit:", binding.id);
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
  };

  const renderMAC = () => {
    const staticCount = mockMACEntries.filter((mac) => mac.learnedType === "static").length;
    const dynamicCount = mockMACEntries.filter((mac) => mac.learnedType === "dynamic").length;
    const localCount = mockMACEntries.filter((mac) => mac.learnedType === "local").length;
    const acCount = mockMACEntries.filter((mac) => mac.sourceType === "AC").length;
    const pwCount = mockMACEntries.filter((mac) => mac.sourceType === "PW").length;

    return (
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" />
              MAC Address Learning ({mockMACEntries.length})
            </h4>
            <div className="flex gap-3 text-xs flex-wrap">
              <span className="text-blue-400">
                Static: <span className="font-semibold">{staticCount}</span>
              </span>
              <span className="text-green-400">
                Dynamic: <span className="font-semibold">{dynamicCount}</span>
              </span>
              <span className="text-purple-400">
                Local: <span className="font-semibold">{localCount}</span>
              </span>
              <span className="text-gray-400">
                AC: <span className="font-semibold">{acCount}</span>
              </span>
              <span className="text-gray-400">
                PW: <span className="font-semibold">{pwCount}</span>
              </span>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700 border-b border-gray-600">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    MAC Address
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    VLAN ID
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    VPLS Instance
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Source Type
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Source Interface
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Pseudowire ID
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Flags
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Learned Type
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Age (sec)
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Last Seen
                  </th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredMAC.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-8 text-center text-gray-400 text-sm">
                      No MAC entries found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredMAC.map((mac) => (
                    <tr key={mac.id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-white font-mono text-sm">{mac.macAddress}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm">{mac.vlanId}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm">{mac.vplsInstance}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            mac.sourceType === "AC"
                              ? "bg-blue-900 text-blue-300"
                              : "bg-purple-900 text-purple-300"
                          }`}
                        >
                          {mac.sourceType}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm">{mac.sourceInterface}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm">{mac.pseudowireId || "N/A"}</div>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {mac.flags.map((flag, idx) => (
                            <span
                              key={idx}
                              className={`px-1.5 py-0.5 rounded text-xs font-medium ${getFlagColor(
                                flag
                              )}`}
                            >
                              {flag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            mac.learnedType === "static"
                              ? "bg-blue-900 text-blue-300"
                              : mac.learnedType === "dynamic"
                              ? "bg-green-900 text-green-300"
                              : "bg-purple-900 text-purple-300"
                          }`}
                        >
                          {mac.learnedType.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-sm">{mac.age}s</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-gray-300 text-xs">
                          {new Date(mac.lastSeen).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap text-center">
                        <button
                          className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-blue-400 transition-colors"
                          title="Edit MAC Entry"
                          onClick={() => {
                            console.log("Edit:", mac.id);
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
  };
  return (
    <div className="space-y-3">
      {/* Section Tabs */}
      <div className="border-b border-gray-700 overflow-x-auto">
        <nav className="flex space-x-4 min-w-max">
          <button
            onClick={() => setActiveSection("instances")}
            className={`flex items-center space-x-1.5 px-3 py-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeSection === "instances"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>VPLS Instances</span>
          </button>
          <button
            onClick={() => setActiveSection("ac")}
            className={`flex items-center space-x-1.5 px-3 py-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeSection === "ac"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>AC Interfaces</span>
          </button>
          <button
            onClick={() => setActiveSection("pw")}
            className={`flex items-center space-x-1.5 px-3 py-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeSection === "pw"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Pseudowires</span>
          </button>
          <button
            onClick={() => setActiveSection("fib")}
            className={`flex items-center space-x-1.5 px-3 py-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeSection === "fib"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>FIB AC</span>
          </button>
          <button
            onClick={() => setActiveSection("fibpw")}
            className={`flex items-center space-x-1.5 px-3 py-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeSection === "fibpw"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>FIB PWs</span>
          </button>
          <button
            onClick={() => setActiveSection("dhcp")}
            className={`flex items-center space-x-1.5 px-3 py-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeSection === "dhcp"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>DHCP</span>
          </button>
          <button
            onClick={() => setActiveSection("mac")}
            className={`flex items-center space-x-1.5 px-3 py-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeSection === "mac"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>MAC</span>
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
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
              <option value="admin-down">Admin Down</option>
              <option value="warning">Warning</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section Content */}
      <div className="pt-3">
        {activeSection === "instances" && renderVPLSInstances()}
        {activeSection === "ac" && renderACInterfaces()}
        {activeSection === "pw" && renderPseudowires()}
        {activeSection === "fib" && renderFIBAC()}
        {activeSection === "fibpw" && renderFIBPW()}
        {activeSection === "dhcp" && renderDHCP()}
        {activeSection === "mac" && renderMAC()}
      </div>
    </div>
  );


};

export default VPLSTab;
