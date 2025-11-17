import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, Clock, Eye, Map as MapIcon, Network } from 'lucide-react';
import type { DiscoveryScan, Device, Site } from '../../types';
import { mockDiscoveryScans } from '../../data/mockData';
import EnhancedNetworkMap from './EnhancedNetworkMap';
import MapView from '../Maps/MapView';

interface TopologyScansViewProps {
  onDeviceSelect?: (device: Device) => void;
  onSiteSelect?: (site: Site) => void;
  scans?: DiscoveryScan[];
}

const TopologyScansView: React.FC<TopologyScansViewProps> = ({ 
  onDeviceSelect, 
  onSiteSelect,
  scans = mockDiscoveryScans 
}) => {
  const [selectedScan, setSelectedScan] = useState<DiscoveryScan | null>(null);
  const [viewMode, setViewMode] = useState<'topology' | 'map'>('topology');

  const getStatusIcon = (status: DiscoveryScan['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'running':
        return <Play className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: DiscoveryScan['status']) => {
    const statusConfig = {
      completed: 'bg-green-100 text-green-800',
      running: 'bg-blue-100 text-blue-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return statusConfig[status] || statusConfig.pending;
  };

  const formatDuration = (scan: DiscoveryScan) => {
    if (!scan.endTime) return 'In progress...';
    const duration = scan.endTime.getTime() - scan.startTime.getTime();
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const handleViewTopology = (scan: DiscoveryScan) => {
    setSelectedScan(scan);
    setViewMode('topology');
  };

  const handleBackToList = () => {
    setSelectedScan(null);
    setViewMode('topology');
  };

  // If a scan is selected, show its topology/map
  if (selectedScan) {
    return (
      <div className="flex flex-col h-full bg-gray-900">
        {/* Header with Back Button and View Toggle */}
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToList}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                ← Back to Scans
              </button>
              <div>
                <h2 className="text-xl font-semibold text-white">{selectedScan.name}</h2>
                <p className="text-sm text-gray-400">
                  {selectedScan.results.totalDevices} devices discovered • {formatDuration(selectedScan)}
                </p>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('topology')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  viewMode === 'topology'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Network className="w-4 h-4" />
                <span>Topology</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  viewMode === 'map'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <MapIcon className="w-4 h-4" />
                <span>Map View</span>
              </button>
            </div>
          </div>

          {/* Scan Summary Stats */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-2xl font-bold text-white">{selectedScan.results.totalDevices}</div>
              <div className="text-sm text-gray-400">Total Devices</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-400">{selectedScan.results.newDevices}</div>
              <div className="text-sm text-gray-400">New Devices</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-400">{selectedScan.results.links.length}</div>
              <div className="text-sm text-gray-400">Links Found</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-2xl font-bold text-yellow-400">{selectedScan.results.summary.topVendors.length}</div>
              <div className="text-sm text-gray-400">Vendors</div>
            </div>
          </div>
        </div>

        {/* Topology or Map View */}
        <div className="flex-1 overflow-hidden">
          {viewMode === 'topology' ? (
            <EnhancedNetworkMap 
              onDeviceSelect={onDeviceSelect}
              onSiteSelect={onSiteSelect}
              devices={selectedScan.results.devices}
              links={selectedScan.results.links}
            />
          ) : (
            <MapView 
              onDeviceSelect={onDeviceSelect}
              onSiteSelect={onSiteSelect}
              devices={selectedScan.results.devices}
            />
          )}
        </div>
      </div>
    );
  }

  // Show scan list
  return (
    <div className="p-6 bg-gray-900 h-full overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
              <Network className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Network Topology Scans
              </h1>
              <p className="text-gray-400 text-sm">Select a scan to view its topology and network map</p>
            </div>
          </div>
        </div>

        {/* Scans Grid */}
        <div className="grid grid-cols-1 gap-4">
          {scans.map((scan) => (
            <div
              key={scan.id}
              className="bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 hover:shadow-lg transition-all duration-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Status Icon */}
                    <div className="mt-1">
                      {getStatusIcon(scan.status)}
                    </div>

                    {/* Scan Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-white">
                          {scan.name}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded text-xs font-medium ${getStatusBadge(scan.status)}`}>
                          {scan.status.charAt(0).toUpperCase() + scan.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-400">Started:</span>
                          <span className="text-gray-300">{scan.startTime.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-400">Duration:</span>
                          <span className="text-gray-300">{formatDuration(scan)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Network className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-400">Seed Devices:</span>
                          <span className="text-gray-300">{scan.seedDevices.length}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Network className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-400">Max Hops:</span>
                          <span className="text-gray-300">{scan.expansionSettings.maxHops}</span>
                        </div>
                      </div>

                      {/* Results Summary */}
                      {scan.status === 'completed' && (
                        <div className="grid grid-cols-4 gap-3 mb-4">
                          <div className="bg-gray-750 rounded-lg p-3 border border-gray-700">
                            <div className="text-xl font-bold text-white mb-1">{scan.results.totalDevices}</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wide">Total Devices</div>
                          </div>
                          <div className="bg-gray-750 rounded-lg p-3 border border-gray-700">
                            <div className="text-xl font-bold text-green-400 mb-1">{scan.results.newDevices}</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wide">New Devices</div>
                          </div>
                          <div className="bg-gray-750 rounded-lg p-3 border border-gray-700">
                            <div className="text-xl font-bold text-blue-400 mb-1">{scan.results.links.length}</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wide">Links Found</div>
                          </div>
                          <div className="bg-gray-750 rounded-lg p-3 border border-gray-700">
                            <div className="text-xl font-bold text-red-400 mb-1">{scan.results.failedDevices}</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wide">Failed</div>
                          </div>
                        </div>
                      )}

                      {/* Top Vendors */}
                      {scan.status === 'completed' && scan.results.summary.topVendors.length > 0 && (
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm text-gray-400">Top Vendors:</span>
                          <div className="flex flex-wrap gap-2">
                            {scan.results.summary.topVendors.slice(0, 3).map((vendor, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 bg-gray-700 border border-gray-600 text-gray-300 text-xs rounded font-medium"
                              >
                                {vendor.vendor} <span className="text-gray-400">({vendor.count})</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Protocols Used */}
                      {scan.status === 'completed' && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-400">Protocols:</span>
                          <div className="flex flex-wrap gap-2">
                            {scan.results.summary.protocolsUsed.map((protocol, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 bg-gray-700 border border-gray-600 text-gray-300 text-xs rounded uppercase font-medium"
                              >
                                {protocol}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="ml-6">
                    {scan.status === 'completed' && (
                      <button
                        onClick={() => handleViewTopology(scan)}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Topology</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {scans.length === 0 && (
          <div className="text-center py-12">
            <Network className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Scans Found</h3>
            <p className="text-gray-500 mb-4">Start a new network discovery scan to see topology results</p>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Start New Scan
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopologyScansView;

