import React, { useState } from 'react';
import type { Device, Site, Link } from '../../types';
import { mockDevices, mockLinks, mockSites } from '../../data/mockData';

interface EnhancedNetworkMapProps {
  onDeviceSelect?: (device: Device) => void;
  onSiteSelect?: (site: Site) => void;
  devices?: Device[];
  links?: Link[];
}

const EnhancedNetworkMap: React.FC<EnhancedNetworkMapProps> = ({ 
  onDeviceSelect, 
  onSiteSelect,
  devices = mockDevices,
  links = mockLinks 
}) => {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [, setSelectedSite] = useState<Site | null>(null);
  const [showDeviceNames, setShowDeviceNames] = useState(true);
  const [showIPAddresses, setShowIPAddresses] = useState(false);
  const [showLinks, setShowLinks] = useState(true);
  const [showVLANs, setShowVLANs] = useState(false);
  const [showSecurityZones, setShowSecurityZones] = useState(false);
  const [showDependencies, setShowDependencies] = useState(false);
  const [layoutType, setLayoutType] = useState<'radial' | 'hierarchical' | 'force-directed' | 'geographic'>('radial');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const getDeviceColor = (status: Device['status']) => {
    switch (status) {
      case 'up': return 'fill-green-500';
      case 'down': return 'fill-red-500';
      case 'warning': return 'fill-yellow-500';
      case 'unknown': return 'fill-gray-500';
      default: return 'fill-gray-500';
    }
  };

  const getDeviceIcon = (vendor: string) => {
    switch (vendor.toLowerCase()) {
      case 'cisco': return '🖧';
      case 'dell': return '🖥️';
      case 'fortinet': return '🔒';
      case 'juniper': return '🌲';
      case 'hp': return '💻';
      default: return '🌐';
    }
  };

  const getVLANColor = (vlanId: string) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const index = parseInt(vlanId) % colors.length;
    return colors[index];
  };

  const getSecurityZoneColor = (device: Device) => {
    if (device.roles.some(role => role.name.includes('Firewall'))) return '#FF6B6B';
    if (device.roles.some(role => role.name.includes('DMZ'))) return '#FFEAA7';
    if (device.roles.some(role => role.name.includes('Internal'))) return '#96CEB4';
    return '#DDA0DD';
  };

  const handleDeviceClick = (device: Device) => {
    setSelectedDevice(device);
    onDeviceSelect?.(device);
  };

  const handleSiteClick = (site: Site) => {
    setSelectedSite(site);
    onSiteSelect?.(site);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.2, 0.1));
  };

  const handleResetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const getRadialCoordinates = (index: number, total: number, radius: number) => {
    const angle = (index / total) * 2 * Math.PI;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return { x, y };
  };

  const getHierarchicalCoordinates = (device: Device) => {
    const coreDevices = devices.filter(d => d.roles.some(r => r.name.includes('Core')));
    const accessDevices = devices.filter(d => d.roles.some(r => r.name.includes('Access')));
    
    if (coreDevices.includes(device)) {
      return { x: 0, y: 0 };
    } else if (accessDevices.includes(device)) {
      const accessIndex = accessDevices.indexOf(device);
      const angle = (accessIndex / accessDevices.length) * 2 * Math.PI;
      return { x: 150 * Math.cos(angle), y: 150 * Math.sin(angle) };
    } else {
      const otherIndex = devices.filter(d => !coreDevices.includes(d) && !accessDevices.includes(d)).indexOf(device);
      const angle = (otherIndex / (devices.length - coreDevices.length - accessDevices.length)) * 2 * Math.PI;
      return { x: 250 * Math.cos(angle), y: 250 * Math.sin(angle) };
    }
  };

  const getDeviceCoordinates = (device: Device, index: number) => {
    switch (layoutType) {
      case 'radial':
        return getRadialCoordinates(index, devices.length, 200);
      case 'hierarchical':
        return getHierarchicalCoordinates(device);
      case 'force-directed':
        return getRadialCoordinates(index, devices.length, 180);
      case 'geographic':
        return getRadialCoordinates(index, devices.length, 160);
      default:
        return getRadialCoordinates(index, devices.length, 200);
    }
  };

  return (
    <div className="flex h-full bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Left Sidebar for Controls */}
      <div className="w-80 bg-gray-900 p-4 border-r border-gray-700 overflow-y-auto">
        <h3 className="text-lg font-semibold text-white mb-4">Network Map Controls</h3>
        
        {/* Layout Controls */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-white mb-2">Layout</h4>
          <select
            value={layoutType}
            onChange={(e) => setLayoutType(e.target.value as typeof layoutType)}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="radial">Radial</option>
            <option value="hierarchical">Hierarchical</option>
            <option value="force-directed">Force-Directed</option>
            <option value="geographic">Geographic</option>
          </select>
        </div>

        {/* Display Options */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-white mb-2">Display Options</h4>
          <div className="space-y-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                checked={showDeviceNames}
                onChange={() => setShowDeviceNames(!showDeviceNames)}
              />
              <span className="ml-2 text-gray-300">Device Names</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                checked={showIPAddresses}
                onChange={() => setShowIPAddresses(!showIPAddresses)}
              />
              <span className="ml-2 text-gray-300">IP Addresses</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                checked={showLinks}
                onChange={() => setShowLinks(!showLinks)}
              />
              <span className="ml-2 text-gray-300">Network Links</span>
            </label>
          </div>
        </div>

        {/* Overlay Options */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-white mb-2">Overlays</h4>
          <div className="space-y-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                checked={showVLANs}
                onChange={() => setShowVLANs(!showVLANs)}
              />
              <span className="ml-2 text-gray-300">VLAN Overlay</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                checked={showSecurityZones}
                onChange={() => setShowSecurityZones(!showSecurityZones)}
              />
              <span className="ml-2 text-gray-300">Security Zones</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                checked={showDependencies}
                onChange={() => setShowDependencies(!showDependencies)}
              />
              <span className="ml-2 text-gray-300">Dependencies</span>
            </label>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-white mb-2">View Controls</h4>
          <div className="flex space-x-2">
            <button
              onClick={handleZoomIn}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Zoom In
            </button>
            <button
              onClick={handleZoomOut}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Zoom Out
            </button>
            <button
              onClick={handleResetView}
              className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
            >
              Reset
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Zoom: {Math.round(zoomLevel * 100)}%
          </div>
        </div>

        {/* Status Legend */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-900 mb-2">Status Legend</h4>
          <ul className="space-y-1 text-sm text-gray-700">
            <li className="flex items-center"><span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span> Up</li>
            <li className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span> Down</li>
            <li className="flex items-center"><span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span> Warning</li>
            <li className="flex items-center"><span className="w-3 h-3 rounded-full bg-gray-500 mr-2"></span> Unknown</li>
          </ul>
        </div>

        {/* Selected Device Info */}
        {selectedDevice && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-md font-medium text-gray-900 mb-2">Selected Device</h4>
            <div className="text-sm text-gray-700">
              <p><strong>Name:</strong> {selectedDevice.hostname}</p>
              <p><strong>IP:</strong> {selectedDevice.ipAddresses[0]}</p>
              <p><strong>Vendor:</strong> {selectedDevice.vendor}</p>
              <p><strong>Status:</strong> <span className={`font-bold ${selectedDevice.status === 'up' ? 'text-green-500' : 'text-red-500'}`}>{selectedDevice.status.toUpperCase()}</span></p>
              <p><strong>Roles:</strong> {selectedDevice.roles.map(role => role.name).join(', ')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Diagram Area */}
      <div className="flex-1 relative overflow-hidden">
        <div
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <svg 
            className="w-full h-full" 
            viewBox="-300 -300 600 600"
            style={{ 
              transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
              transition: isDragging ? 'none' : 'transform 0.2s ease-out'
            }}
          >
            {/* Grid Background */}
            <defs>
              <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 L 0 10" fill="none" stroke="rgba(128,128,128,0.1)" strokeWidth="0.5"/>
              </pattern>
              <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#smallGrid)"/>
                <path d="M 100 0 L 0 0 L 0 100" fill="none" stroke="rgba(128,128,128,0.2)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect x="-300" y="-300" width="600" height="600" fill="url(#grid)" />

            {/* Security Zone Overlay */}
            {showSecurityZones && devices.map((device, index) => {
              const { x, y } = getDeviceCoordinates(device, index);
              return (
                <circle
                  key={`security-${device.id}`}
                  cx={x}
                  cy={y}
                  r="35"
                  fill={getSecurityZoneColor(device)}
                  fillOpacity="0.1"
                  stroke={getSecurityZoneColor(device)}
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              );
            })}

            {/* VLAN Overlay */}
            {showVLANs && devices.map((device, index) => {
              const { x, y } = getDeviceCoordinates(device, index);
              const vlanId = device.interfaces[0]?.vlanId || '1';
              return (
                <circle
                  key={`vlan-${device.id}`}
                  cx={x}
                  cy={y}
                  r="30"
                  fill={getVLANColor(vlanId)}
                  fillOpacity="0.2"
                  stroke={getVLANColor(vlanId)}
                  strokeWidth="1"
                />
              );
            })}

            {/* Links */}
            {showLinks && links.map((link) => {
              const sourceDevice = devices.find(d => d.interfaces.some(i => i.id === link.sourceInterfaceId));
              const targetDevice = devices.find(d => d.interfaces.some(i => i.id === link.targetInterfaceId));

              if (!sourceDevice || !targetDevice) return null;

              const sourceIndex = devices.indexOf(sourceDevice);
              const targetIndex = devices.indexOf(targetDevice);
              const sourceCoords = getDeviceCoordinates(sourceDevice, sourceIndex);
              const targetCoords = getDeviceCoordinates(targetDevice, targetIndex);

              return (
                <g key={link.id}>
                  <line
                    x1={sourceCoords.x}
                    y1={sourceCoords.y}
                    x2={targetCoords.x}
                    y2={targetCoords.y}
                    stroke="#10B981"
                    strokeWidth="2"
                    className="transition-all duration-300"
                  />
                  {/* Link Label */}
                  <text
                    x={(sourceCoords.x + targetCoords.x) / 2}
                    y={(sourceCoords.y + targetCoords.y) / 2 - 5}
                    textAnchor="middle"
                    className="text-xs fill-gray-600"
                  >
                    {link.speed || '1G'}
                  </text>
                </g>
              );
            })}

            {/* Dependencies */}
            {showDependencies && devices.map((device, deviceIndex) => {
              const { x, y } = getDeviceCoordinates(device, deviceIndex);
              return device.dependencies.map((dep, depIndex) => {
                const parentDevice = devices.find(d => d.id === dep.parentDeviceId);
                if (!parentDevice) return null;
                
                const parentIndex = devices.indexOf(parentDevice);
                const parentCoords = getDeviceCoordinates(parentDevice, parentIndex);
                
                return (
                  <line
                    key={`dep-${device.id}-${depIndex}`}
                    x1={x}
                    y1={y}
                    x2={parentCoords.x}
                    y2={parentCoords.y}
                    stroke="#8B5CF6"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                    opacity="0.6"
                  />
                );
              });
            })}

            {/* Devices */}
            {devices.map((device, index) => {
              const { x, y } = getDeviceCoordinates(device, index);
              const isSelected = selectedDevice?.id === device.id;

              return (
                <g
                  key={device.id}
                  transform={`translate(${x}, ${y})`}
                  className="cursor-pointer hover:scale-110 transition-transform duration-200"
                  onClick={() => handleDeviceClick(device)}
                >
                  {/* Device Circle */}
                  <circle
                    r="20"
                    className={`${getDeviceColor(device.status)} stroke-2 ${isSelected ? 'stroke-blue-400' : 'stroke-gray-300'}`}
                  />
                  
                  {/* Device Icon */}
                  <text
                    x="0"
                    y="5"
                    textAnchor="middle"
                    className="text-xl"
                    fill="white"
                  >
                    {getDeviceIcon(device.vendor)}
                  </text>
                  
                  {/* Device Name */}
                  {showDeviceNames && (
                    <text
                      x="0"
                      y="35"
                      textAnchor="middle"
                      className="text-xs fill-gray-800 font-medium"
                    >
                      {device.hostname}
                    </text>
                  )}
                  
                  {/* IP Address */}
                  {showIPAddresses && (
                    <text
                      x="0"
                      y="48"
                      textAnchor="middle"
                      className="text-xs fill-gray-600"
                    >
                      {device.ipAddresses[0]}
                    </text>
                  )}
                  
                  {/* Status Indicator */}
                  <circle
                    cx="15"
                    cy="-15"
                    r="3"
                    className={getDeviceColor(device.status)}
                  />
                </g>
              );
            })}

            {/* Sites */}
            {layoutType === 'geographic' && mockSites.map((site, siteIndex) => {
              const angle = (siteIndex / mockSites.length) * 2 * Math.PI;
              const x = 300 * Math.cos(angle);
              const y = 300 * Math.sin(angle);
              
              return (
                <g
                  key={site.id}
                  transform={`translate(${x}, ${y})`}
                  className="cursor-pointer"
                  onClick={() => handleSiteClick(site)}
                >
                  <rect
                    x="-30"
                    y="-15"
                    width="60"
                    height="30"
                    rx="5"
                    fill="#3B82F6"
                    fillOpacity="0.8"
                    stroke="#1E40AF"
                    strokeWidth="2"
                  />
                  <text
                    x="0"
                    y="0"
                    textAnchor="middle"
                    className="text-sm fill-white font-medium"
                  >
                    {site.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Right Sidebar for Device Details */}
      {selectedDevice && (
        <div className="w-80 bg-gray-50 p-4 border-l border-gray-200 overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Details</h3>
          <div className="space-y-4">
            {/* Basic Info */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-2">Basic Information</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <p><strong>Hostname:</strong> {selectedDevice.hostname}</p>
                <p><strong>IP Addresses:</strong> {selectedDevice.ipAddresses.join(', ')}</p>
                <p><strong>Vendor:</strong> {selectedDevice.vendor}</p>
                <p><strong>Model:</strong> {selectedDevice.model}</p>
                <p><strong>OS:</strong> {selectedDevice.os}</p>
                <p><strong>Status:</strong> <span className={`font-bold ${selectedDevice.status === 'up' ? 'text-green-500' : 'text-red-500'}`}>{selectedDevice.status.toUpperCase()}</span></p>
              </div>
            </div>

            {/* Roles */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-2">Roles</h4>
              <div className="flex flex-wrap gap-1">
                {selectedDevice.roles.map((role, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {role.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Interfaces */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-2">Interfaces ({selectedDevice.interfaces.length})</h4>
              <div className="space-y-1">
                {selectedDevice.interfaces.slice(0, 5).map((iface, index) => (
                  <div key={index} className="text-sm text-gray-700">
                    <span className="font-medium">{iface.name}</span>
                    <span className="ml-2 text-gray-500">(up)</span>
                  </div>
                ))}
                {selectedDevice.interfaces.length > 5 && (
                  <div className="text-sm text-gray-500">
                    +{selectedDevice.interfaces.length - 5} more interfaces
                  </div>
                )}
              </div>
            </div>

            {/* Dependencies */}
            {selectedDevice.dependencies.length > 0 && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-2">Dependencies</h4>
                <div className="space-y-1">
                  {selectedDevice.dependencies.map((_, index) => (
                    <div key={index} className="text-sm text-gray-700">
                      <span className="font-medium">Dependency</span>
                      <span className="ml-2 text-gray-500">(downstream)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => onDeviceSelect?.(selectedDevice)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-2"
              >
                View Full Details
              </button>
              <button
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Configure Device
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedNetworkMap;
