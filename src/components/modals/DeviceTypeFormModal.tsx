import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import {
  fetchNetBoxManufacturers,
  type NetBoxManufacturer,
} from "../../helpers/api/netboxDevicesApiHelper";
import { NETBOX_CONFIG } from "../../config/netbox";

export interface DeviceTypeData {
  id?: number;
  manufacturer: number | "";
  model: string;
  slug?: string;
  part_number?: string;
  u_height?: number;
  is_full_depth?: boolean;
  subdevice_role?: string;
  airflow?: string;
  weight?: number;
  weight_unit?: string;
  description?: string;
  comments?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DeviceTypeData) => Promise<void>;
  editData?: DeviceTypeData | null;
}

const DeviceTypeFormModal: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  editData,
}) => {
  const [form, setForm] = useState<DeviceTypeData>({
    manufacturer: "",
    model: "",
    slug: "",
    part_number: "",
    u_height: 1,
    is_full_depth: false,
    subdevice_role: "",
    airflow: "",
    weight: undefined,
    weight_unit: "kg",
    description: "",
    comments: "",
  });

  const [manufacturers, setManufacturers] = useState<NetBoxManufacturer[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm(editData);
    } else {
      setForm({
        manufacturer: "",
        model: "",
        slug: "",
        part_number: "",
        u_height: 1,
        is_full_depth: false,
        subdevice_role: "",
        airflow: "",
        weight: undefined,
        weight_unit: "kg",
        description: "",
        comments: "",
      });
    }
  }, [editData, open]);

  useEffect(() => {
    if (open) {
      fetchManufacturers();
    }
  }, [open]);

  const fetchManufacturers = async () => {
    setLoading(true);
    try {
      const data = await fetchNetBoxManufacturers(
        NETBOX_CONFIG.BASE_URL,
        NETBOX_CONFIG.TOKEN
      );
      setManufacturers(data);
    } catch (error: any) {
      console.error("Error fetching manufacturers:", error);
      toast.error("Failed to load manufacturers");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const handleChange = (
    field: keyof DeviceTypeData,
    value: string | number | boolean
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.manufacturer || form.manufacturer === "") {
      toast.error("Please select a manufacturer");
      return;
    }
    if (!form.model.trim()) {
      toast.error("Please enter a model name");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(form);
      toast.success(
        editData ? "Device type updated successfully" : "Device type created successfully"
      );
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Failed to save device type");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 w-[600px] rounded-lg p-6 text-white space-y-4 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {editData ? "Edit Device Type" : "Add Device Type"}
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
          {/* Manufacturer */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Manufacturer <span className="text-red-400">*</span>
            </label>
            {loading ? (
              <div className="text-gray-400 text-sm">Loading manufacturers...</div>
            ) : (
              <select
                value={form.manufacturer}
                onChange={(e) =>
                  handleChange("manufacturer", e.target.value === "" ? "" : Number(e.target.value))
                }
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                disabled={isSubmitting}
              >
                <option value="">Select manufacturer</option>
                {manufacturers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Model <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Model name"
              value={form.model}
              onChange={(e) => handleChange("model", e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              disabled={isSubmitting}
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Slug
            </label>
            <input
              type="text"
              placeholder="Auto-generated if empty"
              value={form.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              disabled={isSubmitting}
            />
          </div>

          {/* Part Number */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Part Number
            </label>
            <input
              type="text"
              placeholder="Part number"
              value={form.part_number}
              onChange={(e) => handleChange("part_number", e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* U Height */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                U Height
              </label>
              <input
                type="number"
                min="0"
                value={form.u_height || ""}
                onChange={(e) =>
                  handleChange("u_height", e.target.value ? Number(e.target.value) : 1)
                }
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                disabled={isSubmitting}
              />
            </div>

            {/* Is Full Depth */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Full Depth
              </label>
              <select
                value={form.is_full_depth ? "true" : "false"}
                onChange={(e) => handleChange("is_full_depth", e.target.value === "true")}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                disabled={isSubmitting}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>

          {/* Airflow */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Airflow
            </label>
            <select
              value={form.airflow || ""}
              onChange={(e) => handleChange("airflow", e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              disabled={isSubmitting}
            >
              <option value="">Select airflow</option>
              <option value="front-to-rear">Front to Rear</option>
              <option value="rear-to-front">Rear to Front</option>
              <option value="left-to-right">Left to Right</option>
              <option value="right-to-left">Right to Left</option>
              <option value="side-to-rear">Side to Rear</option>
              <option value="passive">Passive</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Weight
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.weight || ""}
                onChange={(e) =>
                  handleChange("weight", e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                disabled={isSubmitting}
              />
            </div>

            {/* Weight Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Weight Unit
              </label>
              <select
                value={form.weight_unit || "kg"}
                onChange={(e) => handleChange("weight_unit", e.target.value)}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                disabled={isSubmitting}
              >
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="lb">lb</option>
                <option value="oz">oz</option>
              </select>
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
              rows={3}
              disabled={isSubmitting}
            />
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

export default DeviceTypeFormModal;

