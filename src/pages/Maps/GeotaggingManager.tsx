import React, { useState } from 'react';
import type { Device, Site, Location } from '../../types';
import { mockDevices, mockSites } from '../../data/mockData';

interface GeotaggingManagerProps {
  onClose?: () => void;
}

const GeotaggingManager: React.FC<GeotaggingManagerProps> = ({ onClose }) => {
  const [selectedType, setSelectedType] = useState<'device' | 'site'>('device');
  const [selectedItem, setSelectedItem] = useState<Device | Site | null>(null);
  const [, setLocation] = useState<Location | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: ''
  });

  const handleItemSelect = (item: Device | Site) => {
    setSelectedItem(item);
    setLocation(item.location || null);
    setIsEditing(false);
    
    if (item.location) {
      setFormData({
        name: item.location.name,
        latitude: item.location.latitude.toString(),
        longitude: item.location.longitude.toString(),
        address: item.location.address || '',
        city: item.location.city || '',
        state: item.location.state || '',
        country: item.location.country || '',
        postalCode: item.location.postalCode || ''
      });
    } else {
      setFormData({
        name: '',
        latitude: '',
        longitude: '',
        address: '',
        city: '',
        state: '',
        country: '',
        postalCode: ''
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!selectedItem) return;
    
    const newLocation: Location = {
      id: `loc-${Date.now()}`,
      name: formData.name,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      address: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      postalCode: formData.postalCode,
      siteHierarchy: [],
      mapZoom: 12,
      mapTileReference: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setLocation(newLocation);
    setIsEditing(false);
    
    // In a real implementation, this would save to the backend
    console.log('Saving location:', newLocation);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (selectedItem?.location) {
      setFormData({
        name: selectedItem.location.name,
        latitude: selectedItem.location.latitude.toString(),
        longitude: selectedItem.location.longitude.toString(),
        address: selectedItem.location.address || '',
        city: selectedItem.location.city || '',
        state: selectedItem.location.state || '',
        country: selectedItem.location.country || '',
        postalCode: selectedItem.location.postalCode || ''
      });
    }
  };

  const handleGeocode = async () => {
    if (!formData.address) {
      alert('Please enter an address to geocode');
      return;
    }
    
    // Simulate geocoding API call
    console.log('Geocoding address:', formData.address);
    
    // Mock geocoding result
    setFormData(prev => ({
      ...prev,
      latitude: '37.7749',
      longitude: '-122.4194'
    }));
  };

  const getItemIcon = (item: Device | Site) => {
    if ('hostname' in item) {
      // Device
      switch (item.vendor) {
        case 'Cisco': return '🔷';
        case 'Dell': return '💻';
        case 'Fortinet': return '🛡️';
        default: return '🖥️';
      }
    } else {
      // Site
      return '🏢';
    }
  };

  const getItemName = (item: Device | Site) => {
    if ('hostname' in item) {
      return item.hostname;
    } else {
      return item.name;
    }
  };

  const filteredItems = selectedType === 'device' 
    ? mockDevices.filter(device => 
        device.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.vendor.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockSites.filter(site =>
        site.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Geotagging Manager
          </h1>
          <p className="text-gray-400 mt-1">
            Manage geographic locations for devices and sites
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Item Selection */}
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Select Item
          </h3>
          
          {/* Type Selection */}
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setSelectedType('device')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === 'device'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Devices
            </button>
            <button
              onClick={() => setSelectedType('site')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === 'site'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sites
            </button>
          </div>
          
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${selectedType}s...`}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Item List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemSelect(item)}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedItem?.id === item.id
                    ? 'border-blue-500 bg-blue-900'
                    : 'border-gray-600 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{getItemIcon(item)}</span>
                  <div className="flex-1">
                    <div className="font-medium text-white">
                      {getItemName(item)}
                    </div>
                    <div className="text-sm text-gray-400">
                      {selectedType === 'device' 
                        ? `${(item as Device).vendor} ${(item as Device).model}`
                        : (item as Site).description
                      }
                    </div>
                    {(item as Device | Site).location && (
                      <div className="text-xs text-green-400 mt-1">
                        ✓ Has location data
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location Editor */}
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Location Details
            </h3>
            {selectedItem && !isEditing && (
              <button
                onClick={handleEdit}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit
              </button>
            )}
          </div>
          
          {selectedItem ? (
            <div className="space-y-4">
              {/* Selected Item Info */}
              <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                <span className="text-2xl">{getItemIcon(selectedItem)}</span>
                <div>
                  <div className="font-medium text-white">
                    {getItemName(selectedItem)}
                  </div>
                  <div className="text-sm text-gray-400">
                    {selectedType === 'device' 
                      ? `${(selectedItem as Device).vendor} ${(selectedItem as Device).model}`
                      : (selectedItem as Site).description
                    }
                  </div>
                </div>
              </div>
              
              {/* Location Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-600"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-600"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Address
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      disabled={!isEditing}
                      className="flex-1 px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-600"
                    />
                    {isEditing && (
                      <button
                        onClick={handleGeocode}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                      >
                        Geocode
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-600"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100:bg-gray-600"
                    />
                  </div>
                </div>
                
                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200:bg-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Save Location
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl">📍</span>
              <p className="mt-2">Select a {selectedType} to manage its location</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeotaggingManager;
