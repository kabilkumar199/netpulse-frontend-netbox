import React, { useState } from 'react';
import type { Device, Link } from '../../types';
import { mockDevices, mockLinks } from '../../data/mockData';
import { protocolService, type ProtocolIngestionResult } from '../../services/protocolService';
import EnhancedNetworkMap from './EnhancedNetworkMap';

interface NetworkProtocolIngestionProps {
  onClose?: () => void;
}

type ProtocolType = 'lldp' | 'cdp' | 'isis' | 'ospf' | 'bgp' | 'vxlan' | 'evpn';

interface ProtocolConfig {
  name: string;
  icon: string;
  description: string;
  enabled: boolean;
  settings: Record<string, any>;
}

interface IngestionResult extends ProtocolIngestionResult {
  id: string;
  status: 'success' | 'error' | 'warning';
  details?: Record<string, any>;
}

const NetworkProtocolIngestion: React.FC<NetworkProtocolIngestionProps> = ({ onClose }) => {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestionResults, setIngestionResults] = useState<IngestionResult[]>([]);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolType>('lldp');
  const [showProtocolDropdown, setShowProtocolDropdown] = useState(false);
  const [showTopologyView, setShowTopologyView] = useState(false);
  const [discoveredLinks, setDiscoveredLinks] = useState<Link[]>([]);

  const [protocols, setProtocols] = useState<Record<ProtocolType, ProtocolConfig>>({
    lldp: {
      name: 'LLDP',
      icon: '🔗',
      description: 'Link Layer Discovery Protocol - Layer 2 neighbor discovery',
      enabled: true,
      settings: {
        includeCDP: true,
        pollingInterval: 300,
        timeout: 120,
      },
    },
    cdp: {
      name: 'CDP',
      icon: '🔷',
      description: 'Cisco Discovery Protocol - Cisco proprietary neighbor discovery',
      enabled: true,
      settings: {
        pollingInterval: 300,
        timeout: 60,
      },
    },
    isis: {
      name: 'IS-IS',
      icon: '🛣️',
      description: 'Intermediate System to Intermediate System - Link-state routing protocol',
      enabled: false,
      settings: {
        level: 'both', // 'level-1', 'level-2', 'both'
        areaFilter: '',
        includeMetrics: true,
        pollingInterval: 600,
      },
    },
    ospf: {
      name: 'OSPF',
      icon: '🗺️',
      description: 'Open Shortest Path First - Link-state routing protocol',
      enabled: false,
      settings: {
        areas: [], // specific OSPF areas to query
        includeMetrics: true,
        includeRoutes: true,
        pollingInterval: 600,
      },
    },
    bgp: {
      name: 'BGP',
      icon: '🌐',
      description: 'Border Gateway Protocol - Interdomain routing protocol',
      enabled: false,
      settings: {
        includeRoutes: true,
        addressFamilies: ['ipv4', 'ipv6'],
        minPrefixes: 0,
        pollingInterval: 900,
      },
    },
    vxlan: {
      name: 'VXLAN',
      icon: '🔀',
      description: 'Virtual Extensible LAN - Data center overlay network',
      enabled: false,
      settings: {
        includeVTEPs: true,
        includeVNIs: true,
        pollingInterval: 300,
      },
    },
    evpn: {
      name: 'EVPN',
      icon: '🌉',
      description: 'Ethernet VPN - BGP-based control plane for VXLAN',
      enabled: false,
      settings: {
        addressFamily: 'l2vpn evpn',
        includeRoutes: true,
        pollingInterval: 600,
      },
    },
  });

  const handleProtocolToggle = (protocol: ProtocolType) => {
    setProtocols((prev) => ({
      ...prev,
      [protocol]: {
        ...prev[protocol],
        enabled: !prev[protocol].enabled,
      },
    }));
  };

  // Convert ingestion results to discovered links
  const buildDiscoveredLinks = (results: IngestionResult[]): Link[] => {
    const links: Link[] = [];
    
    results.forEach((result) => {
      if (!result.success || !result.linksDiscovered) return;
      
      // Filter mockLinks to get links discovered by this protocol
      const protocolLinks = mockLinks.filter(link => 
        link.discoverySource === result.protocol
      );
      
      links.push(...protocolLinks);
    });
    
    // Remove duplicates by link id
    const uniqueLinks = Array.from(
      new Map(links.map(link => [link.id, link])).values()
    );
    
    return uniqueLinks;
  };

  const handleStartIngestion = async () => {
    if (!selectedDevice) {
      alert('Please select a device to start protocol ingestion');
      return;
    }

    const enabledProtocols = Object.entries(protocols)
      .filter(([_, config]) => config.enabled)
      .map(([type]) => type as ProtocolType);

    if (enabledProtocols.length === 0) {
      alert('Please enable at least one protocol');
      return;
    }

    setIsIngesting(true);

    try {
      // Use protocolService for real ingestion
      const serviceResults = await protocolService.ingestDevice(selectedDevice, enabledProtocols);

      // Convert to UI result format
      const results: IngestionResult[] = serviceResults.map((sr, index) => ({
        ...sr,
        id: `result-${sr.protocol}-${Date.now()}-${index}`,
        status: sr.success ? 'success' : 'error',
        details: sr.data,
      }));

      const allResults = [...ingestionResults, ...results];
      setIngestionResults(allResults);
      
      // Build discovered topology links
      const links = buildDiscoveredLinks(allResults);
      setDiscoveredLinks(links);
      
      // Auto-show topology if links discovered
      if (links.length > 0) {
        setShowTopologyView(true);
      }
    } catch (error) {
      console.error('Ingestion error:', error);
      alert('Protocol ingestion failed. Check console for details.');
    }

    setIsIngesting(false);
  };

  const handleBulkIngestion = async () => {
    const enabledProtocols = Object.entries(protocols)
      .filter(([_, config]) => config.enabled)
      .map(([type]) => type as ProtocolType);

    if (enabledProtocols.length === 0) {
      alert('Please enable at least one protocol');
      return;
    }

    // Show user what protocols will run
    console.log('Running bulk ingestion with protocols:', enabledProtocols);
    console.log('Total devices:', mockDevices.length);
    console.log('Expected results:', mockDevices.length * enabledProtocols.length);

    setIsIngesting(true);

    try {
      // Use protocolService for bulk ingestion
      const serviceResults = await protocolService.bulkIngest(mockDevices, enabledProtocols);

      console.log('Ingestion complete. Results:', serviceResults.length);
      console.log('Results by protocol:', 
        enabledProtocols.map(p => `${p}: ${serviceResults.filter(r => r.protocol === p).length}`)
      );

      // Convert to UI result format
      const results: IngestionResult[] = serviceResults.map((sr, index) => ({
        ...sr,
        id: `result-${sr.deviceId}-${sr.protocol}-${Date.now()}-${index}`,
        status: sr.success ? 'success' : 'error',
        details: sr.data,
      }));

      setIngestionResults(results);
      
      // Build discovered topology links
      const links = buildDiscoveredLinks(results);
      setDiscoveredLinks(links);
      
      // Auto-show topology if links discovered
      if (links.length > 0) {
        setShowTopologyView(true);
      }
    } catch (error) {
      console.error('Bulk ingestion error:', error);
      alert('Bulk protocol ingestion failed. Check console for details.');
    }

    setIsIngesting(false);
  };

  const getProtocolIcon = (protocol: ProtocolType) => {
    return protocols[protocol].icon;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return '⚪';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-900 text-green-300';
      case 'error':
        return 'bg-red-900 text-red-300';
      case 'warning':
        return 'bg-yellow-900 text-yellow-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(timestamp);
  };

  const getDeviceIcon = (device: Device) => {
    switch (device.vendor) {
      case 'Cisco':
        return '🔷';
      case 'Dell':
        return '💻';
      case 'Fortinet':
        return '🛡️';
      default:
        return '🖥️';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Network Protocol Ingestion</h1>
          <p className="text-gray-400 mt-1">
            Discover network topology using LLDP, CDP, IS-IS, OSPF, and BGP protocols
          </p>
        </div>
      </div>

      {/* Protocol Selection - Compact */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-4">
        <div className="relative">
          {/* Dropdown Button */}
          <button
            onClick={() => setShowProtocolDropdown(!showProtocolDropdown)}
            className="w-full flex items-center justify-between p-3 border-2 border-gray-600 rounded-lg bg-gray-700 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-300">Protocols:</span>
              <div className="flex items-center gap-2">
                {Object.entries(protocols)
                  .filter(([_, config]) => config.enabled)
                  .map(([type, config]) => (
                    <span
                      key={type}
                      className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded-md text-xs font-medium flex items-center space-x-1"
                    >
                      <span>{config.icon}</span>
                      <span>{config.name}</span>
                    </span>
                  ))}
                {Object.values(protocols).filter(c => c.enabled).length === 0 && (
                  <span className="text-sm text-gray-500 italic">None selected</span>
                )}
              </div>
            </div>
            <span className="text-gray-500">{showProtocolDropdown ? '▲' : '▼'}</span>
          </button>

          {/* Dropdown Content */}
          {showProtocolDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-gray-800 border-2 border-gray-600 rounded-lg shadow-lg p-3 space-y-2">
              {(Object.entries(protocols) as [ProtocolType, ProtocolConfig][]).map(([type, config]) => (
                <label
                  key={type}
                  className={`flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-gray-700 ${
                    config.enabled ? 'bg-blue-900/20' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={() => handleProtocolToggle(type)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-lg">{config.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{config.name}</div>
                    <div className="text-xs text-gray-400">{config.description}</div>
                  </div>
                </label>
              ))}
              
              {/* Quick Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                <button
                  onClick={() => {
                    setProtocols((prev) => {
                      const updated = { ...prev };
                      Object.keys(updated).forEach((key) => {
                        updated[key as ProtocolType].enabled = true;
                      });
                      return updated;
                    });
                  }}
                  className="flex-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  All
                </button>
                <button
                  onClick={() => {
                    setProtocols((prev) => {
                      const updated = { ...prev };
                      Object.keys(updated).forEach((key) => {
                        updated[key as ProtocolType].enabled = false;
                      });
                      return updated;
                    });
                  }}
                  className="flex-1 px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  None
                </button>
                <button
                  onClick={() => {
                    setProtocols((prev) => {
                      const updated = { ...prev };
                      updated.lldp.enabled = true;
                      updated.cdp.enabled = true;
                      updated.isis.enabled = false;
                      updated.ospf.enabled = false;
                      updated.bgp.enabled = false;
                      updated.vxlan.enabled = false;
                      updated.evpn.enabled = false;
                      return updated;
                    });
                  }}
                  className="flex-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                >
                  L2 Only
                </button>
                <button
                  onClick={() => {
                    setProtocols((prev) => {
                      const updated = { ...prev };
                      updated.lldp.enabled = false;
                      updated.cdp.enabled = false;
                      updated.isis.enabled = true;
                      updated.ospf.enabled = true;
                      updated.bgp.enabled = true;
                      updated.vxlan.enabled = false;
                      updated.evpn.enabled = false;
                      return updated;
                    });
                  }}
                  className="flex-1 px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Routing
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Protocol Settings */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-4">
        <h3 className="text-base font-semibold text-white mb-3">Protocol Settings</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Protocol for Configuration
            </label>
            <select
              value={selectedProtocol}
              onChange={(e) => setSelectedProtocol(e.target.value as ProtocolType)}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(protocols).map(([type, config]) => (
                <option key={type} value={type}>
                  {config.icon} {config.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic Protocol Settings */}
          <div className="p-4 bg-gray-700 rounded-lg">
            <h4 className="font-medium text-white mb-3">
              {protocols[selectedProtocol].name} Settings
            </h4>

            {selectedProtocol === 'lldp' && (
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-300">Include CDP</span>
                </label>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Polling Interval (seconds)
                  </label>
                  <input
                    type="number"
                    defaultValue="300"
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {selectedProtocol === 'isis' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    IS-IS Level
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="both">Both (Level-1 & Level-2)</option>
                    <option value="level-1">Level-1 Only</option>
                    <option value="level-2">Level-2 Only</option>
                  </select>
                </div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-300">Include Metrics</span>
                </label>
              </div>
            )}

            {selectedProtocol === 'ospf' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    OSPF Areas (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="0.0.0.0, 0.0.0.1"
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-300">Include Routes</span>
                </label>
              </div>
            )}

            {selectedProtocol === 'bgp' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Address Families
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-300">IPv4 Unicast</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-300">IPv6 Unicast</span>
                    </label>
                  </div>
                </div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-300">Include Route Tables</span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Device Selection */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-4">
        <h3 className="text-base font-semibold text-white mb-3">Device Selection</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Device</label>
            <select
              value={selectedDevice?.id || ''}
              onChange={(e) => {
                const device = mockDevices.find((d) => d.id === e.target.value);
                setSelectedDevice(device || null);
              }}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a device...</option>
              {mockDevices.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.hostname} ({device.vendor} {device.model})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end space-x-3">
            <button
              onClick={handleStartIngestion}
              disabled={!selectedDevice || isIngesting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isIngesting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Ingesting...</span>
                </>
              ) : (
                <>
                  <span>🔍</span>
                  <span>Start Ingestion</span>
                </>
              )}
            </button>

            <button
              onClick={handleBulkIngestion}
              disabled={isIngesting}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isIngesting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Bulk Ingesting...</span>
                </>
              ) : (
                <>
                  <span>🔄</span>
                  <span>Bulk Ingestion</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Selected Device Info */}
      {selectedDevice && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Information</h3>

          <div className="flex items-center space-x-4">
            <span className="text-3xl">{getDeviceIcon(selectedDevice)}</span>
            <div>
              <div className="font-medium text-gray-900">{selectedDevice.hostname}</div>
              <div className="text-sm text-gray-500">
                {selectedDevice.vendor} {selectedDevice.model} • {selectedDevice.os}
              </div>
              <div className="text-sm text-gray-500">
                IP: {selectedDevice.ipAddresses[0]} • Status: {selectedDevice.status.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ingestion Results */}
      {ingestionResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-900">Ingestion Results</h3>
            <button
              onClick={() => setIngestionResults([])}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200:bg-gray-600"
            >
              Clear Results
            </button>
          </div>

          <div className="space-y-3">
            {ingestionResults.map((result) => (
              <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getStatusIcon(result.status)}</span>
                    <span className="text-xl">{getProtocolIcon(result.protocol)}</span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{result.deviceName}</span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {result.protocol.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTimestamp(result.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                      {result.status.toUpperCase()}
                    </span>
                    <button
                      onClick={() => setShowDetails(showDetails === result.id ? null : result.id)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      {showDetails === result.id ? 'Hide' : 'Show'} Details
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  {result.neighborsFound > 0 && (
                    <div>
                      <span className="text-gray-600">Neighbors:</span>
                      <div className="font-medium text-gray-900">{result.neighborsFound}</div>
                    </div>
                  )}
                  {result.linksDiscovered > 0 && (
                    <div>
                      <span className="text-gray-600">Links:</span>
                      <div className="font-medium text-gray-900">{result.linksDiscovered}</div>
                    </div>
                  )}
                  {result.routesDiscovered !== undefined && (
                    <div>
                      <span className="text-gray-600">Routes:</span>
                      <div className="font-medium text-gray-900">{result.routesDiscovered}</div>
                    </div>
                  )}
                  {result.prefixesReceived !== undefined && (
                    <div>
                      <span className="text-gray-600">Prefixes:</span>
                      <div className="font-medium text-gray-900">
                        {result.prefixesReceived.toLocaleString()}
                      </div>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">Errors:</span>
                    <div className="font-medium text-gray-900">{result.errors.length}</div>
                  </div>
                </div>

                {showDetails === result.id && result.details && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h5 className="font-medium text-gray-900 mb-2">Detailed Results</h5>
                    <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto text-gray-900">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                    {result.errors.length > 0 && (
                      <div className="mt-3">
                        <span className="text-sm font-medium text-gray-600">Errors:</span>
                        <div className="mt-1 space-y-1">
                          {result.errors.map((error, index) => (
                            <div key={index} className="text-red-600 text-xs">
                              • {error}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Discovered Topology */}
      {discoveredLinks.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* View Toggle */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-900">
              Discovered Topology ({discoveredLinks.length} links)
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowTopologyView(false)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  !showTopologyView
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200:bg-gray-600'
                }`}
              >
                📋 List View
              </button>
              <button
                onClick={() => setShowTopologyView(true)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  showTopologyView
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200:bg-gray-600'
                }`}
              >
                🗺️ Topology View
              </button>
            </div>
          </div>

          {/* Topology Graph View */}
          {showTopologyView ? (
            <div className="p-4">
              <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                <EnhancedNetworkMap 
                  onDeviceSelect={(device) => console.log('Selected device:', device)}
                />
              </div>
            </div>
          ) : (
            /* List View */
            <div className="p-4 space-y-2">
              {discoveredLinks.map((link) => {
                const sourceDevice = mockDevices.find((d) => d.id === link.sourceDeviceId);
                const targetDevice = mockDevices.find((d) => d.id === link.targetDeviceId);

                return (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getProtocolIcon(link.discoverySource as ProtocolType)}</span>
                      <div>
                        <div className="font-medium text-gray-900">
                          {sourceDevice?.hostname} ↔ {targetDevice?.hostname}
                        </div>
                        <div className="text-sm text-gray-500">
                          {protocols[link.discoverySource as ProtocolType]?.name || link.discoverySource.toUpperCase()} 
                          {' • '}Confidence: {(link.confidence * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          link.isUp
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {link.isUp ? 'UP' : 'DOWN'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {link.speed ? `${(link.speed / 1000000).toFixed(0)} Mbps` : 'N/A'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NetworkProtocolIngestion;

