import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Regions from '../pages/Organization/Regions';
import Sites from '../pages/Organization/Sites';
import Locations from '../pages/Organization/Locations';
import ManufacturersPage from '../pages/Organization/Manufacturers';
import RacksPage from '../pages/Organization/RacksPage';
import DeviceRolesPage from '../pages/Organization/DeviceRolesPage';

const OrganizationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const organizationTabs = [
    { id: 'regions', label: 'Regions', path: '/organization/regions' },
    { id: 'sites', label: 'Sites', path: '/organization/sites' },
    { id: 'locations', label: 'Locations', path: '/organization/locations' },
    { id: 'manufacturers', label: 'Manufacturers', path: '/organization/manufacturers' },
    { id: 'racks', label: 'Racks', path: '/organization/racks' },
    { id: 'device-roles', label: 'Device Roles', path: '/organization/device-roles' },
  ];

  const getCurrentTab = () => {
    const currentPath = location.pathname;
    return organizationTabs.find(tab => currentPath === tab.path) || organizationTabs[0];
  };

  const currentTab = getCurrentTab();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-5">
        <h2 className="text-2xl font-bold text-white mb-4">Organization Management</h2>
        <p className="text-gray-400">
          Manage regions, sites, locations, manufacturers, racks, and device roles.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
        <div className="border-b border-gray-700">
          <nav className="flex space-x-8 px-5">
            {organizationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  currentTab.id === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-5">
          <Routes>
            <Route path="/" element={<Regions />} />
            <Route path="/regions" element={<Regions />} />
            <Route path="/sites" element={<Sites />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/manufacturers" element={<ManufacturersPage />} />
            <Route path="/racks" element={<RacksPage />} />
            <Route path="/device-roles" element={<DeviceRolesPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default OrganizationPage;
