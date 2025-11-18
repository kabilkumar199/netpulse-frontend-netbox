import React, { useState, useRef } from "react";
import { Upload, X, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { Modal } from "../common/ui"; 

interface ImportDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportDeviceModal: React.FC<ImportDeviceModalProps> = ({ isOpen, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setIsUploading(true);

    // 🕒 SIMULATE API CALL (Wait 2 seconds)
    setTimeout(() => {
      setIsUploading(false);
      toast.success(`Successfully imported devices from ${file.name}`);
      
      // Reset and close
      setFile(null);
      onClose();
    }, 2000);
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

        {/* Helper Text / Template Link */}
        <div className="flex items-center justify-between text-xs text-gray-400 px-1">
          <div className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>Max file size: 5MB</span>
          </div>
          <button className="text-blue-400 hover:underline flex items-center gap-1">
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