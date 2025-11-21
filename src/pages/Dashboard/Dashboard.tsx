// src/pages/Dashboard.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  AlertTriangle,
  Clock,
  Monitor,
  CheckCircle,
  Building2,
  Link2,
  XCircle,
  HelpCircle,
  Cpu,
} from "lucide-react";
import { toast } from "react-toastify";
import StatsCard from "../../components/charts/StatsCard";
import DonutStatsCard from "./DonutStatsCard";
import LatestAlerts from "./LatestAlerts";
import QuickActions from "../../components/shared/QuickActions";
import { getDashboardStats, getDashboardDevices } from "../../services/netboxDashboardService";
import type { NetBoxDevice } from "../../types/netbox";

interface Alert {
  id: string;
  severity: "critical" | "warning" | "info";
  description: string;
  timestamp: string;
  deviceId: string;
  link: string;
}

// Dynamic color palette for platforms
const platformColorPalette = [
  "#3b82f6", // Blue
  "#10b981", // Green
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Purple
  "#06b6d4", // Cyan
  "#ec4899", // Pink
  "#84cc16", // Lime
  "#f97316", // Orange
  "#6366f1", // Indigo
  "#14b8a6", // Teal
  "#a855f7", // Violet
  "#22d3ee", // Sky
  "#f43f5e", // Rose
  "#eab308", // Yellow (replaced Slate gray)
];

