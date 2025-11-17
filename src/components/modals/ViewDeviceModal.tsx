import React, { useEffect, useState } from "react";
import { X, Loader2, MapPin, Server, Network, Shield, Calendar } from "lucide-react";
import axios from "axios";
import type { NetBoxDevice } from "../../types/netbox";
import { Modal } from "../common/ui";
import { StatusBadge, DeviceIcon } from "../common/ui";

interface ViewDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  deviceId: number | string;
  deviceName?: string;
}

const NETBOX_TOKEN = "f860879ea8dc32e1e80ce72357fe84f40c1b8f18";
const NETBOX_BASE_URL = "http://172.27.1.69:8000";

const ViewDeviceModal: React.FC<ViewDeviceModalProps> = ({
  isOpen,
  onClose,
  deviceId,
  deviceName,
}) => {
  const [device, setDevice] = useState<NetBoxDevice | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && deviceId) {
      fetchDeviceDetails();
    } else {
      setDevice(null);
      setError(null);
    }
  }, [isOpen, deviceId]);

  const fetchDeviceDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<NetBoxDevice>(
        `${NETBOX_BASE_URL}/api/dcim/devices/${deviceId}/`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Token ${NETBOX_TOKEN}`,
          },
        }
      );

      setDevice(response.data);
    } catch (err: any) {
      console.error("Error fetching device details:", err);
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch device details"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={deviceName || "Device Details"}
      size="xl"
      theme="dark"
      closeOnBackdropClick={true}
    >
      <div className="space-y-6">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-3 text-gray-400">Loading device details...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {device && !loading && (
          <>
            {/* Device Header */}
            <div className="flex items-start space-x-4 pb-4 border-b border-gray-700">
              <DeviceIcon
                vendor={device.device_type?.manufacturer?.name || "Unknown"}
                className="h-16 w-16 flex-shrink-0"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-1">
                  {device.name || device.display}
                </h3>
                <p className="text-sm text-gray-400">
                  {device.device_type?.manufacturer?.name} {device.device_type?.model}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  {device.status && (
                    <StatusBadge
                      status={
                        device.status.value === "active"
                          ? "up"
                          : device.status.value === "offline" ||
                            device.status.value === "failed"
                          ? "down"
                          : device.status.value === "planned" ||
                            device.status.value === "staged"
                          ? "warning"
                          : "unknown"
                      }
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Device Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
                  <Server className="w-4 h-4 mr-2" />
                  Basic Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Device ID:</span>
                    <span className="text-white font-mono">{device.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white">{device.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Display:</span>
                    <span className="text-white">{device.display}</span>
                  </div>
                  {device.serial && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Serial Number:</span>
                      <span className="text-white font-mono">{device.serial}</span>
                    </div>
                  )}
                  {device.asset_tag && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Asset Tag:</span>
                      <span className="text-white">{device.asset_tag}</span>
                    </div>
                  )}
                  {device.description && (
                    <div className="flex flex-col">
                      <span className="text-gray-400 mb-1">Description:</span>
                      <span className="text-white">{device.description}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Device Type Information */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
                  <Network className="w-4 h-4 mr-2" />
                  Device Type
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Manufacturer:</span>
                    <span className="text-white">
                      {device.device_type?.manufacturer?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Model:</span>
                    <span className="text-white">
                      {device.device_type?.model || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Platform:</span>
                    <span className="text-white">
                      {device.platform?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Role:</span>
                    <span className="text-white">{device.role?.name || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Network Information */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
                  <Network className="w-4 h-4 mr-2" />
                  Network Information
                </h4>
                <div className="space-y-2 text-sm">
                  {device.primary_ip4 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Primary IPv4:</span>
                      <span className="text-white font-mono">
                        {device.primary_ip4.address}
                      </span>
                    </div>
                  )}
                  {device.primary_ip6 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Primary IPv6:</span>
                      <span className="text-white font-mono">
                        {device.primary_ip6.address}
                      </span>
                    </div>
                  )}
                  {device.oob_ip && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">OOB IP:</span>
                      <span className="text-white font-mono">
                        {device.oob_ip.address}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Interface Count:</span>
                    <span className="text-white">{device.interface_count || 0}</span>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Location
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Site:</span>
                    <span className="text-white">{device.site?.name || "N/A"}</span>
                  </div>
                  {device.location && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Location:</span>
                      <span className="text-white">{device.location.name}</span>
                    </div>
                  )}
                  {device.rack && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Rack:</span>
                      <span className="text-white">{device.rack.name}</span>
                    </div>
                  )}
                  {device.position && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Position:</span>
                      <span className="text-white">{device.position}</span>
                    </div>
                  )}
                  {device.face && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Face:</span>
                      <span className="text-white capitalize">{device.face}</span>
                    </div>
                  )}
                  {(device.latitude || device.longitude) && (
                    <div className="flex flex-col">
                      <span className="text-gray-400">Coordinates:</span>
                      <span className="text-white font-mono text-xs">
                        {device.latitude}, {device.longitude}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Information */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Status
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-white capitalize">
                      {device.status?.label || device.status?.value || "N/A"}
                    </span>
                  </div>
                  {device.airflow && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Airflow:</span>
                      <span className="text-white capitalize">
                        {typeof device.airflow === "object" && device.airflow.value
                          ? device.airflow.value
                          : device.airflow}
                      </span>
                    </div>
                  )}
                  {device.tenant && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tenant:</span>
                      <span className="text-white">{device.tenant.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Timestamps */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Timestamps
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-400 mb-1">Created:</span>
                    <span className="text-white text-xs">
                      {formatDate(device.created)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-400 mb-1">Last Updated:</span>
                    <span className="text-white text-xs">
                      {formatDate(device.last_updated)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            {(device.console_port_count > 0 ||
              device.interface_count > 0 ||
              device.power_port_count > 0) && (
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-3">
                  Component Counts
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Console Ports:</span>
                    <span className="text-white ml-2">{device.console_port_count}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Interfaces:</span>
                    <span className="text-white ml-2">{device.interface_count}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Power Ports:</span>
                    <span className="text-white ml-2">{device.power_port_count}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Module Bays:</span>
                    <span className="text-white ml-2">{device.module_bay_count}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Custom Fields */}
            {device.custom_fields &&
              Object.keys(device.custom_fields).length > 0 && (
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-300 mb-3">
                    Custom Fields
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {Object.entries(device.custom_fields).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-400 capitalize">
                          {key.replace(/_/g, " ")}:
                        </span>
                        <span className="text-white">
                          {value ? String(value) : "N/A"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default ViewDeviceModal;

