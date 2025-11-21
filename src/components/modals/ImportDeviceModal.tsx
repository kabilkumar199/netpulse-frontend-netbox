import React, { useState, useRef } from "react";
import { Upload, X, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { Modal } from "../common/ui";
import { importNetBoxDevices } from "../../helpers/api/netboxDevicesApiHelper";
import { NETBOX_CONFIG } from "../../config/netbox";
import type { NetBoxDeviceCreatePayload } from "../../types/netbox";

interface ImportDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ImportDeviceModal: React.FC<ImportDeviceModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importProgress, setImportProgress] = useState<{ total: number; success: number; errors: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setImportProgress(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setImportProgress(null);
    }
  };

  /**
   * Parse JSON file and extract device data
   */
  const parseJSONFile = async (file: File): Promise<NetBoxDeviceCreatePayload[]> => {
    const text = await file.text();
    const data = JSON.parse(text);
    
    // Handle NetBox API response format (with results array)
    if (data.results && Array.isArray(data.results)) {
      return data.results.map((device: any) => ({
        name: device.name,
        device_type: device.device_type?.id || device.device_type,
        role: device.device_role?.id || device.role || device.device_role,
        site: device.site?.id || device.site,
        status: device.status?.value || device.status || 'active',
        platform: device.platform?.id || device.platform,
        tenant: device.tenant?.id || device.tenant,
        location: device.location?.id || device.location,
        rack: device.rack?.id || device.rack,
        position: device.position,
        face: device.face?.value || device.face,
        serial: device.serial,
        asset_tag: device.asset_tag,
        description: device.description,
        comments: device.comments,
      }));
    }
    
    // Handle array format
    if (Array.isArray(data)) {
      return data.map((device: any) => ({
        name: device.name,
        device_type: device.device_type?.id || device.device_type,
        role: device.device_role?.id || device.role || device.device_role,
        site: device.site?.id || device.site,
        status: device.status?.value || device.status || 'active',
        platform: device.platform?.id || device.platform,
        tenant: device.tenant?.id || device.tenant,
        location: device.location?.id || device.location,
        rack: device.rack?.id || device.rack,
        position: device.position,
        face: device.face?.value || device.face,
        serial: device.serial,
        asset_tag: device.asset_tag,
        description: device.description,
        comments: device.comments,
      }));
    }
    
    throw new Error('Invalid JSON format. Expected array or NetBox API response format.');
  };

  /**
   * Parse CSV file and convert to device payload
   */
  const parseCSVFile = async (file: File): Promise<NetBoxDeviceCreatePayload[]> => {
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      throw new Error('CSV file must have at least a header and one data row.');
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const devices: NetBoxDeviceCreatePayload[] = [];

    // Note: CSV import requires device_type, device_role, and site as IDs
    // For CSV import, users should provide IDs in the CSV file
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const device: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index];
        if (value) {
          // Handle numeric IDs
          if (['device_type', 'device_role', 'role', 'site', 'platform', 'tenant', 'location', 'rack', 'position'].includes(header)) {
            const numValue = parseInt(value, 10);
            device[header] = isNaN(numValue) ? value : numValue;
          } else {
            device[header] = value;
          }
        }
      });

      if (device.name) {
        devices.push({
          name: device.name,
          device_type: device.device_type,
          role: device.device_role || device.role,
          site: device.site,
          status: device.status || 'active',
          platform: device.platform,
          tenant: device.tenant,
          location: device.location,
          rack: device.rack,
          position: device.position,
          face: device.face,
          serial: device.serial,
          asset_tag: device.asset_tag,
          description: device.description,
          comments: device.comments,
        } as NetBoxDeviceCreatePayload);
      }
    }

    return devices;
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setIsUploading(true);
    setImportProgress(null);

    try {
      let devices: NetBoxDeviceCreatePayload[] = [];

      // Parse file based on extension
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'json') {
        devices = await parseJSONFile(file);
      } else if (fileExtension === 'csv') {
        devices = await parseCSVFile(file);
      } else {
        throw new Error('Unsupported file format. Please use JSON or CSV.');
      }

      if (devices.length === 0) {
        toast.error('No valid devices found in file.');
        setIsUploading(false);
        return;
      }

      setImportProgress({ total: devices.length, success: 0, errors: 0 });

      // Import devices using NetBox API
      const result = await importNetBoxDevices(
        NETBOX_CONFIG.BASE_URL,
        NETBOX_CONFIG.TOKEN,
        devices
      );

      setImportProgress({
        total: devices.length,
        success: result.success.length,
        errors: result.errors.length,
      });

      if (result.success.length > 0) {
        toast.success(
          `Successfully imported ${result.success.length} device(s)${result.errors.length > 0 ? ` (${result.errors.length} failed)` : ''}`
        );
      }

      if (result.errors.length > 0) {
        // Show detailed errors
        const errorMessages = result.errors.map(err => 
          `Row ${err.index + 1}: ${err.error}`
        ).join('\n');
        toast.error(`${result.errors.length} device(s) failed to import:\n${errorMessages}`, {
          autoClose: 10000,
        });
      }

      if (result.success.length > 0) {
        // Reset and close on success
        setFile(null);
        setImportProgress(null);
        onSuccess?.();
        onClose();
      }
    } catch (error: any) {
      console.error('Import error:', error);
      toast.error(
        error?.message || 'Failed to import devices. Please check the file format.'
      );
      setImportProgress(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setFile(null);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Import Devices"
      size="md" // Adjust based on your Modal component props
    >
      <div className="space-y-4">
        
        {/* Drag and Drop Area */}
        <div 
          className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-800/50"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept=".csv,.xlsx,.json"
            onChange={handleFileChange}
          />
          
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="p-3 bg-gray-700 rounded-full">
              <Upload className="h-6 w-6 text-blue-400" />
            </div>
            <div className="text-gray-300 font-medium">
              {file ? file.name : "Click to upload or drag and drop"}
            </div>
            <div className="text-xs text-gray-500">
              {file ? (
                <span className="text-green-400">{(file.size / 1024).toFixed(2)} KB</span>
              ) : (
                "Supported formats: CSV, Excel, JSON"
              )}
            </div>
          </div>
        </div>

        {/* Import Progress */}
        {importProgress && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Import Progress</span>
              <span className="text-sm text-gray-400">
                {importProgress.success + importProgress.errors} / {importProgress.total}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((importProgress.success + importProgress.errors) / importProgress.total) * 100}%`,
                }}
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-green-400">
                ✓ {importProgress.success} successful
              </span>
              {importProgress.errors > 0 && (
                <span className="text-red-400">
                  ✗ {importProgress.errors} failed
                </span>
              )}
            </div>
          </div>
        )}

        {/* Helper Text / Template Link */}
        <div className="flex items-center justify-between text-xs text-gray-400 px-1">
          <div className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>Max file size: 5MB • Supported: JSON, CSV</span>
          </div>
          <button
            onClick={() => {
              // Download example JSON template
              const template = {
                results: [
                  {
                    name: "device-01",
                    device_type: 1, // Device Type ID
                    device_role: 1, // Device Role ID
                    site: 1, // Site ID
                    status: "active",
                  },
                ],
              };
              const blob = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = "netbox_devices_template.json";
              link.click();
              URL.revokeObjectURL(url);
            }}
            className="text-blue-400 hover:underline flex items-center gap-1"
          >
            <FileSpreadsheet className="h-3 w-3" />
            Download Template
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Import Devices
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ImportDeviceModal;