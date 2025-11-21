import React, { useState, useEffect } from "react";
import { X, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import {
  fetchNetBoxSites,
  fetchNetBoxLocations,
  fetchNetBoxRackRoles,
  type NetBoxSite,
  type NetBoxLocation,
  type NetBoxRackRole,
} from "../../helpers/api/netboxDevicesApiHelper";
import { NETBOX_CONFIG } from "../../config/netbox";

export interface RackData {
  id?: number;
  name: string;
  site: number | "";
  location?: number | "";
  tenant?: number | "";
  status?: 'available' | 'reserved' | 'deprecated' | 'planned';
  role?: number | "";
  serial?: string;
  asset_tag?: string;
  type?: '2-post-frame' | '4-post-frame' | '4-post-cabinet' | 'wall-frame' | 'wall-cabinet';
  width?: number;
  u_height?: number;
  desc_units?: boolean;
  outer_width?: number;
  outer_depth?: number;
  outer_unit?: 'mm' | 'in';
  weight?: number;
  max_weight?: number;
  weight_unit?: 'kg' | 'g' | 'lb' | 'oz';
  mounting_depth?: number;
  airflow?: 'front-to-rear' | 'rear-to-front' | 'left-to-right' | 'right-to-left' | 'side-to-rear' | 'passive' | 'mixed';
  facility_id?: string;
  description?: string;
  comments?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RackData) => Promise<void>;
  editData?: RackData | null;
}

