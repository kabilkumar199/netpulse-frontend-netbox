export interface InterfaceIp {
  vrfname: string;
  interface: string;
  status: 'up' | 'down' | 'admin-down';
  'address/type': string;
}

export interface InterfaceResponse {
  InterfaceIp: InterfaceIp[];
  Name: {
    PlatformName: string;
  };
}

export interface ParsedInterface {
  original: InterfaceIp;
  slot?: number;
  port?: number;
  subport?: number;
  subinterface?: number;
  type: 'eth' | 'mgmt' | 'loopback' | 'other';
  displayName: string;
}

export interface GroupedInterfaces {
  [key: string]: ParsedInterface[];
}

