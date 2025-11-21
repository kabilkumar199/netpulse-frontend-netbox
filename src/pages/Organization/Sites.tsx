import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import SiteFormModal, {
  type SiteData,
} from "../../components/modals/SiteFormModal";
import {
  getNetBoxSites,
  addNetBoxSite,
  updateNetBoxSiteService,
  deleteNetBoxSiteService,
} from "../../services/netboxSiteService";
import type { NetBoxSite } from "../../helpers/api/netboxDevicesApiHelper";
import {
  DataTable,
  type TableColumn,
} from "../../components/common/ui";

const Sites: React.FC = () => {
  const [sites, setSites] = useState<NetBoxSite[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSite, setEditingSite] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedSites, setSelectedSites] = useState<NetBoxSite[]>([]);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    setLoading(true);
    try {
      const data = await getNetBoxSites();
      setSites(data);
    } catch (error: any) {
      console.error("Error fetching sites:", error);
      toast.error(error?.message || "Failed to fetch sites");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingSite(null);
    setShowModal(true);
  };

  const handleEdit = (site: NetBoxSite) => {
    setEditingSite({
      id: site.id,
      name: site.name,
      slug: site.slug,
      status: site.status?.value || "active",
      region: site.region?.id || "",
      description: site.description || "",
      facility: site.facility || "",
      physical_address: site.physical_address || "",
      latitude: site.latitude,
      longitude: site.longitude,
      comments: site.comments || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (site: NetBoxSite) => {
    if (!confirm(`Are you sure you want to delete "${site.display}"?`)) return;
    try {
      await deleteNetBoxSiteService(site.id);
      toast.success("Site deleted successfully");
      fetchSites();
    } catch (error: any) {
      console.error("Error deleting site:", error);
      toast.error(error?.message || "Failed to delete site");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedSites.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedSites.length} site(s)?`)) return;
    
    try {
      await Promise.all(
        selectedSites.map((s) => deleteNetBoxSiteService(s.id))
      );
      toast.success(`Successfully deleted ${selectedSites.length} site(s)`);
      setSelectedSites([]);
      fetchSites();
    } catch (error: any) {
      console.error("Error deleting sites:", error);
      toast.error(error?.message || "Failed to delete sites");
    }
  };

  const handleSave = async (data: SiteData) => {
    try {
      if (editingSite?.id) {
        // Update existing
        await updateNetBoxSiteService(editingSite.id, {
          name: data.name,
          slug: data.slug,
          status: data.status,
          region: data.region === "" ? undefined : (data.region as number),
          description: data.description,
          facility: data.facility,
          physical_address: data.physical_address,
          latitude: data.latitude,
          longitude: data.longitude,
          comments: data.comments,
        });
        toast.success("Site updated successfully");
      } else {
        // Create new
        await addNetBoxSite({
          name: data.name,
          slug: data.slug,
          status: data.status,
          region: data.region === "" ? undefined : (data.region as number),
          description: data.description,
          facility: data.facility,
          physical_address: data.physical_address,
          latitude: data.latitude,
          longitude: data.longitude,
          comments: data.comments,
        });
        toast.success("Site created successfully");
      }
      setShowModal(false);
      fetchSites();
    } catch (error: any) {
      console.error("Error saving site:", error);
      throw error; // Re-throw to let modal handle the error
    }
  };

  // Define table columns
  const columns: TableColumn<NetBoxSite>[] = [
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
      key: "status",
      title: "Status",
      sortable: true,
      render: (value: any, site: NetBoxSite) => {
        const status = site.status?.value || "active";
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
            {site.status?.label || status}
          </span>
        );
      },
    },
    {
      key: "region",
      title: "Region",
      sortable: true,
      render: (value: any, site: NetBoxSite) => (
        <span className="text-gray-300">
          {site.region?.name || "-"}
        </span>
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
      render: (value: any, site: NetBoxSite) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(site);
            }}
            className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
            title="Edit site"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(site);
            }}
            className="p-1 text-red-400 hover:text-red-300 transition-colors"
            title="Delete site"
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
        <span>Add Site</span>
      </button>
    </div>
  );

  const bulkActions = selectedSites.length > 0 ? (
    <div className="flex space-x-2">
      <button
        onClick={handleBulkDelete}
        className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded flex items-center space-x-1"
      >
        <Trash2 className="h-4 w-4" />
        <span>Delete ({selectedSites.length})</span>
      </button>
    </div>
  ) : null;

  return (
    <div className="p-5 bg-gray-900 min-h-screen text-white space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Sites</h1>
      </div>

      {/* DataTable */}
      <DataTable
        data={sites}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search sites..."
        loading={loading}
        pagination={{
          enabled: true,
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: [10, 25, 50, 100],
          showQuickJumper: false,
          showTotal: true,
        }}
        onRefresh={fetchSites}
        headerActions={headerActions}
        selectedRows={selectedSites}
        onSelectionChange={setSelectedSites}
        selectable={true}
        bulkActions={bulkActions}
        emptyMessage="No sites found"
        emptyIcon={<span className="text-4xl text-gray-600">🏢</span>}
      />

      {/* Modal */}
      <SiteFormModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSave}
        editData={editingSite}
      />
    </div>
  );
};

export default Sites;
