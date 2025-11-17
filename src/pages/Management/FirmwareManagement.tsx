import React, { useState } from 'react';
import { 
  HardDrive, 
  Download, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Star, 
  FileText
} from 'lucide-react';

interface FirmwareManagementProps {
  onClose?: () => void;
}

const FirmwareManagement: React.FC<FirmwareManagementProps> = ({ onClose }) => {
  const [selectedFirmware, setSelectedFirmware] = useState<string | null>(null);

  const firmwareImages = [
    {
      id: "fw-001",
      name: "Cisco IOS XE 17.3.04a",
      version: "17.3.04a",
      vendor: "Cisco",
      deviceType: "Router",
      size: "847 MB",
      releaseDate: "2024-01-10",
      compatibility: ["ISR4000", "ASR1000", "CSR1000V"],
      status: "stable",
      downloads: 1247,
      rating: 4.8,
      description: "Latest stable release with security enhancements",
    },
    {
      id: "fw-002",
      name: "Juniper Junos 22.4R3",
      version: "22.4R3",
      vendor: "Juniper",
      deviceType: "Switch",
      size: "623 MB",
      releaseDate: "2024-01-08",
      compatibility: ["EX4300", "EX4600", "QFX5100"],
      status: "stable",
      downloads: 892,
      rating: 4.6,
      description: "Enhanced Layer 2/3 switching capabilities",
    },
    {
      id: "fw-003",
      name: "Aruba ArubaOS 8.11.2.1",
      version: "8.11.2.1",
      vendor: "Aruba",
      deviceType: "Wireless",
      size: "234 MB",
      releaseDate: "2024-01-12",
      compatibility: ["7000", "7200", "7200XM"],
      status: "beta",
      downloads: 156,
      rating: 4.2,
      description: "Beta release with WiFi 6E support",
    },
    {
      id: "fw-004",
      name: "Fortinet FortiOS 7.4.2",
      version: "7.4.2",
      vendor: "Fortinet",
      deviceType: "Firewall",
      size: "445 MB",
      releaseDate: "2024-01-05",
      compatibility: ["FortiGate-100F", "FortiGate-200F", "FortiGate-400F"],
      status: "stable",
      downloads: 2341,
      rating: 4.9,
      description: "Critical security updates and performance improvements",
    },
  ];

  const deployments = [
    {
      id: "deploy-001",
      device: "Core-Router-01",
      deviceIp: "192.168.1.1",
      firmware: "Cisco IOS XE 17.3.04a",
      status: "completed",
      progress: 100,
      startTime: "2024-01-15 10:30:00",
      duration: "12m 45s",
    },
    {
      id: "deploy-002",
      device: "Distribution-SW-02",
      deviceIp: "192.168.1.12",
      firmware: "Juniper Junos 22.4R3",
      status: "in-progress",
      progress: 67,
      startTime: "2024-01-15 11:15:00",
      duration: "8m 23s",
    },
    {
      id: "deploy-003",
      device: "Access-SW-08",
      deviceIp: "192.168.1.28",
      firmware: "Cisco IOS XE 17.3.04a",
      status: "failed",
      progress: 45,
      startTime: "2024-01-15 09:45:00",
      duration: "5m 12s",
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      stable: "bg-green-500/10 text-green-500 border-green-500/20",
      beta: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      deprecated: "bg-red-500/10 text-red-500 border-red-500/20",
      completed: "bg-green-500/10 text-green-500 border-green-500/20",
      "in-progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
      failed: "bg-red-500/10 text-red-500 border-red-500/20",
    }
    return variants[status as keyof typeof variants] || variants.stable
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-400" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-400" />
    }
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 shadow-sm border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-white">Firmware Management</h1>
              <p className="text-sm text-gray-400">Manage device firmware images and deployments</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Images</p>
                  <p className="text-2xl font-bold text-white">47</p>
                </div>
                <HardDrive className="h-8 w-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Active Deployments</p>
                  <p className="text-2xl font-bold text-blue-400">3</p>
                </div>
                <Clock className="h-8 w-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Success Rate</p>
                  <p className="text-2xl font-bold text-green-400">94.7%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Storage Used</p>
                  <p className="text-2xl font-bold text-white">12.4 GB</p>
                </div>
                <HardDrive className="h-8 w-8 text-orange-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Firmware Catalog */}
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700">
                <div className="px-6 py-4 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Firmware Catalog</h3>
                      <p className="text-sm text-gray-400">Available firmware images and versions</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Upload className="h-4 w-4 mr-2 inline" />
                      Upload Image
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <input placeholder="Search firmware..." className="flex-1 px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      <select className="px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="all">All</option>
                        <option value="stable">Stable</option>
                        <option value="beta">Beta</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      {firmwareImages.map((firmware) => (
                        <div key={firmware.id} className="p-4 border border-gray-600 rounded-lg hover:bg-gray-700 cursor-pointer bg-gray-700">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium text-white">{firmware.name}</h4>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(firmware.status)}`}>
                                  {firmware.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-300 mb-2">{firmware.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-400">
                                <span>{firmware.vendor}</span>
                                <span>{firmware.deviceType}</span>
                                <span>{firmware.size}</span>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span>{firmware.rating}</span>
                                </div>
                                <span>{firmware.downloads} downloads</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="p-2 text-gray-400 hover:text-gray-300">
                                <FileText className="h-4 w-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-gray-300">
                                <Download className="h-4 w-4" />
                              </button>
                              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Deploy</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Deployments */}
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700">
                <div className="px-6 py-4 border-b border-gray-700">
                  <h3 className="text-lg font-semibold text-white">Active Deployments</h3>
                  <p className="text-sm text-gray-400">Current firmware deployment operations</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {deployments.map((deployment) => (
                      <div key={deployment.id} className="p-4 border border-gray-600 rounded-lg bg-gray-700">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-white">{deployment.device}</h4>
                            <p className="text-sm text-gray-400">{deployment.deviceIp}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(deployment.status)}
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(deployment.status)}`}>
                              {deployment.status}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Firmware: {deployment.firmware}</span>
                            <span>{deployment.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${deployment.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Started: {deployment.startTime}</span>
                            <span>Duration: {deployment.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirmwareManagement;
