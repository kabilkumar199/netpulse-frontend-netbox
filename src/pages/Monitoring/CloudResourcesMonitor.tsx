import React, { useState, useEffect } from 'react';
import type { CloudResource } from '../../types';

interface CloudResourcesMonitorProps {
  onClose?: () => void;
}

interface CloudStats {
  totalResources: number;
  runningResources: number;
  stoppedResources: number;
  totalCost: number;
  costByProvider: { provider: string; cost: number }[];
  resourcesByType: { type: string; count: number }[];
}

const CloudResourcesMonitor: React.FC<CloudResourcesMonitorProps> = ({ onClose }) => {
  const [selectedView, setSelectedView] = useState<'overview' | 'resources' | 'costs' | 'performance'>('overview');
  const [selectedProvider, setSelectedProvider] = useState<'all' | 'aws' | 'azure' | 'gcp'>('all');
  const [cloudResources, setCloudResources] = useState<CloudResource[]>([]);
  const [cloudStats, setCloudStats] = useState<CloudStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Generate mock cloud data
  useEffect(() => {
    const generateMockData = () => {
      setIsLoading(true);
      
      const mockResources: CloudResource[] = [
        {
          id: 'aws-vm-1',
          provider: 'aws',
          type: 'vm',
          name: 'Web-Server-01',
          region: 'us-east-1',
          status: 'running',
          metrics: {
            cpuUtilization: 65,
            memoryUtilization: 78,
            diskUtilization: 45,
            networkIn: 125,
            networkOut: 89
          },
          cost: {
            hourly: 0.046,
            monthly: 33.12,
            currency: 'USD'
          },
          tags: {
            Environment: 'Production',
            Application: 'Web',
            Owner: 'DevOps'
          }
        },
        {
          id: 'aws-db-1',
          provider: 'aws',
          type: 'database',
          name: 'Main-Database',
          region: 'us-east-1',
          status: 'running',
          metrics: {
            cpuUtilization: 45,
            memoryUtilization: 82,
            diskUtilization: 67,
            networkIn: 45,
            networkOut: 23
          },
          cost: {
            hourly: 0.125,
            monthly: 90.00,
            currency: 'USD'
          },
          tags: {
            Environment: 'Production',
            Application: 'Database',
            Owner: 'DBA'
          }
        },
        {
          id: 'azure-vm-1',
          provider: 'azure',
          type: 'vm',
          name: 'App-Server-01',
          region: 'East US',
          status: 'running',
          metrics: {
            cpuUtilization: 55,
            memoryUtilization: 72,
            diskUtilization: 38,
            networkIn: 98,
            networkOut: 67
          },
          cost: {
            hourly: 0.052,
            monthly: 37.44,
            currency: 'USD'
          },
          tags: {
            Environment: 'Production',
            Application: 'App',
            Owner: 'DevOps'
          }
        },
        {
          id: 'azure-storage-1',
          provider: 'azure',
          type: 'storage',
          name: 'Data-Storage',
          region: 'East US',
          status: 'running',
          metrics: {
            diskUtilization: 23,
            networkIn: 156,
            networkOut: 234
          },
          cost: {
            hourly: 0.023,
            monthly: 16.56,
            currency: 'USD'
          },
          tags: {
            Environment: 'Production',
            Application: 'Storage',
            Owner: 'DevOps'
          }
        },
        {
          id: 'gcp-vm-1',
          provider: 'gcp',
          type: 'vm',
          name: 'Analytics-Server',
          region: 'us-central1',
          status: 'stopped',
          metrics: {
            cpuUtilization: 0,
            memoryUtilization: 0,
            diskUtilization: 0,
            networkIn: 0,
            networkOut: 0
          },
          cost: {
            hourly: 0.000,
            monthly: 0.00,
            currency: 'USD'
          },
          tags: {
            Environment: 'Development',
            Application: 'Analytics',
            Owner: 'DataTeam'
          }
        },
        {
          id: 'aws-lb-1',
          provider: 'aws',
          type: 'load-balancer',
          name: 'Web-LoadBalancer',
          region: 'us-east-1',
          status: 'running',
          metrics: {
            requestCount: 1250,
            errorRate: 0.5,
            networkIn: 456,
            networkOut: 234
          },
          cost: {
            hourly: 0.025,
            monthly: 18.00,
            currency: 'USD'
          },
          tags: {
            Environment: 'Production',
            Application: 'LoadBalancer',
            Owner: 'DevOps'
          }
        }
      ];
      
      setCloudResources(mockResources);
      
      // Calculate statistics
      const totalResources = mockResources.length;
      const runningResources = mockResources.filter(r => r.status === 'running').length;
      const stoppedResources = mockResources.filter(r => r.status === 'stopped').length;
      const totalCost = mockResources.reduce((sum, r) => sum + r.cost.monthly, 0);
      
      const costByProvider = [
        { provider: 'AWS', cost: mockResources.filter(r => r.provider === 'aws').reduce((sum, r) => sum + r.cost.monthly, 0) },
        { provider: 'Azure', cost: mockResources.filter(r => r.provider === 'azure').reduce((sum, r) => sum + r.cost.monthly, 0) },
        { provider: 'GCP', cost: mockResources.filter(r => r.provider === 'gcp').reduce((sum, r) => sum + r.cost.monthly, 0) }
      ];
      
      const resourcesByType = [
        { type: 'Virtual Machines', count: mockResources.filter(r => r.type === 'vm').length },
        { type: 'Databases', count: mockResources.filter(r => r.type === 'database').length },
        { type: 'Storage', count: mockResources.filter(r => r.type === 'storage').length },
        { type: 'Load Balancers', count: mockResources.filter(r => r.type === 'load-balancer').length }
      ];
      
      setCloudStats({
        totalResources,
        runningResources,
        stoppedResources,
        totalCost,
        costByProvider,
        resourcesByType
      });
      
      setIsLoading(false);
    };
    
    generateMockData();
    
    // Simulate real-time updates
    const interval = setInterval(generateMockData, 60000);
    return () => clearInterval(interval);
  }, []);

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'aws': return '☁️';
      case 'azure': return '🔷';
      case 'gcp': return '🔵';
      default: return '☁️';
    }
  };


  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'vm': return '🖥️';
      case 'database': return '🗄️';
      case 'storage': return '💾';
      case 'load-balancer': return '⚖️';
      case 'function': return '⚡';
      default: return '📦';
    }
  };


  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-900 text-green-300';
      case 'stopped': return 'bg-gray-700 text-gray-300';
      case 'terminated': return 'bg-red-900 text-red-300';
      default: return 'bg-gray-700 text-gray-300';
    }
  };

  const formatCost = (cost: number) => {
    return `$${cost.toFixed(2)}`;
  };

  const formatUtilization = (utilization: number) => {
    return `${utilization.toFixed(1)}%`;
  };

  const filteredResources = selectedProvider === 'all' 
    ? cloudResources 
    : cloudResources.filter(r => r.provider === selectedProvider);

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Cloud Resources Monitor
          </h2>
          <p className="text-gray-400">
            Monitor cloud infrastructure across AWS, Azure, and GCP
          </p>
        </div>
      </div>

      {/* Provider Filter */}
      <div className="flex space-x-2 mb-6">
        {(['all', 'aws', 'azure', 'gcp'] as const).map((provider) => (
          <button
            key={provider}
            onClick={() => setSelectedProvider(provider)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedProvider === provider
                ? 'bg-blue-600 text-white'
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            {provider === 'all' ? 'All Providers' : provider.toUpperCase()}
          </button>
        ))}
      </div>

      {/* View Selector */}
      <div className="flex space-x-2 mb-6">
        {([
          { key: 'overview', label: 'Overview' },
          { key: 'resources', label: 'Resources' },
          { key: 'costs', label: 'Cost Analysis' },
          { key: 'performance', label: 'Performance' }
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
            <p className="mt-2 text-gray-300">Loading cloud data...</p>
          </div>
        </div>
      )}

      {/* Content */}
      {!isLoading && cloudStats && (
        <div className="space-y-6">
          {/* Overview */}
          {selectedView === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Total Resources
                </h3>
                <div className="text-2xl font-bold text-blue-400">
                  {cloudStats.totalResources}
                </div>
                <div className="text-sm text-gray-400">
                  Across all providers
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Running Resources
                </h3>
                <div className="text-2xl font-bold text-green-400">
                  {cloudStats.runningResources}
                </div>
                <div className="text-sm text-gray-400">
                  Active
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Monthly Cost
                </h3>
                <div className="text-2xl font-bold text-purple-400">
                  {formatCost(cloudStats.totalCost)}
                </div>
                <div className="text-sm text-gray-400">
                  Total
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Utilization
                </h3>
                <div className="text-2xl font-bold text-orange-400">
                  {((cloudStats.runningResources / cloudStats.totalResources) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">
                  Resources active
                </div>
              </div>
            </div>
          )}

          {/* Resources */}
          {selectedView === 'resources' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Cloud Resources ({filteredResources.length})
              </h3>
              <div className="space-y-4">
                {filteredResources.map((resource) => (
                  <div key={resource.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div>
                          <div className="font-medium text-white">{resource.name}</div>
                          <div className="text-sm text-gray-400">
                            {resource.provider.toUpperCase()} • {resource.region} • {resource.type}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm text-gray-400">Monthly Cost</div>
                          <div className="font-medium text-white">
                            {formatCost(resource.cost.monthly)}
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBgColor(resource.status)}`}>
                          {resource.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {resource.metrics.cpuUtilization !== undefined && (
                        <div>
                          <div className="text-sm text-gray-400">CPU</div>
                          <div className="font-medium text-white">
                            {formatUtilization(resource.metrics.cpuUtilization)}
                          </div>
                        </div>
                      )}
                      {resource.metrics.memoryUtilization !== undefined && (
                        <div>
                          <div className="text-sm text-gray-400">Memory</div>
                          <div className="font-medium text-white">
                            {formatUtilization(resource.metrics.memoryUtilization)}
                          </div>
                        </div>
                      )}
                      {resource.metrics.diskUtilization !== undefined && (
                        <div>
                          <div className="text-sm text-gray-400">Disk</div>
                          <div className="font-medium text-white">
                            {formatUtilization(resource.metrics.diskUtilization)}
                          </div>
                        </div>
                      )}
                      {resource.metrics.requestCount !== undefined && (
                        <div>
                          <div className="text-sm text-gray-400">Requests</div>
                          <div className="font-medium text-white">
                            {resource.metrics.requestCount.toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {Object.entries(resource.tags).map(([key, value]) => (
                        <span
                          key={key}
                          className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded"
                        >
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cost Analysis */}
          {selectedView === 'costs' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Cost by Provider
                  </h3>
                  <div className="space-y-3">
                    {cloudStats.costByProvider.map((provider) => (
                      <div key={provider.provider} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">
                            {getProviderIcon(provider.provider.toLowerCase())}
                          </span>
                          <div>
                            <div className="font-medium text-white">{provider.provider}</div>
                            <div className="text-sm text-gray-400">
                              {((provider.cost / cloudStats.totalCost) * 100).toFixed(1)}% of total
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-white">
                            {formatCost(provider.cost)}
                          </div>
                          <div className="w-32 bg-gray-700 rounded-full h-2 mt-1">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(provider.cost / cloudStats.totalCost) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Resources by Type
                  </h3>
                  <div className="space-y-3">
                    {cloudStats.resourcesByType.map((type) => (
                      <div key={type.type} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">
                            {getResourceIcon(type.type.toLowerCase().replace(' ', '-'))}
                          </span>
                          <div>
                            <div className="font-medium text-white">{type.type}</div>
                            <div className="text-sm text-gray-400">
                              {((type.count / cloudStats.totalResources) * 100).toFixed(1)}% of total
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-white">
                            {type.count}
                          </div>
                          <div className="w-32 bg-gray-700 rounded-full h-2 mt-1">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${(type.count / cloudStats.totalResources) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Performance */}
          {selectedView === 'performance' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Performance Metrics
              </h3>
              <div className="text-center py-8">
                <div className="text-gray-400 text-6xl mb-4">📊</div>
                <div className="text-lg font-medium text-white mb-2">
                  Performance Analytics
                </div>
                <div className="text-gray-400">
                  Detailed performance metrics and trends for cloud resources
                </div>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  View Performance Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CloudResourcesMonitor;

