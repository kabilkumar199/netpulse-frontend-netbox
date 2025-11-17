import React, { useState, useEffect } from "react";

export interface DeviceRoleData {
  id?: number;
  name: string;
  slug: string;
  color: string;
  description?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DeviceRoleData) => void;
  editData?: DeviceRoleData | null;
}

const DeviceRoleFormModal: React.FC<Props> = ({ open, onClose, onSubmit, editData }) => {
  const [form, setForm] = useState<DeviceRoleData>({
    name: "",
    slug: "",
    color: "#10b981",
    description: "",
  });

  useEffect(() => {
    if (editData) setForm(editData);
  }, [editData]);

  if (!open) return null;

  const handleChange = (field: keyof DeviceRoleData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 w-96 rounded-lg p-6 text-white space-y-4 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold">
          {editData ? "Edit Device Role" : "Add Device Role"}
        </h2>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
          />
          <input
            type="text"
            placeholder="Slug"
            value={form.slug}
            onChange={(e) => handleChange("slug", e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
          />
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-300">Color:</label>
            <input
              type="color"
              value={form.color}
              onChange={(e) => handleChange("color", e.target.value)}
              className="w-10 h-10 rounded border border-gray-600"
            />
          </div>
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded"
          >
            {editData ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceRoleFormModal;
