import React, { useState } from 'react';
import type { Device } from '../../types';
import { mockDevices } from '../../data/mockData';

interface DeviceSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeviceSelect: (device: Device) => void;
  currentDevice?: Device;
}

const DeviceSelectorModal: React.FC<DeviceSelectorModalProps> = ({
  isOpen,
  onClose,
  onDeviceSelect,
  currentDevice
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedVendor, setSelectedVendor] = useState<string>('');

  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'up': return 'bg-green-900 text-green-300';
      case 'down': return 'bg-red-900 text-red-300';
      case 'warning': return 'bg-yellow-900 text-yellow-300';
      case 'unknown': return 'bg-gray-700 text-gray-300';
      default: return 'bg-gray-700 text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'up': return '🟢';
      case 'down': return '🔴';
      case 'warning': return '🟡';
      case 'unknown': return '⚪';
      default: return '⚪';
    }
  };

  const filteredDevices = mockDevices.filter(device => {
    const matchesSearch = !searchQuery || 
      device.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.ipAddresses.some(ip => ip.includes(searchQuery));
    
    const matchesStatus = !selectedStatus || device.status === selectedStatus;
    const matchesVendor = !selectedVendor || device.vendor.toLowerCase().includes(selectedVendor.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesVendor;
  });

  const handleDeviceSelect = (device: Device) => {
    onDeviceSelect(device);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">Select Device</h2>
            <p className="text-gray-400">Choose a device to configure</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Current Device Display */}
        {currentDevice && (
          <div className="p-4 bg-blue-900/20 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-400">Currently selected:</div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">
                  {currentDevice.vendor === 'Cisco' ? '🔷' : 
                   currentDevice.vendor === 'Dell' ? '💻' : 
                   currentDevice.vendor === 'Fortinet' ? '🛡️' : '🖥️'}
                </span>
                <span className="font-medium text-white">{currentDevice.hostname}</span>
                <span className="text-gray-400">({currentDevice.vendor} {currentDevice.model})</span>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="p-6 border-b border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by hostname, vendor, model, or IP..."
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="up">Up</option>
                <option value="down">Down</option>
                <option value="warning">Warning</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Vendor
              </label>
              <input
                type="text"
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                placeholder="Filter by vendor..."
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Device List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="space-y-2">
              {filteredDevices.map((device) => (
                <div
                  key={device.id}
                  onClick={() => handleDeviceSelect(device)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    currentDevice?.id === device.id
                      ? 'bg-blue-900/30 border-blue-500'
                      : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-lg bg-gray-600 flex items-center justify-center">
                          <span className="text-lg">
                            {device.vendor === 'Cisco' ? '🔷' : 
                             device.vendor === 'Dell' ? '💻' : 
                             device.vendor === 'Fortinet' ? '🛡️' : '🖥️'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-white">{device.hostname}</div>
                        <div className="text-sm text-gray-400">
                          {device.vendor} {device.model} • {device.ipAddresses[0]}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(device.status)}`}>
                        <span className="mr-1">{getStatusIcon(device.status)}</span>
                        {device.status.toUpperCase()}
                      </span>
                      {currentDevice?.id === device.id && (
                        <span className="text-blue-400 text-sm font-medium">Selected</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredDevices.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-2">🔍</div>
                <div className="text-gray-400">No devices found</div>
                <div className="text-sm text-gray-500">Try adjusting your search filters</div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Clear selection
              onDeviceSelect(null as any);
              onClose();
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
          >
            Clear Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceSelectorModal;
