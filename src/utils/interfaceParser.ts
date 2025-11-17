import type {
  InterfaceIp,
  ParsedInterface,
  GroupedInterfaces,
} from "../types/interface";

export function parseInterfaceName(
  interfaceName: string
): Omit<ParsedInterface, "original"> {
  // Parse x-eth0/0/0 format
  const ethMatch = interfaceName.match(
    /^x-eth(\d+)\/(\d+)\/(\d+)(?:\.(\d+))?$/
  );
  if (ethMatch) {
    return {
      slot: parseInt(ethMatch[1], 10),
      port: parseInt(ethMatch[2], 10),
      subport: parseInt(ethMatch[3], 10),
      subinterface: ethMatch[4] ? parseInt(ethMatch[4], 10) : undefined,
      type: "eth",
      displayName: interfaceName.replace("x-eth", ""),
    };
  }

  // Parse mgmt0/0/0 format
  const mgmtMatch = interfaceName.match(/^mgmt(\d+)\/(\d+)\/(\d+)$/);
  if (mgmtMatch) {
    return {
      slot: parseInt(mgmtMatch[1], 10),
      port: parseInt(mgmtMatch[2], 10),
      subport: parseInt(mgmtMatch[3], 10),
      type: "mgmt",
      displayName: interfaceName,
    };
  }

  // Parse loopback interfaces
  const loopbackMatch = interfaceName.match(/^loopback(\d+)$/);
  if (loopbackMatch) {
    return {
      type: "loopback",
      displayName: interfaceName,
    };
  }

  // Default for other types
  return {
    type: "other",
    displayName: interfaceName,
  };
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "up":
      return "bg-green-500";
    case "down":
      return "bg-gray-800";
    case "admin-down":
      return "bg-yellow-600";
    default:
      return "bg-gray-700";
  }
}

export function getStatusBorderColor(status: string): string {
  switch (status) {
    case "up":
      return "border-green-400";
    case "down":
      return "border-gray-600";
    case "admin-down":
      return "border-yellow-500";
    default:
      return "border-gray-600";
  }
}

export function organizeInterfaces(
  interfaces: InterfaceIp[]
): GroupedInterfaces {
  const grouped: GroupedInterfaces = {
    "0/0": [],
    "0/1": [],
    mgmt: [],
    loopback: [],
    other: [],
  };

  interfaces.forEach((iface) => {
    const parsed = parseInterfaceName(iface.interface);
    const fullParsed: ParsedInterface = { ...parsed, original: iface };

    if (
      parsed.type === "eth" &&
      parsed.slot !== undefined &&
      parsed.port !== undefined
    ) {
      const key = `${parsed.slot}/${parsed.port}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(fullParsed);
    } else if (parsed.type === "mgmt") {
      grouped.mgmt.push(fullParsed);
    } else if (parsed.type === "loopback") {
      grouped.loopback.push(fullParsed);
    } else {
      grouped.other.push(fullParsed);
    }
  });

  // Sort each group by subport
  Object.keys(grouped).forEach((key) => {
    grouped[key].sort((a, b) => {
      if (a.subport !== undefined && b.subport !== undefined) {
        return a.subport - b.subport;
      }
      return 0;
    });
  });

  return grouped;
}

export function getMaxSubport(group: ParsedInterface[]): number {
  return Math.max(...group.map((iface) => iface.subport ?? 0), 0);
}
