import React, { useState } from 'react';
import type { Device, PathQuery, PathResult } from '../../types';
import { mockDevices, mockPathQueries } from '../../data/mockData';

interface PathAnalysisProps {
  onClose?: () => void;
}

const PathAnalysis: React.FC<PathAnalysisProps> = ({ onClose }) => {
  const [sourceDevice, setSourceDevice] = useState<Device | null>(null);
  const [targetDevice, setTargetDevice] = useState<Device | null>(null);
  const [sourceIp, setSourceIp] = useState('');
  const [targetIp, setTargetIp] = useState('');
  const [options, setOptions] = useState({
    preferL2: true,
    includeL3Hops: true,
    maxHops: 10,
    excludeDownLinks: true
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<PathResult[]>([]);
  const [queries] = useState<PathQuery[]>(mockPathQueries);

  const handleAnalyze = async () => {
    if (!sourceDevice && !sourceIp) {
      alert('Please select a source device or enter a source IP');
      return;
    }
    if (!targetDevice && !targetIp) {
      alert('Please select a target device or enter a target IP');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Use mock results for demonstration
    setResults(mockPathQueries[0].results);
    setIsAnalyzing(false);
  };

  const formatLatency = (latency: number) => {
    if (latency < 1000) return `${latency}ms`;
    return `${(latency / 1000).toFixed(2)}s`;
  };

  const getStatusIcon = (isUp: boolean) => {
    return isUp ? '🟢' : '🔴';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Path Analysis
          </h1>
          <p className="text-gray-400 mt-1">
            Analyze network paths and connectivity between devices
          </p>
        </div>
      </div>

      {/* Analysis Form */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Path Analysis Configuration
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Source */}
          <div className="space-y-4">
            <h4 className="font-medium text-white">Source</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Source Device
              </label>
              <select
                value={sourceDevice?.id || ''}
                onChange={(e) => {
                  const device = mockDevices.find(d => d.id === e.target.value);
                  setSourceDevice(device || null);
                }}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select source device...</option>
                {mockDevices.map(device => (
                  <option key={device.id} value={device.id}>
                    {device.hostname} ({device.ipAddresses[0]})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Source IP (optional)
              </label>
              <input
                type="text"
                value={sourceIp}
                onChange={(e) => setSourceIp(e.target.value)}
                placeholder="192.168.1.1"
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Target */}
          <div className="space-y-4">
            <h4 className="font-medium text-white">Target</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Device
              </label>
              <select
                value={targetDevice?.id || ''}
                onChange={(e) => {
                  const device = mockDevices.find(d => d.id === e.target.value);
                  setTargetDevice(device || null);
                }}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select target device...</option>
                {mockDevices.map(device => (
                  <option key={device.id} value={device.id}>
                    {device.hostname} ({device.ipAddresses[0]})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target IP (optional)
              </label>
              <input
                type="text"
                value={targetIp}
                onChange={(e) => setTargetIp(e.target.value)}
                placeholder="192.168.2.1"
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-4">Analysis Options</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="preferL2"
                checked={options.preferL2}
                onChange={(e) => setOptions({...options, preferL2: e.target.checked})}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="preferL2" className="text-sm text-gray-700">
                Prefer L2 paths
              </label>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="includeL3Hops"
                checked={options.includeL3Hops}
                onChange={(e) => setOptions({...options, includeL3Hops: e.target.checked})}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="includeL3Hops" className="text-sm text-gray-700">
                Include L3 hops
              </label>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="excludeDownLinks"
                checked={options.excludeDownLinks}
                onChange={(e) => setOptions({...options, excludeDownLinks: e.target.checked})}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="excludeDownLinks" className="text-sm text-gray-700">
                Exclude down links
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Max Hops
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={options.maxHops}
                onChange={(e) => setOptions({...options, maxHops: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Analyze Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || (!sourceDevice && !sourceIp) || (!targetDevice && !targetIp)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>🔍</span>
                <span>Analyze Path</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Analysis Results
          </h3>
          
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={result.id} className="border border-gray-600 rounded-lg p-4 bg-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-white">
                      Path {index + 1}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      result.isReachable 
                        ? 'bg-green-900 text-green-300'
                        : 'bg-red-900 text-red-300'
                    }`}>
                      {result.isReachable ? 'REACHABLE' : 'UNREACHABLE'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {result.totalHops} hops • {formatLatency(result.totalLatency)} total latency
                  </div>
                </div>
                
                {result.isReachable ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <span>Confidence: {(result.confidence * 100).toFixed(1)}%</span>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-3">
                      <h5 className="font-medium text-white mb-2">Path Details</h5>
                      <div className="space-y-1">
                        {result.path.map((hop, hopIndex) => (
                          <div key={hopIndex} className="flex items-center space-x-2 text-sm">
                            <span className="w-6 h-6 rounded-full bg-blue-900 text-blue-300 flex items-center justify-center text-xs font-medium">
                              {hopIndex + 1}
                            </span>
                            <span className="flex-1">
                              <span className="font-medium text-white">
                                {hop.deviceName}
                              </span>
                              <span className="text-gray-400 ml-2">
                                ({hop.interfaceName})
                              </span>
                              {hop.ipAddress && (
                                <span className="text-gray-400 ml-2">
                                  {hop.ipAddress}
                                </span>
                              )}
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-400">
                                {formatLatency(hop.latency)}
                              </span>
                              <span className="text-lg">
                                {getStatusIcon(hop.isUp)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-red-600">❌</span>
                      <span className="text-red-800 font-medium">
                        Path unreachable
                      </span>
                    </div>
                    {result.failureReason && (
                      <p className="text-red-700 text-sm mt-1">
                        {result.failureReason}
                      </p>
                    )}
                    {result.failureHop && (
                      <p className="text-red-700 text-sm mt-1">
                        Failed at hop {result.failureHop}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Queries */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Recent Path Queries
        </h3>
        
        <div className="space-y-3">
          {queries.map((query) => (
            <div key={query.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-lg">🛣️</span>
                <div>
                  <div className="font-medium text-white">
                    {mockDevices.find(d => d.id === query.sourceDeviceId)?.hostname} → {mockDevices.find(d => d.id === query.targetDeviceId)?.hostname}
                  </div>
                  <div className="text-sm text-gray-400">
                    {query.results.length} result(s) • {new Date(query.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PathAnalysis;
