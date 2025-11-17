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
  PieChart as PieChartIcon,
} from "lucide-react";
import { api } from "../../helpers/api/apiHelper";
import StatsCard from "../../components/charts/StatsCard";
import DonutStatsCard from "./DonutStatsCard";
import LatestAlerts from "./LatestAlerts";
import QuickActions from "../../components/shared/QuickActions";
import { API_ENDPOINTS } from "../../helpers/url_helper";
import type { Device, DevicesApiResponse } from "../../types";

interface ApiAlert {
  ack: string;
  Severity: string;
  Description: string;
  Timestamp: string;
  deviceId: string;
}
interface Alert {
  id: string;
  severity: "critical" | "warning" | "info";
  description: string;
  timestamp: string;
  deviceId: string;
  link: string;
}
const Dashboard: React.FC = () => {
  const [deviceData, setDeviceData] = useState<{
    devices: Device[];
    error: string | null;
  }>({ devices: [], error: null });
  const [alertData, setAlertData] = useState<{
    alerts: Alert[];
    error: string | null;
  }>({ alerts: [], error: null });
  const [isLoading, setIsLoading] = useState(true);

  const processAlerts = (rawAlerts: ApiAlert[]): Alert[] => {
    return rawAlerts.slice(0, 10).map((alert, index) => {
      let severity: Alert["severity"] = "info";
      const apiSeverity = alert.Severity.toLowerCase();
      if (apiSeverity === "critical") severity = "critical";
      else if (apiSeverity === "major" || apiSeverity === "warning")
        severity = "warning";
      return {
        id: `${alert.deviceId}-${alert.Timestamp}-${index}`,
        severity: severity,
        description: alert.Description,
        timestamp: new Date(alert.Timestamp).toLocaleTimeString(),
        deviceId: alert.deviceId,
        link: `/devices/${alert.deviceId}/alarms`,
      };
    });
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setDeviceData({ devices: [], error: null });
      setAlertData({ alerts: [], error: null });

      const [deviceResult, alertResult] = await Promise.allSettled([
        api.get<DevicesApiResponse>(API_ENDPOINTS.GET_DEVICES_URL),
        api.get<ApiAlert[]>(API_ENDPOINTS.GET_ALERTS_URL),
      ]);

      if (
        deviceResult.status === "fulfilled" &&
        deviceResult.value &&
        Array.isArray(deviceResult.value.devices)
      ) {
        setDeviceData({ devices: deviceResult.value.devices, error: null });
      } else {
        setDeviceData({ devices: [], error: "Failed to load" });
      }

      if (
        alertResult.status === "fulfilled" &&
        alertResult.value &&
        Array.isArray(alertResult.value)
      ) {
        setAlertData({ alerts: processAlerts(alertResult.value), error: null });
      } else {
        setAlertData({ alerts: [], error: "Failed to load" });
      }

      setIsLoading(false);
    };
    fetchDashboardData();
  }, []);

  const devices = deviceData.devices;
  const alerts = alertData.alerts;
  const totalDevices = devices.length;

  const deviceStatusData = useMemo(() => {
    const counts = { up: 0, down: 0, warning: 0, unknown: 0 };
    devices.forEach((device) => {
      const status = (device.status || "unknown").toLowerCase();
      if (status === "reachable") counts.up += 1;
      else if (status === "unreachable") counts.down += 1;
      else counts.unknown += 1;
    });
    return counts;
  }, [devices]);

  const osDistributionData = useMemo(() => {
    const TOP_N = 3;
    const counts = devices.reduce((acc, device) => {
      const os = device.osVersion || "Unknown";
      acc[os] = (acc[os] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const sortedEntries = Object.entries(counts).sort(([, a], [, b]) => b - a);
    const finalData: { [key: string]: number } = {};
    let otherCount = 0;

    sortedEntries.forEach((entry, index) => {
      if (index < TOP_N) finalData[entry[0]] = entry[1];
      else otherCount += entry[1];
    });
    if (otherCount > 0) finalData["Other"] = otherCount;
    return finalData;
  }, [devices]);

  const criticalAlerts = useMemo(() => {
    return alerts.filter((a) => a.severity === "critical").length;
  }, [alerts]);

  const deviceStatusColors = {
    up: "#22c55e",
    down: "#ef4444",
    warning: "#f97316",
    unknown: "#6b7280",
  };
  const deviceStatusIcons = {
    up: CheckCircle,
    down: XCircle,
    warning: AlertTriangle,
    unknown: HelpCircle,
  };
  const osDistributionColors = {
    exaware: "#3b82f6",
    Unknown: "#6b7280",
    Other: "#a855f7",
  };
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
          error={deviceData.error}
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
          error={deviceData.error}
        />
        <StatsCard
          title="Sites"
          value={0}
          icon={Building2}
          color="purple"
          subtitle="Active locations"
        />
        <StatsCard
          title="Network Links"
          value={0}
          icon={Link2}
          color="indigo"
          subtitle="Discovered connections"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <DonutStatsCard
          title="Device Status Overview"
          data={deviceStatusData}
          colors={deviceStatusColors}
          icons={deviceStatusIcons}
          isLoading={isLoading}
          error={deviceData.error}
        />
        <DonutStatsCard
          title="OS Distribution"
          data={osDistributionData}
          colors={osDistributionColors}
          icons={osDistributionIcons}
          isLoading={isLoading}
          error={deviceData.error}
        />
        <LatestAlerts
          alerts={alerts}
          isLoading={isLoading}
          error={alertData.error}
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
          error={alertData.error}
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
