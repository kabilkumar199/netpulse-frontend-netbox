import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import LocationFormModal from "../../components/modals/LocationFormModal";
import { mockLocations } from "../../data/mockData";
import type { Location } from "../../types";

const Locations: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  const handleAdd = () => {
    setEditingLocation(null);
    setShowModal(true);
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this location?")) return;
    setLocations(locations.filter((loc) => loc.id !== id));
  };

  const handleSave = (location: Location) => {
    const exists = locations.find((loc) => loc.id === location.id);
    if (exists) {
      setLocations(
        locations.map((loc) => (loc.id === location.id ? location : loc))
      );
    } else {
      setLocations([location, ...locations]);
    }
    setShowModal(false);
  };

  return (
    <div className="p-5 bg-gray-900 min-h-screen text-white space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Locations</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} /> Add Location
        </button>
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
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">City</th>
              <th className="px-4 py-2">State</th>
              <th className="px-4 py-2">Country</th>
              <th className="px-4 py-2">Coordinates</th>
              <th className="px-4 py-2">Postal Code</th>
              <th className="px-4 py-2">Updated</th>
             </tr>
          </thead>

          <tbody>
            {locations.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-6 text-gray-400">
                  — No locations found —
                </td>
              </tr>
            ) : (
              locations.map((loc) => (
                <tr
                  key={loc.id}
                  className="border-t border-gray-700 hover:bg-gray-700/40 transition-colors"
                >
                  <td className="px-4 py-3">
                    <input type="checkbox" className="accent-emerald-500" />
                  </td>
                  <td className="px-4 py-3 text-white">{loc.name}</td>
                  <td className="px-4 py-3 text-gray-300">
                    {loc.address || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {loc.city || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {loc.state || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {loc.country || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {`${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {loc.postalCode || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {new Date(loc.updatedAt).toLocaleDateString()}
                  </td>
                   
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <LocationFormModal
          location={editingLocation}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Locations;
