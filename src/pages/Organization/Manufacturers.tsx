import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import ManufacturersFormModal, {
  type ManufacturerData,
} from "../../components/modals/ManufacturersFormModal";
import {
  getNetBoxManufacturers,
  addNetBoxManufacturer,
  updateNetBoxManufacturerService,
  deleteNetBoxManufacturerService,
} from "../../services/netboxManufacturerService";
import type { NetBoxManufacturer } from "../../helpers/api/netboxDevicesApiHelper";
import {
  DataTable,
  type TableColumn,
} from "../../components/common/ui";

const ManufacturersPage: React.FC = () => {
  const [manufacturers, setManufacturers] = useState<NetBoxManufacturer[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingManufacturer, setEditingManufacturer] =
    useState<ManufacturerData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedManufacturers, setSelectedManufacturers] = useState<NetBoxManufacturer[]>([]);

  useEffect(() => {
    fetchManufacturers();
  }, []);

  const fetchManufacturers = async () => {
    setLoading(true);
    try {
      const data = await getNetBoxManufacturers();
      setManufacturers(data);
    } catch (error: any) {
      console.error("Error fetching manufacturers:", error);
      toast.error(error?.message || "Failed to fetch manufacturers");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingManufacturer(null);
    setShowModal(true);
  };

  const handleEdit = (manufacturer: NetBoxManufacturer) => {
    setEditingManufacturer({
      id: manufacturer.id,
      name: manufacturer.name,
      slug: manufacturer.slug || manufacturer.name.toLowerCase().replace(/\s+/g, '-'),
      description: manufacturer.description || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (manufacturer: NetBoxManufacturer) => {
    if (!confirm(`Are you sure you want to delete "${manufacturer.display}"?`)) return;
    try {
      await deleteNetBoxManufacturerService(manufacturer.id);
      toast.success("Manufacturer deleted successfully");
      fetchManufacturers();
    } catch (error: any) {
      console.error("Error deleting manufacturer:", error);
      toast.error(error?.message || "Failed to delete manufacturer");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedManufacturers.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedManufacturers.length} manufacturer(s)?`)) return;
    
    try {
      await Promise.all(
        selectedManufacturers.map((m) => deleteNetBoxManufacturerService(m.id))
      );
      toast.success(`Successfully deleted ${selectedManufacturers.length} manufacturer(s)`);
      setSelectedManufacturers([]);
      fetchManufacturers();
    } catch (error: any) {
      console.error("Error deleting manufacturers:", error);
      toast.error(error?.message || "Failed to delete manufacturers");
    }
  };

  const handleSave = async (data: ManufacturerData) => {
    try {
      if (editingManufacturer?.id) {
        // Update existing
        await updateNetBoxManufacturerService(editingManufacturer.id, {
          name: data.name,
          slug: data.slug,
          description: data.description,
        });
        toast.success("Manufacturer updated successfully");
      } else {
        // Create new
        await addNetBoxManufacturer({
          name: data.name,
          slug: data.slug,
          description: data.description,
        });
        toast.success("Manufacturer created successfully");
      }
      setShowModal(false);
      fetchManufacturers();
    } catch (error: any) {
      console.error("Error saving manufacturer:", error);
      throw error; // Re-throw to let modal handle the error
    }
  };

  // Define table columns
  const columns: TableColumn<NetBoxManufacturer>[] = [
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
      render: (value: any, manufacturer: NetBoxManufacturer) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(manufacturer);
            }}
            className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
            title="Edit manufacturer"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(manufacturer);
            }}
            className="p-1 text-red-400 hover:text-red-300 transition-colors"
            title="Delete manufacturer"
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
        <span>Add Manufacturer</span>
      </button>
    </div>
  );

  const bulkActions = selectedManufacturers.length > 0 ? (
    <div className="flex space-x-2">
      <button
        onClick={handleBulkDelete}
        className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded flex items-center space-x-1"
      >
        <Trash2 className="h-4 w-4" />
        <span>Delete ({selectedManufacturers.length})</span>
      </button>
    </div>
  ) : null;

  return (
    <div className="p-5 bg-gray-900 min-h-screen text-white space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Manufacturers</h1>
      </div>

      {/* DataTable */}
      <DataTable
        data={manufacturers}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search manufacturers..."
        loading={loading}
        pagination={{
          enabled: true,
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: [10, 25, 50, 100],
          showQuickJumper: false,
          showTotal: true,
        }}
        onRefresh={fetchManufacturers}
        headerActions={headerActions}
        selectedRows={selectedManufacturers}
        onSelectionChange={setSelectedManufacturers}
        selectable={true}
        bulkActions={bulkActions}
        emptyMessage="No manufacturers found"
        emptyIcon={<span className="text-4xl text-gray-600">🏭</span>}
      />

      {/* Modal */}
      <ManufacturersFormModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSave}
        editData={editingManufacturer}
      />
    </div>
  );
};

export default ManufacturersPage;
