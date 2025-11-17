import React, { useState } from 'react';
import { 
  Wrench, 
  Search, 
  Plus, 
  Download, 
  Upload, 
  Zap, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Play, 
  Settings, 
  MoreHorizontal, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Activity, 
  FileText, 
  Calendar 
} from 'lucide-react';

interface ProvisioningManagementProps {
  onClose: () => void;
}

const ProvisioningManagement: React.FC<ProvisioningManagementProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showDeployDialog, setShowDeployDialog] = useState(false);

  const devices = [
    {
      id: "dev-001",
      name: "Core-Router-01",
      type: "Router",
      ip: "192.168.1.1",
      status: "provisioned",
      lastProvision: "2024-01-15 14:30:00",
      template: "Router-Base",
      version: "v1.2.3",
    },
    {
      id: "dev-002",
      name: "Distribution-SW-01",
      type: "Switch",
      ip: "192.168.1.10",
      status: "pending",
      lastProvision: "2024-01-15 14:25:00",
      template: "Switch-Base",
      version: "v2.1.0",
    },
    {
      id: "dev-003",
      name: "Access-SW-05",
      type: "Switch",
      ip: "192.168.1.25",
      status: "failed",
      lastProvision: "2024-01-15 14:20:00",
      template: "Switch-Base",
      version: "-",
    },
    {
      id: "dev-004",
      name: "WiFi-Controller-01",
      type: "Access Point",
      ip: "192.168.1.50",
      status: "provisioning",
      lastProvision: "2024-01-15 14:35:00",
      template: "AP-Base",
      version: "-",
    },
  ];

  const templates = [
    {
      id: "template-001",
      name: "Router-Base",
      description: "Basic router configuration with OSPF and BGP",
      devices: 45,
      lastUsed: "2024-01-15 14:30:00",
    },
    {
      id: "template-002",
      name: "Switch-Base",
      description: "Standard switch configuration with VLANs",
      devices: 78,
      lastUsed: "2024-01-15 14:25:00",
    },
    {
      id: "template-003",
      name: "AP-Base",
      description: "Access point configuration with WPA3",
      devices: 23,
      lastUsed: "2024-01-15 14:20:00",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "provisioned":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-400" />;
      case "provisioning":
        return <Clock className="h-4 w-4 text-blue-400" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      provisioned: "bg-green-500/10 text-green-500 border-green-500/20",
      failed: "bg-red-500/10 text-red-500 border-red-500/20",
      provisioning: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    };
    return variants[status as keyof typeof variants] || "bg-gray-500/10 text-gray-500 border-gray-500/20";
  };

  const filteredDevices = devices.filter((device) => {
    const matchesSearch = 
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.ip.includes(searchTerm);
    const matchesStatus = selectedStatus === 'all' || device.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex h-screen bg-gray-900">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 shadow-sm border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-white">Device Provisioning</h1>
              <p className="text-sm text-gray-400">Deploy and provision network devices</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-auto">

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Devices</p>
                  <p className="text-2xl font-bold text-white">146</p>
                </div>
                <Cpu className="h-8 w-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Provisioned</p>
                  <p className="text-2xl font-bold text-green-400">142</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Templates</p>
                  <p className="text-2xl font-bold text-white">8</p>
                </div>
                <Package className="h-8 w-8 text-purple-400" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-yellow-400">4</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <input 
                placeholder="Search devices..." 
                className="w-64 px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
              <select className="px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">All Status</option>
                <option value="provisioned">Provisioned</option>
                <option value="pending">Pending</option>
                <option value="provisioning">Provisioning</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4 mr-2 inline" />
                Deploy Template
              </button>
            </div>
          </div>

          {/* Devices Table */}
          <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Device</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Template</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Provision</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {devices.map((device) => (
                    <tr key={device.id} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{device.name}</div>
                          <div className="text-sm text-gray-400">{device.type} - {device.ip}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-300">
                          {device.template}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(device.status)}
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(device.status)}`}>
                            {device.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {device.lastProvision}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-400 hover:text-blue-300">
                            <Play className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-300">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Templates Section */}
          <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Provisioning Templates</h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <div key={template.id} className="border border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">{template.name}</h4>
                      <button className="text-blue-400 hover:text-blue-300">
                        <Settings className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">{template.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{template.devices} devices</span>
                      <span>{template.lastUsed}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProvisioningManagement;
