import React, { useState, useEffect } from "react";
import { X, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import {
  fetchNetBoxRegions,
  type NetBoxRegion,
} from "../../helpers/api/netboxDevicesApiHelper";
import { NETBOX_CONFIG } from "../../config/netbox";

export interface SiteData {
  id?: number;
  name: string;
  slug: string;
  status?: 'active' | 'planned' | 'retired';
  region?: number | "";
  description?: string;
  facility?: string;
  time_zone?: string;
  physical_address?: string;
  shipping_address?: string;
  latitude?: number;
  longitude?: number;
  comments?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SiteData) => Promise<void>;
  editData?: SiteData | null;
}

const SiteFormModal: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  editData,
}) => {
  const [form, setForm] = useState<SiteData>({
    name: "",
    slug: "",
    status: "active",
    region: "",
    description: "",
    facility: "",
    time_zone: "",
    physical_address: "",
    shipping_address: "",
    latitude: undefined,
    longitude: undefined,
    comments: "",
  });
  const [regions, setRegions] = useState<NetBoxRegion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm(editData);
    } else {
      setForm({
        name: "",
        slug: "",
        status: "active",
        region: "",
        description: "",
        facility: "",
        time_zone: "",
        physical_address: "",
        shipping_address: "",
        latitude: undefined,
        longitude: undefined,
        comments: "",
      });
    }
  }, [editData, open]);

  useEffect(() => {
    if (open) {
      fetchRegions();
    }
  }, [open]);

  const fetchRegions = async () => {
    setLoading(true);
    try {
      const data = await fetchNetBoxRegions(
        NETBOX_CONFIG.BASE_URL,
        NETBOX_CONFIG.TOKEN
      );
      setRegions(data);
    } catch (error: any) {
      console.error("Error fetching regions:", error);
      toast.error("Failed to load regions");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const handleChange = (
    field: keyof SiteData,
    value: string | number | undefined
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
      <div className="bg-gray-800 w-[600px] rounded-lg p-6 text-white space-y-4 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {editData ? "Edit Site" : "Add Site"}
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
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Site name"
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
                placeholder="site-slug"
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
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Status
              </label>
              <select
                value={form.status || "active"}
                onChange={(e) =>
                  handleChange("status", e.target.value as 'active' | 'planned' | 'retired')
                }
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                disabled={isSubmitting}
              >
                <option value="active">Active</option>
                <option value="planned">Planned</option>
                <option value="retired">Retired</option>
              </select>
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Region
              </label>
              {loading ? (
                <div className="text-gray-400 text-sm">Loading regions...</div>
              ) : (
                <select
                  value={form.region === "" ? "" : form.region}
                  onChange={(e) =>
                    handleChange(
                      "region",
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                  disabled={isSubmitting}
                >
                  <option value="">Select region</option>
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.display}
                    </option>
                  ))}
                </select>
              )}
            </div>
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
              rows={2}
              disabled={isSubmitting}
            />
          </div>

          {/* Facility */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Facility
            </label>
            <input
              type="text"
              placeholder="Facility name"
              value={form.facility}
              onChange={(e) => handleChange("facility", e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              disabled={isSubmitting}
            />
          </div>

          {/* Physical Address */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Physical Address
            </label>
            <textarea
              placeholder="Physical address"
              value={form.physical_address}
              onChange={(e) => handleChange("physical_address", e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              rows={2}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Latitude */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                placeholder="Latitude"
                value={form.latitude || ""}
                onChange={(e) =>
                  handleChange(
                    "latitude",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                disabled={isSubmitting}
              />
            </div>

            {/* Longitude */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                placeholder="Longitude"
                value={form.longitude || ""}
                onChange={(e) =>
                  handleChange(
                    "longitude",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Comments
            </label>
            <textarea
              placeholder="Comments"
              value={form.comments}
              onChange={(e) => handleChange("comments", e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              rows={2}
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

export default SiteFormModal;
