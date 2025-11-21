import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import DeviceRoleFormModal, { type DeviceRoleData } from "../../components/modals/DeviceRoleFormModal";
import {
  getNetBoxDeviceRoles,
  addNetBoxDeviceRole,
  updateNetBoxDeviceRoleService,
  deleteNetBoxDeviceRoleService,
} from "../../services/netboxDeviceRoleService";
import type { NetBoxDeviceRole } from "../../helpers/api/netboxDevicesApiHelper";
import {
  DataTable,
  type TableColumn,
} from "../../components/common/ui";

const DeviceRolesPage: React.FC = () => {
  const [roles, setRoles] = useState<NetBoxDeviceRole[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingRole, setEditingRole] = useState<DeviceRoleData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRoles, setSelectedRoles] = useState<NetBoxDeviceRole[]>([]);

  useEffect(() => {
    fetchDeviceRoles();
  }, []);

  const fetchDeviceRoles = async () => {
    setLoading(true);
    try {
      const data = await getNetBoxDeviceRoles();
      setRoles(data);
    } catch (error: any) {
      console.error("Error fetching device roles:", error);
      toast.error(error?.message || "Failed to fetch device roles");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingRole(null);
    setShowModal(true);
  };

  const handleEdit = (role: NetBoxDeviceRole) => {
    setEditingRole({
      id: role.id,
      name: role.name,
      slug: role.slug || role.name.toLowerCase().replace(/\s+/g, '-'),
      color: role.color || '#6b7280',
      description: role.description || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (role: NetBoxDeviceRole) => {
    if (!confirm(`Are you sure you want to delete "${role.display}"?`)) return;
    try {
      await deleteNetBoxDeviceRoleService(role.id);
      toast.success("Device role deleted successfully");
      fetchDeviceRoles();
    } catch (error: any) {
      console.error("Error deleting device role:", error);
      toast.error(error?.message || "Failed to delete device role");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRoles.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedRoles.length} device role(s)?`)) return;
    
    try {
      await Promise.all(
        selectedRoles.map((r) => deleteNetBoxDeviceRoleService(r.id))
      );
      toast.success(`Successfully deleted ${selectedRoles.length} device role(s)`);
      setSelectedRoles([]);
      fetchDeviceRoles();
    } catch (error: any) {
      console.error("Error deleting device roles:", error);
      toast.error(error?.message || "Failed to delete device roles");
    }
  };

  const handleSave = async (data: DeviceRoleData) => {
    try {
      if (editingRole?.id) {
        // Update existing
        await updateNetBoxDeviceRoleService(editingRole.id, {
          name: data.name,
          slug: data.slug,
          color: data.color,
          description: data.description,
        });
        toast.success("Device role updated successfully");
      } else {
        // Create new
        await addNetBoxDeviceRole({
          name: data.name,
          slug: data.slug,
          color: data.color,
          description: data.description,
        });
        toast.success("Device role created successfully");
      }
      setShowModal(false);
      fetchDeviceRoles();
    } catch (error: any) {
      console.error("Error saving device role:", error);
      throw error; // Re-throw to let modal handle the error
    }
  };

  // Define table columns
  const columns: TableColumn<NetBoxDeviceRole>[] = [
    {
      key: "name",
      title: "Name",
      sortable: true,
      searchable: true,
      render: (value: any) => (
        <span className="text-white font-medium">{value}</span>
      ),
    },
    {
      key: "slug",
      title: "Slug",
      sortable: true,
      searchable: true,
      render: (value: any) => (
        <span className="text-gray-300">{value || "-"}</span>
      ),
    },
    {
      key: "color",
      title: "Color",
      sortable: true,
      render: (value: any, role: NetBoxDeviceRole) => (
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-5 h-5 rounded-full border border-gray-600"
            style={{ backgroundColor: value || '#6b7280' }}
          />
          <span className="text-gray-400">{value || "-"}</span>
        </div>
      ),
    },
    {
      key: "description",
      title: "Description",
      sortable: true,
      searchable: true,
      render: (value: any) => (
        <span className="text-gray-300">{value || "-"}</span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      sortable: false,
      render: (value: any, role: NetBoxDeviceRole) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(role);
            }}
            className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
            title="Edit device role"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(role);
            }}
            className="p-1 text-red-400 hover:text-red-300 transition-colors"
            title="Delete device role"
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
        <span>Add Device Role</span>
      </button>
    </div>
  );

  const bulkActions = selectedRoles.length > 0 ? (
    <div className="flex space-x-2">
      <button
        onClick={handleBulkDelete}
        className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded flex items-center space-x-1"
      >
        <Trash2 className="h-4 w-4" />
        <span>Delete ({selectedRoles.length})</span>
      </button>
    </div>
  ) : null;

  return (
    <div className="p-5 bg-gray-900 min-h-screen text-white space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Device Roles</h1>
      </div>

      {/* DataTable */}
      <DataTable
        data={roles}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search device roles..."
        loading={loading}
        pagination={{
          enabled: true,
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: [10, 25, 50, 100],
          showQuickJumper: false,
          showTotal: true,
        }}
        onRefresh={fetchDeviceRoles}
        headerActions={headerActions}
        selectedRows={selectedRoles}
        onSelectionChange={setSelectedRoles}
        selectable={true}
        bulkActions={bulkActions}
        emptyMessage="No device roles found"
        emptyIcon={<span className="text-4xl text-gray-600">👤</span>}
      />

      {/* Modal */}
      <DeviceRoleFormModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSave}
        editData={editingRole}
      />
    </div>
  );
};

export default DeviceRolesPage;
