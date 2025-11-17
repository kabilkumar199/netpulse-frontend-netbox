import React, { useState } from 'react';
import type { Credential } from '../../types';
import { mockCredentials } from '../../data/mockData';

interface CredentialsManagerProps {
  onClose?: () => void;
}

const CredentialsManager: React.FC<CredentialsManagerProps> = ({ onClose }) => {
  const [credentials, setCredentials] = useState<Credential[]>(mockCredentials);
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});

  const [formData, setFormData] = useState({
    name: '',
    type: 'snmp_v2c' as Credential['type'],
    username: '',
    password: '',
    community: '',
    authProtocol: 'md5' as Credential['authProtocol'],
    authPassword: '',
    privProtocol: 'aes' as Credential['privProtocol'],
    privPassword: '',
    engineId: '',
    context: '',
    vlanContextPattern: '',
    priority: 1,
    isActive: true,
    scoping: {
      ipRanges: [] as string[],
      deviceTypes: [] as string[],
      vendors: [] as string[],
      osTypes: [] as string[],
      roles: [] as string[]
    }
  });

  const handleCreate = () => {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedCredential(null);
    setFormData({
      name: '',
      type: 'snmp_v2c',
      username: '',
      password: '',
      community: '',
      authProtocol: 'md5',
      authPassword: '',
      privProtocol: 'aes',
      privPassword: '',
      engineId: '',
      context: '',
      vlanContextPattern: '',
      priority: 1,
      isActive: true,
      scoping: {
        ipRanges: [],
        deviceTypes: [],
        vendors: [],
        osTypes: [],
        roles: []
      }
    });
  };

  const handleEdit = (credential: Credential) => {
    setSelectedCredential(credential);
    setIsEditing(true);
    setIsCreating(false);
    setFormData({
      name: credential.name,
      type: credential.type,
      username: credential.username || '',
      password: credential.password || '',
      community: credential.community || '',
      authProtocol: credential.authProtocol || 'md5',
      authPassword: credential.authPassword || '',
      privProtocol: credential.privProtocol || 'aes',
      privPassword: credential.privPassword || '',
      engineId: credential.engineId || '',
      context: credential.context || '',
      vlanContextPattern: credential.vlanContextPattern || '',
      priority: credential.priority,
      isActive: credential.isActive,
      scoping: {
        ipRanges: credential.scoping.ipRanges || [],
        deviceTypes: credential.scoping.deviceTypes || [],
        vendors: credential.scoping.vendors || [],
        osTypes: credential.scoping.osTypes || [],
        roles: credential.scoping.roles || []
      }
    });
  };

  const handleSave = () => {
    if (isCreating) {
      const newCredential: Credential = {
        id: `cred-${Date.now()}`,
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setCredentials([...credentials, newCredential]);
    } else if (selectedCredential) {
      const updatedCredential = {
        ...selectedCredential,
        ...formData,
        updatedAt: new Date()
      };
      setCredentials(credentials.map(c => c.id === selectedCredential.id ? updatedCredential : c));
    }
    
    setIsCreating(false);
    setIsEditing(false);
    setSelectedCredential(null);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(false);
    setSelectedCredential(null);
  };

  const handleDelete = (credential: Credential) => {
    if (confirm('Are you sure you want to delete this credential?')) {
      setCredentials(credentials.filter(c => c.id !== credential.id));
      if (selectedCredential?.id === credential.id) {
        setSelectedCredential(null);
        setIsEditing(false);
      }
    }
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const getCredentialTypeIcon = (type: string) => {
    switch (type) {
      case 'snmp_v1': return '🔐';
      case 'snmp_v2c': return '🔐';
      case 'snmp_v3': return '🔒';
      case 'ssh': return '🔑';
      case 'wmi': return '🪟';
      case 'telnet': return '📡';
      case 'vmware': return '☁️';
      case 'aws': return '☁️';
      case 'azure': return '☁️';
      case 'meraki': return '📡';
      case 'rest': return '🌐';
      case 'redfish': return '🔴';
      default: return '🔑';
    }
  };

  const getCredentialTypeLabel = (type: string) => {
    switch (type) {
      case 'snmp_v1': return 'SNMP v1';
      case 'snmp_v2c': return 'SNMP v2c';
      case 'snmp_v3': return 'SNMP v3';
      case 'ssh': return 'SSH';
      case 'wmi': return 'Windows WMI';
      case 'telnet': return 'Telnet';
      case 'vmware': return 'VMware vSphere';
      case 'aws': return 'AWS API';
      case 'azure': return 'Azure API';
      case 'meraki': return 'Cisco Meraki';
      case 'rest': return 'REST API';
      case 'redfish': return 'Redfish';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Credentials Manager
          </h1>
          <p className="text-gray-400 mt-1">
            Manage authentication credentials for network devices
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Add Credential</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Credentials List */}
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Credentials ({credentials.length})
          </h3>
          
          <div className="space-y-3">
            {credentials.map((credential) => (
              <div
                key={credential.id}
                onClick={() => setSelectedCredential(credential)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedCredential?.id === credential.id
                    ? 'border-blue-500 bg-blue-900'
                    : 'border-gray-600 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getCredentialTypeIcon(credential.type)}</span>
                    <div>
                      <div className="font-medium text-white">
                        {credential.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {getCredentialTypeLabel(credential.type)} • Priority: {credential.priority}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      credential.isActive 
                        ? 'bg-green-900 text-green-300'
                        : 'bg-gray-700 text-gray-300'
                    }`}>
                      {credential.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(credential);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600:text-gray-300"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(credential);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600:text-red-400"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Credential Editor */}
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              {isCreating ? 'Create Credential' : isEditing ? 'Edit Credential' : 'Credential Details'}
            </h3>
            {isEditing && (
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
          
          {(isCreating || isEditing) ? (
            <div className="space-y-4">
              {/* Basic Info */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter credential name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as Credential['type']})}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="snmp_v1">SNMP v1</option>
                  <option value="snmp_v2c">SNMP v2c</option>
                  <option value="snmp_v3">SNMP v3</option>
                  <option value="ssh">SSH</option>
                  <option value="wmi">Windows WMI</option>
                  <option value="telnet">Telnet</option>
                  <option value="vmware">VMware vSphere</option>
                  <option value="aws">AWS API</option>
                  <option value="azure">Azure API</option>
                  <option value="meraki">Cisco Meraki</option>
                  <option value="rest">REST API</option>
                  <option value="redfish">Redfish</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Authentication Fields */}
              {(formData.type === 'snmp_v1' || formData.type === 'snmp_v2c') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Community String
                  </label>
                  <input
                    type="text"
                    value={formData.community}
                    onChange={(e) => setFormData({...formData, community: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="public"
                  />
                </div>
              )}
              
              {(formData.type === 'snmp_v3' || formData.type === 'ssh' || formData.type === 'wmi' || formData.type === 'telnet') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter username"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.password ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('password')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword.password ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>
                </>
              )}
              
              {/* SNMP v3 Specific Fields */}
              {formData.type === 'snmp_v3' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Auth Protocol
                      </label>
                      <select
                        value={formData.authProtocol}
                        onChange={(e) => setFormData({...formData, authProtocol: e.target.value as Credential['authProtocol']})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="md5">MD5</option>
                        <option value="sha">SHA</option>
                        <option value="sha224">SHA-224</option>
                        <option value="sha256">SHA-256</option>
                        <option value="sha384">SHA-384</option>
                        <option value="sha512">SHA-512</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priv Protocol
                      </label>
                      <select
                        value={formData.privProtocol}
                        onChange={(e) => setFormData({...formData, privProtocol: e.target.value as Credential['privProtocol']})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="des">DES</option>
                        <option value="aes">AES</option>
                        <option value="aes192">AES-192</option>
                        <option value="aes256">AES-256</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Auth Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.authPassword ? 'text' : 'password'}
                        value={formData.authPassword}
                        onChange={(e) => setFormData({...formData, authPassword: e.target.value})}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter auth password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('authPassword')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword.authPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priv Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.privPassword ? 'text' : 'password'}
                        value={formData.privPassword}
                        onChange={(e) => setFormData({...formData, privPassword: e.target.value})}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter priv password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('privPassword')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword.privPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>
                </>
              )}
              
              {/* Status */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Active
                </label>
              </div>
              
              {/* Action Buttons */}
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
                  {isCreating ? 'Create' : 'Save'}
                </button>
              </div>
            </div>
          ) : selectedCredential ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{getCredentialTypeIcon(selectedCredential.type)}</span>
                <div>
                  <div className="font-medium text-gray-900">
                    {selectedCredential.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {getCredentialTypeLabel(selectedCredential.type)}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Priority:</span>
                  <span className="text-gray-900">{selectedCredential.priority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedCredential.isActive 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedCredential.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                {selectedCredential.username && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Username:</span>
                    <span className="text-gray-900">{selectedCredential.username}</span>
                  </div>
                )}
                {selectedCredential.community && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Community:</span>
                    <span className="text-gray-900">{selectedCredential.community}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-900">
                    {new Date(selectedCredential.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Updated:</span>
                  <span className="text-gray-900">
                    {new Date(selectedCredential.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl">🔑</span>
              <p className="mt-2">Select a credential to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CredentialsManager;
