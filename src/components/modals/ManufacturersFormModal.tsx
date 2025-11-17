import React, { useState, useEffect } from "react";

export interface ManufacturerData {
  id?: number;
  name: string;
  slug: string;
  description: string;
}

interface ManufacturersFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ManufacturerData) => void;
  editData?: ManufacturerData | null;
}

const ManufacturersFormModal: React.FC<ManufacturersFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  editData,
}) => {
  const [formData, setFormData] = useState<ManufacturerData>({
    name: "",
    slug: "",
    description: "",
  });

  useEffect(() => {
    if (editData) setFormData(editData);
    else setFormData({ name: "", slug: "", description: "" });
  }, [editData]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">
          {editData ? "Edit Manufacturer" : "Add Manufacturer"}
        </h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full border px-3 py-2 rounded-lg"
          />
          <input
            type="text"
            placeholder="Slug"
            value={formData.slug}
            onChange={(e) =>
              setFormData({ ...formData, slug: e.target.value })
            }
            className="w-full border px-3 py-2 rounded-lg"
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(formData)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            {editData ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManufacturersFormModal;
