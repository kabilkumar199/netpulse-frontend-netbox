export const API_ENDPOINTS = {
  // Authentication
  LOGIN: "/api/auth/signin",
  REFRESH_TOKEN: "/api/auth/refresh",
  SIGNOUT: "/api/auth/signout",

  // Peripherals
  transceiver: "/device/sfp/statistics",
  psu: "/device/psu/info",
  thermal: "/device/thermal/info",
  fan: "/device/fan/info",

  // Dashboard
  GET_NETBOX_DEVICES_URL: "/api/dcim/devices",
  GET_DEVICES_URL: "/device",
  GET_ALERTS_URL: "/device/alarm/notifications",
  GET_DEVICES_INFO_URL: "/device/system/info",
  GET_INTERFACES_LIST_URL: `/device/interface`,
  GET_EVENTS: "/events",
  GET_USERS: "/user",
  CREATE_USER: "/api/auth/signup",
  UPDATE_USER: "/user",
  DELETE_USER: "/user",
  
  // VPLS
  GET_VPLS_ALL_DATA: "/device/vpls/all",
  GET_DHCP_SNOOPING_RESTORE: "/device/vpls/dhcp-snooping/restore",
};

export const NETBOX_API_ENDPOINTS = {
  // Authentication
  LOGIN: "/api/auth/signin",
  REFRESH_TOKEN: "/api/auth/refresh",
  SIGNOUT: "/api/auth/signout",

  // Devices
  GET_DEVICES_URL: "/api/dcim/devices",
  CREATE_DEVICE_URL: "/api/dcim/devices/",
  DELETE_DEVICE_URL: "/api/dcim/devices", // Base URL, append /{id}/ for delete
};
