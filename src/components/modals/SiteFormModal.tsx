import React, { useState } from "react";
import { RefreshCw } from "lucide-react";
import type { Site } from "../../types";
import { mockLocations } from "../../data/mockData";

interface Props {
  site?: Site | null;
  onClose: () => void;
  onSave: (site: Site) => void;
}

const SiteFormModal: React.FC<Props> = ({ site, onClose, onSave }) => {
  const [formData, setFormData] = useState<Site>({
    id: site?.id || Date.now().toString(),
    name: site?.name || "",
    description: site?.description || "",
    location: site?.location || mockLocations[0],
    devices: site?.devices || [],
    subnets: site?.subnets || [],
    vlans: site?.vlans || [],
    createdAt: site?.createdAt || new Date(),
    updatedAt: site?.updatedAt || new Date(),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "location") {
      const loc = mockLocations.find((l) => l.id === value);
      if (loc) setFormData((prev) => ({ ...prev, location: loc }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleGenerateSlug = () => {
    if (formData.name) {
      const slug = formData.name.toLowerCase().replace(/\s+/g, "-");
      setFormData((prev) => ({ ...prev, name: formData.name })); // name stays the same
    }
  };

  const handleSubmit = () => {
    onSave({ ...formData, updatedAt: new Date() });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-slate-900 rounded-xl border border-slate-700 shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-100"
        >
          ✖
        </button>

        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold mb-2">
            {site ? "Edit Site" : "Add Site"}
          </h2>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Site Name"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
            />
          </div>

          {/* Slug (just for demonstration, optional) */}
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <div className="flex items-center">
              <input
                type="text"
                value={formData.name.toLowerCase().replace(/\s+/g, "-")}
                readOnly
                className="flex-1 bg-slate-800 border border-slate-700 rounded-l-lg px-3 py-2"
              />
              <button
                type="button"
                onClick={handleGenerateSlug}
                className="bg-slate-700 hover:bg-slate-600 border border-slate-700 rounded-r-lg px-3 py-2 flex items-center"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          {/* Location selection */}
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <select
              name="location"
              value={formData.location.id}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
            >
              {mockLocations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-slate-900 pb-2">
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
              {site ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteFormModal;
