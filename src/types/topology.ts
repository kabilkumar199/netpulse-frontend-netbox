export interface LldpPort {
  "CHASSIS ID": string;
  TX?: string;
  RX?: string;
  "SYSTEM NAME"?: string;
  "REMOTE PORT ID"?: string;
  "MANAGEMENT ADDRESS"?: string;
  "SYSTEM DESCRIPTION"?: string;
  TTL?: string;
  "REMOTE PORT DESCRIPTION"?: string;
}

export interface LldpNode {
  "known-device": boolean;
  "System Information"?: {
    "MAC Range": string;
    "Part Number": string;
    "ONIE Version": string;
    "Product Name": string;
    Vendor: string;
    MAC: string;
    "Diag Version": string;
    "Serial Number": string;
    "Label Revision": string;
    Manufacturer: string;
    "Manufacture Date": string;
    "Country Code": string;
    "Platform Name": string;
  };
  Ports?: {
    [portName: string]: LldpPort;
  };
  device: {
    connectionEstablishment: string;
    authStatus: string;
    status: string;
  };
}

export interface LldpEdge {
  source: string;
  target: string;
  sourceInterface?: string;
  targetInterface?: string;
  label?: string;
}

export interface LldpResponse {
  nodes: {
    [ipAddress: string]: LldpNode;
  };
  edges: {
    [key: string]: LldpEdge;
  };
}

export interface G6Node {
  id: string;
  label: string;
  type?: string;
  img?: string;
  size?: number | [number, number];
  style?: any;
  deviceInfo?: LldpNode;
}

export interface G6Edge {
  source: string;
  target: string;
  label?: string;
  style?: any;
  type?: string;
}

export interface G6GraphData {
  nodes: G6Node[];
  edges: G6Edge[];
}
