import React, { useState, useEffect } from 'react';
import type { AccessPoint, WirelessClient } from '../../types';

interface WirelessNetworkMonitorProps {
  onClose?: () => void;
}

interface WirelessStats {
  totalAPs: number;
  totalClients: number;
  activeAPs: number;
  rogueAPs: number;
  averageSignalStrength: number;
  channelUtilization: { channel: number; utilization: number }[];
}

const WirelessNetworkMonitor: React.FC<WirelessNetworkMonitorProps> = ({ onClose }) => {
  const [selectedView, setSelectedView] = useState<'overview' | 'access-points' | 'clients' | 'rogues' | 'channels'>('overview');
  const [wirelessStats, setWirelessStats] = useState<WirelessStats | null>(null);
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>([]);
  const [clients, setClients] = useState<WirelessClient[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Generate mock wireless data
  useEffect(() => {
    const generateMockData = () => {
      setIsLoading(true);
      
      // Generate mock access points
      const mockAPs: AccessPoint[] = [
        {
          id: 'ap-1',
          name: 'AP-Headquarters-01',
          macAddress: '00:1A:2B:3C:4D:5E',
          ipAddress: '192.168.1.100',
          ssid: 'Company-WiFi',
          channel: 6,
          frequency: 2437,
          signalStrength: -45,
          clientCount: 15,
          maxClients: 50,
          status: 'up'
        },
        {
          id: 'ap-2',
          name: 'AP-Headquarters-02',
          macAddress: '00:1A:2B:3C:4D:5F',
          ipAddress: '192.168.1.101',
          ssid: 'Company-WiFi',
          channel: 11,
          frequency: 2462,
          signalStrength: -52,
          clientCount: 8,
          maxClients: 50,
          status: 'up'
        },
        {
          id: 'ap-3',
          name: 'AP-Conference-01',
          macAddress: '00:1A:2B:3C:4D:60',
          ipAddress: '192.168.1.102',
          ssid: 'Company-WiFi',
          channel: 1,
          frequency: 2412,
          signalStrength: -38,
          clientCount: 25,
          maxClients: 50,
          status: 'up'
        },
        {
          id: 'ap-4',
          name: 'AP-Guest-01',
          macAddress: '00:1A:2B:3C:4D:61',
          ipAddress: '192.168.1.103',
          ssid: 'Guest-WiFi',
          channel: 6,
          frequency: 2437,
          signalStrength: -48,
          clientCount: 12,
          maxClients: 30,
          status: 'up'
        },
        {
          id: 'ap-rogue',
          name: 'Rogue-AP-Detected',
          macAddress: '00:1A:2B:3C:4D:99',
          ipAddress: '192.168.1.200',
          ssid: 'Free-WiFi',
          channel: 6,
          frequency: 2437,
          signalStrength: -65,
          clientCount: 3,
          maxClients: 10,
          status: 'warning'
        }
      ];
      
      // Generate mock clients
      const mockClients: WirelessClient[] = [
        {
          id: 'client-1',
          macAddress: 'AA:BB:CC:DD:EE:01',
          ipAddress: '192.168.1.150',
          deviceName: 'John-Laptop',
          connectedAP: 'ap-1',
          signalStrength: -45,
          bandwidthUsage: 15.5,
          connectedTime: new Date(Date.now() - 3600000),
          lastSeen: new Date()
        },
        {
          id: 'client-2',
          macAddress: 'AA:BB:CC:DD:EE:02',
          ipAddress: '192.168.1.151',
          deviceName: 'Sarah-Phone',
          connectedAP: 'ap-1',
          signalStrength: -52,
          bandwidthUsage: 8.2,
          connectedTime: new Date(Date.now() - 1800000),
          lastSeen: new Date()
        },
        {
          id: 'client-3',
          macAddress: 'AA:BB:CC:DD:EE:03',
          deviceName: 'Mike-Tablet',
          connectedAP: 'ap-2',
          signalStrength: -48,
          bandwidthUsage: 12.1,
          connectedTime: new Date(Date.now() - 2700000),
          lastSeen: new Date()
        },
        {
          id: 'client-4',
          macAddress: 'AA:BB:CC:DD:EE:04',
          deviceName: 'Unknown-Device',
          connectedAP: 'ap-rogue',
          signalStrength: -65,
          bandwidthUsage: 2.3,
          connectedTime: new Date(Date.now() - 900000),
          lastSeen: new Date()
        }
      ];
      
      setAccessPoints(mockAPs);
      setClients(mockClients);
      
      // Calculate statistics
      const totalAPs = mockAPs.length;
      const totalClients = mockClients.length;
      const activeAPs = mockAPs.filter(ap => ap.status === 'up').length;
      const rogueAPs = mockAPs.filter(ap => ap.status === 'warning').length;
      const averageSignalStrength = mockAPs.reduce((sum, ap) => sum + ap.signalStrength, 0) / mockAPs.length;
      
      // Channel utilization
      const channelUtilization = [
        { channel: 1, utilization: 45 },
        { channel: 6, utilization: 78 },
        { channel: 11, utilization: 32 },
        { channel: 36, utilization: 15 },
        { channel: 40, utilization: 22 },
        { channel: 44, utilization: 18 },
        { channel: 48, utilization: 12 }
      ];
      
      setWirelessStats({
        totalAPs,
        totalClients,
        activeAPs,
        rogueAPs,
        averageSignalStrength,
        channelUtilization
      });
      
      setIsLoading(false);
    };
    
    generateMockData();
    
    // Simulate real-time updates
    const interval = setInterval(generateMockData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getSignalStrengthColor = (strength: number) => {
    if (strength >= -50) return 'text-green-400';
    if (strength >= -60) return 'text-yellow-400';
    if (strength >= -70) return 'text-orange-400';
    return 'text-red-400';
  };

  const getSignalStrengthBar = (strength: number) => {
    const percentage = Math.max(0, Math.min(100, (strength + 100) * 2));
    return percentage;
  };

  const getChannelColor = (channel: number) => {
    if (channel <= 11) return 'bg-blue-500';
    if (channel <= 48) return 'bg-green-500';
    return 'bg-purple-500';
  };

  const formatBandwidth = (mbps: number) => {
    return `${mbps.toFixed(1)} Mbps`;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
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
            Wireless Network Monitor
          </h2>
          <p className="text-gray-400">
            Monitor WiFi access points, clients, and security
          </p>
        </div>
      </div>

      {/* View Selector */}
      <div className="flex space-x-2 mb-6">
        {([
          { key: 'overview', label: 'Overview' },
          { key: 'access-points', label: 'Access Points' },
          { key: 'clients', label: 'Clients' },
          { key: 'rogues', label: 'Rogue Detection' },
          { key: 'channels', label: 'Channel Analysis' }
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
            <p className="mt-2 text-gray-300">Loading wireless data...</p>
          </div>
        </div>
      )}

      {/* Content */}
      {!isLoading && wirelessStats && (
        <div className="space-y-6">
          {/* Overview */}
          {selectedView === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Total APs
                </h3>
                <div className="text-2xl font-bold text-blue-400">
                  {wirelessStats.totalAPs}
                </div>
                <div className="text-sm text-gray-400">
                  Access Points
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Active APs
                </h3>
                <div className="text-2xl font-bold text-green-400">
                  {wirelessStats.activeAPs}
                </div>
                <div className="text-sm text-gray-400">
                  Online
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Connected Clients
                </h3>
                <div className="text-2xl font-bold text-purple-400">
                  {wirelessStats.totalClients}
                </div>
                <div className="text-sm text-gray-400">
                  Active
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Rogue APs
                </h3>
                <div className="text-2xl font-bold text-red-400">
                  {wirelessStats.rogueAPs}
                </div>
                <div className="text-sm text-gray-400">
                  Detected
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Avg Signal
                </h3>
                <div className={`text-2xl font-bold ${getSignalStrengthColor(wirelessStats.averageSignalStrength)}`}>
                  {wirelessStats.averageSignalStrength} dBm
                </div>
                <div className="text-sm text-gray-400">
                  Signal Strength
                </div>
              </div>
            </div>
          )}

          {/* Access Points */}
          {selectedView === 'access-points' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Access Points
              </h3>
              <div className="space-y-4">
                {accessPoints.map((ap) => (
                  <div key={ap.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          ap.status === 'up' ? 'bg-green-500' : 
                          ap.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <div className="font-medium text-white">{ap.name}</div>
                          <div className="text-sm text-gray-400">
                            {ap.ipAddress} • {ap.ssid}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">
                          Channel {ap.channel}
                        </div>
                        <div className={`font-medium ${getSignalStrengthColor(ap.signalStrength)}`}>
                          {ap.signalStrength} dBm
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-400">
                          Clients: {ap.clientCount}/{ap.maxClients}
                        </div>
                        <div className="text-sm text-gray-400">
                          MAC: {ap.macAddress}
                        </div>
                      </div>
                      <div className="w-32 bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${getSignalStrengthBar(ap.signalStrength)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clients */}
          {selectedView === 'clients' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Connected Clients
              </h3>
              <div className="space-y-4">
                {clients.map((client) => (
                  <div key={client.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-900 text-blue-300 rounded-full flex items-center justify-center mr-3">
                          {client.deviceName?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {client.deviceName || 'Unknown Device'}
                          </div>
                          <div className="text-sm text-gray-400">
                            {client.ipAddress} • {client.macAddress}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">
                          {formatBandwidth(client.bandwidthUsage)}
                        </div>
                        <div className={`font-medium ${getSignalStrengthColor(client.signalStrength)}`}>
                          {client.signalStrength} dBm
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        Connected: {formatTimeAgo(client.connectedTime)}
                      </div>
                      <div className="text-sm text-gray-400">
                        Last seen: {formatTimeAgo(client.lastSeen)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rogue Detection */}
          {selectedView === 'rogues' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Rogue Access Points
              </h3>
              <div className="space-y-4">
                {accessPoints.filter(ap => ap.status === 'warning').map((ap) => (
                  <div key={ap.id} className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-3" />
                        <div>
                          <div className="font-medium text-red-300">{ap.name}</div>
                          <div className="text-sm text-red-400">
                            {ap.ipAddress} • {ap.ssid}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-red-400">
                          Channel {ap.channel}
                        </div>
                        <div className="font-medium text-red-300">
                          {ap.signalStrength} dBm
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm text-red-400">
                        MAC: {ap.macAddress}
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                          Block
                        </button>
                        <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">
                          Investigate
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {accessPoints.filter(ap => ap.status === 'warning').length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-green-600 text-6xl mb-4">✅</div>
                    <div className="text-lg font-medium text-white mb-2">
                      No Rogue APs Detected
                    </div>
                    <div className="text-gray-400">
                      Your wireless network is secure
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Channel Analysis */}
          {selectedView === 'channels' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Channel Utilization
              </h3>
              <div className="space-y-4">
                {wirelessStats.channelUtilization.map((channel) => (
                  <div key={channel.channel} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 ${getChannelColor(channel.channel)} text-white rounded-full flex items-center justify-center text-sm font-medium mr-3`}>
                        {channel.channel}
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          Channel {channel.channel}
                        </div>
                        <div className="text-sm text-gray-400">
                          {channel.utilization}% utilization
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-white">
                        {channel.utilization}%
                      </div>
                      <div className="w-32 bg-gray-600 rounded-full h-2 mt-1">
                        <div
                          className={`h-2 rounded-full ${getChannelColor(channel.channel)}`}
                          style={{ width: `${channel.utilization}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WirelessNetworkMonitor;

