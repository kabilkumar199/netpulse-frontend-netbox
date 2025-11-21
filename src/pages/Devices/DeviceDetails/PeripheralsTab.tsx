import React, { useState, useEffect } from "react";
import type { Device } from "../../../types";
import { Cpu, Zap, Thermometer, Wind } from "lucide-react";
import { API_ENDPOINTS } from "../../../helpers/url_helper"; 
import { api } from "../../../services/api/api";
 
interface PeripheralsTabProps {
  device: Device;
}

interface Transceiver {
  id: string;
  slot: string;
  type: string;
  vendor: string;
  partNumber: string;
  serialNumber: string;
  wavelength?: string;
  distance?: string;
  status: "up" | "down" | "warning";
}

interface PSU {
  id: string;
  slot: string;
  model: string;
  vendor: string;
  power: string;
  voltage: string;
  status: "up" | "down" | "warning";
  temperature?: string;
}

interface Thermal {
  id: string;
  sensor: string;
  location: string;
  temperature: number;
  threshold: number;
  status: "normal" | "warning" | "critical";
  unit: "celsius" | "fahrenheit";
}

interface Fan {
  id: string;
  slot: string;
  name: string;
  speed: number;
  maxSpeed: number;
  status: "up" | "down" | "warning";
  direction?: "forward" | "reverse";
}

const mapSfpData = (data: any): Transceiver[] => {
  if (!data?.sfp?.sfp) return [];
  
  return data.sfp.sfp
    .filter((item: any) => item.Status)
    .map((item: any): Transceiver => {
      let status: "up" | "down" | "warning" = "warning";
      if (item.Status === "OK") status = "up";

      return {
        id: item.interface,
        slot: item.interface,
        type: item.Type || "N/A",
        vendor: item.Vendor || "N/A",
        partNumber: item.Model || "N/A",
        serialNumber: item["Serial-Number"] || "N/A",
        distance: item["Link-Length"] === "N/A" ? undefined : item["Link-Length"],
        status: status,
      };
    });
};

const mapPsuData = (data: any[]): PSU[] => {
  return data.map((item: any): PSU => {
    let status: "up" | "down" | "warning" = "warning";
    if (item.State === "Missing") status = "down";
    else if (item.Status === "Running") status = "up";
    
    return {
      id: item.Name,
      slot: item.Name,
      model: item.Model || "N/A",
      vendor: "N/A", 
      power: item.Pout ? `${item.Pout}W` : "N/A",
      voltage: item.Vin ? `${item.Vin}V AC` : "N/A",
      status: status,
    };
  });
};

const mapThermalData = (data: any[]): Thermal[] => {
  return data.map((item: any): Thermal => {
    const tempValue = parseFloat(item.Temperature) || 0;
        const defaultThreshold = 70; 
    
    let status: "normal" | "warning" | "critical" = "normal";
    if (item.Status !== "Functional") status = "warning";

    return {
      id: item.Name,
      sensor: item.Description,
      location: "N/A",
      temperature: tempValue,
      threshold: defaultThreshold, 
      status: status,
      unit: item.Temperature.includes("C") ? "celsius" : "fahrenheit",
    };
  });
};

const mapFanData = (data: any[]): Fan[] => {
  return data.map((item: any): Fan => {
    const defaultMaxSpeed = 12000; 
    return {
      id: item.Name,
      slot: item.Description,
      name: item.Name,
      speed: parseInt(item.RPM) || 0,
      maxSpeed: defaultMaxSpeed, 
      status: item.State === "Present" && item.Status === "Running" ? "up" : "down",
    };
  });
};

