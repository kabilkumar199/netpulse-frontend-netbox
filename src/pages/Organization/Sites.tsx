import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import SiteFormModal from "../../components/modals/SiteFormModal";
import { mockSites } from "../../data/mockData";
import type { Site } from "../../types";

const Sites: React.FC = () => {
  const [sites, setSites] = useState<Site[]>(mockSites);
  const [showModal, setShowModal] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);

  const handleAdd = () => {
    setEditingSite(null);
    setShowModal(true);
  };

  const handleEdit = (site: Site) => {
    setEditingSite(site);
    setShowModal(true);
  };

  const handleDelete = (siteId: string) => {
    if (!confirm("Are you sure you want to delete this site?")) return;
    setSites((prev) => prev.filter((s) => s.id !== siteId));
  };

  const handleSave = (site: Site) => {
    const exists = sites.find((s) => s.id === site.id);
    if (exists) {
      setSites((prev) => prev.map((s) => (s.id === site.id ? site : s)));
    } else {
      setSites((prev) => [site, ...prev]);
    }
    setEditingSite(null);
    setShowModal(false);
  };

  return (
    <div className="p-5 bg-gray-900 min-h-screen text-white space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Sites</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} /> Add Site
        </button>
      </div>

      {/* Toolbar */}

      {/* Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-700 uppercase text-xs text-gray-300">
            <tr>
              <th className="px-4 py-3 w-10">
                <input type="checkbox" className="accent-emerald-500" />
              </th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Devices</th>
              <th className="px-4 py-2">Subnets</th>
              <th className="px-4 py-2">VLANs</th>
              <th className="px-4 py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {sites.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-400">
                  — No sites found —
                </td>
              </tr>
            ) : (
              sites.map((site) => (
                <tr
                  key={site.id}
                  className="border-t border-gray-700 hover:bg-gray-700/40 transition-colors"
                >
                  <td className="px-4 py-3">
                    <input type="checkbox" className="accent-emerald-500" />
                  </td>
                  <td className="px-4 py-3 text-white">{site.name}</td>
                  <td className="px-4 py-3 text-gray-300">
                    {site.location?.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {site.devices?.length ?? 0}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {site.subnets?.length ?? 0}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {site.vlans?.length ?? 0}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {site.description || "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Actions */}

      {/* Modal */}
      {showModal && (
        <SiteFormModal
          site={editingSite}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Sites;
