import React, { useState, useEffect } from "react";
import { Plus, Trash2, Download, Upload } from "lucide-react";
import type { Device } from "../../types";
import type { NetBoxDevice } from "../../types/netbox";
import AddDeviceModal from "../modals/AddDeviceModal";
import ViewDeviceModal from "../modals/ViewDeviceModal";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import { toast } from "react-toastify";
import axios from "axios";
import { NETBOX_API_ENDPOINTS } from "../../helpers/url_helper";
import ImportDeviceModal from "../modals/ImportDeviceModal";

import {
  DataTable,
  type TableColumn,
  type FilterConfig,
  StatusBadge,
  DeviceIcon,
  ActionButtons,
} from "../common/ui";

interface DeviceListProps {
  onDeviceSelect: (device: Device) => void;
  onConfigureL2Services?: (device: Device) => void;
  devices: Device[];
  loading?: boolean;
  onReload?: () => void;
  netboxBaseUrl?: string;
  netboxToken?: string;
}

const DeviceList: React.FC<DeviceListProps> = ({
  onDeviceSelect,
  devices,
  loading = false,
  onReload,
  netboxBaseUrl = "http://172.27.1.69:8000",
  netboxToken = "f860879ea8dc32e1e80ce72357fe84f40c1b8f18",
}) => {
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [showViewDeviceModal, setShowViewDeviceModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [selectedDevices, setSelectedDevices] = useState<Device[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deviceDetails, setDeviceDetails] = useState<NetBoxDevice[]>([]);
  const [loadingDeviceDetails, setLoadingDeviceDetails] = useState(false);
  const [paginationState, setPaginationState] = useState({
    current: 1,
    pageSize: 10,
  });

  const handleViewDevice = (device: Device) => {
    setSelectedDevice(device);
    setShowViewDeviceModal(true);
  };

  useEffect(() => {
    setPaginationState((prev) => ({ ...prev, current: 1 }));
  }, [devices.length]);

  // Define table columns (Keep your existing columns)
  const columns: TableColumn<Device>[] = [
    {
      key: "hostname",
      title: "Device",
      sortable: true,
      searchable: true,
      render: (value: any, device: Device) => (
        <div className="flex items-center">
          <DeviceIcon
            vendor={device.vendor}
            className="h-10 w-10 flex-shrink-0"
          />
          <div className="ml-4">
            <div className="text-sm font-medium text-white">
              {device.arangoId || device.hostname || device.fqdn || "-"}
            </div>
            <div className="text-sm text-gray-400">
              {device.osVersion || device.os || "Unknown"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      title: "Status",
      sortable: true,
      filterable: true,
      render: (value: any) => <StatusBadge status={value} />,
    },
    {
      key: "vendor",
      title: "Vendor/Model",
      sortable: true,
      searchable: true,
      render: (value: any, device: Device) => (
        <div>
          <div className="text-sm text-white">{device.vendor}</div>
          <div className="text-sm text-gray-400">{device.model}</div>
        </div>
      ),
    },
    {
      key: "ipAddresses",
      title: "IP Addresses",
      searchable: true,
      render: (value: any, device: Device) => {
        const ipAddresses = Array.isArray(device.ipAddresses)
          ? device.ipAddresses
          : [];
        if (ipAddresses.length === 0) {
          return <span className="text-sm text-gray-400">-</span>;
        }
        return (
          <div className="text-sm text-white">
            {ipAddresses.slice(0, 2).join(", ")}
            {ipAddresses.length > 2 && (
              <span className="text-gray-400">
                {" "}
                +{ipAddresses.length - 2} more
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "location",
      title: "Location",
      render: (value: any) => (
        <span className="text-sm text-white">{value?.name || "-"}</span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (value: any, device: Device) => (
        <ActionButtons
          actions={[
            {
              label: "View",
              onClick: (e) => {
                e.stopPropagation();
                handleViewDevice(device);
              },
              className: "text-blue-400 hover:text-blue-300",
            },
            {
              label: "Edit",
              onClick: (e) => {
                e.stopPropagation();
              },
              className: "text-gray-400 hover:text-gray-300",
            },
          ]}
        />
      ),
    },
  ];

  // Define filters
  const filters: FilterConfig[] = [
    {
      key: "status",
      type: "select",
      label: "Status",
      options: [
        { value: "up", label: "Up" },
        { value: "down", label: "Down" },
        { value: "warning", label: "Warning" },
        { value: "unknown", label: "Unknown" },
      ],
    },
    {
      key: "vendor",
      type: "text",
      label: "Vendor",
      placeholder: "Filter by vendor...",
    },
    {
      key: "roles",
      type: "select",
      label: "Roles",
      options: [
        { value: "router", label: "Router" },
        { value: "switch", label: "Switch" },
        { value: "firewall", label: "Firewall" },
        { value: "access-point", label: "Access Point" },
      ],
    },
  ];
  /**
   * Extract NetBox device ID from device object
   * Device ID format is "device-{id}" where {id} is the numeric NetBox device ID
   */
  const extractNetBoxDeviceId = (device: Device): number | null => {
    // Try to extract from device.id (format: "device-{id}")
    if (device.id && device.id.startsWith("device-")) {
      const idStr = device.id.replace("device-", "");
      const id = parseInt(idStr, 10);
      if (!isNaN(id)) {
        return id;
      }
    }
    return null;
  };

  /**
   * Fetch device details from NetBox API to get component counts
   */
  const fetchDeviceDetails = async (deviceIds: number[]): Promise<NetBoxDevice[]> => {
    try {
      const detailPromises = deviceIds.map((id) =>
        axios.get<NetBoxDevice>(
          `${netboxBaseUrl}${NETBOX_API_ENDPOINTS.DELETE_DEVICE_URL}/${id}/`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Token ${netboxToken}`,
            },
          }
        )
      );

      const responses = await Promise.all(detailPromises);
      return responses.map((res) => res.data);
    } catch (error) {
      console.error("Error fetching device details:", error);
      return [];
    }
  };

  /**
   * Show delete confirmation modal with device details
   */
  const handleDeleteClick = async () => {
    if (selectedDevices.length === 0) return;

    // Extract NetBox device IDs
    const netboxIds = selectedDevices
      .map(extractNetBoxDeviceId)
      .filter((id): id is number => id !== null);

    if (netboxIds.length === 0) {
      toast.error("Could not extract device IDs");
      return;
    }

    // Fetch device details to show component counts
    setLoadingDeviceDetails(true);
    try {
      const details = await fetchDeviceDetails(netboxIds);
      setDeviceDetails(details);
      setShowDeleteConfirmModal(true);
    } catch (error) {
      toast.error("Failed to fetch device details");
    } finally {
      setLoadingDeviceDetails(false);
    }
  };

  /**
   * Perform the actual deletion after confirmation
   */
  const confirmDelete = async () => {
    setShowDeleteConfirmModal(false);
    setIsDeleting(true);

    try {
      // Extract NetBox device IDs
      const netboxIds = selectedDevices
        .map(extractNetBoxDeviceId)
        .filter((id): id is number => id !== null);

      if (netboxIds.length === 0) {
        toast.error("Could not extract device IDs for deletion");
        setIsDeleting(false);
        return;
      }

      // Delete devices one by one (NetBox API requires individual DELETE requests)
      const deletePromises = netboxIds.map((id) =>
        axios.delete(
          `${netboxBaseUrl}${NETBOX_API_ENDPOINTS.DELETE_DEVICE_URL}/${id}/`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Token ${netboxToken}`,
            },
          }
        )
      );

      await Promise.all(deletePromises);

      toast.success(
        `Successfully deleted ${netboxIds.length} device(s)`
      );
      setSelectedDevices([]);
      setDeviceDetails([]);

      if (onReload) onReload();
    } catch (error: any) {
      console.error("Delete error:", error);
      const errorMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "An error occurred while deleting devices";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    // This function now shows the confirmation modal with device details
    await handleDeleteClick();
  };

  const handleBulkExport = () => {
    const dataToExport = selectedDevices.length > 0 ? selectedDevices : devices;
    if (dataToExport.length === 0) {
      toast.info("No devices available to export");
      return;
    }
    const headers = [
      "Device Name",
      "IP Address",
      "MAC Address",
      "Vendor",
      "Model",
      "Status",
      "OS Version",
      "Location",
    ];

    const csvRows = dataToExport.map((device) => {
      const escape = (text: any) =>
        `"${String(text || "").replace(/"/g, '""')}"`;
      const ipString = Array.isArray(device.deviceId)
        ? device.deviceId.join("; ")
        : device.deviceId;

      return [
        escape(device.hostname || device.arangoId),
        escape(ipString),
        escape(device.mac),
        escape(device.vendor),
        escape(device.model),
        escape(device.status),
        escape(device.osVersion),
        escape(device.location?.name),
      ].join(",");
    });
    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const timestamp = new Date().toISOString().split("T")[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `inventory_export_${timestamp}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Successfully exported ${dataToExport.length} devices`);
  };

  const bulkActions = (
    <div className="flex space-x-2">
      <button
        onClick={handleBulkExport}
        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center space-x-1"
      >
        <Download className="h-4 w-4" />
        <span>Export ({selectedDevices.length})</span>
      </button>
      <button
        onClick={handleBulkDelete}
        disabled={isDeleting}
        className={`px-3 py-1 text-sm text-white rounded flex items-center space-x-1 ${
          isDeleting
            ? "bg-red-800 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {isDeleting ? (
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
        <span>
          {isDeleting ? "Deleting..." : `Delete (${selectedDevices.length})`}
        </span>
      </button>
    </div>
  );

  const headerActions = (
    <div className="flex gap-2">
      {/* Add Device Button */}
      <button
        onClick={() => setShowAddDeviceModal(true)}
        className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
      >
        <Plus className="h-4 w-4" />
        <span>Add Device</span>
      </button>
      {/* Import Button */}
      <button
        onClick={() => setShowImportModal(true)}
        className="px-3 py-2 text-sm bg-gray-700 text-gray-200 border border-gray-600 rounded-lg hover:bg-gray-600 flex items-center space-x-2"
      >
        <Upload className="h-4 w-4" />
        <span>Import</span>
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <DataTable
        data={devices}
        columns={columns}
        filters={filters}
        searchable={true}
        searchPlaceholder="Search devices..."
        loading={loading}
        onExport={handleBulkExport}
        pagination={{
          enabled: true,
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: [10, 25, 50, 100],
          showQuickJumper: false,
          showTotal: true,
        }}
        onRowClick={onDeviceSelect}
        onRefresh={() => {
          if (onReload) onReload();
        }}
        headerActions={headerActions}
        selectedRows={selectedDevices}
        onSelectionChange={setSelectedDevices}
        selectable={true}
        bulkActions={bulkActions}
        emptyMessage="No devices found"
        emptyIcon={<span className="text-4xl text-gray-600">🔍</span>}
        rowClassName={(device: Device) =>
          selectedDevices.includes(device) ? "bg-blue-900/20" : ""
        }
      />
      <ImportDeviceModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />

      <AddDeviceModal
        isOpen={showAddDeviceModal}
        onClose={() => setShowAddDeviceModal(false)}
        onSuccess={() => {
          if (onReload) onReload();
        }}
      />

      {/* View Device Modal */}
      {selectedDevice && (
        <ViewDeviceModal
          isOpen={showViewDeviceModal}
          onClose={() => {
            setShowViewDeviceModal(false);
            setSelectedDevice(null);
          }}
          deviceId={selectedDevice.id.replace("device-", "")}
          deviceName={selectedDevice.hostname || selectedDevice.arangoId}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal<NetBoxDevice>
        isOpen={showDeleteConfirmModal}
        onClose={() => {
          setShowDeleteConfirmModal(false);
          setDeviceDetails([]);
        }}
        onConfirm={confirmDelete}
        items={deviceDetails}
        itemCount={selectedDevices.length}
        entityName="Device"
        isLoading={loadingDeviceDetails}
        isDeleting={isDeleting}
        warningMessage={`You are about to delete ${selectedDevices.length} device(s). This will permanently remove the devices and all associated data from NetBox.`}
        loadingMessage="Loading device details..."
        renderItem={(device, index) => (
          <div
            key={device.id || index}
            className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h5 className="text-white font-medium">{device.name}</h5>
                  <span className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded">
                    ID: {device.id}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {device.device_type.manufacturer.name} {device.device_type.model}
                </p>
                {device.site && (
                  <p className="text-xs text-gray-500 mt-1">
                    Site: {device.site.name}
                  </p>
                )}
              </div>
            </div>

            {/* Component Counts */}
            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                {device.interface_count !== undefined && (
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-500">Interfaces:</span>
                    <span className="text-white font-medium">
                      {device.interface_count}
                    </span>
                  </div>
                )}
                {device.console_port_count !== undefined && (
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-500">Console Ports:</span>
                    <span className="text-white font-medium">
                      {device.console_port_count}
                    </span>
                  </div>
                )}
                {device.power_port_count !== undefined && (
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-500">Power Ports:</span>
                    <span className="text-white font-medium">
                      {device.power_port_count}
                    </span>
                  </div>
                )}
                {device.power_outlet_count !== undefined && (
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-500">Power Outlets:</span>
                    <span className="text-white font-medium">
                      {device.power_outlet_count}
                    </span>
                  </div>
                )}
                {device.front_port_count !== undefined && (
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-500">Front Ports:</span>
                    <span className="text-white font-medium">
                      {device.front_port_count}
                    </span>
                  </div>
                )}
                {device.rear_port_count !== undefined && (
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-500">Rear Ports:</span>
                    <span className="text-white font-medium">
                      {device.rear_port_count}
                    </span>
                  </div>
                )}
                {device.device_bay_count !== undefined && (
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-500">Device Bays:</span>
                    <span className="text-white font-medium">
                      {device.device_bay_count}
                    </span>
                  </div>
                )}
                {device.module_bay_count !== undefined && (
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-500">Module Bays:</span>
                    <span className="text-white font-medium">
                      {device.module_bay_count}
                    </span>
                  </div>
                )}
                {device.inventory_item_count !== undefined && (
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-500">Inventory Items:</span>
                    <span className="text-white font-medium">
                      {device.inventory_item_count}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default DeviceList;
