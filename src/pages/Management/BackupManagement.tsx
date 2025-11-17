import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  Play, 
  Pause, 
  RotateCcw, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';

interface BackupManagementProps {
  onClose?: () => void;
}

const BackupManagement: React.FC<BackupManagementProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const backups = [
    {
      id: "backup-001",
      device: "Core-Router-01",
      deviceIp: "192.168.1.1",
      type: "Configuration",
      status: "completed",
      size: "2.4 MB",
      created: "2024-01-15 14:30:00",
      duration: "45s",
      version: "v1.2.3",
    },
    {
      id: "backup-002",
      device: "Distribution-SW-01",
      deviceIp: "192.168.1.10",
      type: "Full System",
      status: "completed",
      size: "15.7 MB",
      created: "2024-01-15 14:25:00",
      duration: "2m 15s",
      version: "v2.1.0",
    },
    {
      id: "backup-003",
      device: "Access-SW-05",
      deviceIp: "192.168.1.25",
      type: "Configuration",
      status: "failed",
      size: "-",
      created: "2024-01-15 14:20:00",
      duration: "30s",
      version: "-",
    },
    {
      id: "backup-004",
      device: "WiFi-Controller-01",
      deviceIp: "192.168.1.50",
      type: "Configuration",
      status: "running",
      size: "-",
      created: "2024-01-15 14:35:00",
      duration: "1m 20s",
      version: "-",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "running":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-green-500/10 text-green-500 border-green-500/20",
      failed: "bg-red-500/10 text-red-500 border-red-500/20",
      running: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    };
    return variants[status as keyof typeof variants] || "bg-gray-500/10 text-gray-500 border-gray-500/20";
  };

  const filteredBackups = backups.filter((backup) => {
    const matchesSearch = 
      backup.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
      backup.deviceIp.includes(searchTerm);
    const matchesType = selectedType === 'all' || backup.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || backup.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="flex h-screen bg-gray-900">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 shadow-sm border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-white">Configuration Backups</h1>
              <p className="text-sm text-gray-400">Manage device configuration backups and restore points</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-auto">

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Backups</p>
                  <p className="text-2xl font-bold text-white">1,247</p>
                </div>
                <Database className="h-8 w-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Success Rate</p>
                  <p className="text-2xl font-bold text-green-400">98.2%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Storage Used</p>
                  <p className="text-2xl font-bold text-white">2.4 GB</p>
                </div>
                <Database className="h-8 w-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Last Backup</p>
                  <p className="text-2xl font-bold text-white">2m ago</p>
                </div>
                <Clock className="h-8 w-8 text-orange-400" />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <input 
                placeholder="Search backups..." 
                className="w-64 px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
              <select className="px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">All Backups</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="running">Running</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Play className="h-4 w-4 mr-2 inline" />
                New Backup
              </button>
            </div>
          </div>

          {/* Backups Table */}
          <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Device</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {backups.map((backup) => (
                    <tr key={backup.id} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{backup.device}</div>
                          <div className="text-sm text-gray-400">{backup.deviceIp}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-300">
                          {backup.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(backup.status)}
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(backup.status)}`}>
                            {backup.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {backup.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {backup.created}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-400 hover:text-blue-300">
                            <Download className="h-4 w-4" />
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
        </div>
      </div>
    </div>
  );
};

export default BackupManagement;
