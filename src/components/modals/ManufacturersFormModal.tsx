import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";

export interface ManufacturerData {
  id?: number;
  name: string;
  slug: string;
  description: string;
}

interface ManufacturersFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ManufacturerData) => Promise<void>;
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({ name: "", slug: "", description: "" });
    }
  }, [editData, open]);

  if (!open) return null;

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a name");
      return;
    }
    if (!formData.slug.trim()) {
      toast.error("Please enter a slug");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Don't show success toast here - let the page handle it
      onClose();
    } catch (error: any) {
      // Error toast is already shown by the page, but we can show it here too for immediate feedback
      // The error is re-thrown so the page can handle it
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 w-[500px] rounded-lg p-6 text-white space-y-4 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {editData ? "Edit Manufacturer" : "Add Manufacturer"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Manufacturer name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Slug <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="manufacturer-slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              rows={3}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <span>{editData ? "Update" : "Save"}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManufacturersFormModal;
