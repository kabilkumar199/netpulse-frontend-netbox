/**
 * NetBox Configuration
 * Reads from environment variables with fallback defaults
 * 
 * To configure, create a .env file in the root directory with:
 * VITE_NETBOX_BASE_URL=http://your-netbox-url:port
 * VITE_NETBOX_TOKEN=your_netbox_token_here
 */
export const NETBOX_CONFIG = {
  BASE_URL: import.meta.env.VITE_NETBOX_BASE_URL || "http://172.27.1.69:8000",
  TOKEN: import.meta.env.VITE_NETBOX_TOKEN || "f860879ea8dc32e1e80ce72357fe84f40c1b8f18",
} as const;

