import React, { useState } from "react";
import type { Location } from "../../types";
 
interface Props {
  location?: Location | null;
  onClose: () => void;
  onSave: (location: Location) => void;
}

const LocationFormModal: React.FC<Props> = ({ location, onClose, onSave }) => {
  const [formData, setFormData] = useState<Location>({
    id: location?.id || Date.now().toString(),
    name: location?.name || "",
    latitude: location?.latitude || 0,
    longitude: location?.longitude || 0,
    address: location?.address || "",
    city: location?.city || "",
    state: location?.state || "",
    country: location?.country || "",
    postalCode: location?.postalCode || "",
    siteHierarchy: location?.siteHierarchy || [],
    mapZoom: location?.mapZoom || 10,
    mapTileReference: location?.mapTileReference || "",
    createdAt: location?.createdAt || new Date(),
    updatedAt: location?.updatedAt || new Date(),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev:any) => ({
      ...prev,
      [name]:
        name === "latitude" || name === "longitude" || name === "mapZoom"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.name) {
      alert("Name is required!");
      return;
    }

    const updatedData = {
      ...formData,
      updatedAt: new Date(),
    };

    onSave(updatedData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-lg w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-100"
        >
          ✖
        </button>

        <h2 className="text-2xl font-semibold mb-4">
          {location ? "Edit Location" : "Add Location"}
        </h2>

        <div className="space-y-3">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Location Name"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              placeholder="Street Address"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
            />
          </div>

          {/* City / State / Country */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city || ""}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input
                type="text"
                name="state"
                value={formData.state || ""}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country || ""}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Postal Code
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode || ""}
              onChange={handleChange}
              placeholder="ZIP / PIN Code"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
            />
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Latitude
              </label>
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                step="0.0001"
                onChange={handleChange}
                placeholder="Latitude"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Longitude
              </label>
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                step="0.0001"
                onChange={handleChange}
                placeholder="Longitude"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Map Zoom */}
          <div>
            <label className="block text-sm font-medium mb-1">Map Zoom</label>
            <input
              type="number"
              name="mapZoom"
              value={formData.mapZoom || 10}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
            />
          </div>

          {/* Map Tile Reference */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Map Tile Reference
            </label>
            <input
              type="text"
              name="mapTileReference"
              value={formData.mapTileReference || ""}
              onChange={handleChange}
              placeholder="Map Tile Info"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
            />
          </div>

          {/* Site Hierarchy */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Site Hierarchy (comma-separated)
            </label>
            <input
              type="text"
              name="siteHierarchy"
              value={formData.siteHierarchy?.join(", ") || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  siteHierarchy: e.target.value
                    .split(",")
                    .map((v) => v.trim())
                    .filter(Boolean),
                }))
              }
              placeholder="e.g. Region1, ZoneA, SiteX"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* Footer Buttons */}
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

export default LocationFormModal;
