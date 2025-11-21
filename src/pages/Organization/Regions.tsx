import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import RegionFormModal, {
  type RegionData,
} from "../../components/modals/RegionFormModal";
import {
  getNetBoxRegions,
  addNetBoxRegion,
  updateNetBoxRegionService,
  deleteNetBoxRegionService,
} from "../../services/netboxRegionService";
import type { NetBoxRegion } from "../../helpers/api/netboxDevicesApiHelper";
import {
  DataTable,
  type TableColumn,
} from "../../components/common/ui";

const Regions: React.FC = () => {
  const [regions, setRegions] = useState<NetBoxRegion[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingRegion, setEditingRegion] = useState<RegionData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRegions, setSelectedRegions] = useState<NetBoxRegion[]>([]);

  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    setLoading(true);
    try {
      const data = await getNetBoxRegions();
      setRegions(data);
    } catch (error: any) {
      console.error("Error fetching regions:", error);
      toast.error(error?.message || "Failed to fetch regions");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingRegion(null);
    setShowModal(true);
  };

  const handleEdit = (region: NetBoxRegion) => {
    setEditingRegion({
      id: region.id,
      name: region.name,
      slug: region.slug,
      description: region.description || "",
      parent: region.parent?.id || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (region: NetBoxRegion) => {
    if (!confirm(`Are you sure you want to delete "${region.display}"?`)) return;
    try {
      await deleteNetBoxRegionService(region.id);
      toast.success("Region deleted successfully");
      fetchRegions();
    } catch (error: any) {
      console.error("Error deleting region:", error);
      toast.error(error?.message || "Failed to delete region");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRegions.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedRegions.length} region(s)?`)) return;
    
    try {
      await Promise.all(
        selectedRegions.map((r) => deleteNetBoxRegionService(r.id))
      );
      toast.success(`Successfully deleted ${selectedRegions.length} region(s)`);
      setSelectedRegions([]);
      fetchRegions();
    } catch (error: any) {
      console.error("Error deleting regions:", error);
      toast.error(error?.message || "Failed to delete regions");
    }
  };

  const handleSave = async (data: RegionData) => {
    try {
      if (editingRegion?.id) {
        // Update existing
        await updateNetBoxRegionService(editingRegion.id, {
          name: data.name,
          slug: data.slug,
          description: data.description,
          parent: data.parent === "" ? undefined : (data.parent as number),
        });
        toast.success("Region updated successfully");
      } else {
        // Create new
        await addNetBoxRegion({
          name: data.name,
          slug: data.slug,
          description: data.description,
          parent: data.parent === "" ? undefined : (data.parent as number),
        });
        toast.success("Region created successfully");
      }
      setShowModal(false);
      fetchRegions();
    } catch (error: any) {
      console.error("Error saving region:", error);
      throw error; // Re-throw to let modal handle the error
    }
  };

  // Define table columns
  const columns: TableColumn<NetBoxRegion>[] = [
    {
      key: "name",
      title: "Name",
      sortable: true,
      searchable: true,
      render: (value: any, region: NetBoxRegion) => (
        <div className="flex items-center gap-2">
          {region._depth !== undefined && region._depth > 0 && (
            <span className="text-gray-500">
              {"  ".repeat(region._depth)}
              {"└─ "}
            </span>
          )}
          <span className="text-white font-medium">{value}</span>
        </div>
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
      key: "parent",
      title: "Parent",
      sortable: true,
      render: (value: any, region: NetBoxRegion) => (
        <span className="text-gray-300">
          {region.parent?.name || "-"}
        </span>
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
      render: (value: any, region: NetBoxRegion) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(region);
            }}
            className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
            title="Edit region"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(region);
            }}
            className="p-1 text-red-400 hover:text-red-300 transition-colors"
            title="Delete region"
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
        <span>Add Region</span>
      </button>
    </div>
  );

  const bulkActions = selectedRegions.length > 0 ? (
    <div className="flex space-x-2">
      <button
        onClick={handleBulkDelete}
        className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded flex items-center space-x-1"
      >
        <Trash2 className="h-4 w-4" />
        <span>Delete ({selectedRegions.length})</span>
      </button>
    </div>
  ) : null;

  return (
    <div className="p-5 bg-gray-900 min-h-screen text-white space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Regions</h1>
      </div>

      {/* DataTable */}
      <DataTable
        data={regions}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search regions..."
        loading={loading}
        pagination={{
          enabled: true,
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: [10, 25, 50, 100],
          showQuickJumper: false,
          showTotal: true,
        }}
        onRefresh={fetchRegions}
        headerActions={headerActions}
        selectedRows={selectedRegions}
        onSelectionChange={setSelectedRegions}
        selectable={true}
        bulkActions={bulkActions}
        emptyMessage="No regions found"
        emptyIcon={<span className="text-4xl text-gray-600">🌍</span>}
      />

      {/* Modal */}
      <RegionFormModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSave}
        editData={editingRegion}
      />
    </div>
  );
};

export default Regions;
