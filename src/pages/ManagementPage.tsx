import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import ConfigurationManager from '../pages/Settings/ConfigurationManager';
import BackupManagement from '../pages/Management/BackupManagement';
import FirmwareManagement from '../pages/Management/FirmwareManagement';
import AlertManagement from '../pages/Management/AlertManagement';
import UserList from '../pages/Management/UserList';
import UserRole from '../pages/Management/UserRole';
import UserProfile from '../pages/Management/UserProfile';

const ManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const managementTabs = [
    { id: 'configuration', label: 'Configuration', path: '/management/configuration' },
    { id: 'backups', label: 'Backups', path: '/management/backups' },
    { id: 'firmware', label: 'Firmware', path: '/management/firmware' },
    { id: 'alerts', label: 'Alerts', path: '/management/alerts' },
    { id: 'users', label: 'Users', path: '/management/users' },
    { id: 'roles', label: 'Roles', path: '/management/roles' },
    { id: 'profile', label: 'Profile', path: '/management/profile' },
  ];

  const getCurrentTab = () => {
    const currentPath = location.pathname;
    return managementTabs.find(tab => currentPath === tab.path) || managementTabs[0];
  };

  const currentTab = getCurrentTab();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
        <h2 className="text-2xl font-bold text-white mb-4">System Management</h2>
        <p className="text-gray-400">
          Manage configurations, backups, firmware, alerts, and user accounts.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
        <div className="border-b border-gray-700">
          <nav className="flex space-x-8 px-6">
            {managementTabs.map((tab) => (
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
        <div className="p-6">
          <Routes>
            <Route path="/" element={<ConfigurationManager onClose={() => {}} />} />
            <Route path="/configuration" element={<ConfigurationManager onClose={() => {}} />} />
            <Route path="/backups" element={<BackupManagement onClose={() => {}} />} />
            <Route path="/firmware" element={<FirmwareManagement onClose={() => {}} />} />
            <Route path="/alerts" element={<AlertManagement onClose={() => {}} />} />
            <Route path="/users" element={<UserList onClose={() => {}} />} />
            <Route path="/roles" element={<UserRole onClose={() => {}} />} />
            <Route path="/profile" element={<UserProfile onClose={() => {}} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default ManagementPage;
