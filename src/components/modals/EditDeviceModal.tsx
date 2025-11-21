import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, X } from "lucide-react";
import { toast } from "react-toastify";
import { Modal } from "../common/ui";
import { useNetBoxStore } from "../../store/netboxStore";
import { updateNetBoxDevice } from "../../helpers/api/netboxDevicesApiHelper";
import { NETBOX_CONFIG } from "../../config/netbox";
import type { NetBoxDevice, NetBoxDeviceCreatePayload } from "../../types/netbox";
import axios from "axios";
import { NETBOX_API_ENDPOINTS } from "../../helpers/url_helper";

interface EditDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  deviceId: number | null;
}

interface NetBoxDeviceFormData {
  name: string;
  device_type: number | "";
  role: number | "";
  site: number | "";
  serial?: string;
  asset_tag?: string;
  location?: number | "";
  status?: "offline" | "active" | "planned" | "staged" | "failed" | "inventory" | "decommissioning";
  description?: string;
  rack?: number | "";
  position?: number | "";
  face?: "front" | "rear" | "";
}

interface NetBoxDeviceFormErrors {
  name?: string;
  device_type?: string;
  role?: string;
  site?: string;
  general?: string;
}

const EditDeviceModal: React.FC<EditDeviceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  deviceId,
}) => {
  const [formData, setFormData] = useState<NetBoxDeviceFormData>({
    name: "",
    device_type: "",
    role: "",
    site: "",
    serial: "",
    asset_tag: "",
    location: "",
    status: "active",
    description: "",
    rack: "",
    position: "",
    face: "",
  });

  const [errors, setErrors] = useState<NetBoxDeviceFormErrors>({});
  const [isLoadingDevice, setIsLoadingDevice] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Zustand store hooks
  const {
    deviceTypes,
    deviceRoles,
    sites,
    isLoadingOptions,
    optionsError,
    fetchDeviceOptions,
    clearErrors,
  } = useNetBoxStore();

  // Fetch device details when modal opens
  useEffect(() => {
    if (isOpen && deviceId) {
      clearErrors();
      fetchDeviceOptions().catch((error) => {
        toast.error(
          error?.message || "Failed to load device options. Please try again.",
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
      });
      fetchDeviceDetails();
    }
  }, [isOpen, deviceId, fetchDeviceOptions, clearErrors]);

  // Fetch device details from NetBox
  const fetchDeviceDetails = async () => {
    if (!deviceId) return;

    setIsLoadingDevice(true);
    try {
      const response = await axios.get<NetBoxDevice>(
        `${NETBOX_CONFIG.BASE_URL}${NETBOX_API_ENDPOINTS.DELETE_DEVICE_URL}/${deviceId}/`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Token ${NETBOX_CONFIG.TOKEN}`,
          },
        }
      );

      const device = response.data;

      // Populate form with device data
      setFormData({
        name: device.name || "",
        device_type: device.device_type?.id || "",
        role: device.role?.id || "",
        site: device.site?.id || "",
        serial: device.serial || "",
        asset_tag: device.asset_tag || "",
        location: device.location?.id || "",
        status: device.status?.value || "active",
        description: device.description || "",
        rack: device.rack?.id || "",
        position: device.position || "",
        face: device.face || "",
      });
    } catch (error: any) {
      console.error("Error fetching device details:", error);
      toast.error(
        error?.response?.data?.detail ||
          error?.message ||
          "Failed to load device details",
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
      onClose();
    } finally {
      setIsLoadingDevice(false);
    }
  };

  // Show error toast when options error occurs
  useEffect(() => {
    if (optionsError) {
      toast.error(optionsError, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }, [optionsError]);

  const validateForm = (): boolean => {
    const newErrors: NetBoxDeviceFormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Device name is required";
    }

    // Device type validation
    if (formData.device_type === "" || formData.device_type === 0) {
      newErrors.device_type = "Device type is required";
    }

    // Role validation
    if (formData.role === "" || formData.role === 0) {
      newErrors.role = "Device role is required";
    }

    // Site validation
    if (formData.site === "" || formData.site === 0) {
      newErrors.site = "Site is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === "device_type" || name === "role" || name === "site" || name === "location" || name === "rack") {
        return {
          ...prev,
          [name]: value === "" ? "" : Number(value),
        };
      } else if (name === "position") {
        return {
          ...prev,
          [name]: value === "" ? "" : Number(value),
        };
      } else {
        return {
          ...prev,
          [name]: value,
        };
      }
    });

    // Clear error when user starts typing
    if (errors[name as keyof NetBoxDeviceFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!deviceId) {
      toast.error("Device ID is missing");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setErrors({});
    setIsUpdating(true);

    try {
      // Prepare NetBox device update payload
      const devicePayload: Partial<NetBoxDeviceCreatePayload> = {
        name: formData.name.trim(),
        device_type: formData.device_type as number,
        role: formData.role as number,
        site: formData.site as number,
        status: formData.status || "active",
      };

      // Add optional fields if provided
      if (formData.serial?.trim()) {
        devicePayload.serial = formData.serial.trim();
      } else {
        devicePayload.serial = "";
      }
      if (formData.asset_tag?.trim()) {
        devicePayload.asset_tag = formData.asset_tag.trim();
      } else {
        devicePayload.asset_tag = "";
      }
      if (formData.location && typeof formData.location === 'number' && formData.location !== 0) {
        devicePayload.location = formData.location;
      }
      if (formData.rack && typeof formData.rack === 'number' && formData.rack !== 0) {
        devicePayload.rack = formData.rack;
      }
      if (formData.position && typeof formData.position === 'number' && formData.position !== 0) {
        devicePayload.position = formData.position;
      }
      if (formData.face && formData.face !== "") {
        devicePayload.face = formData.face as 'front' | 'rear';
      }
      if (formData.description?.trim()) {
        devicePayload.description = formData.description.trim();
      }

      // Update device using NetBox API
      await updateNetBoxDevice(
        NETBOX_CONFIG.BASE_URL,
        NETBOX_CONFIG.TOKEN,
        deviceId,
        devicePayload
      );

      // Show success toast
      toast.success("Device updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error: any) {
      console.error("Error updating device:", error);

      // Get error message
      const errorMessage =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to update device. Please try again.";

      // Show error toast
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });

      // Set form errors
      setErrors({
        general: errorMessage,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    if (!isUpdating && !isLoadingDevice) {
      setFormData({
        name: "",
        device_type: "",
        role: "",
        site: "",
        serial: "",
        asset_tag: "",
        location: "",
        status: "active",
        description: "",
        rack: "",
        position: "",
        face: "",
      });
      setErrors({});
      clearErrors();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Device"
      size="lg"
      theme="dark"
      closeOnBackdropClick={!isUpdating && !isLoadingDevice}
    >
      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* General Error */}
        {errors.general && (
          <div className="mb-4 flex items-center space-x-2 rounded-md bg-red-900/50 border border-red-700 p-3 text-red-200">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{errors.general}</span>
          </div>
        )}

        {/* Loading State */}
        {isLoadingDevice && (
          <div className="mb-4 text-center text-gray-400">
            Loading device details...
          </div>
        )}

        {isLoadingOptions && !isLoadingDevice && (
          <div className="mb-4 text-center text-gray-400">
            Loading device options...
          </div>
        )}

        {!isLoadingDevice && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Device Name Field */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Device Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter device name"
                className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? "border-red-500" : "border-gray-600"
                }`}
                disabled={isUpdating || isLoadingDevice || isLoadingOptions}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Device Type Field */}
            <div className="mb-4">
              <label
                htmlFor="device_type"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Device Type <span className="text-red-400">*</span>
              </label>
              <select
                id="device_type"
                name="device_type"
                value={formData.device_type}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.device_type ? "border-red-500" : "border-gray-600"
                }`}
                disabled={isUpdating || isLoadingDevice || isLoadingOptions}
              >
                <option value="">Select device type</option>
                {deviceTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.display} ({type.manufacturer.name})
                  </option>
                ))}
              </select>
              {errors.device_type && (
                <p className="mt-1 text-sm text-red-400">{errors.device_type}</p>
              )}
            </div>

            {/* Device Role Field */}
            <div className="mb-4">
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Device Role <span className="text-red-400">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.role ? "border-red-500" : "border-gray-600"
                }`}
                disabled={isUpdating || isLoadingDevice || isLoadingOptions}
              >
                <option value="">Select device role</option>
                {deviceRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.display}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-400">{errors.role}</p>
              )}
            </div>

            {/* Site Field */}
            <div className="mb-4">
              <label
                htmlFor="site"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Site <span className="text-red-400">*</span>
              </label>
              <select
                id="site"
                name="site"
                value={formData.site}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.site ? "border-red-500" : "border-gray-600"
                }`}
                disabled={isUpdating || isLoadingDevice || isLoadingOptions}
              >
                <option value="">Select site</option>
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.display}
                  </option>
                ))}
              </select>
              {errors.site && (
                <p className="mt-1 text-sm text-red-400">{errors.site}</p>
              )}
            </div>

            {/* Serial Number Field */}
            <div className="mb-4">
              <label
                htmlFor="serial"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Serial Number
              </label>
              <input
                type="text"
                id="serial"
                name="serial"
                value={formData.serial}
                onChange={handleInputChange}
                placeholder="Enter serial number (optional)"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isUpdating || isLoadingDevice || isLoadingOptions}
              />
            </div>

            {/* Asset Tag Field */}
            <div className="mb-4">
              <label
                htmlFor="asset_tag"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Asset Tag
              </label>
              <input
                type="text"
                id="asset_tag"
                name="asset_tag"
                value={formData.asset_tag}
                onChange={handleInputChange}
                placeholder="Enter asset tag (optional)"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isUpdating || isLoadingDevice || isLoadingOptions}
              />
            </div>

            {/* Status Field */}
            <div className="mb-4">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isUpdating || isLoadingDevice || isLoadingOptions}
              >
                <option value="active">Active</option>
                <option value="offline">Offline</option>
                <option value="planned">Planned</option>
                <option value="staged">Staged</option>
                <option value="failed">Failed</option>
                <option value="inventory">Inventory</option>
                <option value="decommissioning">Decommissioning</option>
              </select>
            </div>
          </div>
        )}

        {/* Description Field */}
        {!isLoadingDevice && (
          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter device description (optional)"
              rows={3}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              disabled={isUpdating || isLoadingDevice || isLoadingOptions}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isUpdating || isLoadingDevice}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUpdating || isLoadingDevice || isLoadingOptions}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
          >
            {isUpdating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Updating...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Update</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditDeviceModal;

