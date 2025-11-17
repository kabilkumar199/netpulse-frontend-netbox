import React, { useState } from "react";
// import type { Rack } from "../RacksPage";
import type { Rack } from "../../pages/Organization/RacksPage";
 
interface Props {
  rack: Rack | null;
  onClose: () => void;
  onSave: (rack: Rack) => void;
}

const RackFormModal: React.FC<Props> = ({ rack, onClose, onSave }) => {
  const [formData, setFormData] = useState<Rack>(
    rack || {
      id: Date.now(),
      site: "",
      location: "",
      name: "",
      status: "Active",
      role: "",
      rackType: "",
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(",").map((t) => t.trim());
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-xl p-6 w-[750px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {rack ? "Edit Rack" : "Add Rack"}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Site</label>
            <input
              name="site"
              value={formData.site}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm">Location</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2"
            >
              <option>Active</option>
              <option>Offline</option>
              <option>Planned</option>
            </select>
          </div>

          <div>
            <label className="text-sm">Role</label>
            <input
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm">Rack Type</label>
            <input
              name="rackType"
              value={formData.rackType}
              onChange={handleChange}
              placeholder="Select or enter rack type"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2"
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm">Description</label>
            <input
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2"
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm">Tags</label>
            <input
              name="tags"
              value={formData.tags?.join(", ") || ""}
              onChange={handleTagsChange}
              placeholder="Comma separated tags"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default RackFormModal;
