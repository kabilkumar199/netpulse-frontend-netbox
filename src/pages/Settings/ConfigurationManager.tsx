import React, { useState, useEffect } from 'react';
import type { DeviceConfiguration, Device, DevicePerformance, DevicePortLayout } from '../../types';
import { mockDevices } from '../../data/mockData';
import L2ServicesConfig from './L2ServicesConfig';
import DeviceSelectorModal from '../../components/modals/DeviceSelectorModal';
  
interface ConfigurationManagerProps {
  onClose?: () => void;
  selectedDevice?: Device;
}

interface ConfigStats {
  totalDevices: number;
  configuredDevices: number;
  recentChanges: number;
}

const ConfigurationManager: React.FC<ConfigurationManagerProps> = ({ onClose, selectedDevice: initialSelectedDevice }) => {
  const [selectedView, setSelectedView] = useState<'overview' | 'peripherals' | 'interface' | 'alarms' | 'vpls' | 'lldp' | 'syslog' | 'ctc-cpe' | 'config-files' | 'changes' | 'compliance' | 'l2-services'>(
    initialSelectedDevice ? 'l2-services' : 'overview'
  );
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(initialSelectedDevice || null);
  const [showDeviceSelector, setShowDeviceSelector] = useState(false);
  const [configStats, setConfigStats] = useState<ConfigStats | null>(null);
  const [deviceConfigs, setDeviceConfigs] = useState<DeviceConfiguration[]>([]);
  const [devicePerformance, setDevicePerformance] = useState<DevicePerformance | null>(null);
  const [devicePortLayout, setDevicePortLayout] = useState<DevicePortLayout | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Update selected view when device changes
  useEffect(() => {
    if (selectedDevice) {
      setSelectedView('l2-services');
    }
  }, [selectedDevice]);

  const handleDeviceSelect = (device: Device | null) => {
    setSelectedDevice(device);
    if (device) {
      setSelectedView('l2-services');
      generateDeviceStats(device);
    } else {
      setSelectedView('overview');
      setDevicePerformance(null);
      setDevicePortLayout(null);
    }
  };

  const generateDeviceStats = (device: Device) => {
    // Generate mock device performance data
    const performance: DevicePerformance = {
      deviceId: device.id,
      cpu: {
        usage: Math.floor(Math.random() * 80) + 10, // 10-90%
        cores: device.vendor === 'Cisco' ? 4 : 2,
        temperature: Math.floor(Math.random() * 20) + 45, // 45-65°C
        loadAverage: [Math.random() * 2, Math.random() * 2, Math.random() * 2]
      },
      memory: {
        total: device.vendor === 'Cisco' ? 8192 : 4096, // MB
        used: Math.floor(Math.random() * 4000) + 1000,
        free: 0, // Will be calculated
        usage: 0 // Will be calculated
      },
      uptime: Math.floor(Math.random() * 86400 * 30), // 0-30 days in seconds
      lastUpdated: new Date()
    };
    
    performance.memory.free = performance.memory.total - performance.memory.used;
    performance.memory.usage = Math.round((performance.memory.used / performance.memory.total) * 100);

    // Generate mock port layout data
    const portCount = device.vendor === 'Cisco' ? 48 : 24;
    const ports = Array.from({ length: portCount }, (_, i) => ({
      id: `port-${i + 1}`,
      name: `GigabitEthernet0/0/${i + 1}`,
      type: i < portCount - 2 ? 'ethernet' as const : i === portCount - 2 ? 'console' as const : 'management' as const,
      status: Math.random() > 0.3 ? 'up' as const : 'down' as const,
      speed: i < portCount - 2 ? 1000 : undefined,
      duplex: i < portCount - 2 ? 'full' as const : undefined,
      vlan: i < portCount - 2 ? Math.floor(Math.random() * 10) + 1 : undefined,
      description: i < portCount - 2 ? `Port ${i + 1}` : undefined,
      connectedTo: Math.random() > 0.5 ? `Device-${Math.floor(Math.random() * 5) + 1}` : undefined,
      utilization: Math.random() * 100
    }));

    const portLayout: DevicePortLayout = {
      deviceId: device.id,
      ports,
      totalPorts: portCount,
      usedPorts: ports.filter(p => p.status === 'up').length,
      availablePorts: ports.filter(p => p.status === 'down').length
    };

    setDevicePerformance(performance);
    setDevicePortLayout(portLayout);
  };

  // Generate mock configuration data
  useEffect(() => {
    const generateMockData = () => {
      setIsLoading(true);
      
      // Generate mock device configurations
      const mockConfigs: DeviceConfiguration[] = mockDevices.map(device => ({
        deviceId: device.id,
        configuration: `# Configuration for ${device.hostname}\nhostname ${device.hostname}\ninterface GigabitEthernet0/0/1\n description Connected to network\n ip address ${device.ipAddresses[0]} 255.255.255.0\n no shutdown\nsnmp-server community public RO\nsnmp-server community private RW`,
        version: `v${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 10)}`,
        timestamp: new Date(Date.now() - Math.random() * 86400000),
        checksum: `sha256:${Math.random().toString(36).substring(2, 15)}`,
        backupType: Math.random() > 0.5 ? 'scheduled' : 'manual',
        status: Math.random() > 0.8 ? 'backup' : 'current'
      }));
      
      setDeviceConfigs(mockConfigs);
      
      // Calculate statistics
      const totalDevices = mockDevices.length;
      const configuredDevices = mockConfigs.length;
      const recentChanges = Math.floor(Math.random() * 10);
      
      setConfigStats({
        totalDevices,
        configuredDevices,
        recentChanges
      });
      
      setIsLoading(false);
    };
    
    generateMockData();
    
    // Simulate real-time updates
    const interval = setInterval(generateMockData, 60000);
    return () => clearInterval(interval);
  }, []);

  const getDeviceByName = (deviceId: string) => {
    return mockDevices.find(d => d.id === deviceId);
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'text-green-400';
      case 'backup': return 'text-blue-400';
      case 'gold-standard': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };


  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleString();
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };


  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Configuration Manager
          </h2>
          <p className="text-gray-400">
            Manage device configurations, backups, and compliance
          </p>
        </div>
      </div>

      {/* Device Context Banner */}
      {selectedDevice && (
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center">
                  <span className="text-2xl">
                    {selectedDevice.vendor === 'Cisco' ? '🔷' : 
                     selectedDevice.vendor === 'Dell' ? '💻' : 
                     selectedDevice.vendor === 'Fortinet' ? '🛡️' : '🖥️'}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {selectedDevice.hostname}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-300">
                  <span>{selectedDevice.vendor} {selectedDevice.model}</span>
                  <span className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      selectedDevice.status === 'up' ? 'bg-green-400' : 
                      selectedDevice.status === 'down' ? 'bg-red-400' : 
                      selectedDevice.status === 'warning' ? 'bg-yellow-400' : 'bg-gray-400'
                    }`}></span>
                    {selectedDevice.status.toUpperCase()}
                  </span>
                  <span>{selectedDevice.ipAddresses[0]}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowDeviceSelector(true)}
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-500"
              >
                Change Device
              </button>
              <button
                onClick={() => handleDeviceSelect(null)}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-500"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Device Selection for L2 Services */}
      {!selectedDevice && selectedView === 'l2-services' && (
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-yellow-400 text-2xl">⚠️</span>
              <div>
                <h3 className="text-lg font-semibold text-white">No Device Selected</h3>
                <p className="text-yellow-300">Please select a device to configure L2 services</p>
              </div>
            </div>
            <button
              onClick={() => setShowDeviceSelector(true)}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500"
            >
              Select Device
            </button>
          </div>
        </div>
      )}

      {/* View Selector */}
      <div className="flex space-x-2 mb-6">
        {([
          { key: 'overview', label: 'Overview' },
          { key: 'peripherals', label: 'Peripherals' },
          { key: 'interface', label: 'Interface' },
          { key: 'alarms', label: 'Alarms' },
          { key: 'vpls', label: 'VPLS' },
          { key: 'lldp', label: 'LLDP' },
          { key: 'syslog', label: 'SysLog' },
          { key: 'ctc-cpe', label: 'CTC CPE' },
          { key: 'config-files', label: 'Config Files' },
          { key: 'changes', label: 'Changes' },
          { key: 'compliance', label: 'Compliance' },
          { key: 'l2-services', label: 'L2 Services' }
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSelectedView(key)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedView === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-300">Loading configuration data...</p>
          </div>
        </div>
      )}

      {/* Content */}
      {!isLoading && configStats && (
        <div className="space-y-6">
          {/* Overview */}
          {selectedView === 'overview' && (
            <div className="space-y-6">
              {/* General Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Total Devices
                </h3>
                <div className="text-2xl font-bold text-blue-400">
                  {configStats.totalDevices}
                </div>
                <div className="text-sm text-gray-400">
                  Managed devices
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Configured Devices
                </h3>
                <div className="text-2xl font-bold text-green-400">
                  {configStats.configuredDevices}
                </div>
                <div className="text-sm text-gray-400">
                    With configurations
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                    Recent Changes
                </h3>
                  <div className="text-2xl font-bold text-orange-400">
                    {configStats.recentChanges}
                </div>
                <div className="text-sm text-gray-400">
                    Last 24 hours
                  </div>
                </div>
              </div>

              {/* Device Inventory */}
              {selectedDevice && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <span>📋</span>
                    <span>Device Inventory - {selectedDevice.hostname}</span>
                </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-300">Serial Number</label>
                        <p className="text-white font-mono text-lg">{selectedDevice.serialNumber || 'N/A'}</p>
                </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300">MAC Address</label>
                        <p className="text-white font-mono text-lg">{selectedDevice.macAddress || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300">Hardware Version</label>
                        <p className="text-white text-lg">{selectedDevice.hardwareVersion || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-300">Software Version</label>
                        <p className="text-white text-lg">{selectedDevice.softwareVersion || selectedDevice.os}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300">Firmware Version</label>
                        <p className="text-white text-lg">{selectedDevice.firmwareVersion || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300">Device Type</label>
                        <p className="text-white text-lg capitalize">{selectedDevice.deviceType || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-300">Uptime</label>
                        <p className="text-white text-lg">
                          {selectedDevice.uptime ? 
                            `${Math.floor(selectedDevice.uptime / 86400)} days, ${Math.floor((selectedDevice.uptime % 86400) / 3600)} hours` : 
                            'N/A'
                          }
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300">Status</label>
                        <div className="mt-1">
                          <span className={`px-3 py-1 rounded text-sm font-medium ${
                            selectedDevice.status === 'up' ? 'bg-green-900 text-green-300' :
                            selectedDevice.status === 'down' ? 'bg-red-900 text-red-300' :
                            selectedDevice.status === 'warning' ? 'bg-yellow-900 text-yellow-300' :
                            'bg-gray-700 text-gray-400'
                          }`}>
                            {selectedDevice.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      {selectedDevice.isCTC && (
                        <div>
                          <label className="text-sm font-medium text-gray-300">CTC CPE</label>
                          <p className="text-blue-400 font-medium text-lg">✓ CTC Customer Premises Equipment</p>
                        </div>
                      )}
                </div>
              </div>

                  {/* CTC CPE Information */}
                  {selectedDevice.isCTC && selectedDevice.ctcInfo && (
                    <div className="mt-6 pt-6 border-t border-gray-600">
                      <h4 className="text-md font-semibold text-blue-400 mb-4 flex items-center space-x-2">
                        <span>🏢</span>
                        <span>CTC CPE Information</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-300">CPE ID</label>
                            <p className="text-white font-mono">{selectedDevice.ctcInfo.cpeId}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-300">Customer ID</label>
                            <p className="text-white font-mono">{selectedDevice.ctcInfo.customerId}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-300">Service Type</label>
                            <p className="text-white">{selectedDevice.ctcInfo.serviceType}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-300">Circuit ID</label>
                            <p className="text-white font-mono">{selectedDevice.ctcInfo.circuitId}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-300">Service Level</label>
                            <div className="mt-1">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                selectedDevice.ctcInfo.serviceLevel === 'platinum' ? 'bg-purple-900 text-purple-300' :
                                selectedDevice.ctcInfo.serviceLevel === 'gold' ? 'bg-yellow-900 text-yellow-300' :
                                selectedDevice.ctcInfo.serviceLevel === 'silver' ? 'bg-gray-600 text-gray-300' :
                                'bg-orange-900 text-orange-300'
                              }`}>
                                {selectedDevice.ctcInfo.serviceLevel.toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-300">Installation Date</label>
                            <p className="text-white">{selectedDevice.ctcInfo.installationDate.toLocaleDateString()}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-300">Last Maintenance</label>
                            <p className="text-white">
                              {selectedDevice.ctcInfo.lastMaintenance?.toLocaleDateString() || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-300">Customer</label>
                            <p className="text-white">{selectedDevice.ctcInfo.contactInfo.customerName}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Device Performance Stats */}
              {selectedDevice && devicePerformance && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <span>📊</span>
                    <span>Device Performance - {selectedDevice.hostname}</span>
                </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* CPU Usage */}
                    <div className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-300">CPU Usage</h4>
                        <span className="text-xs text-gray-400">{devicePerformance.cpu.cores} cores</span>
                </div>
                      <div className="text-2xl font-bold text-blue-400 mb-2">
                        {devicePerformance.cpu.usage}%
                </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${devicePerformance.cpu.usage}%` }}
                        ></div>
                      </div>
                      {devicePerformance.cpu.temperature && (
                        <div className="text-xs text-gray-400 mt-1">
                          Temp: {devicePerformance.cpu.temperature}°C
                        </div>
                      )}
              </div>

                    {/* Memory Usage */}
                    <div className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-300">Memory Usage</h4>
                        <span className="text-xs text-gray-400">
                          {Math.round(devicePerformance.memory.total / 1024)}GB
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-green-400 mb-2">
                        {devicePerformance.memory.usage}%
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-green-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${devicePerformance.memory.usage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {Math.round(devicePerformance.memory.used / 1024)}GB / {Math.round(devicePerformance.memory.total / 1024)}GB
                      </div>
                    </div>

                    {/* Uptime */}
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Uptime</h4>
                      <div className="text-2xl font-bold text-purple-400 mb-2">
                        {Math.floor(devicePerformance.uptime / 86400)}d
                      </div>
                      <div className="text-xs text-gray-400">
                        {Math.floor((devicePerformance.uptime % 86400) / 3600)}h {Math.floor((devicePerformance.uptime % 3600) / 60)}m
                      </div>
                    </div>

                    {/* Load Average */}
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Load Average</h4>
                      <div className="space-y-1">
                        {devicePerformance.cpu.loadAverage.map((load, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-400">{index === 0 ? '1m:' : index === 1 ? '5m:' : '15m:'}</span>
                            <span className="text-white">{load.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Port Layout */}
              {selectedDevice && devicePortLayout && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <span>🔌</span>
                    <span>Port Layout - {selectedDevice.hostname}</span>
                </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Total Ports</h4>
                      <div className="text-2xl font-bold text-blue-400">{devicePortLayout.totalPorts}</div>
                </div>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Used Ports</h4>
                      <div className="text-2xl font-bold text-green-400">{devicePortLayout.usedPorts}</div>
                </div>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Available Ports</h4>
                      <div className="text-2xl font-bold text-orange-400">{devicePortLayout.availablePorts}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {devicePortLayout.ports.map((port) => (
                      <div
                        key={port.id}
                        className={`p-3 rounded-lg border text-center ${
                          port.status === 'up' 
                            ? 'bg-green-900/20 border-green-500/30' 
                            : port.status === 'down'
                            ? 'bg-gray-700 border-gray-600'
                            : 'bg-red-900/20 border-red-500/30'
                        }`}
                      >
                        <div className="text-xs font-medium text-white mb-1">
                          {port.name.split('/').pop()}
                        </div>
                        <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                          port.status === 'up' ? 'bg-green-400' : 
                          port.status === 'down' ? 'bg-gray-400' : 'bg-red-400'
                        }`}></div>
                        <div className="text-xs text-gray-400">
                          {port.type === 'ethernet' ? 'Eth' : 
                           port.type === 'fiber' ? 'Fiber' :
                           port.type === 'console' ? 'Console' : 'Mgmt'}
                        </div>
                        {port.utilization && port.status === 'up' && (
                          <div className="text-xs text-blue-400 mt-1">
                            {port.utilization.toFixed(0)}%
                          </div>
                        )}
                      </div>
                    ))}
              </div>
            </div>
          )}

              {/* No Device Selected Message */}
              {!selectedDevice && (
                <div className="bg-gray-800 rounded-lg p-8 text-center">
                  <div className="text-gray-400 text-6xl mb-4">🖥️</div>
                  <h3 className="text-lg font-medium text-white mb-2">No Device Selected</h3>
                  <p className="text-gray-400 mb-4">
                    Select a device to view detailed performance statistics and port layout
                  </p>
                  <button
                    onClick={() => setShowDeviceSelector(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Select Device
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Peripherals */}
          {selectedView === 'peripherals' && (
            <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                  Device Peripherals
              </h3>
                {selectedDevice ? (
              <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Power Supplies</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">PSU 1:</span>
                            <span className="text-green-400">Online</span>
                            </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">PSU 2:</span>
                            <span className="text-green-400">Online</span>
                            </div>
                          </div>
                        </div>
                      <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Fans</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Fan 1:</span>
                            <span className="text-green-400">Normal</span>
                            </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Fan 2:</span>
                            <span className="text-green-400">Normal</span>
                          </div>
                            </div>
                          </div>
                      <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Temperature</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">CPU:</span>
                            <span className="text-green-400">45°C</span>
                            </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Ambient:</span>
                            <span className="text-green-400">32°C</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">Select a device to view peripheral information</p>
                            <button
                      onClick={() => setShowDeviceSelector(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                    >
                      Select Device
                            </button>
                          </div>
                )}
                        </div>
                      </div>
          )}

          {/* Interface */}
          {selectedView === 'interface' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Interface Configuration
                </h3>
                {selectedDevice ? (
                  <div className="space-y-6">
                    {/* Port Statistics Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Total Interfaces</h4>
                        <div className="text-2xl font-bold text-blue-400">{devicePortLayout?.totalPorts || 0}</div>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Active Interfaces</h4>
                        <div className="text-2xl font-bold text-green-400">{devicePortLayout?.usedPorts || 0}</div>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Available Interfaces</h4>
                        <div className="text-2xl font-bold text-orange-400">{devicePortLayout?.availablePorts || 0}</div>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Utilization</h4>
                        <div className="text-2xl font-bold text-purple-400">
                          {devicePortLayout ? Math.round((devicePortLayout.usedPorts / devicePortLayout.totalPorts) * 100) : 0}%
                        </div>
                      </div>
                    </div>

                    {/* Detailed Interface Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-600">
                            <th className="text-left py-2 text-gray-300">Interface</th>
                            <th className="text-left py-2 text-gray-300">Status</th>
                            <th className="text-left py-2 text-gray-300">VLAN</th>
                            <th className="text-left py-2 text-gray-300">Speed</th>
                            <th className="text-left py-2 text-gray-300">Duplex</th>
                            <th className="text-left py-2 text-gray-300">Utilization</th>
                            <th className="text-left py-2 text-gray-300">Bytes In/Out</th>
                            <th className="text-left py-2 text-gray-300">Errors</th>
                            <th className="text-left py-2 text-gray-300">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {devicePortLayout?.ports.slice(0, 15).map((port) => (
                            <tr key={port.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                              <td className="py-2 text-gray-300 font-mono">{port.name}</td>
                              <td className="py-2">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  port.status === 'up' ? 'bg-green-900 text-green-300' : 
                                  port.status === 'down' ? 'bg-gray-700 text-gray-400' :
                                  port.status === 'error' ? 'bg-red-900 text-red-300' :
                                  'bg-yellow-900 text-yellow-300'
                                }`}>
                                  {port.status}
                                </span>
                              </td>
                              <td className="py-2 text-gray-300">{port.vlan || '-'}</td>
                              <td className="py-2 text-gray-300">
                                {port.speed ? `${port.speed}Mbps` : '-'}
                              </td>
                              <td className="py-2 text-gray-300">
                                {port.duplex ? (
                                  <span className={`px-1 py-0.5 rounded text-xs ${
                                    port.duplex === 'full' ? 'bg-blue-900 text-blue-300' : 'bg-yellow-900 text-yellow-300'
                                  }`}>
                                    {port.duplex}
                                  </span>
                                ) : '-'}
                              </td>
                              <td className="py-2 text-gray-300">
                                {port.utilization ? (
                                  <div className="flex items-center space-x-2">
                                    <div className="w-16 bg-gray-600 rounded-full h-1.5">
                                      <div 
                                        className="bg-blue-400 h-1.5 rounded-full"
                                        style={{ width: `${Math.min(port.utilization, 100)}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-xs">{port.utilization.toFixed(0)}%</span>
                                  </div>
                                ) : '-'}
                              </td>
                              <td className="py-2 text-gray-300 text-xs">
                                {port.bytesIn && port.bytesOut ? (
                                  <div>
                                    <div>In: {(port.bytesIn / 1024 / 1024).toFixed(1)}MB</div>
                                    <div>Out: {(port.bytesOut / 1024 / 1024).toFixed(1)}MB</div>
                                  </div>
                                ) : '-'}
                              </td>
                              <td className="py-2 text-gray-300 text-xs">
                                {port.errorsIn !== undefined && port.errorsOut !== undefined ? (
                                  <div>
                                    <div className={port.errorsIn > 0 ? 'text-red-400' : 'text-green-400'}>
                                      In: {port.errorsIn}
                                    </div>
                                    <div className={port.errorsOut > 0 ? 'text-red-400' : 'text-green-400'}>
                                      Out: {port.errorsOut}
                                    </div>
                                  </div>
                                ) : '-'}
                              </td>
                              <td className="py-2 text-gray-300">{port.description || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Port Statistics Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-4">Port Utilization Distribution</h4>
                        <div className="space-y-2">
                          {devicePortLayout?.ports.filter(p => p.status === 'up').slice(0, 5).map((port) => (
                            <div key={port.id} className="flex items-center justify-between">
                              <span className="text-xs text-gray-400">{port.name}</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-20 bg-gray-600 rounded-full h-1.5">
                                  <div 
                                    className="bg-blue-400 h-1.5 rounded-full"
                                    style={{ width: `${Math.min(port.utilization || 0, 100)}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-white w-8">{port.utilization?.toFixed(0) || 0}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-4">Interface Types</h4>
                        <div className="space-y-2">
                          {['ethernet', 'fiber', 'console', 'management'].map((type) => {
                            const count = devicePortLayout?.ports.filter(p => p.type === type).length || 0;
                            return (
                              <div key={type} className="flex items-center justify-between">
                                <span className="text-xs text-gray-400 capitalize">{type}</span>
                                <span className="text-xs text-white">{count}</span>
                    </div>
                  );
                })}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">Select a device to view interface configuration</p>
                    <button
                      onClick={() => setShowDeviceSelector(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                    >
                      Select Device
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Alarms */}
          {selectedView === 'alarms' && (
            <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                  Device Alarms
              </h3>
                {selectedDevice ? (
              <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-400 text-xl">🔴</span>
                      <div>
                            <p className="text-red-400 font-medium">Critical</p>
                            <p className="text-2xl font-bold text-white">0</p>
                      </div>
                        </div>
                      </div>
                      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                          <span className="text-yellow-400 text-xl">🟡</span>
                          <div>
                            <p className="text-yellow-400 font-medium">Warning</p>
                            <p className="text-2xl font-bold text-white">2</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-green-400 text-xl">🟢</span>
                          <div>
                            <p className="text-green-400 font-medium">Normal</p>
                            <p className="text-2xl font-bold text-white">46</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-yellow-900/10 border border-yellow-500/20 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-yellow-400 font-medium">High CPU Usage</p>
                            <p className="text-gray-400 text-sm">CPU utilization above 80%</p>
                            </div>
                          <span className="text-yellow-400 text-xs">2 min ago</span>
                          </div>
                        </div>
                      <div className="bg-yellow-900/10 border border-yellow-500/20 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-yellow-400 font-medium">Port Down</p>
                            <p className="text-gray-400 text-sm">GigabitEthernet0/0/24</p>
                    </div>
                          <span className="text-yellow-400 text-xs">5 min ago</span>
                    </div>
                  </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">Select a device to view alarm information</p>
                    <button
                      onClick={() => setShowDeviceSelector(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                    >
                      Select Device
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VPLS */}
          {selectedView === 'vpls' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  VPLS Configuration
                </h3>
                {selectedDevice ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">VPLS Instances</h4>
                        <p className="text-2xl font-bold text-white">3</p>
                        <p className="text-gray-400 text-sm">Active instances</p>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">AC Interfaces</h4>
                        <p className="text-2xl font-bold text-white">8</p>
                        <p className="text-gray-400 text-sm">Attached circuits</p>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Pseudowires</h4>
                        <p className="text-2xl font-bold text-white">6</p>
                        <p className="text-gray-400 text-sm">Active tunnels</p>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-600">
                            <th className="text-left py-2 text-gray-300">VPLS Name</th>
                            <th className="text-left py-2 text-gray-300">State</th>
                            <th className="text-left py-2 text-gray-300">VE ID</th>
                            <th className="text-left py-2 text-gray-300">RD</th>
                            <th className="text-left py-2 text-gray-300">AC Count</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-700">
                            <td className="py-2 text-gray-300">VPLS-100</td>
                            <td className="py-2">
                              <span className="px-2 py-1 rounded text-xs bg-green-900 text-green-300">Up</span>
                            </td>
                            <td className="py-2 text-gray-300">100</td>
                            <td className="py-2 text-gray-300">65000:100</td>
                            <td className="py-2 text-gray-300">3</td>
                          </tr>
                          <tr className="border-b border-gray-700">
                            <td className="py-2 text-gray-300">VPLS-200</td>
                            <td className="py-2">
                              <span className="px-2 py-1 rounded text-xs bg-green-900 text-green-300">Up</span>
                            </td>
                            <td className="py-2 text-gray-300">200</td>
                            <td className="py-2 text-gray-300">65000:200</td>
                            <td className="py-2 text-gray-300">2</td>
                          </tr>
                          <tr className="border-b border-gray-700">
                            <td className="py-2 text-gray-300">VPLS-300</td>
                            <td className="py-2">
                              <span className="px-2 py-1 rounded text-xs bg-yellow-900 text-yellow-300">Down</span>
                            </td>
                            <td className="py-2 text-gray-300">300</td>
                            <td className="py-2 text-gray-300">65000:300</td>
                            <td className="py-2 text-gray-300">3</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">Select a device to view VPLS configuration</p>
                    <button
                      onClick={() => setShowDeviceSelector(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                    >
                      Select Device
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* LLDP */}
          {selectedView === 'lldp' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  LLDP Neighbors
                </h3>
                {selectedDevice ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Total Neighbors</h4>
                        <p className="text-2xl font-bold text-white">12</p>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Cisco Devices</h4>
                        <p className="text-2xl font-bold text-white">8</p>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Other Vendors</h4>
                        <p className="text-2xl font-bold text-white">4</p>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-600">
                            <th className="text-left py-2 text-gray-300">Local Interface</th>
                            <th className="text-left py-2 text-gray-300">Neighbor Device</th>
                            <th className="text-left py-2 text-gray-300">Neighbor Interface</th>
                            <th className="text-left py-2 text-gray-300">Capabilities</th>
                            <th className="text-left py-2 text-gray-300">TTL</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-700">
                            <td className="py-2 text-gray-300">Gig0/0/1</td>
                            <td className="py-2 text-gray-300">SW-01</td>
                            <td className="py-2 text-gray-300">Gig0/0/24</td>
                            <td className="py-2 text-gray-300">Bridge, Router</td>
                            <td className="py-2 text-gray-300">120</td>
                          </tr>
                          <tr className="border-b border-gray-700">
                            <td className="py-2 text-gray-300">Gig0/0/2</td>
                            <td className="py-2 text-gray-300">SW-02</td>
                            <td className="py-2 text-gray-300">Gig0/0/23</td>
                            <td className="py-2 text-gray-300">Bridge</td>
                            <td className="py-2 text-gray-300">120</td>
                          </tr>
                          <tr className="border-b border-gray-700">
                            <td className="py-2 text-gray-300">Gig0/0/3</td>
                            <td className="py-2 text-gray-300">RT-01</td>
                            <td className="py-2 text-gray-300">Gig0/0/0</td>
                            <td className="py-2 text-gray-300">Router</td>
                            <td className="py-2 text-gray-300">120</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">Select a device to view LLDP neighbors</p>
                    <button
                      onClick={() => setShowDeviceSelector(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                    >
                      Select Device
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SysLog */}
          {selectedView === 'syslog' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  System Logs
                </h3>
                {selectedDevice ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex space-x-2">
                        <select className="bg-gray-700 text-white px-3 py-1 rounded text-sm">
                          <option>All Levels</option>
                          <option>Critical</option>
                          <option>Warning</option>
                          <option>Info</option>
                        </select>
                        <select className="bg-gray-700 text-white px-3 py-1 rounded text-sm">
                          <option>Last 1 Hour</option>
                          <option>Last 24 Hours</option>
                          <option>Last 7 Days</option>
                        </select>
                      </div>
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-500">
                        Refresh
                      </button>
                    </div>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      <div className="bg-gray-700 rounded p-3">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-red-400 text-xs font-medium">CRITICAL</span>
                          <span className="text-gray-400 text-xs">2024-01-15 14:30:25</span>
                        </div>
                        <p className="text-white text-sm">System temperature exceeded threshold</p>
                      </div>
                      <div className="bg-gray-700 rounded p-3">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-yellow-400 text-xs font-medium">WARNING</span>
                          <span className="text-gray-400 text-xs">2024-01-15 14:25:10</span>
                        </div>
                        <p className="text-white text-sm">High CPU utilization detected</p>
                      </div>
                      <div className="bg-gray-700 rounded p-3">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-blue-400 text-xs font-medium">INFO</span>
                          <span className="text-gray-400 text-xs">2024-01-15 14:20:05</span>
                        </div>
                        <p className="text-white text-sm">Interface Gig0/0/1 state changed to up</p>
                      </div>
                      <div className="bg-gray-700 rounded p-3">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-green-400 text-xs font-medium">INFO</span>
                          <span className="text-gray-400 text-xs">2024-01-15 14:15:30</span>
                        </div>
                        <p className="text-white text-sm">Configuration saved successfully</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">Select a device to view system logs</p>
                    <button
                      onClick={() => setShowDeviceSelector(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                    >
                      Select Device
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CTC CPE */}
          {selectedView === 'ctc-cpe' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  CTC CPE Management
                </h3>
                <div className="space-y-6">
                  {/* CTC CPE List */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-600">
                          <th className="text-left py-2 text-gray-300">CPE ID</th>
                          <th className="text-left py-2 text-gray-300">Customer</th>
                          <th className="text-left py-2 text-gray-300">Service Type</th>
                          <th className="text-left py-2 text-gray-300">Service Level</th>
                          <th className="text-left py-2 text-gray-300">Status</th>
                          <th className="text-left py-2 text-gray-300">Last Seen</th>
                          <th className="text-left py-2 text-gray-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockDevices.filter(device => device.isCTC).map((device) => (
                          <tr key={device.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                            <td className="py-2 text-gray-300 font-mono">{device.ctcInfo?.cpeId}</td>
                            <td className="py-2 text-gray-300">{device.ctcInfo?.contactInfo.customerName}</td>
                            <td className="py-2 text-gray-300">{device.ctcInfo?.serviceType}</td>
                            <td className="py-2 text-gray-300">
                              <span className={`px-2 py-1 rounded text-xs ${
                                device.ctcInfo?.serviceLevel === 'platinum' ? 'bg-purple-900 text-purple-300' :
                                device.ctcInfo?.serviceLevel === 'gold' ? 'bg-yellow-900 text-yellow-300' :
                                device.ctcInfo?.serviceLevel === 'silver' ? 'bg-gray-600 text-gray-300' :
                                'bg-orange-900 text-orange-300'
                              }`}>
                                {device.ctcInfo?.serviceLevel.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                device.status === 'up' ? 'bg-green-900 text-green-300' :
                                device.status === 'down' ? 'bg-red-900 text-red-300' :
                                device.status === 'warning' ? 'bg-yellow-900 text-yellow-300' :
                                'bg-gray-700 text-gray-400'
                              }`}>
                                {device.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-2 text-gray-300">{device.lastSeen.toLocaleString()}</td>
                            <td className="py-2">
                              <button
                                onClick={() => handleDeviceSelect(device)}
                                className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-500 mr-2"
                              >
                                Configure
                              </button>
                              <button className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-500">
                                Monitor
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* CTC CPE Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Total CPEs</h4>
                      <div className="text-2xl font-bold text-blue-400">
                        {mockDevices.filter(device => device.isCTC).length}
                      </div>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Online CPEs</h4>
                      <div className="text-2xl font-bold text-green-400">
                        {mockDevices.filter(device => device.isCTC && device.status === 'up').length}
                      </div>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Offline CPEs</h4>
                      <div className="text-2xl font-bold text-red-400">
                        {mockDevices.filter(device => device.isCTC && device.status === 'down').length}
                      </div>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Warning CPEs</h4>
                      <div className="text-2xl font-bold text-yellow-400">
                        {mockDevices.filter(device => device.isCTC && device.status === 'warning').length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Config Files */}
          {selectedView === 'config-files' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Configuration File Management
                </h3>
                {selectedDevice ? (
                  <div className="space-y-6">
                    {/* Upload Config File */}
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="text-md font-medium text-white mb-4">Upload Configuration File</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Select Configuration File
                          </label>
                          <input
                            type="file"
                            accept=".txt,.cfg,.conf"
                            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Description (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="Enter description for this configuration..."
                            className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500">
                            Upload & Apply
                          </button>
                          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500">
                            Upload Only
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Configuration Files List */}
                    <div>
                      <h4 className="text-md font-medium text-white mb-4">Configuration Files for {selectedDevice.hostname}</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-600">
                              <th className="text-left py-2 text-gray-300">Filename</th>
                              <th className="text-left py-2 text-gray-300">Size</th>
                              <th className="text-left py-2 text-gray-300">Uploaded</th>
                              <th className="text-left py-2 text-gray-300">Status</th>
                              <th className="text-left py-2 text-gray-300">Description</th>
                              <th className="text-left py-2 text-gray-300">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-gray-700 hover:bg-gray-700/50">
                              <td className="py-2 text-gray-300 font-mono">config-backup-20240115.txt</td>
                              <td className="py-2 text-gray-300">2.4 KB</td>
                              <td className="py-2 text-gray-300">2024-01-15 10:30:00</td>
                              <td className="py-2">
                                <span className="px-2 py-1 rounded text-xs bg-green-900 text-green-300">Active</span>
                              </td>
                              <td className="py-2 text-gray-300">Production configuration backup</td>
                              <td className="py-2">
                                <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-500 mr-2">
                                  Download
                                </button>
                                <button className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-500 mr-2">
                                  Apply
                                </button>
                                <button className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-500">
                                  Delete
                                </button>
                              </td>
                            </tr>
                            <tr className="border-b border-gray-700 hover:bg-gray-700/50">
                              <td className="py-2 text-gray-300 font-mono">config-gold-standard.cfg</td>
                              <td className="py-2 text-gray-300">1.8 KB</td>
                              <td className="py-2 text-gray-300">2024-01-10 14:20:00</td>
                              <td className="py-2">
                                <span className="px-2 py-1 rounded text-xs bg-yellow-900 text-yellow-300">Backup</span>
                              </td>
                              <td className="py-2 text-gray-300">Gold standard configuration</td>
                              <td className="py-2">
                                <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-500 mr-2">
                                  Download
                                </button>
                                <button className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-500 mr-2">
                                  Apply
                                </button>
                                <button className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-500">
                                  Delete
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Configuration Comparison */}
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="text-md font-medium text-white mb-4">Configuration Comparison</h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Compare File 1</label>
                            <select className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg border border-gray-500">
                              <option>config-backup-20240115.txt</option>
                              <option>config-gold-standard.cfg</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Compare File 2</label>
                            <select className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg border border-gray-500">
                              <option>config-gold-standard.cfg</option>
                              <option>config-backup-20240115.txt</option>
                            </select>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500">
                          Compare Configurations
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">Select a device to manage configuration files</p>
                    <button
                      onClick={() => setShowDeviceSelector(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                    >
                      Select Device
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Changes */}
          {selectedView === 'changes' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Configuration Changes
              </h3>
              <div className="text-center py-8">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <div className="text-lg font-medium text-white mb-2">
                  Change Tracking
                </div>
                <div className="text-gray-400">
                  Track and audit configuration changes across devices
                </div>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  View Change History
                </button>
              </div>
            </div>
          )}

          {/* Compliance */}
          {selectedView === 'compliance' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Compliance Report
              </h3>
              <div className="text-center py-8">
                <div className="text-gray-400 text-6xl mb-4">✅</div>
                <div className="text-lg font-medium text-white mb-2">
                  Compliance Dashboard
                </div>
                <div className="text-gray-400">
                  Monitor policy compliance and generate audit reports
                </div>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Generate Report
                </button>
              </div>
            </div>
          )}

          {/* L2 Services */}
          {selectedView === 'l2-services' && (
            <div className="space-y-6">
              <L2ServicesConfig onClose={onClose} selectedDevice={selectedDevice || undefined} />
        </div>
      )}
        </div>
      )}

      {/* Device Selector Modal */}
      <DeviceSelectorModal
        isOpen={showDeviceSelector}
        onClose={() => setShowDeviceSelector(false)}
        onDeviceSelect={handleDeviceSelect}
        currentDevice={selectedDevice || undefined}
      />
    </div>
  );
};

export default ConfigurationManager;

