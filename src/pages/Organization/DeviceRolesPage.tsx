import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import DeviceRolesToolbar from "../../components/shared/DeviceRolesToolbar";
import DeviceRoleFormModal, { type DeviceRoleData } from "../../components/modals/DeviceRoleFormModal";
import { mockDeviceRoles } from "../../data/mockData";
import type { DeviceRole } from "../../types";

// Convert mockDeviceRoles to DeviceRoleData format
const convertDeviceRoles = (deviceRoles: DeviceRole[]): DeviceRoleData[] => {
  return deviceRoles.map((role, index) => ({
    id: index + 1,
    name: role.name,
    slug: role.name.toLowerCase().replace(/\s+/g, '-'),
    color: role.name === 'Core Router' ? '#2563eb' : 
           role.name === 'Access Switch' ? '#10b981' : 
           role.name === 'Server' ? '#ef4444' : '#6b7280',
    description: role.description || '',
  }));
};

const DeviceRolesPage: React.FC = () => {
  const [roles, setRoles] = useState<DeviceRoleData[]>(convertDeviceRoles(mockDeviceRoles));
  const [search, setSearch] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingRole, setEditingRole] = useState<DeviceRoleData | null>(null);

  const handleAdd = () => {
    setEditingRole(null);
    setShowModal(true);
  };

  const handleEdit = (role: DeviceRoleData) => {
    setEditingRole(role);
    setShowModal(true);
  };

  const handleDelete = (id?: number) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this device role?")) return;
    setRoles(roles.filter((r) => r.id !== id));
  };

  const handleSave = (data: DeviceRoleData) => {
    if (editingRole) {
      setRoles((prev) =>
        prev.map((r) => (r.id === editingRole.id ? { ...r, ...data } : r))
      );
    } else {
      setRoles([{ id: Date.now(), ...data }, ...roles]);
    }
    setShowModal(false);
  };

  const filtered = roles.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-5 bg-gray-900 min-h-screen text-white space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Device Roles</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} /> Add Role
        </button>
      </div>

      <DeviceRolesToolbar onSearch={setSearch} />

      {/* Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-700 uppercase text-xs text-gray-300">
            <tr>
              <th className="px-4 py-3 w-10">
                <input type="checkbox" className="accent-emerald-500" />
              </th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Slug</th>
              <th className="px-4 py-2">Color</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  — No roles found —
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr
                  key={r.id}
                  className="border-t border-gray-700 hover:bg-gray-700/40 transition-colors"
                >
                  <td className="px-4 py-3">
                    <input type="checkbox" className="accent-emerald-500" />
                  </td>
                  <td className="px-4 py-3 text-white">{r.name}</td>
                  <td className="px-4 py-3 text-gray-300">{r.slug}</td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-block w-5 h-5 rounded-full border"
                      style={{ backgroundColor: r.color }}
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-300">{r.description}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(r)}
                        className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                        title="Edit role"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete role"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
