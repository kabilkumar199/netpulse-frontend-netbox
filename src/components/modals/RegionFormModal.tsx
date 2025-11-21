import React, { useState, useEffect } from "react";
import { X, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import {
  fetchNetBoxRegions,
  type NetBoxRegion,
} from "../../helpers/api/netboxDevicesApiHelper";
import { NETBOX_CONFIG } from "../../config/netbox";

export interface RegionData {
  id?: number;
  name: string;
  slug: string;
  description?: string;
  parent?: number | "";
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RegionData) => Promise<void>;
  editData?: RegionData | null;
}

const RegionFormModal: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  editData,
}) => {
  const [form, setForm] = useState<RegionData>({
    name: "",
    slug: "",
    description: "",
    parent: "",
  });
  const [parentRegions, setParentRegions] = useState<NetBoxRegion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm(editData);
    } else {
      setForm({
        name: "",
        slug: "",
        description: "",
        parent: "",
      });
    }
  }, [editData, open]);

  useEffect(() => {
    if (open) {
      fetchParentRegions();
    }
  }, [open]);

  const fetchParentRegions = async () => {
    setLoading(true);
    try {
      const data = await fetchNetBoxRegions(
        NETBOX_CONFIG.BASE_URL,
        NETBOX_CONFIG.TOKEN
      );
      // Filter out the current region if editing (to prevent circular references)
      const filtered = editData?.id
        ? data.filter((r) => r.id !== editData.id)
        : data;
      setParentRegions(filtered);
    } catch (error: any) {
      console.error("Error fetching parent regions:", error);
      toast.error("Failed to load parent regions");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const handleChange = (
    field: keyof RegionData,
    value: string | number | ""
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateSlug = () => {
    if (form.name) {
      const slug = form.name.toLowerCase().replace(/\s+/g, "-");
      handleChange("slug", slug);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Please enter a name");
      return;
    }
    if (!form.slug.trim()) {
      toast.error("Please enter a slug");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(form);
      // Don't show success toast here - let the page handle it
      onClose();
    } catch (error: any) {
      // Error toast is already shown by the page
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 w-[500px] rounded-lg p-6 text-white space-y-4 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {editData ? "Edit Region" : "Add Region"}
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
          {/* Parent Region */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Parent Region
            </label>
            {loading ? (
              <div className="text-gray-400 text-sm">Loading regions...</div>
            ) : (
              <select
                value={form.parent === "" ? "" : form.parent}
                onChange={(e) =>
                  handleChange(
                    "parent",
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                disabled={isSubmitting}
              >
                <option value="">None (Top-level region)</option>
                {parentRegions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.display}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Region name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              disabled={isSubmitting}
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Slug <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="region-slug"
                value={form.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                className="flex-1 p-2 rounded bg-gray-700 border border-gray-600 text-white"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={handleGenerateSlug}
                className="p-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded transition-colors"
                disabled={isSubmitting}
                title="Generate slug from name"
              >
                <RefreshCw size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              URL-friendly unique shorthand
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
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

export default RegionFormModal;


