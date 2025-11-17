import React, { useState } from "react";
import { Plus } from "lucide-react";
import type { Device } from "../../types";
import AddDeviceModal from "../modals/AddDeviceModal";
import ViewDeviceModal from "../modals/ViewDeviceModal";
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
}

const DeviceList: React.FC<DeviceListProps> = ({
  onDeviceSelect,
  devices,
  loading = false,
}) => {
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [showViewDeviceModal, setShowViewDeviceModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [selectedDevices, setSelectedDevices] = useState<Device[]>([]);

  const handleViewDevice = (device: Device) => {
    setSelectedDevice(device);
    setShowViewDeviceModal(true);
  };

  // Define table columns
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
        const ipAddresses = Array.isArray(device.ipAddresses) ? device.ipAddresses : [];
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
    // {
    //   key: "lastSeen",
    //   title: "Last Seen",
    //   sortable: true,
    //   render: (value: any) => (
    //     <span className="text-sm text-gray-400">{formatLastSeen(value)}</span>
    //   ),
    // },
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
              // icon: <Eye className="h-4 w-4" />,
            },

            {
              label: "Edit",
              onClick: (e) => {
                e.stopPropagation();
                // Handle edit action
              },
              className: "text-gray-400 hover:text-gray-300",
              // icon: <Edit className="h-4 w-4" />,
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

  // Handle bulk actions
  const handleBulkDelete = () => {
    if (selectedDevices.length > 0) {
      // Implement bulk delete logic
      console.log("Deleting devices:", selectedDevices);
    }
  };

  const handleBulkExport = () => {
    if (selectedDevices.length > 0) {
      // Implement bulk export logic
      console.log("Exporting devices:", selectedDevices);
    }
  };

  const bulkActions = (
    <div className="flex space-x-2">
      <button
        onClick={handleBulkExport}
        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Export Selected
      </button>
      <button
        onClick={handleBulkDelete}
        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
      >
        Delete Selected
      </button>
    </div>
  );

  const headerActions = (
    <button
      onClick={() => setShowAddDeviceModal(true)}
      className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
    >
      <Plus className="h-4 w-4" />
      <span>Add Device</span>
    </button>
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
          // Implement refresh logic
          console.log("Refreshing devices...");
        }}
        onExport={() => {
          // Implement export logic
          console.log("Exporting all devices...");
        }}
        headerActions={headerActions}
        selectedRows={selectedDevices}
        onSelectionChange={setSelectedDevices}
        selectable={true}
        bulkActions={bulkActions}
        emptyMessage="No devices found"
        emptyIcon={<span className="text-4xl text-gray-600">🔍</span>}
        rowClassName={(device: Device, index: any) =>
          selectedDevices.includes(device) ? "bg-blue-900/20" : ""
        }
      />

      {/* Add Device Modal */}
      <AddDeviceModal
        isOpen={showAddDeviceModal}
        onClose={() => setShowAddDeviceModal(false)}
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
    </div>
  );
};

export default DeviceList;
