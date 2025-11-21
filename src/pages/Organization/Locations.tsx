import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import LocationFormModal, {
  type LocationData,
} from "../../components/modals/LocationFormModal";
import {
  getNetBoxLocations,
  addNetBoxLocation,
  updateNetBoxLocationService,
  deleteNetBoxLocationService,
} from "../../services/netboxLocationService";
import type { NetBoxLocation } from "../../helpers/api/netboxDevicesApiHelper";
import {
  DataTable,
  type TableColumn,
} from "../../components/common/ui";

const Locations: React.FC = () => {
  const [locations, setLocations] = useState<NetBoxLocation[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedLocations, setSelectedLocations] = useState<NetBoxLocation[]>([]);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const data = await getNetBoxLocations();
      setLocations(data);
    } catch (error: any) {
      console.error("Error fetching locations:", error);
      toast.error(error?.message || "Failed to fetch locations");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingLocation(null);
    setShowModal(true);
  };

  const handleEdit = (location: NetBoxLocation) => {
    setEditingLocation({
      id: location.id,
      name: location.name,
      slug: location.slug,
      site: location.site?.id || "",
      parent: location.parent?.id || "",
      status: location.status?.value || "active",
      description: location.description || "",
      facility: location.facility || "",
      physical_address: location.physical_address || "",
      latitude: location.latitude,
      longitude: location.longitude,
      comments: location.comments || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (location: NetBoxLocation) => {
    if (!confirm(`Are you sure you want to delete "${location.display}"?`)) return;
    try {
      await deleteNetBoxLocationService(location.id);
      toast.success("Location deleted successfully");
      fetchLocations();
    } catch (error: any) {
      console.error("Error deleting location:", error);
      toast.error(error?.message || "Failed to delete location");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedLocations.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedLocations.length} location(s)?`)) return;
    
    try {
      await Promise.all(
        selectedLocations.map((l) => deleteNetBoxLocationService(l.id))
      );
      toast.success(`Successfully deleted ${selectedLocations.length} location(s)`);
      setSelectedLocations([]);
      fetchLocations();
    } catch (error: any) {
      console.error("Error deleting locations:", error);
      toast.error(error?.message || "Failed to delete locations");
    }
  };

  const handleSave = async (data: LocationData) => {
    try {
      if (editingLocation?.id) {
        // Update existing
        await updateNetBoxLocationService(editingLocation.id, {
          name: data.name,
          slug: data.slug,
          site: data.site === "" ? undefined : (data.site as number),
          parent: data.parent === "" ? undefined : (data.parent as number),
          status: data.status,
          description: data.description,
          facility: data.facility,
          physical_address: data.physical_address,
          latitude: data.latitude,
          longitude: data.longitude,
          comments: data.comments,
        });
        toast.success("Location updated successfully");
      } else {
        // Create new
        await addNetBoxLocation({
          name: data.name,
          slug: data.slug,
          site: data.site === "" ? undefined : (data.site as number),
          parent: data.parent === "" ? undefined : (data.parent as number),
          status: data.status,
          description: data.description,
          facility: data.facility,
          physical_address: data.physical_address,
          latitude: data.latitude,
          longitude: data.longitude,
          comments: data.comments,
        });
        toast.success("Location created successfully");
      }
      setShowModal(false);
      fetchLocations();
    } catch (error: any) {
      console.error("Error saving location:", error);
      throw error; // Re-throw to let modal handle the error
    }
  };

  // Define table columns
  const columns: TableColumn<NetBoxLocation>[] = [
    {
      key: "name",
      title: "Name",
      sortable: true,
      searchable: true,
      render: (value: any, location: NetBoxLocation) => (
        <div className="flex items-center gap-2">
          {location._depth !== undefined && location._depth > 0 && (
            <span className="text-gray-500">
              {"  ".repeat(location._depth)}
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
      key: "site",
      title: "Site",
      sortable: true,
      render: (value: any, location: NetBoxLocation) => (
        <span className="text-gray-300">
          {location.site?.name || "-"}
        </span>
      ),
    },
    {
      key: "parent",
      title: "Parent",
      sortable: true,
      render: (value: any, location: NetBoxLocation) => (
        <span className="text-gray-300">
          {location.parent?.name || "-"}
        </span>
      ),
    },
    {
      key: "status",
      title: "Status",
      sortable: true,
      render: (value: any, location: NetBoxLocation) => {
        const status = location.status?.value || "active";
        const statusColors: Record<string, string> = {
          active: "bg-green-500",
          planned: "bg-yellow-500",
          retired: "bg-red-500",
        };
        return (
          <span
            className={`px-2 py-1 rounded text-xs text-white ${
              statusColors[status] || "bg-gray-500"
            }`}
          >
            {location.status?.label || status}
          </span>
        );
      },
    },
    {
      key: "device_count",
      title: "Devices",
      sortable: true,
      render: (value: any) => (
        <span className="text-gray-300">{value || 0}</span>
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
      render: (value: any, location: NetBoxLocation) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(location);
            }}
            className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
            title="Edit location"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(location);
            }}
            className="p-1 text-red-400 hover:text-red-300 transition-colors"
            title="Delete location"
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
        <span>Add Location</span>
      </button>
    </div>
  );

  const bulkActions = selectedLocations.length > 0 ? (
    <div className="flex space-x-2">
      <button
        onClick={handleBulkDelete}
        className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded flex items-center space-x-1"
      >
        <Trash2 className="h-4 w-4" />
        <span>Delete ({selectedLocations.length})</span>
      </button>
    </div>
  ) : null;

  return (
    <div className="p-5 bg-gray-900 min-h-screen text-white space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Locations</h1>
      </div>

      {/* DataTable */}
      <DataTable
        data={locations}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search locations..."
        loading={loading}
        pagination={{
          enabled: true,
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: [10, 25, 50, 100],
          showQuickJumper: false,
          showTotal: true,
        }}
        onRefresh={fetchLocations}
        headerActions={headerActions}
        selectedRows={selectedLocations}
        onSelectionChange={setSelectedLocations}
        selectable={true}
        bulkActions={bulkActions}
        emptyMessage="No locations found"
        emptyIcon={<span className="text-4xl text-gray-600">📍</span>}
      />

      {/* Modal */}
      <LocationFormModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSave}
        editData={editingLocation}
      />
    </div>
  );
};

export default Locations;
