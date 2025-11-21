import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import DeviceTypeFormModal, {
  type DeviceTypeData,
} from "../../components/modals/DeviceTypeFormModal";
import {
  getNetBoxDeviceTypes,
  addNetBoxDeviceType,
  updateNetBoxDeviceTypeService,
  deleteNetBoxDeviceTypeService,
} from "../../services/netboxDeviceTypeService";
import type { NetBoxDeviceType } from "../../helpers/api/netboxDevicesApiHelper";
import {
  DataTable,
  type TableColumn,
} from "../../components/common/ui";

const DeviceTypesPage: React.FC = () => {
  const [deviceTypes, setDeviceTypes] = useState<NetBoxDeviceType[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingDeviceType, setEditingDeviceType] =
    useState<DeviceTypeData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDeviceTypes, setSelectedDeviceTypes] = useState<NetBoxDeviceType[]>([]);

  useEffect(() => {
    fetchDeviceTypes();
  }, []);

  const fetchDeviceTypes = async () => {
    setLoading(true);
    try {
      const data = await getNetBoxDeviceTypes();
      setDeviceTypes(data);
    } catch (error: any) {
      console.error("Error fetching device types:", error);
      toast.error(error?.message || "Failed to fetch device types");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingDeviceType(null);
    setShowModal(true);
  };

  const handleEdit = (deviceType: NetBoxDeviceType) => {
    setEditingDeviceType({
      id: deviceType.id,
      manufacturer: deviceType.manufacturer.id,
      model: deviceType.model,
      slug: deviceType.model.toLowerCase().replace(/\s+/g, "-"),
    });
    setShowModal(true);
  };

  const handleDelete = async (deviceType: NetBoxDeviceType) => {
    if (!confirm(`Are you sure you want to delete "${deviceType.display}"?`)) return;
    try {
      await deleteNetBoxDeviceTypeService(deviceType.id);
      toast.success("Device type deleted successfully");
      fetchDeviceTypes();
    } catch (error: any) {
      console.error("Error deleting device type:", error);
      toast.error(error?.message || "Failed to delete device type");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedDeviceTypes.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedDeviceTypes.length} device type(s)?`)) return;
    
    try {
      await Promise.all(
        selectedDeviceTypes.map((dt) => deleteNetBoxDeviceTypeService(dt.id))
      );
      toast.success(`Successfully deleted ${selectedDeviceTypes.length} device type(s)`);
      setSelectedDeviceTypes([]);
      fetchDeviceTypes();
    } catch (error: any) {
      console.error("Error deleting device types:", error);
      toast.error(error?.message || "Failed to delete device types");
    }
  };

  const handleSave = async (data: DeviceTypeData) => {
    try {
      if (editingDeviceType?.id) {
        // Update existing
        await updateNetBoxDeviceTypeService(editingDeviceType.id, {
          manufacturer: data.manufacturer as number,
          model: data.model,
          slug: data.slug,
          part_number: data.part_number,
          u_height: data.u_height,
          is_full_depth: data.is_full_depth,
          airflow: data.airflow,
          weight: data.weight,
          weight_unit: data.weight_unit,
          description: data.description,
          comments: data.comments,
        });
        toast.success("Device type updated successfully");
      } else {
        // Create new
        await addNetBoxDeviceType({
          manufacturer: data.manufacturer as number,
          model: data.model,
          slug: data.slug,
          part_number: data.part_number,
          u_height: data.u_height,
          is_full_depth: data.is_full_depth,
          airflow: data.airflow,
          weight: data.weight,
          weight_unit: data.weight_unit,
          description: data.description,
          comments: data.comments,
        });
        toast.success("Device type created successfully");
      }
      setShowModal(false);
      fetchDeviceTypes();
    } catch (error: any) {
      console.error("Error saving device type:", error);
      throw error; // Re-throw to let modal handle the error
    }
  };

  // Define table columns
  const columns: TableColumn<NetBoxDeviceType>[] = [
    {
      key: "manufacturer",
      title: "Manufacturer",
      sortable: true,
      searchable: true,
      render: (value: any, deviceType: NetBoxDeviceType) => (
        <span className="text-white">{deviceType.manufacturer.name}</span>
      ),
    },
    {
      key: "model",
      title: "Model",
      sortable: true,
      searchable: true,
      render: (value: any) => (
        <span className="text-white font-medium">{value}</span>
      ),
    },
    {
      key: "display",
      title: "Display Name",
      sortable: true,
      searchable: true,
      render: (value: any) => (
        <span className="text-gray-300">{value}</span>
      ),
    },
    {
      key: "part_number",
      title: "Part Number",
      sortable: true,
      searchable: true,
      render: (value: any) => (
        <span className="text-gray-400">{value || "-"}</span>
      ),
    },
    {
      key: "u_height",
      title: "U Height",
      sortable: true,
      render: (value: any) => (
        <span className="text-gray-300">{value || "-"}</span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      sortable: false,
      render: (value: any, deviceType: NetBoxDeviceType) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(deviceType);
            }}
            className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
            title="Edit device type"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(deviceType);
            }}
            className="p-1 text-red-400 hover:text-red-300 transition-colors"
            title="Delete device type"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const headerActions = (
    <div className="flex gap-2">
      <button
        onClick={handleAdd}
        className="px-3 py-2 text-sm bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center space-x-2 transition-colors"
      >
        <Plus className="h-4 w-4" />
        <span>Add Device Type</span>
      </button>
    </div>
  );

  const bulkActions = selectedDeviceTypes.length > 0 ? (
    <div className="flex space-x-2">
      <button
        onClick={handleBulkDelete}
        className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded flex items-center space-x-1"
      >
        <Trash2 className="h-4 w-4" />
        <span>Delete ({selectedDeviceTypes.length})</span>
      </button>
    </div>
  ) : null;

  return (
    <div className="p-5 bg-gray-900 min-h-screen text-white space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Device Types</h1>
      </div>

      {/* DataTable */}
      <DataTable
        data={deviceTypes}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search device types..."
        loading={loading}
        pagination={{
          enabled: true,
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: [10, 25, 50, 100],
          showQuickJumper: false,
          showTotal: true,
        }}
        onRefresh={fetchDeviceTypes}
        headerActions={headerActions}
        selectedRows={selectedDeviceTypes}
        onSelectionChange={setSelectedDeviceTypes}
        selectable={true}
        bulkActions={bulkActions}
        emptyMessage="No device types found"
        emptyIcon={<span className="text-4xl text-gray-600">📦</span>}
      />

      {/* Modal */}
      <DeviceTypeFormModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSave}
        editData={editingDeviceType}
      />
    </div>
  );
};

export default DeviceTypesPage;

