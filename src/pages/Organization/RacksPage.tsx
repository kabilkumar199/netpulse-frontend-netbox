import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import RackFormModal from "../../components/modals/RackFormModal";
import { mockRacks } from "../../data/mockData";

export interface Rack {
  id: number;
  site: string;
  location: string;
  name: string;
  status: string;
  role: string;
  rackType: string;
  description?: string;
  airflow?: string;
  tags?: string[];
  facilityId?: string;
  serialNumber?: string;
  assetTag?: string;
  tenantGroup?: string;
  tenant?: string;
  formFactor?: string;
  width?: string;
  railWidth?: string;
  startUnit?: string;
  height?: string;
  outerWidth?: string;
  outerHeight?: string;
  outerDepth?: string;
  outerUnit?: string;
  weight?: string;
  maxWeight?: string;
  weightUnit?: string;
  mountingDepth?: string;
}

const RacksPage: React.FC = () => {
  const [racks, setRacks] = useState<Rack[]>(mockRacks);
  const [showModal, setShowModal] = useState(false);
  const [editingRack, setEditingRack] = useState<Rack | null>(null);

  const handleAdd = () => {
    setEditingRack(null);
    setShowModal(true);
  };

  const handleEdit = (rack: Rack) => {
    setEditingRack(rack);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this rack?")) return;
    setRacks(racks.filter((r) => r.id !== id));
  };

  const handleSave = (rack: Rack) => {
    if (editingRack) {
      setRacks(racks.map((r) => (r.id === rack.id ? rack : r)));
    } else {
      setRacks([{ ...rack, id: Date.now() }, ...racks]);
    }
    setShowModal(false);
  };

  return (
    <div className="p-5 bg-slate-900 min-h-screen text-white space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Racks</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg"
        >
          <Plus size={16} /> Add Rack
        </button>
      </div>

      <div className="bg-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-700 uppercase text-xs text-slate-300">
            <tr> <th className="px-4 py-3 w-10">
              <input type="checkbox" className="accent-emerald-500" />
            </th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Site</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Rack Type</th>
            </tr>
          </thead>
          <tbody>
            {racks.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-slate-400">
                  — No racks found —
                </td>
              </tr>
            ) : (
              racks.map((rack) => (
                <tr
                  key={rack.id}
                  className="border-t border-slate-700 hover:bg-slate-700/40"
                > <td className="px-4 py-3">
                  <input type="checkbox" className="accent-emerald-500" />
                </td>
                  <td className="px-4 py-3">{rack.name}</td>
                  <td className="px-4 py-3">{rack.site}</td>
                  <td className="px-4 py-3">{rack.location}</td>
                  <td className="px-4 py-3">{rack.role}</td>
                  <td className="px-4 py-3">{rack.status}</td>
                  <td className="px-4 py-3">{rack.rackType}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <RackFormModal
          rack={editingRack}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default RacksPage;
