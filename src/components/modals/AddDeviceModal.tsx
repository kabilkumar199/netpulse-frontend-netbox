import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import { Modal } from "../common/ui";
import { useNetBoxStore } from "../../store/netboxStore";
import type { AddDeviceModalProps } from "../../types";
import type { NetBoxDeviceCreatePayload } from "../../types/netbox";

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
}

interface NetBoxDeviceFormErrors {
  name?: string;
  device_type?: string;
  role?: string;
  site?: string;
  general?: string;
}

const AddDeviceModal: React.FC<AddDeviceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
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
  });

  const [errors, setErrors] = useState<NetBoxDeviceFormErrors>({});

  // Zustand store hooks
  const {
    deviceTypes,
    deviceRoles,
    sites,
    isLoadingOptions,
    isCreatingDevice,
    optionsError,
    createError,
    fetchDeviceOptions,
    createDevice,
    clearErrors,
  } = useNetBoxStore();

  // Fetch options when modal opens
  useEffect(() => {
    if (isOpen) {
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
    }
  }, [isOpen, fetchDeviceOptions, clearErrors]);

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
    setFormData((prev) => ({
      ...prev,
      [name]: name === "device_type" || name === "role" || name === "site" || name === "location"
        ? value === "" ? "" : Number(value)
        : value,
    }));

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

    if (!validateForm()) {
      return;
    }

    setErrors({});

    try {
      // Prepare NetBox device payload
      const devicePayload: NetBoxDeviceCreatePayload = {
        name: formData.name.trim(),
        device_type: formData.device_type as number,
        role: formData.role as number,
        site: formData.site as number,
        status: formData.status || "active",
      };

      // Add optional fields if provided
      if (formData.serial?.trim()) {
        devicePayload.serial = formData.serial.trim();
      }
      if (formData.asset_tag?.trim()) {
        devicePayload.asset_tag = formData.asset_tag.trim();
      }
      if (formData.location && typeof formData.location === 'number' && formData.location !== 0) {
        devicePayload.location = formData.location;
      }
      if (formData.description?.trim()) {
        devicePayload.description = formData.description.trim();
      }

      // Create device using Zustand store (saves response automatically)
      await createDevice(devicePayload);

      // Show success toast
      toast.success("Device added successfully to NetBox!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Reset form and close modal
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
      });
      
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error: any) {
      console.error("Error creating device:", error);

      // Get error message from store or error object
      const errorMessage =
        createError ||
        error?.message ||
        "Failed to add device to NetBox. Please try again.";

      // Show error toast
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });

      // Set form errors
      setErrors({
        general: errorMessage,
      });
    }
  };

  const handleClose = () => {
    if (!isCreatingDevice) {
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
      title="Add Device to NetBox"
      size="lg"
      theme="dark"
      closeOnBackdropClick={!isCreatingDevice}
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
        {isLoadingOptions && (
          <div className="mb-4 text-center text-gray-400">
            Loading device options...
          </div>
        )}

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
              disabled={isCreatingDevice || isLoadingOptions}
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
              disabled={isCreatingDevice || isLoadingOptions}
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
              disabled={isCreatingDevice || isLoadingOptions}
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
              disabled={isCreatingDevice || isLoadingOptions}
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
              disabled={isCreatingDevice || isLoadingOptions}
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
              disabled={isCreatingDevice || isLoadingOptions}
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
              disabled={isCreatingDevice || isLoadingOptions}
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

        {/* Description Field */}
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
            disabled={isCreatingDevice || isLoadingOptions}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isCreatingDevice}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreatingDevice || isLoadingOptions}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
          >
            {isCreatingDevice ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Adding...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddDeviceModal;
