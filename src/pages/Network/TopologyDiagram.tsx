import React, { useState, useRef } from 'react';
import type { Device, Link } from '../../types';
import { mockDevices, mockLinks } from '../../data/mockData';

interface TopologyDiagramProps {
  onDeviceSelect?: (device: Device) => void;
}

const TopologyDiagram: React.FC<TopologyDiagramProps> = ({ onDeviceSelect }) => {
  const [devices] = useState<Device[]>(mockDevices);
  const [links] = useState<Link[]>(mockLinks);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showDeviceNames, setShowDeviceNames] = useState(true);
  const [showDeviceIPs, setShowDeviceIPs] = useState(false);
  const [showLinks, setShowLinks] = useState(true);
  const [layout, setLayout] = useState<'radial' | 'hierarchical' | 'force'>('radial');
  const svgRef = useRef<SVGSVGElement>(null);

  const getDeviceIcon = (device: Device) => {
    switch (device.vendor) {
      case 'Cisco': return '🔷';
      case 'Dell': return '💻';
      case 'Fortinet': return '🛡️';
      default: return '🖥️';
    }
  };

  const getDeviceColor = (device: Device) => {
    switch (device.status) {
      case 'up': return '#10B981'; // green
      case 'down': return '#EF4444'; // red
      case 'warning': return '#F59E0B'; // yellow
      case 'unknown': return '#6B7280'; // gray
      default: return '#6B7280';
    }
  };

  const getDeviceStrokeColor = (device: Device) => {
    return selectedDevice?.id === device.id ? '#3B82F6' : '#374151';
  };

  const calculateRadialLayout = () => {
    const centerX = 400;
    const centerY = 300;
    const radius = 200;
    
    return devices.map((device, index) => {
      const angle = (index / devices.length) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      return { device, x, y };
    });
  };

  const calculateHierarchicalLayout = () => {
    const coreDevices = devices.filter(d => d.roles.some(r => r.name.includes('Core')));
    const accessDevices = devices.filter(d => d.roles.some(r => r.name.includes('Access')));
    const otherDevices = devices.filter(d => !coreDevices.includes(d) && !accessDevices.includes(d));
    
    const positions: Array<{ device: Device; x: number; y: number }> = [];
    
    // Core devices in center
    coreDevices.forEach((device, index) => {
      positions.push({
        device,
        x: 400 + (index - coreDevices.length / 2) * 100,
        y: 300
      });
    });
    
    // Access devices around core
    accessDevices.forEach((device, index) => {
      const angle = (index / accessDevices.length) * 2 * Math.PI;
      positions.push({
        device,
        x: 400 + 150 * Math.cos(angle),
        y: 300 + 150 * Math.sin(angle)
      });
    });
    
    // Other devices in outer ring
    otherDevices.forEach((device, index) => {
      const angle = (index / otherDevices.length) * 2 * Math.PI;
      positions.push({
        device,
        x: 400 + 250 * Math.cos(angle),
        y: 300 + 250 * Math.sin(angle)
      });
    });
    
    return positions;
  };

  const getDevicePositions = () => {
    switch (layout) {
      case 'radial': return calculateRadialLayout();
      case 'hierarchical': return calculateHierarchicalLayout();
      default: return calculateRadialLayout();
    }
  };

  const handleDeviceClick = (device: Device) => {
    setSelectedDevice(device);
    onDeviceSelect?.(device);
  };

  const devicePositions = getDevicePositions();

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            Network Topology Diagram
          </h3>
          
          <div className="flex items-center space-x-4">
            {/* Layout Options */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-300">Layout:</label>
              <select
                value={layout}
                onChange={(e) => setLayout(e.target.value as any)}
                className="px-3 py-1 border border-gray-600 rounded-lg bg-gray-700 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="radial">Radial</option>
                <option value="hierarchical">Hierarchical</option>
                <option value="force">Force-Directed</option>
              </select>
            </div>
            
            {/* Display Options */}
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showDeviceNames}
                  onChange={(e) => setShowDeviceNames(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">Device Names</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showDeviceIPs}
                  onChange={(e) => setShowDeviceIPs(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">IP Addresses</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showLinks}
                  onChange={(e) => setShowLinks(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">Links</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Topology Diagram */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
        <div className="relative">
          <svg
            ref={svgRef}
            width="100%"
            height="600"
            viewBox="0 0 800 600"
            className="border border-gray-600 rounded-lg bg-gray-900"
          >
            {/* Background Grid */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Links */}
            {showLinks && links.map((link) => {
              const sourcePos = devicePositions.find(p => p.device.id === link.sourceDeviceId);
              const targetPos = devicePositions.find(p => p.device.id === link.targetDeviceId);
              
              if (!sourcePos || !targetPos) return null;
              
              return (
                <line
                  key={link.id}
                  x1={sourcePos.x}
                  y1={sourcePos.y}
                  x2={targetPos.x}
                  y2={targetPos.y}
                  stroke={link.isUp ? '#10B981' : '#EF4444'}
                  strokeWidth="2"
                  strokeDasharray={link.discoverySource === 'lldp' ? '5,5' : 'none'}
                  opacity="0.7"
                />
              );
            })}
            
            {/* Devices */}
            {devicePositions.map(({ device, x, y }) => (
              <g key={device.id}>
                {/* Device Circle */}
                <circle
                  cx={x}
                  cy={y}
                  r="25"
                  fill={getDeviceColor(device)}
                  stroke={getDeviceStrokeColor(device)}
                  strokeWidth={selectedDevice?.id === device.id ? "3" : "2"}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleDeviceClick(device)}
                />
                
                {/* Device Icon */}
                <text
                  x={x}
                  y={y + 5}
                  textAnchor="middle"
                  fontSize="16"
                  fill="white"
                  className="pointer-events-none select-none"
                >
                  {getDeviceIcon(device)}
                </text>
                
                {/* Device Label */}
                {showDeviceNames && (
                  <text
                    x={x}
                    y={y + 45}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#D1D5DB"
                    className="pointer-events-none select-none"
                  >
                    {device.hostname}
                  </text>
                )}
                
                {/* Device IP */}
                {showDeviceIPs && (
                  <text
                    x={x}
                    y={y + 60}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#9CA3AF"
                    className="pointer-events-none select-none"
                  >
                    {device.ipAddresses[0]}
                  </text>
                )}
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-4">
        <h4 className="font-medium text-white mb-3">Status Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-gray-300">Up</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-gray-300">Down</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span className="text-gray-300">Warning</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-gray-500"></div>
            <span className="text-gray-300">Unknown</span>
          </div>
        </div>
      </div>

      {/* Selected Device Info */}
      {selectedDevice && (
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Selected Device
            </h3>
            <button
              onClick={() => setSelectedDevice(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: getDeviceColor(selectedDevice) }}>
              {getDeviceIcon(selectedDevice)}
            </div>
            <div>
              <div className="font-medium text-white">
                {selectedDevice.hostname}
              </div>
              <div className="text-sm text-gray-400">
                {selectedDevice.vendor} {selectedDevice.model}
              </div>
              <div className="text-sm text-gray-400">
                IP: {selectedDevice.ipAddresses[0]} • Status: {selectedDevice.status.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Discovery Summary */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Discovery Summary
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {devices.length}
            </div>
            <div className="text-sm text-gray-400">
              Total Devices
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {devices.filter(d => d.status === 'up').length}
            </div>
            <div className="text-sm text-gray-400">
              Online Devices
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              {devices.filter(d => d.status === 'down').length}
            </div>
            <div className="text-sm text-gray-400">
              Offline Devices
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {links.length}
            </div>
            <div className="text-sm text-gray-400">
              Network Links
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopologyDiagram;