// Function to generate consistent color for a platform name
const getPlatformColor = (platformName: string): string => {
  // Normalize platform name (lowercase, trim)
  const normalized = platformName.toLowerCase().trim();

  // Special cases for known platforms
  const specialColors: { [key: string]: string } = {
    unknown: "#8b5cf6", // Purple for Unknown
    other: "#a855f7", // Violet for Other
    exaware: "#3b82f6", // Blue for Exaware
    cisco: "#1ba1e2", // Cisco blue
    juniper: "#84a4c1", // Juniper blue
    arista: "#e31937", // Arista red
    hp: "#0096d6", // HP blue
    "hp-enterprise": "#0096d6",
    dell: "#007db8", // Dell blue
    "dell-emc": "#007db8",
    fortinet: "#ee3124", // Fortinet red
    paloalto: "#ef4444", // Palo Alto red
    checkpoint: "#0084d1", // Check Point blue
    mikrotik: "#2c3e50", // MikroTik dark blue
    ubiquiti: "#055da8", // Ubiquiti blue
    netgear: "#6d9e3f", // Netgear green
    "tp-link": "#0066cc", // TP-Link blue
  };

  // Return special color if exists
  if (specialColors[normalized]) {
    return specialColors[normalized];
  }

  // Generate hash from platform name for consistent color assignment
  let hash = 0;
  for (let i = 0; i < platformName.length; i++) {
    hash = platformName.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Use hash to select color from palette
  const colorIndex = Math.abs(hash) % platformColorPalette.length;
  return platformColorPalette[colorIndex];
};

const Dashboard: React.FC = () => {
  const [devices, setDevices] = useState<NetBoxDevice[]>([]);
  const [stats, setStats] = useState<{
    totalDevices: number;
    onlineDevices: number;
    totalSites: number;
    activeSites: number;
    totalLinks: number;
    connectedLinks: number;
    deviceStatusData: { up: number; down: number; warning: number; unknown: number };
    osDistributionData: { [key: string]: number };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [dashboardStats, dashboardDevices] = await Promise.all([
          getDashboardStats(),
          getDashboardDevices(),
      ]);

        setStats({
          totalDevices: dashboardStats.totalDevices,
          onlineDevices: dashboardStats.onlineDevices,
          totalSites: dashboardStats.totalSites,
          activeSites: dashboardStats.activeSites,
          totalLinks: dashboardStats.totalLinks,
          connectedLinks: dashboardStats.connectedLinks,
          deviceStatusData: dashboardStats.deviceStatusData,
          osDistributionData: dashboardStats.osDistributionData,
        });
        setDevices(dashboardDevices);
        // For now, set empty alerts - can be extended later with NetBox alerts/events
        setAlerts([]);
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err?.message || "Failed to load dashboard data");
        toast.error(err?.message || "Failed to load dashboard data");
      } finally {
      setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalDevices = stats?.totalDevices || 0;
  const deviceStatusData = stats?.deviceStatusData || { up: 0, down: 0, warning: 0, unknown: 0 };
  const osDistributionData = stats?.osDistributionData || {};
  const criticalAlerts = 0; // Can be extended with NetBox events/alerts later

  const deviceStatusColors = {
    up: "#22c55e",
    down: "#ef4444",
    warning: "#f97316",
    unknown: "#8b5cf6", // Purple instead of gray
  };
  const deviceStatusIcons = {
    up: CheckCircle,
    down: XCircle,
    warning: AlertTriangle,
    unknown: HelpCircle,
  };

  // Generate colors object dynamically from osDistributionData
  const osDistributionColors = useMemo(() => {
    const colors: { [key: string]: string } = {};
    Object.keys(osDistributionData).forEach((platform) => {
      colors[platform] = getPlatformColor(platform);
    });
    return colors;
  }, [osDistributionData]);

  const osDistributionIcons = {
    exaware: Cpu,
    Unknown: HelpCircle,
    Other: HelpCircle,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Overview of your network infrastructure
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Devices"
          value={totalDevices}
          icon={Monitor}
          color="blue"
          subtitle="Across all sites"
          isLoading={isLoading}
          error={error}
        />
        <StatsCard
          title="Online Devices"
          value={deviceStatusData.up ?? 0}
          icon={CheckCircle}
          color="green"
          subtitle={
            totalDevices > 0
              ? `${((deviceStatusData.up / totalDevices) * 100).toFixed(
                  0
                )}% uptime`
              : "0% uptime"
          }
          isLoading={isLoading}
          error={error}
        />
        <StatsCard
          title="Sites"
          value={stats?.totalSites || 0}
          icon={Building2}
          color="purple"
          subtitle={`${stats?.activeSites || 0} active locations`}
          isLoading={isLoading}
          error={error}
        />
        <StatsCard
          title="Network Links"
          value={stats?.totalLinks || 0}
          icon={Link2}
          color="indigo"
          subtitle={`${stats?.connectedLinks || 0} connected`}
          isLoading={isLoading}
          error={error}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <DonutStatsCard
          title="Device Status Overview"
          data={deviceStatusData}
          colors={deviceStatusColors}
          icons={deviceStatusIcons}
          isLoading={isLoading}
          error={error}
        />
        <DonutStatsCard
          title="Platform Distribution"
          data={osDistributionData}
          colors={osDistributionColors}
          icons={osDistributionIcons}
          isLoading={isLoading}
          error={error}
        />
        <LatestAlerts
          alerts={alerts}
          isLoading={isLoading}
          error={null}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Critical Alerts"
          value={criticalAlerts}
          icon={AlertTriangle}
          color="red"
          subtitle="Require immediate attention"
          isLoading={isLoading}
          error={null}
        />
        <StatsCard
          title="Active Scans"
          value={0}
          icon={Search}
          color="yellow"
          subtitle="Discovery in progress"
        />

        <StatsCard
          title="Last Discovery"
          value="0"
          icon={Clock}
          color="blue"
          subtitle="Network scan completed"
        />
      </div>
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Recent Network Activity
        </h3>

        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
            <span className="text-2xl">🔍</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">
                Network discovery completed
              </p>
              <p className="text-xs text-gray-400">
                Found 5 new devices across 3 sites
              </p>
            </div>
            <span className="text-xs text-gray-400">2 hours ago</span>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
            <span className="text-2xl">🔗</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">
                LLDP link discovered
              </p>
              <p className="text-xs text-gray-400">
                New connection between SW-ACCESS-01 and CORE-ROUTER-01
              </p>
            </div>
            <span className="text-xs text-gray-400">4 hours ago</span>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">
                Device status changed
              </p>
              <p className="text-xs text-gray-400">
                SW-DIST-01 status changed to warning
              </p>
            </div>
            <span className="text-xs text-gray-400">6 hours ago</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <QuickActions />
      </div>
    </div>
  );
};

export default Dashboard;