const RackFormModal: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  editData,
}) => {
  const [form, setForm] = useState<RackData>({
    name: "",
    site: "",
    location: "",
    tenant: "",
    status: "available",
    role: "",
    serial: "",
    asset_tag: "",
    type: "4-post-cabinet",
    width: 19,
    u_height: 42,
    desc_units: false,
    outer_width: undefined,
    outer_depth: undefined,
    outer_unit: "mm",
    weight: undefined,
    max_weight: undefined,
    weight_unit: "kg",
    mounting_depth: undefined,
    airflow: "front-to-rear",
    facility_id: "",
    description: "",
    comments: "",
  });
  const [sites, setSites] = useState<NetBoxSite[]>([]);
  const [locations, setLocations] = useState<NetBoxLocation[]>([]);
  const [rackRoles, setRackRoles] = useState<NetBoxRackRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm(editData);
    } else {
      setForm({
        name: "",
        site: "",
        location: "",
        tenant: "",
        status: "available",
        role: "",
        serial: "",
        asset_tag: "",
        type: "4-post-cabinet",
        width: 19,
        u_height: 42,
        desc_units: false,
        outer_width: undefined,
        outer_depth: undefined,
        outer_unit: "mm",
        weight: undefined,
        max_weight: undefined,
        weight_unit: "kg",
        mounting_depth: undefined,
        airflow: "front-to-rear",
        facility_id: "",
        description: "",
        comments: "",
      });
    }
  }, [editData, open]);

  useEffect(() => {
    if (open) {
      fetchOptions();
    }
  }, [open]);

  const fetchOptions = async () => {
    setLoading(true);
    try {
      const [sitesData, locationsData, rolesData] = await Promise.all([
        fetchNetBoxSites(NETBOX_CONFIG.BASE_URL, NETBOX_CONFIG.TOKEN),
        fetchNetBoxLocations(NETBOX_CONFIG.BASE_URL, NETBOX_CONFIG.TOKEN),
        fetchNetBoxRackRoles(NETBOX_CONFIG.BASE_URL, NETBOX_CONFIG.TOKEN),
      ]);
      setSites(sitesData);
      setLocations(locationsData);
      setRackRoles(rolesData);
    } catch (error: any) {
      console.error("Error fetching options:", error);
      toast.error("Failed to load options");
    } finally {
      setLoading(false);
    }
  };

  // Filter locations by selected site
  const filteredLocations = form.site
    ? locations.filter((loc) => loc.site?.id === form.site)
    : locations;

  if (!open) return null;

  const handleChange = (
    field: keyof RackData,
    value: string | number | boolean | undefined
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Please enter a name");
      return;
    }
    if (!form.site || form.site === "") {
      toast.error("Please select a site");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (error: any) {
      // Error toast is already shown by the page
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 w-[700px] rounded-lg p-6 text-white space-y-4 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {editData ? "Edit Rack" : "Add Rack"}
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
              placeholder="Rack name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Site */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Site <span className="text-red-400">*</span>
              </label>
              {loading ? (
                <div className="text-gray-400 text-sm">Loading sites...</div>
              ) : (
                <select
                  value={form.site === "" ? "" : form.site}
                  onChange={(e) =>
                    handleChange(
                      "site",
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                  disabled={isSubmitting}
                >
                  <option value="">Select site</option>
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.display}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Location
              </label>
              {loading ? (
                <div className="text-gray-400 text-sm">Loading locations...</div>
              ) : (
                <select
                  value={form.location === "" ? "" : form.location}
                  onChange={(e) =>
                    handleChange(
                      "location",
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                  disabled={isSubmitting || !form.site}
                >
                  <option value="">Select location</option>
                  {filteredLocations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.display}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Status
              </label>
              <select
                value={form.status || "available"}
                onChange={(e) =>
                  handleChange("status", e.target.value as any)
                }
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                disabled={isSubmitting}
              >
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="deprecated">Deprecated</option>
                <option value="planned">Planned</option>
              </select>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Role
              </label>
              {loading ? (
                <div className="text-gray-400 text-sm">Loading roles...</div>
              ) : (
                <select
                  value={form.role === "" ? "" : form.role}
                  onChange={(e) =>
                    handleChange(
                      "role",
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                  disabled={isSubmitting}
                >
                  <option value="">Select role</option>
                  {rackRoles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.display}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Type
              </label>
              <select
                value={form.type || "4-post-cabinet"}
                onChange={(e) =>
                  handleChange("type", e.target.value as any)
                }
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                disabled={isSubmitting}
              >
                <option value="2-post-frame">2-post Frame</option>
                <option value="4-post-frame">4-post Frame</option>
                <option value="4-post-cabinet">4-post Cabinet</option>
                <option value="wall-frame">Wall Frame</option>
                <option value="wall-cabinet">Wall Cabinet</option>
              </select>
            </div>

            {/* Airflow */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Airflow
              </label>
              <select
                value={form.airflow || "front-to-rear"}
                onChange={(e) =>
                  handleChange("airflow", e.target.value as any)
                }
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                disabled={isSubmitting}
              >
                <option value="front-to-rear">Front to Rear</option>
                <option value="rear-to-front">Rear to Front</option>
                <option value="left-to-right">Left to Right</option>
                <option value="right-to-left">Right to Left</option>
                <option value="side-to-rear">Side to Rear</option>
                <option value="passive">Passive</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Width */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Width (inches)
              </label>
              <input
                type="number"
                placeholder="19"
                value={form.width || ""}
                onChange={(e) =>
                  handleChange(
                    "width",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                disabled={isSubmitting}
              />
            </div>

            {/* U Height */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                U Height
              </label>
              <input
                type="number"
                placeholder="42"
                value={form.u_height || ""}
                onChange={(e) =>
                  handleChange(
                    "u_height",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                disabled={isSubmitting}
              />
            </div>

            {/* Desc Units */}
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <input
                  type="checkbox"
                  checked={form.desc_units || false}
                  onChange={(e) => handleChange("desc_units", e.target.checked)}
                  className="accent-emerald-500"
                  disabled={isSubmitting}
                />
                Descending Units
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Serial */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Serial Number
              </label>
              <input
                type="text"
                placeholder="Serial number"
                value={form.serial || ""}
                onChange={(e) => handleChange("serial", e.target.value)}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                disabled={isSubmitting}
              />
            </div>

            {/* Asset Tag */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Asset Tag
              </label>
              <input
                type="text"
                placeholder="Asset tag"
                value={form.asset_tag || ""}
                onChange={(e) => handleChange("asset_tag", e.target.value)}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Facility ID */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Facility ID
            </label>
            <input
              type="text"
              placeholder="Facility ID"
              value={form.facility_id || ""}
              onChange={(e) => handleChange("facility_id", e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              disabled={isSubmitting}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              placeholder="Description"
              value={form.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              rows={2}
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
              value={form.comments || ""}
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

export default RackFormModal;
