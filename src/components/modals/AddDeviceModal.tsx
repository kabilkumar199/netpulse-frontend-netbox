import React, { useState } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import { Modal } from "../common/ui";
import { api } from "../../services/api/api";
import { API_ENDPOINTS } from "../../helpers/url_helper";
import type {
  Device,
  AddDeviceModalProps,
  AddDeviceFormData,
  AddDeviceFormErrors,
} from "../../types";
import { Eye, EyeOff } from "lucide-react";

const AddDeviceModal: React.FC<AddDeviceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<AddDeviceFormData>({
    ipAddress: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<AddDeviceFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: AddDeviceFormErrors = {};

    // IP Address validation
    if (!formData.ipAddress.trim()) {
      newErrors.ipAddress = "IP Address is required";
    } else {
      const ipRegex =
        /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (!ipRegex.test(formData.ipAddress)) {
        newErrors.ipAddress = "Please enter a valid IP address";
      }
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof AddDeviceFormErrors]) {
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

    setIsSubmitting(true);
    setErrors({});

    try {
      // Use axios API directly with formData as payload
      const result = await api.post<any>(
        API_ENDPOINTS.GET_DEVICES_URL,
        formData
      );

      if (result?.statusCode === 400) {
        toast.error(result?.message || "Failed to add device", {
          position: "top-right",
          autoClose: 5000,
        });
        setErrors({
          general: result?.message || "Failed to add device",
        });
      } else {
        // Show success toast
        toast.success("Device added successfully!", {
          position: "top-right",
          autoClose: 3000,
        });

        // Reset form and close modal
        setFormData({
          ipAddress: "",
          username: "",
          password: "",
        });
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      }
    } catch (error: any) {
      console.error("Error creating device:", error);

      // Get error message
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to add device. Please try again.";

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
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        ipAddress: "",
        username: "",
        password: "",
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Device"
      size="sm"
      theme="dark"
      closeOnBackdropClick={!isSubmitting}
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

        {/* IP Address Field */}
        <div className="mb-4">
          <label
            htmlFor="ipAddress"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            IP Address <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="ipAddress"
            name="ipAddress"
            value={formData.ipAddress}
            onChange={handleInputChange}
            placeholder="Enter IP address (e.g., 192.168.100.18)"
            className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.ipAddress ? "border-red-500" : "border-gray-600"
            }`}
            disabled={isSubmitting}
          />
          {errors.ipAddress && (
            <p className="mt-1 text-sm text-red-400">{errors.ipAddress}</p>
          )}
        </div>

        {/* Username Field */}
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Username <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.username ? "border-red-500" : "border-gray-600"
            }`}
            disabled={isSubmitting}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-400">{errors.username}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-6 relative">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Password <span className="text-red-400">*</span>
          </label>

          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white
      placeholder-gray-500 focus:outline-none focus:ring-2 
      focus:ring-blue-500 focus:border-blue-500 pr-10
      ${errors.password ? "border-red-500" : "border-gray-600"}
    `}
            disabled={isSubmitting}
          />

          {/* 🔥 Eye Icon */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-200"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>

          {errors.password && (
            <p className="mt-1 text-sm text-red-400">{errors.password}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
          >
            {isSubmitting ? (
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
