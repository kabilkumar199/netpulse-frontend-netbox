import React, { useState } from 'react';
import type { Device, ReachabilityQuery, ReachabilityResult } from '../../types';
import { mockDevices, mockReachabilityQueries } from '../../data/mockData';

interface ReachabilityAnalysisProps {
  onClose?: () => void;
}

const ReachabilityAnalysis: React.FC<ReachabilityAnalysisProps> = ({ onClose }) => {
  const [sourceDevice, setSourceDevice] = useState<Device | null>(null);
  const [targetDevice, setTargetDevice] = useState<Device | null>(null);
  const [sourceIp, setSourceIp] = useState('');
  const [targetIp, setTargetIp] = useState('');
  const [options, setOptions] = useState({
    includeDependencies: true,
    includeSuppressed: false,
    checkInterval: 60,
    timeout: 30,
    maxRetries: 3
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<ReachabilityResult[]>([]);
  const [queries] = useState<ReachabilityQuery[]>(mockReachabilityQueries);
  const [isContinuous, setIsContinuous] = useState(false);

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
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Use mock results for demonstration
    setResults(mockReachabilityQueries[0].results);
    setIsAnalyzing(false);
  };

  const startContinuousMonitoring = () => {
    setIsContinuous(true);
    // In a real implementation, this would start a background process
    console.log('Starting continuous reachability monitoring...');
  };

  const stopContinuousMonitoring = () => {
    setIsContinuous(false);
    // In a real implementation, this would stop the background process
    console.log('Stopping continuous reachability monitoring...');
  };

  const formatLatency = (latency: number) => {
    if (latency < 1000) return `${latency}ms`;
    return `${(latency / 1000).toFixed(2)}s`;
  };

  const getReachabilityIcon = (isReachable: boolean) => {
    return isReachable ? '✅' : '❌';
  };

  const getReachabilityColor = (isReachable: boolean) => {
    return isReachable 
      ? 'bg-green-900 text-green-300'
      : 'bg-red-900 text-red-300';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Reachability Analysis
          </h1>
          <p className="text-gray-400 mt-1">
            Test and monitor network reachability between devices
          </p>
        </div>
      </div>

      {/* Analysis Form */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Reachability Test Configuration
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
          <h4 className="font-medium text-white mb-4">Test Options</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="includeDependencies"
                checked={options.includeDependencies}
                onChange={(e) => setOptions({...options, includeDependencies: e.target.checked})}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="includeDependencies" className="text-sm text-gray-300">
                Include dependencies
              </label>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="includeSuppressed"
                checked={options.includeSuppressed}
                onChange={(e) => setOptions({...options, includeSuppressed: e.target.checked})}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="includeSuppressed" className="text-sm text-gray-300">
                Include suppressed alerts
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Check Interval (seconds)
              </label>
              <input
                type="number"
                min="10"
                max="3600"
                value={options.checkInterval}
                onChange={(e) => setOptions({...options, checkInterval: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Timeout (seconds)
              </label>
              <input
                type="number"
                min="1"
                max="300"
                value={options.timeout}
                onChange={(e) => setOptions({...options, timeout: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between">
          <div className="flex space-x-3">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || (!sourceDevice && !sourceIp) || (!targetDevice && !targetIp)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Testing...</span>
                </>
              ) : (
                <>
                  <span>🔍</span>
                  <span>Test Reachability</span>
                </>
              )}
            </button>
            
            {!isContinuous ? (
              <button
                onClick={startContinuousMonitoring}
                disabled={isAnalyzing || (!sourceDevice && !sourceIp) || (!targetDevice && !targetIp)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <span>▶️</span>
                <span>Start Monitoring</span>
              </button>
            ) : (
              <button
                onClick={stopContinuousMonitoring}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
              >
                <span>⏹️</span>
                <span>Stop Monitoring</span>
              </button>
            )}
          </div>
          
          {isContinuous && (
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Monitoring active</span>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Reachability Test Results
          </h3>
          
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getReachabilityIcon(result.isReachable)}</span>
                    <div>
                      <div className="font-medium text-gray-900">
                        Test #{index + 1}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(result.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getReachabilityColor(result.isReachable)}`}>
                      {result.isReachable ? 'REACHABLE' : 'UNREACHABLE'}
                    </span>
                    {result.latency && (
                      <span className="text-sm text-gray-600">
                        {formatLatency(result.latency)}
                      </span>
                    )}
                  </div>
                </div>
                
                {result.isReachable ? (
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-green-800">
                      <span>✅</span>
                      <span className="font-medium">Connection successful</span>
                    </div>
                    {result.latency && (
                      <div className="text-green-700 text-sm mt-1">
                        Response time: {formatLatency(result.latency)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-red-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-red-800">
                      <span>❌</span>
                      <span className="font-medium">Connection failed</span>
                    </div>
                    {result.failureReason && (
                      <div className="text-red-700 text-sm mt-1">
                        Reason: {result.failureReason}
                      </div>
                    )}
                    {result.suppressedBy && result.suppressedBy.length > 0 && (
                      <div className="text-red-700 text-sm mt-1">
                        Suppressed by: {result.suppressedBy.join(', ')}
                      </div>
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
          Recent Reachability Queries
        </h3>
        
        <div className="space-y-3">
          {queries.map((query) => (
            <div key={query.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-lg">🔍</span>
                <div>
                  <div className="font-medium text-white">
                    {mockDevices.find(d => d.id === query.sourceDeviceId)?.hostname} → {mockDevices.find(d => d.id === query.targetDeviceId)?.hostname}
                  </div>
                  <div className="text-sm text-gray-400">
                    {query.results.length} result(s) • {new Date(query.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  query.results[query.results.length - 1]?.isReachable 
                    ? 'bg-green-900 text-green-300'
                    : 'bg-red-900 text-red-300'
                }`}>
                  {query.results[query.results.length - 1]?.isReachable ? 'REACHABLE' : 'UNREACHABLE'}
                </span>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReachabilityAnalysis;
