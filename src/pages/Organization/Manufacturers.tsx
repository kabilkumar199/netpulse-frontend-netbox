import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import ManufacturersActions from "../../components/forms/ManufacturersActions";
import ManufacturersToolbar from "../../components/shared/ManufacturersToolbar";
import ManufacturersFormModal, {
  type ManufacturerData,
} from "../../components/modals/ManufacturersFormModal";
import { mockManufacturers } from "../../data/mockData";

const ManufacturersPage: React.FC = () => {
  const [manufacturers, setManufacturers] =
    useState<ManufacturerData[]>(mockManufacturers);
  const [search, setSearch] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingManufacturer, setEditingManufacturer] =
    useState<ManufacturerData | null>(null);

  const handleAdd = () => {
    setEditingManufacturer(null);
    setShowModal(true);
  };

  const handleEdit = (manufacturer: ManufacturerData) => {
    setEditingManufacturer(manufacturer);
    setShowModal(true);
  };

  const handleDelete = (id?: number) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this manufacturer?")) return;
    setManufacturers(manufacturers.filter((m) => m.id !== id));
  };

  const handleSave = (data: ManufacturerData) => {
    if (editingManufacturer) {
      // Update
      setManufacturers((prev) =>
        prev.map((m) =>
          m.id === editingManufacturer.id ? { ...m, ...data } : m
        )
      );
    } else {
      // Add new
      setManufacturers([{ id: Date.now(), ...data }, ...manufacturers]);
    }
    setShowModal(false);
  };

  const filtered = manufacturers.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-5 bg-gray-900 min-h-screen text-white space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Manufacturers</h1>
        <ManufacturersToolbar onAdd={handleAdd} onSearch={setSearch} />
      </div>
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
              <th className="px-4 py-2">Description</th>
              {/* <th className="px-4 py-2 text-right">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400">
                  — No manufacturers found —
                </td>
              </tr>
            ) : (
              filtered.map((m) => (
                <tr
                  key={m.id}
                  className="border-t border-gray-700 hover:bg-gray-700/40 transition-colors"
                >
                  <td className="px-4 py-3">
                    <input type="checkbox" className="accent-emerald-500" />
                  </td>
                  <td className="px-4 py-3 text-white">{m.name}</td>
                  <td className="px-4 py-3 text-gray-300">{m.slug}</td>
                  <td className="px-4 py-3 text-gray-300">{m.description}</td>
                  {/* <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleEdit(m)}
                        className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* <ManufacturersActions
        onEdit={() => console.log("Bulk edit")}
        onDelete={() => console.log("Bulk delete")}
        onView={() => console.log("View selected")}
      /> */}

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
