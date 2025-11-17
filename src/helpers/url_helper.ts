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
};
