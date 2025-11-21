// Route configuration for better maintainability
import React from "react";
import {
  LayoutDashboard,
  Search,
  Network,
  Server,
  Settings,
  Activity,
  Wrench,
  Building2,
  Building,
  Map,
  MapPin,
  Factory,
  Package,
  UserCheck,
  Play,
  History,
  TrendingUp,
  BarChart3,
  Wifi,
  Layers,
  Cloud,
  FileText,
  Monitor,
  Share2,
  CheckCircle,
  Route,
  Key,
  Tag,
  Clock,
  Shield,
  Users,
  Bell,
  Database,
  HardDrive,
  Link,
} from "lucide-react";

// Icon map for navigation items
export const ICON_MAP: {
  [key: string]: React.ComponentType<{ className?: string }>;
} = {
  dashboard: LayoutDashboard,
  search: Search,
  play: Play,
  history: History,
  network: Network,
  server: Server,
  share: Share2,
  map: Map,
  chart: BarChart3,
  "check-circle": CheckCircle,
  "file-text": FileText,
  settings: Settings,
  key: Key,
  tag: Tag,
  clock: Clock,
  activity: Activity,
  "trending-up": TrendingUp,
  "bar-chart": BarChart3,
  wifi: Wifi,
  layers: Layers,
  cloud: Cloud,
  database: Database,
  harddrive: HardDrive,
  wrench: Wrench,
  bell: Bell,
  users: Users,
  shield: Shield,
  "map-pin": MapPin,
  "building-2": Building2,
  building: Building,
  factory: Factory,
  "server-rack": Server,
  "user-check": UserCheck,
  link: Link,
  route: Route,
} as const;

export const ROUTES = {
  // Auth
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  // Main routes
  DASHBOARD: "/dashboard",
  DEVICES: "/devices",
  DISCOVERY: "/discovery",
  TOPOLOGY: "/topology",

  // Organization routes
  ORGANIZATION: {
    BASE: "/organization",
    REGIONS: "/organization/regions",
    SITES: "/organization/sites",
    LOCATIONS: "/organization/locations",
    MANUFACTURERS: "/organization/manufacturers",
    RACKS: "/organization/racks",
    DEVICE_ROLES: "/organization/device-roles",
    DEVICE_TYPES: "/organization/device-types",
  },
  EVENTS: {

    EVENT: "/EventPage"
  },

  // Monitoring routes
  MONITORING: {
    BASE: "/monitoring",
    PERFORMANCE: "/monitoring/performance",
    TRAFFIC: "/monitoring/traffic",
    WIRELESS: "/monitoring/wireless",
    APPLICATIONS: "/monitoring/applications",
    CLOUD: "/monitoring/cloud",
    LOGS: "/monitoring/logs",
    GRAFANA: "/monitoring/grafana",
  },

  // Management routes
  MANAGEMENT: {
    BASE: "/management",
    CONFIGURATION: "/management/configuration",
    BACKUPS: "/management/backups",
    FIRMWARE: "/management/firmware",
    ALERTS: "/management/alerts",
  },

  // Settings routes
  SETTINGS: {
    BASE: "/settings",
    CREDENTIALS: "/settings/credentials",
    GRAFANA: "/settings/grafana",
    USERS: "/settings/users",
    ROLES: "/settings/roles",
    L2_SERVICES: "/settings/l2-services",
    THEME: "/settings/theme",
    PROFILE: "/profile",
  },

  // Direct component routes
  COMPONENTS: {
    DEVICE_DETAILS: "/device/:id",
    DISCOVERY_WIZARD: "/discovery/wizard",
    NETBOX_IMPORTER: "/discovery/netbox",
    TOPOLOGY_VIEW: "/topology/view",
  },
} as const;

