import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import type { Device } from "../../types";
import { ArrowLeft } from "lucide-react";
import api from "../../helpers/api/apiHelper";
import { API_ENDPOINTS } from "../../helpers/url_helper";
import {
  OverviewTab,
  InterfaceTab,
  PeripheralsTab,
  VPLSTab,
  LLDPTab,
} from "./DeviceDetails/index";

interface LocationState {
  deviceData?: Device;
}

const DeviceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Get device from navigation state (highest priority)
  const navigationDevice = (location.state as LocationState)?.deviceData;

  // Local state for device and loading
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fallbackDevice, setFallbackDevice] = useState<Device | null>(null);

  useEffect(() => {
    // If device is in navigation state, use it and don't fetch
    if (navigationDevice) {
      setDevice(navigationDevice);
      return;
    }

    // If no device in navigation state and we have an ID, fetch from API
    if (id && !navigationDevice) {
      const fetchDevice = async () => {
        setLoading(true);
        try {
          const deviceResult = await api.get<Device>(
            `${API_ENDPOINTS.GET_DEVICES_URL}/${id}`
          );
          setDevice(deviceResult);
        } catch (error) {
          console.error("Error fetching device:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchDevice();
    }
  }, [id, navigationDevice]);

  // Priority: navigation state > API device > mock data
  const currentDevice = navigationDevice || device || fallbackDevice;
  const [activeTab, setActiveTab] = useState<
    "overview" | "peripherals" | "interface" | "vpls" | "lldp"
  >("overview");

  // Handle device not found
  if (!loading && !currentDevice && id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white mb-2">
            Device Not Found
          </h2>
          <p className="text-gray-400 mb-4">
            Device with ID "{id}" could not be found.
          </p>
          <button
            onClick={() => navigate("/devices")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Devices
          </button>
        </div>
      </div>
    );
  }

  // Handle loading state
  if (loading || !currentDevice) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading device details...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "peripherals", label: "Peripherals", icon: "🧩" },
    { id: "interface", label: "Interface", icon: "🔌" },
    { id: "vpls", label: "VPLS", icon: "🛰️" },
    { id: "lldp", label: "LLDP", icon: "🧭" },
  ];

  const renderTabContent = () => {
    if (!currentDevice) return null;

    // Type assertion to ensure Device type compatibility
    const device = currentDevice as Device;

    switch (activeTab) {
      case "overview":
        return <OverviewTab device={device} />;
      case "peripherals":
        return <PeripheralsTab device={device} />;
      case "interface":
        return <InterfaceTab device={device} />;
      case "vpls":
        return <VPLSTab device={device} />;
      case "lldp":
        return <LLDPTab device={device} />;
      default:
        return <OverviewTab device={device} />;
    }
  };

  return (
    <>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/devices")}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              aria-label="Back to devices"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-lg bg-gray-600 flex items-center justify-center">
              <span className="text-2xl">
                {currentDevice?.vendor === "Cisco"
                  ? "🔷"
                  : currentDevice?.vendor === "Dell"
                  ? "💻"
                  : currentDevice?.vendor === "Fortinet"
                  ? "🛡️"
                  : "🖥️"}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {currentDevice?.hostname}
              </h2>
              <p className="text-sm text-gray-400">
                {currentDevice?.vendor} {currentDevice?.model} •{" "}
                {currentDevice?.location?.name || "Unknown Location"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4 border-b border-gray-700">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {/* <span>{tab.icon}</span> */}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6  overflow-y-auto">{renderTabContent()}</div>
    </>
  );
};

export default DeviceDetails;
