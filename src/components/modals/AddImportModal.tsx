import React, { useState } from "react";
import { X, AlertCircle, CheckCircle } from "lucide-react";
import { useAppDispatch } from "../../store/hooks";
import { addDevice } from "../../store/slices/devicesSlice";
import { useCreateDeviceMutation } from "../../helpers/api/devicesApiHelper";


interface AddImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  deviceFile: File | null;
}

interface FormErrors {  
  general?: string;
  deviceFile?: File | null;
}

const AddImportModal: React.FC<AddImportModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const [createDevice, { isLoading }] = useCreateDeviceMutation();

  const [formData, setFormData] = useState<FormData>({
    deviceFile: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleFileChange = (file: File | undefined) => {
    if (!file) return;
    setFormData({ ...formData, deviceFile: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Create device data
      const deviceData = {
        vendor: "Unknown",
        model: "Unknown",
        os: "Unknown",
        status: "unknown" as const,
        labels: [],
        tags: [],
        lastSeen: new Date(),
        credentials: [],
        roles: [],
        interfaces: [],
        dependencies: [],
        monitors: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Use RTK Query mutation
      const result = await createDevice(deviceData).unwrap();

      // Also update local state
      dispatch(addDevice(result));

      // Reset form and close modal
      setFormData({
        deviceFile: null,
      });
      onClose();
    } catch (error: any) {
      console.error("Error creating device:", error);
      setErrors({
        general:
          error?.data?.message || "Failed to add device. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        deviceFile: null,
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0  bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">Import Device</h3>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-4">
            {/* General Error */}
            {errors.general && (
              <div className="mb-4 flex items-center space-x-2 rounded-md bg-red-50 p-3 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{errors.general}</span>
              </div>
            )}

            {/* File Upload Field */}
            <div className="mb-4">
              <label
                htmlFor="deviceFile"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Upload Device File <span className="text-red-500">*</span>
              </label>

              <div className="flex items-center justify-between border border-gray-300 rounded-md p-2 bg-gray-50 hover:bg-gray-100 cursor-pointer">
                <input
                  type="file"
                  id="deviceFile"
                  name="deviceFile"
                  accept=".csv,.txt,.json"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    handleFileChange(file);
                  }}
                  className="hidden"
                  disabled={isSubmitting}
                />

                <label
                  htmlFor="deviceFile"
                  className="flex items-center space-x-2 w-full cursor-pointer"
                >
                  <div className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                    Choose File
                  </div>
                  <span className="text-sm text-gray-700 truncate">
                    {formData.deviceFile?.name || "No file selected"}
                  </span>
                </label>
              </div>

              {/* {errors.deviceFile && (
                <p className="mt-1 text-sm text-red-600">{errors.deviceFile}</p>
              )} */}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting || isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Submit</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddImportModal;