// Navigation items for sidebar
export const NAVIGATION_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: ROUTES.DASHBOARD,
    icon: "dashboard",
  },
  {
    id: "organization",
    label: "Organization",
    path: ROUTES.ORGANIZATION.BASE,
    icon: "building-2",
    children: [
      {
        id: "regions",
        icon: "map",
        label: "Regions",
        path: ROUTES.ORGANIZATION.REGIONS,
      },
      {
        id: "sites",
        icon: "building-2",
        label: "Sites",
        path: ROUTES.ORGANIZATION.SITES,
      },
      {
        id: "locations",
        icon: "map-pin",
        label: "Locations",
        path: ROUTES.ORGANIZATION.LOCATIONS,
      },
      {
        id: "manufacturers",
        label: "Manufacturers",
        icon: "factory",

        path: ROUTES.ORGANIZATION.MANUFACTURERS,
      },
      {
        id: "racks",
        label: "Racks",
        icon: "server-rack",
        path: ROUTES.ORGANIZATION.RACKS,
      },
      {
        id: "device-roles",
        label: "Device Roles",
        icon: "user-check",
        path: ROUTES.ORGANIZATION.DEVICE_ROLES,
      },
      {
        id: "device-types",
        label: "Device Types",
        icon: "package",
        path: ROUTES.ORGANIZATION.DEVICE_TYPES,
      },
    ],
  },
  {
    id: "discovery",
    label: "Discovery",
    path: ROUTES.DISCOVERY,
    icon: "search",
    children: [
      {
        id: "new-scan",
        label: "New Scan",
        icon: "play",
        path: ROUTES.DISCOVERY,
      },
      {
        id: "scan-history",
        label: "Scan History",
        icon: "history",
        path: ROUTES.DISCOVERY,
      },
    ],
  },
  {
    id: "inventory",
    label: "Inventory",
    path: ROUTES.DEVICES,
    icon: "server",
  },
  {
    id: "topology",
    label: "Topology",
    path: ROUTES.TOPOLOGY,
    icon: "network",
  },

  {
    id: "monitoring",
    label: "Monitoring",
    path: ROUTES.MONITORING.BASE,
    icon: "activity",
    children: [
      {
        id: "performance",
        icon: "trending-up",
        label: "Performance",
        path: ROUTES.MONITORING.PERFORMANCE,
      },
      {
        id: "traffic",
        label: "Traffic Analysis",
        icon: "bar-chart",
        path: ROUTES.MONITORING.TRAFFIC,
      },
      {
        id: "wireless",
        label: "Wireless",
        icon: "wifi",
        path: ROUTES.MONITORING.WIRELESS,
      },
      {
        id: "applications",
        icon: "layers",
        label: "Applications",
        path: ROUTES.MONITORING.APPLICATIONS,
      },
      {
        id: "cloud",
        label: "Cloud Resources",
        icon: "cloud",
        path: ROUTES.MONITORING.CLOUD,
      },
      {
        id: "logs",
        label: "Log Management",
        icon: "file-text",
        path: ROUTES.MONITORING.LOGS,
      },
      {
        id: "alerts",
        label: "Alerts",
        icon: "bell",
        path: ROUTES.MANAGEMENT.ALERTS,
      },
      {
        id: "events",
        label: "Events",
        icon: "calendar", 
        path: ROUTES.EVENTS.EVENT,
      },

      {
        id: "grafana",
        label: "Grafana",
        displayInMenu: true,
        path: ROUTES.MONITORING.GRAFANA,
      },
    ],
  },
  {
    id: "management",
    label: "Management",
    path: ROUTES.MANAGEMENT.BASE,
    icon: "wrench",
    children: [
      {
        id: "configuration",
        label: "Configuration",
        icon: "settings",

        path: ROUTES.MANAGEMENT.CONFIGURATION,
      },
      {
        id: "backups",
        label: "Backups",
        icon: "database",
        path: ROUTES.MANAGEMENT.BACKUPS,
      },
      {
        id: "firmware",
        label: "Firmware",
        icon: "harddrive",
        path: ROUTES.MANAGEMENT.FIRMWARE,
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    path: ROUTES.SETTINGS.BASE,
    icon: "settings",
    children: [
      {
        id: "nav-user-management",
        label: "User Management",
        icon: "users",
        path: "/settings/users",
        children: [
          {
            id: "users",
            label: "Users",
            icon: "users",
            path: ROUTES.SETTINGS.USERS,
          },
          {
            id: "roles",
            label: "Roles",
            icon: "shield",
            path: ROUTES.SETTINGS.ROLES,
          },
        ],
      },
      {
        id: "profile",
        label: "Profile",
        icon: "profile",
        path: ROUTES.SETTINGS.PROFILE,
      },
      {
        id: "credentials",
        label: "Credentials",
        icon: "key",
        path: ROUTES.SETTINGS.CREDENTIALS,
      },
      {
        id: "theme",
        label: "Theme",
        path: ROUTES.SETTINGS.THEME,
        displayInMenu: false,
      },
    ],
  },
] as const;