const PeripheralsTab: React.FC<PeripheralsTabProps> = ({ device }) => {
  console.log("CURRENT DEVICE PROP:", device);
  const [activeSubTab, setActiveSubTab] = useState<
    "transceiver" | "psu" | "thermal" | "fan"
  >("transceiver");

  const [transceivers, setTransceivers] = useState<Transceiver[]>([]);
  const [psus, setPsus] = useState<PSU[]>([]);
  const [thermal, setThermal] = useState<Thermal[]>([]);
  const [fans, setFans] = useState<Fan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const payload = { deviceId: device.deviceId };

      try {

        const transceiverData = await api.post(API_ENDPOINTS.transceiver, payload);
        setTransceivers(mapSfpData(transceiverData));

        const psuData = await api.post(API_ENDPOINTS.psu, payload);
        setPsus(mapPsuData(psuData as any[]));

        const thermalData = await api.post(API_ENDPOINTS.thermal, payload);
        setThermal(mapThermalData(thermalData as any[]));

        const fanData = await api.post(API_ENDPOINTS.fan, payload);
        setFans(mapFanData(fanData as any[]));
        
      } catch (err: any) {
        setError(err.message || "Failed to fetch peripheral data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [device]);

  // --- Helper Functions (Unchanged) ---
  const getStatusColor = (status: string) => {
    switch (status) {
      case "up":
      case "normal":
        return "bg-green-900 text-green-300";
      case "down":
      case "critical":
        return "bg-red-900 text-red-300";
      case "warning":
        return "bg-yellow-900 text-yellow-300";
      default:
        return "bg-gray-700 text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "up":
      case "normal":
        return "🟢";
      case "down":
      case "critical":
        return "🔴";
      case "warning":
        return "🟡";
      default:
        return "⚪";
    }
  };

  // --- SubTabs Array (Now uses state for count) ---
  const subTabs = [
    { id: "transceiver", label: "Transceiver", icon: Cpu, count: transceivers.length },
    { id: "psu", label: "PSU", icon: Zap, count: psus.length },
    { id: "thermal", label: "Thermal", icon: Thermometer, count: thermal.length },
    { id: "fan", label: "Fan", icon: Wind, count: fans.length },
  ];

  // --- RENDER FUNCTIONS (Modified to use state variables) ---

  const renderTransceiver = () => (
    <div className="space-y-3">
      {transceivers.length === 0 ? (
        <div className="text-gray-400 text-sm text-center py-8">
          No transceivers found.
        </div>
      ) : (
        transceivers.map((transceiver) => (
          <div
            key={transceiver.id}
            className="bg-gray-700 rounded-lg p-4 border border-gray-600"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{getStatusIcon(transceiver.status)}</span>
                <div>
                  <div className="font-medium text-white">{transceiver.slot}</div>
                  <div className="text-xs text-gray-400">{transceiver.type}</div>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  transceiver.status
                )}`}
              >
                {transceiver.status.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <span className="text-gray-400">Vendor:</span>
                <div className="text-white">{transceiver.vendor}</div>
              </div>
              <div>
                <span className="text-gray-400">Part Number:</span>
                <div className="text-white font-mono text-xs">{transceiver.partNumber}</div>
              </div>
              <div>
                <span className="text-gray-400">Serial Number:</span>
                <div className="text-white font-mono text-xs">{transceiver.serialNumber}</div>
              </div>
              {transceiver.wavelength && (
                <div>
                  <span className="text-gray-400">Wavelength:</span>
                  <div className="text-white">{transceiver.wavelength}</div>
                </div>
              )}
              {transceiver.distance && (
                <div>
                  <span className="text-gray-400">Distance:</span>
                  <div className="text-white">{transceiver.distance}</div>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderPSU = () => (
    <div className="space-y-3">
      {psus.length === 0 ? (
        <div className="text-gray-400 text-sm text-center py-8">No PSUs found.</div>
      ) : (
        psus.map((psu) => (
          <div
            key={psu.id}
            className="bg-gray-700 rounded-lg p-4 border border-gray-600"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{getStatusIcon(psu.status)}</span>
                <div>
                  <div className="font-medium text-white">{psu.slot}</div>
                  <div className="text-xs text-gray-400">{psu.model}</div>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  psu.status
                )}`}
              >
                {psu.status.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <span className="text-gray-400">Vendor:</span>
                <div className="text-white">{psu.vendor}</div>
              </div>
              <div>
                <span className="text-gray-400">Power:</span>
                <div className="text-white font-medium">{psu.power}</div>
              </div>
              <div>
                <span className="text-gray-400">Voltage:</span>
                <div className="text-white">{psu.voltage}</div>
              </div>
              {psu.temperature && (
                <div>
                  <span className="text-gray-400">Temperature:</span>
                  <div className="text-white">{psu.temperature}</div>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderThermal = () => (
    <div className="space-y-3">
      {thermal.length === 0 ? (
        <div className="text-gray-400 text-sm text-center py-8">
          No thermal sensors found.
        </div>
      ) : (
        thermal.map((thermal) => {
          const tempPercent = (thermal.temperature / thermal.threshold) * 100;
          const tempColor =
            thermal.status === "critical"
              ? "bg-red-600"
              : thermal.status === "warning"
              ? "bg-yellow-600"
              : "bg-green-600";

          return (
            <div
              key={thermal.id}
              className="bg-gray-700 rounded-lg p-4 border border-gray-600"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{getStatusIcon(thermal.status)}</span>
                  <div>
                    <div className="font-medium text-white">{thermal.sensor}</div>
                    <div className="text-xs text-gray-400">{thermal.location}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-white">
                    {thermal.temperature}°{thermal.unit === "celsius" ? "C" : "F"}
                  </div>
                  <div className="text-xs text-gray-400">
                    Threshold: {thermal.threshold}°{thermal.unit === "celsius" ? "C" : "F"}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Temperature</span>
                  <span>{tempPercent.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${tempColor}`}
                    style={{ width: `${Math.min(tempPercent, 100)}%` }}
                  />
                </div>
              </div>
              <div className="mt-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    thermal.status
                  )}`}
                >
                  {thermal.status.toUpperCase()}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  const renderFan = () => (
    <div className="space-y-3">
      {fans.length === 0 ? (
        <div className="text-gray-400 text-sm text-center py-8">No fans found.</div>
      ) : (
        fans.map((fan) => {
          const speedPercent = (fan.speed / fan.maxSpeed) * 100;

          return (
            <div
              key={fan.id}
              className="bg-gray-700 rounded-lg p-4 border border-gray-600"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{getStatusIcon(fan.status)}</span>
                  <div>
                    <div className="font-medium text-white">{fan.name}</div>
                    <div className="text-xs text-gray-400">{fan.slot}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-white">
                    {fan.speed.toLocaleString()} RPM
                  </div>
                  <div className="text-xs text-gray-400">
                    Max: {fan.maxSpeed.toLocaleString()} RPM
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Speed</span>
                  <span>{speedPercent.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      fan.status === "up" ? "bg-blue-600" : "bg-red-600"
                    }`}
                    style={{ width: `${speedPercent}%` }}
                  />
                </div>
              </div>
              <div className="mt-3 flex items-center space-x-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    fan.status
                  )}`}
                >
                  {fan.status.toUpperCase()}
                </span>
                {fan.direction && (
                  <span className="text-xs text-gray-400">
                    Direction: {fan.direction}
                  </span>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
  
  // --- Main Content Renderer ---
  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case "transceiver":
        return renderTransceiver();
      case "psu":
        return renderPSU();
      case "thermal":
        return renderThermal();
      case "fan":
        return renderFan();
      default:
        return renderTransceiver();
    }
  };

  // --- Loading / Error / Success States ---
  if (loading) {
    return (
      <div className="text-gray-400 text-center p-8">
        Loading peripheral data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 bg-red-900 border border-red-700 rounded-lg p-4 text-center">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  // --- Main Return (JSX) ---
  return (
    <div className="space-y-4">
      {/* Sub Tabs */}
      <div className="border-b border-gray-700">
        <nav className="flex space-x-6">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                  activeSubTab === tab.id
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    activeSubTab === tab.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sub Tab Content */}
      <div className="pt-4">{renderSubTabContent()}</div>
    </div>
  );
};

export default PeripheralsTab;