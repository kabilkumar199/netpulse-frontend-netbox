import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import type { Device, PerformanceMetric } from '../../types';
import { mockDevices } from '../../data/mockData';

interface PerformanceDashboardProps {}

interface PerformanceData {
  cpu: PerformanceMetric[];
  memory: PerformanceMetric[];
  disk: PerformanceMetric[];
  network: PerformanceMetric[];
  temperature: PerformanceMetric[];
}

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = () => {
  const { deviceId: routeDeviceId } = useParams<{ deviceId?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Use mock devices instead of API
  const devices = mockDevices;
  
  // Get device ID from URL params or search params
  const urlDeviceId = routeDeviceId || searchParams.get('deviceId');
  
  const [selectedDevice, setSelectedDevice] = useState<Device | undefined>(undefined);
  const [showDeviceSelector, setShowDeviceSelector] = useState(false);
  
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    cpu: [],
    memory: [],
    disk: [],
    network: [],
    temperature: []
  });
  const [selectedMetric, setSelectedMetric] = useState<keyof PerformanceData>('cpu');
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('1h');

  // Load device from URL or show selector
  useEffect(() => {
    if (urlDeviceId && devices.length > 0) {
      const foundDevice = devices.find((d) => d.id === urlDeviceId);
      if (foundDevice) {
        setSelectedDevice(foundDevice);
        setShowDeviceSelector(false);
      } else {
        // Device ID in URL but not found
        setSelectedDevice(undefined);
        setShowDeviceSelector(true);
      }
    } else if (!urlDeviceId) {
      // No device ID in URL - show selector
      setSelectedDevice(undefined);
      setShowDeviceSelector(true);
    }
  }, [urlDeviceId, devices]);

  // Mock performance data - in real implementation, this would come from API
  useEffect(() => {
    if (!selectedDevice) return;

    const generateMockData = () => {
      const now = new Date();
      const data: PerformanceData = {
        cpu: [],
        memory: [],
        disk: [],
        network: [],
        temperature: []
      };

      // Generate mock data for the last hour
      for (let i = 59; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60000); // Every minute
        
        data.cpu.push({
          deviceId: selectedDevice.id,
          metricType: 'cpu',
          value: Math.random() * 100,
          unit: '%',
          timestamp,
          threshold: { warning: 70, critical: 90 }
        });

        data.memory.push({
          deviceId: selectedDevice.id,
          metricType: 'memory',
          value: Math.random() * 100,
          unit: '%',
          timestamp,
          threshold: { warning: 80, critical: 95 }
        });

        data.disk.push({
          deviceId: selectedDevice.id,
          metricType: 'disk',
          value: Math.random() * 100,
          unit: '%',
          timestamp,
          threshold: { warning: 85, critical: 95 }
        });

        data.network.push({
          deviceId: selectedDevice.id,
          metricType: 'network',
          value: Math.random() * 1000,
          unit: 'Mbps',
          timestamp,
          threshold: { warning: 800, critical: 950 }
        });

        data.temperature.push({
          deviceId: selectedDevice.id,
          metricType: 'temperature',
          value: 20 + Math.random() * 40,
          unit: '°C',
          timestamp,
          threshold: { warning: 60, critical: 80 }
        });
      }

      setPerformanceData(data);
    };

    generateMockData();
    
    // Simulate real-time updates
    const interval = setInterval(generateMockData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [selectedDevice?.id]);

  const handleDeviceSelect = (deviceId: string) => {
    const device = devices.find((d) => d.id === deviceId);
    if (device) {
      setSelectedDevice(device);
      setShowDeviceSelector(false);
      // Update URL with device ID - use navigate to update route
      navigate(`/monitoring/performance/${deviceId}`, { replace: true });
    }
  };

  const getMetricColor = (value: number, threshold?: { warning: number; critical: number }) => {
    if (!threshold) return 'text-gray-400';
    if (value >= threshold.critical) return 'text-red-400';
    if (value >= threshold.warning) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getCurrentValue = (metrics: PerformanceMetric[]) => {
    return metrics.length > 0 ? metrics[metrics.length - 1] : null;
  };

  const getAverageValue = (metrics: PerformanceMetric[]) => {
    if (metrics.length === 0) return 0;
    const sum = metrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / metrics.length;
  };

  const getPeakValue = (metrics: PerformanceMetric[]) => {
    if (metrics.length === 0) return 0;
    return Math.max(...metrics.map(metric => metric.value));
  };

  const currentMetric = getCurrentValue(performanceData[selectedMetric]);
  const averageValue = getAverageValue(performanceData[selectedMetric]);
  const peakValue = getPeakValue(performanceData[selectedMetric]);

  // Device Selector Modal
  const DeviceSelectorModal = () => {
    if (!showDeviceSelector) return null;

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={() => {
          // Close modal when clicking outside (only if device is selected)
          if (selectedDevice) {
            setShowDeviceSelector(false);
          }
        }}
      >
        <div 
          className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6 max-w-md w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-semibold text-white mb-4">
            Select Device
          </h3>
          <p className="text-gray-400 mb-4 text-sm">
            Please select a device to view performance metrics and charts.
          </p>
          {devices.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">No devices available.</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowDeviceSelector(false);
                    navigate('/devices');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Devices
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Device
                </label>
                <select
                  value={selectedDevice?.id || ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      handleDeviceSelect(e.target.value);
                    }
                  }}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm"
                >
                  <option value="">-- Select a device --</option>
                  {devices.map((device) => {
                    // Handle ipAddresses array (mock devices use ipAddresses array)
                    const ipAddress = (device.ipAddresses && device.ipAddresses.length > 0)
                      ? device.ipAddresses[0]
                      : 'N/A';
                    const displayName = device.hostname || device.id || 'Unknown Device';
                    const vendor = device.vendor || '';
                    const model = device.model || '';
                    const deviceInfo = vendor || model ? ` - ${vendor} ${model}`.trim() : '';
                    
                    return (
                      <option key={device.id} value={device.id}>
                        {displayName} ({ipAddress}){deviceInfo}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowDeviceSelector(false);
                  }}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Device Selector Modal */}
      <DeviceSelectorModal />

      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Performance Dashboard
            </h2>
            {selectedDevice ? (
              <p className="text-gray-400">
                {selectedDevice.hostname} - {selectedDevice.vendor} {selectedDevice.model}
              </p>
            ) : (
              <p className="text-gray-400">
                No device selected
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {selectedDevice && (
              <button
                onClick={() => {
                  setShowDeviceSelector(true);
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Change Device
              </button>
            )}
          </div>
        </div>

        {!selectedDevice ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">
              Please select a device to view performance metrics and charts.
            </p>
            <button
              onClick={() => setShowDeviceSelector(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Select Device
            </button>
          </div>
        ) : (
          <>
            {/* Metric Selector */}
            <div className="flex space-x-4 mb-6">
              {(['cpu', 'memory', 'disk', 'network', 'temperature'] as const).map((metric) => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedMetric === metric
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  {metric.charAt(0).toUpperCase() + metric.slice(1)}
                </button>
              ))}
            </div>

            {/* Time Range Selector */}
            <div className="flex space-x-2 mb-6">
              {(['1h', '6h', '24h', '7d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            {/* Current Metrics */}
            {currentMetric && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-2">
              Current Value
            </h3>
            <div className={`text-3xl font-bold ${getMetricColor(currentMetric.value, currentMetric.threshold)}`}>
              {currentMetric.value.toFixed(1)} {currentMetric.unit}
            </div>
            <div className="text-sm text-gray-400">
              {currentMetric.timestamp.toLocaleTimeString()}
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-2">
              Average
            </h3>
            <div className="text-3xl font-bold text-blue-400">
              {averageValue.toFixed(1)} {currentMetric.unit}
            </div>
            <div className="text-sm text-gray-400">
              Last {timeRange}
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-2">
              Peak
            </h3>
            <div className="text-3xl font-bold text-red-400">
              {peakValue.toFixed(1)} {currentMetric.unit}
            </div>
            <div className="text-sm text-gray-400">
              Last {timeRange}
            </div>
          </div>
        </div>
      )}

      {/* Performance Chart */}
      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Usage Over Time
        </h3>
        
        {/* Simple ASCII Chart - In real implementation, use a proper charting library */}
        <div className="bg-gray-800 rounded p-4 h-64 flex items-end justify-between">
          {performanceData[selectedMetric].slice(-20).map((metric, index) => {
            const height = (metric.value / 100) * 200; // Scale to chart height
            
            return (
              <div
                key={index}
                className={`w-4 rounded-t transition-all duration-300 ${
                  metric.value >= (metric.threshold?.critical || 100) ? 'bg-red-500' :
                  metric.value >= (metric.threshold?.warning || 80) ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ height: `${height}px` }}
                title={`${metric.value.toFixed(1)} ${metric.unit} at ${metric.timestamp.toLocaleTimeString()}`}
              />
            );
          })}
        </div>
      </div>

      {/* Thresholds */}
      {currentMetric?.threshold && (
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">
            Thresholds
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400">Warning</div>
              <div className="text-xl font-semibold text-yellow-400">
                {currentMetric.threshold.warning} {currentMetric.unit}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Critical</div>
              <div className="text-xl font-semibold text-red-400">
                {currentMetric.threshold.critical} {currentMetric.unit}
              </div>
            </div>
            </div>
          </div>
        )}
      </>
        )}
      </div>
    </>
  );
};

export default PerformanceDashboard;
