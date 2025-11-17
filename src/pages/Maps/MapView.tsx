import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import type { Device, Site } from '../../types';
import { mockDevices, mockSites } from '../../data/mockData';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  onDeviceSelect?: (device: Device) => void;
  onSiteSelect?: (site: Site) => void;
  devices?: Device[];
}

// Custom icons for devices
const createDeviceIcon = (status: string, vendor: string) => {
  const colors = {
    up: '#10B981',
    down: '#EF4444',
    warning: '#F59E0B',
    unknown: '#6B7280'
  };

  const vendorShapes = {
    Cisco: 'M8 8h16v16H8z', // Square
    Dell: 'M16 4l8 8-8 8-8-8z', // Diamond
    Fortinet: 'M4 8h24v4H4z', // Rectangle
    default: 'M16 4l12 12-12 12L4 16z' // Diamond
  };

  const color = colors[status as keyof typeof colors] || colors.unknown;
  const shape = vendorShapes[vendor as keyof typeof vendorShapes] || vendorShapes.default;

  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="14" fill="${color}" stroke="#1F2937" stroke-width="2"/>
    <path d="${shape}" fill="white" transform="scale(0.8) translate(2, 2)"/>
  </svg>`;

  return new Icon({
    iconUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

// Custom icon for sites
const siteIcon = new Icon({
  iconUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="18" fill="#3B82F6" stroke="#1F2937" stroke-width="2"/>
      <rect x="12" y="14" width="16" height="12" fill="white"/>
      <rect x="14" y="16" width="2" height="8" fill="#3B82F6"/>
      <rect x="17" y="16" width="2" height="8" fill="#3B82F6"/>
      <rect x="20" y="16" width="2" height="8" fill="#3B82F6"/>
      <rect x="23" y="16" width="2" height="8" fill="#3B82F6"/>
      <polygon points="20,8 26,14 14,14" fill="white"/>
    </svg>
  `)}`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20]
});

const MapView: React.FC<MapViewProps> = ({ 
  onDeviceSelect, 
  onSiteSelect,
  devices = mockDevices 
}) => {
  const [selectedOverlay, setSelectedOverlay] = useState<'devices' | 'sites' | 'links' | 'alerts'>('devices');
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');
  const [zoom, setZoom] = useState(10);
  const [center, setCenter] = useState<[number, number]>([37.7749, -122.4194]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);


  const handleDeviceClick = (device: Device) => {
    setSelectedDevice(device);
    onDeviceSelect?.(device);
  };

  const handleSiteClick = (site: Site) => {
    setSelectedSite(site);
    onSiteSelect?.(site);
  };

  const getTileLayerUrl = () => {
    switch (mapType) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'terrain':
        return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      case 'hybrid':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  const getTileLayerAttribution = () => {
    switch (mapType) {
      case 'satellite':
        return '&copy; <a href="https://www.esri.com/">Esri</a>';
      case 'terrain':
        return '&copy; <a href="https://opentopomap.org/">OpenTopoMap</a>';
      case 'hybrid':
        return '&copy; <a href="https://www.esri.com/">Esri</a>';
      default:
        return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    }
  };

  // Add some mock coordinates for devices and sites
  const devicesWithCoords = devices.map((device) => ({
    ...device,
    coordinates: [
      37.7749 + (Math.random() - 0.5) * 0.1,
      -122.4194 + (Math.random() - 0.5) * 0.1
    ] as [number, number]
  }));

  const sitesWithCoords = mockSites.map((site) => ({
    ...site,
    coordinates: [
      37.7849 + (Math.random() - 0.5) * 0.05,
      -122.4094 + (Math.random() - 0.5) * 0.05
    ] as [number, number]
  }));

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Map Controls */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Overlay Selection */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-300">Show:</label>
            <div className="flex space-x-1">
              {[
                { key: 'devices', label: 'Devices', count: devicesWithCoords.length },
                { key: 'sites', label: 'Sites', count: sitesWithCoords.length },
                { key: 'links', label: 'Links', count: 0 },
                { key: 'alerts', label: 'Alerts', count: 0 }
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setSelectedOverlay(key as any)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    selectedOverlay === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>
          </div>

          {/* Map Type Selection */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-300">Map Type:</label>
            <select
              value={mapType}
              onChange={(e) => setMapType(e.target.value as any)}
              className="px-3 py-1 rounded bg-gray-700 text-white text-sm border border-gray-600"
            >
              <option value="roadmap">Road Map</option>
              <option value="satellite">Satellite</option>
              <option value="terrain">Terrain</option>
            </select>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-300">Zoom:</label>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setZoom(Math.max(1, zoom - 1))}
                className="w-8 h-8 bg-gray-600 text-white rounded hover:bg-gray-500 flex items-center justify-center"
              >
                −
              </button>
              <span className="text-sm text-gray-300 w-8 text-center">{zoom}</span>
              <button
                onClick={() => setZoom(Math.min(18, zoom + 1))}
                className="w-8 h-8 bg-gray-600 text-white rounded hover:bg-gray-500 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Center Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCenter([37.7749, -122.4194])}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Reset View
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          className="dark-map"
        >
          <TileLayer
            url={getTileLayerUrl()}
            attribution={getTileLayerAttribution()}
          />

          {/* Device Markers */}
          {selectedOverlay === 'devices' && devicesWithCoords.map((device) => (
            <Marker
              key={device.id}
              position={device.coordinates}
              icon={createDeviceIcon(device.status, device.vendor)}
              eventHandlers={{
                click: () => handleDeviceClick(device)
              }}
            >
              <Popup className="custom-popup">
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${
                      device.status === 'up' ? 'bg-green-500' :
                      device.status === 'down' ? 'bg-red-500' :
                      device.status === 'warning' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`} />
                    <h3 className="font-semibold text-gray-900">{device.hostname}</h3>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Vendor:</strong> {device.vendor}</p>
                    <p><strong>Model:</strong> {device.model}</p>
                    <p><strong>IP:</strong> {device.ipAddresses[0] || 'N/A'}</p>
                    <p><strong>Location:</strong> {device.location?.name || 'Unknown'}</p>
                    <p><strong>Last Seen:</strong> {device.lastSeen?.toLocaleDateString()}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Site Markers */}
          {selectedOverlay === 'sites' && sitesWithCoords.map((site) => (
            <Marker
              key={site.id}
              position={site.coordinates}
              icon={siteIcon}
              eventHandlers={{
                click: () => handleSiteClick(site)
              }}
            >
              <Popup className="custom-popup">
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-gray-900 mb-2">{site.name}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Description:</strong> {site.description}</p>
                    <p><strong>Location:</strong> {site.location?.name}</p>
                    <p><strong>Devices:</strong> {site.devices.length}</p>
                    <p><strong>Created:</strong> {site.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Map Info Overlay */}
        <div className="absolute top-4 right-4 bg-gray-800 bg-opacity-90 rounded-lg p-4 text-white">
          <h3 className="font-semibold mb-2">Map Information</h3>
          <div className="text-sm space-y-1">
            <p>Center: {center[0].toFixed(4)}, {center[1].toFixed(4)}</p>
            <p>Zoom: {zoom}</p>
            <p>Type: {mapType}</p>
            <p>Showing: {selectedOverlay}</p>
          </div>
        </div>
      </div>

      {/* Selected Item Info */}
      {(selectedDevice || selectedSite) && (
        <div className="bg-gray-800 border-t border-gray-700 p-4">
          {selectedDevice && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  selectedDevice.status === 'up' ? 'bg-green-500' :
                  selectedDevice.status === 'down' ? 'bg-red-500' :
                  selectedDevice.status === 'warning' ? 'bg-yellow-500' : 'bg-gray-500'
                }`} />
                <div>
                  <h3 className="font-semibold text-white">{selectedDevice.hostname}</h3>
                  <p className="text-sm text-gray-400">
                    {selectedDevice.vendor} {selectedDevice.model} • {selectedDevice.ipAddresses[0] || 'N/A'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDevice(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
          )}

          {selectedSite && (
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">{selectedSite.name}</h3>
                <p className="text-sm text-gray-400">{selectedSite.description}</p>
              </div>
              <button
                onClick={() => setSelectedSite(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapView;