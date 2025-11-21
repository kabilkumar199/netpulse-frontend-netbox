import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import RackFormModal, {
  type RackData,
} from "../../components/modals/RackFormModal";
import {
  getNetBoxRacks,
  addNetBoxRack,
  updateNetBoxRackService,
  deleteNetBoxRackService,
} from "../../services/netboxRackService";
import type { NetBoxRack } from "../../helpers/api/netboxDevicesApiHelper";
import {
  DataTable,
  type TableColumn,
} from "../../components/common/ui";

const RacksPage: React.FC = () => {
  const [racks, setRacks] = useState<NetBoxRack[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRack, setEditingRack] = useState<RackData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRacks, setSelectedRacks] = useState<NetBoxRack[]>([]);

  useEffect(() => {
    fetchRacks();
  }, []);

  const fetchRacks = async () => {
    setLoading(true);
    try {
      const data = await getNetBoxRacks();
      setRacks(data);
    } catch (error: any) {
      console.error("Error fetching racks:", error);
      toast.error(error?.message || "Failed to fetch racks");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingRack(null);
    setShowModal(true);
  };

  const handleEdit = (rack: NetBoxRack) => {
    setEditingRack({
      id: rack.id,
      name: rack.name,
      site: rack.site.id,
      location: rack.location?.id || "",
      tenant: rack.tenant?.id || "",
      status: rack.status?.value || "available",
      role: rack.role?.id || "",
      serial: rack.serial || "",
      asset_tag: rack.asset_tag || "",
      type: rack.type?.value || "4-post-cabinet",
      width: rack.width?.value,
      u_height: rack.u_height,
      desc_units: rack.desc_units,
      outer_width: rack.outer_width,
      outer_depth: rack.outer_depth,
      outer_unit: rack.outer_unit,
      weight: rack.weight,
      max_weight: rack.max_weight,
      weight_unit: rack.weight_unit,
      mounting_depth: rack.mounting_depth,
      airflow: rack.airflow?.value || "front-to-rear",
      facility_id: rack.facility_id || "",
      description: rack.description || "",
      comments: rack.comments || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (rack: NetBoxRack) => {
    if (!confirm(`Are you sure you want to delete "${rack.display}"?`)) return;
    try {
      await deleteNetBoxRackService(rack.id);
      toast.success("Rack deleted successfully");
      fetchRacks();
    } catch (error: any) {
      console.error("Error deleting rack:", error);
      toast.error(error?.message || "Failed to delete rack");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRacks.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedRacks.length} rack(s)?`)) return;
    
    try {
      await Promise.all(
        selectedRacks.map((r) => deleteNetBoxRackService(r.id))
      );
      toast.success(`Successfully deleted ${selectedRacks.length} rack(s)`);
      setSelectedRacks([]);
      fetchRacks();
    } catch (error: any) {
      console.error("Error deleting racks:", error);
      toast.error(error?.message || "Failed to delete racks");
    }
  };

  const handleSave = async (data: RackData) => {
    try {
      if (editingRack?.id) {
        // Update existing
        await updateNetBoxRackService(editingRack.id, {
          name: data.name,
          site: data.site as number,
          location: data.location === "" ? undefined : (data.location as number),
          tenant: data.tenant === "" ? undefined : (data.tenant as number),
          status: data.status,
          role: data.role === "" ? undefined : (data.role as number),
          serial: data.serial,
          asset_tag: data.asset_tag,
          type: data.type,
          width: data.width,
          u_height: data.u_height,
          desc_units: data.desc_units,
          outer_width: data.outer_width,
          outer_depth: data.outer_depth,
          outer_unit: data.outer_unit,
          weight: data.weight,
          max_weight: data.max_weight,
          weight_unit: data.weight_unit,
          mounting_depth: data.mounting_depth,
          airflow: data.airflow,
          facility_id: data.facility_id,
          description: data.description,
          comments: data.comments,
        });
        toast.success("Rack updated successfully");
      } else {
        // Create new
        await addNetBoxRack({
          name: data.name,
          site: data.site as number,
          location: data.location === "" ? undefined : (data.location as number),
          tenant: data.tenant === "" ? undefined : (data.tenant as number),
          status: data.status,
          role: data.role === "" ? undefined : (data.role as number),
          serial: data.serial,
          asset_tag: data.asset_tag,
          type: data.type,
          width: data.width,
          u_height: data.u_height,
          desc_units: data.desc_units,
          outer_width: data.outer_width,
          outer_depth: data.outer_depth,
          outer_unit: data.outer_unit,
          weight: data.weight,
          max_weight: data.max_weight,
          weight_unit: data.weight_unit,
          mounting_depth: data.mounting_depth,
          airflow: data.airflow,
          facility_id: data.facility_id,
          description: data.description,
          comments: data.comments,
        });
        toast.success("Rack created successfully");
      }
      setShowModal(false);
      fetchRacks();
    } catch (error: any) {
      console.error("Error saving rack:", error);
      throw error; // Re-throw to let modal handle the error
    }
  };

  // Define table columns
  const columns: TableColumn<NetBoxRack>[] = [
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
      key: "site",
      title: "Site",
      sortable: true,
      render: (value: any, rack: NetBoxRack) => (
        <span className="text-gray-300">
          {rack.site?.name || "-"}
        </span>
      ),
    },
    {
      key: "location",
      title: "Location",
      sortable: true,
      render: (value: any, rack: NetBoxRack) => (
        <span className="text-gray-300">
          {rack.location?.name || "-"}
        </span>
      ),
    },
    {
      key: "role",
      title: "Role",
      sortable: true,
      render: (value: any, rack: NetBoxRack) => (
        <span className="text-gray-300">
          {rack.role?.name || "-"}
        </span>
      ),
    },
    {
      key: "status",
      title: "Status",
      sortable: true,
      render: (value: any, rack: NetBoxRack) => {
        const status = rack.status?.value || "available";
        const statusColors: Record<string, string> = {
          available: "bg-green-500",
          reserved: "bg-yellow-500",
          deprecated: "bg-red-500",
          planned: "bg-blue-500",
        };
        return (
          <span
            className={`px-2 py-1 rounded text-xs text-white ${
              statusColors[status] || "bg-gray-500"
            }`}
          >
            {rack.status?.label || status}
          </span>
        );
      },
    },
    {
      key: "type",
      title: "Type",
      sortable: true,
      render: (value: any, rack: NetBoxRack) => (
        <span className="text-gray-300">
          {rack.type?.label || "-"}
        </span>
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
      key: "device_count",
      title: "Devices",
      sortable: true,
      render: (value: any) => (
        <span className="text-gray-300">{value || 0}</span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      sortable: false,
      render: (value: any, rack: NetBoxRack) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(rack);
            }}
            className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
            title="Edit rack"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(rack);
            }}
            className="p-1 text-red-400 hover:text-red-300 transition-colors"
            title="Delete rack"
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
        <span>Add Rack</span>
      </button>
    </div>
  );

  const bulkActions = selectedRacks.length > 0 ? (
    <div className="flex space-x-2">
      <button
        onClick={handleBulkDelete}
        className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded flex items-center space-x-1"
      >
        <Trash2 className="h-4 w-4" />
        <span>Delete ({selectedRacks.length})</span>
      </button>
    </div>
  ) : null;

  return (
    <div className="p-5 bg-gray-900 min-h-screen text-white space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Racks</h1>
      </div>

      {/* DataTable */}
      <DataTable
        data={racks}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search racks..."
        loading={loading}
        pagination={{
          enabled: true,
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: [10, 25, 50, 100],
          showQuickJumper: false,
          showTotal: true,
        }}
        onRefresh={fetchRacks}
        headerActions={headerActions}
        selectedRows={selectedRacks}
        onSelectionChange={setSelectedRacks}
        selectable={true}
        bulkActions={bulkActions}
        emptyMessage="No racks found"
        emptyIcon={<span className="text-4xl text-gray-600">📦</span>}
      />

      {/* Modal */}
      <RackFormModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSave}
        editData={editingRack}
      />
    </div>
  );
};

export default RacksPage;
