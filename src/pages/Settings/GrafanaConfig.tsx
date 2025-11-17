import React, { useState } from 'react';
import { Plus, Save, TestTube, ExternalLink, Settings, AlertCircle, CheckCircle, Edit, Trash2 } from 'lucide-react';

interface GrafanaConfigProps {
  onClose?: () => void;
}

interface GrafanaSettings {
  id: string;
  name: string;
  baseUrl: string;
  apiKey: string;
  organizationId: string;
  defaultDashboard: string;
  refreshInterval: number;
  enableAutoRefresh: boolean;
  theme: 'light' | 'dark' | 'auto';
  status: 'connected' | 'disconnected' | 'testing';
  lastTested?: Date;
}

const GrafanaConfig: React.FC<GrafanaConfigProps> = ({ onClose }) => {
  const [configurations, setConfigurations] = useState<GrafanaSettings[]>([
    {
      id: '1',
      name: 'Primary Grafana',
      baseUrl: 'http://10.4.160.240:3001',
      apiKey: '••••••••••••••••',
      organizationId: '1',
      defaultDashboard: 'e2341c9d20a04894a4ea4b8bad48f180',
      refreshInterval: 30,
      enableAutoRefresh: true,
      theme: 'dark',
      status: 'connected',
      lastTested: new Date()
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState<GrafanaSettings | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [testMessage, setTestMessage] = useState('');

  const handleAdd = () => {
    setEditingConfig(null);
    setShowModal(true);
  };

  const handleEdit = (config: GrafanaSettings) => {
    setEditingConfig(config);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this Grafana configuration?")) return;
    setConfigurations(prev => prev.filter(config => config.id !== id));
  };

  const handleSave = (config: GrafanaSettings) => {
    const exists = configurations.find(c => c.id === config.id);
    if (exists) {
      setConfigurations(prev => prev.map(c => c.id === config.id ? config : c));
    } else {
      setConfigurations(prev => [config, ...prev]);
    }
    setEditingConfig(null);
    setShowModal(false);
  };

  const testConnection = async (config: GrafanaSettings) => {
    setIsTesting(true);
    setTestResult(null);
    setTestMessage('');

    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock test result - in real implementation, you'd test the actual Grafana API
      const isReachable = config.baseUrl.includes('10.4.160.240');
      
      if (isReachable) {
        setTestResult('success');
        setTestMessage('Successfully connected to Grafana instance');
        setConfigurations(prev => prev.map(c => 
          c.id === config.id 
            ? { ...c, status: 'connected', lastTested: new Date() }
            : c
        ));
      } else {
        setTestResult('error');
        setTestMessage('Failed to connect to Grafana instance');
        setConfigurations(prev => prev.map(c => 
          c.id === config.id 
            ? { ...c, status: 'disconnected', lastTested: new Date() }
            : c
        ));
      }
    } catch (error) {
      setTestResult('error');
      setTestMessage('Connection test failed');
      setConfigurations(prev => prev.map(c => 
        c.id === config.id 
          ? { ...c, status: 'disconnected', lastTested: new Date() }
          : c
      ));
    } finally {
      setIsTesting(false);
    }
  };

  const openGrafana = (config: GrafanaSettings) => {
    window.open(config.baseUrl, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-400';
      case 'disconnected': return 'text-red-400';
      case 'testing': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'disconnected': return <AlertCircle className="w-4 h-4" />;
      case 'testing': return <TestTube className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Grafana Configuration</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} /> Add Configuration
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-800 p-4 rounded-xl mb-4">
        <div className="flex items-center gap-3 mb-3">
          <button className="text-sm border-b-2 border-transparent hover:border-emerald-400">
            Results ({configurations.length})
          </button>
          <button className="text-sm border-b-2 border-transparent hover:border-emerald-400">
            Filters
          </button>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Quick search"
            className="bg-gray-700 text-sm text-white px-3 py-2 rounded-md w-64 outline-none"
          />
          <select className="bg-gray-700 text-sm px-3 py-2 rounded-md outline-none">
            <option>All Status</option>
            <option>Connected</option>
            <option>Disconnected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-700 uppercase text-xs text-gray-300">
            <tr>
              <th className="px-4 py-3 w-10">
                <input type="checkbox" className="accent-emerald-500" />
              </th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Base URL</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Dashboard</th>
              <th className="px-4 py-2">Theme</th>
              <th className="px-4 py-2">Last Tested</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {configurations.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-400">
                  — No configurations found —
                </td>
              </tr>
            ) : (
              configurations.map((config) => (
                <tr
                  key={config.id}
                  className="border-t border-gray-700 hover:bg-gray-700/40 transition-colors"
                >
                  <td className="px-4 py-3">
                    <input type="checkbox" className="accent-emerald-500" />
                  </td>
                  <td className="px-4 py-3 text-white font-medium">{config.name}</td>
                  <td className="px-4 py-3 text-gray-300">{config.baseUrl}</td>
                  <td className="px-4 py-3">
                    <div className={`flex items-center space-x-2 ${getStatusColor(config.status)}`}>
                      {getStatusIcon(config.status)}
                      <span className="capitalize">{config.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {config.defaultDashboard ? config.defaultDashboard.substring(0, 8) + '...' : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-300 capitalize">{config.theme}</td>
                  <td className="px-4 py-3 text-gray-300">
                    {config.lastTested ? config.lastTested.toLocaleString() : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => testConnection(config)}
                        disabled={isTesting}
                        className="p-1 text-blue-400 hover:text-blue-300 disabled:opacity-50"
                        title="Test Connection"
                      >
                        <TestTube className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openGrafana(config)}
                        className="p-1 text-orange-400 hover:text-orange-300"
                        title="Open Grafana"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(config)}
                        className="p-1 text-gray-400 hover:text-gray-300"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(config.id)}
                        className="p-1 text-red-400 hover:text-red-300"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Actions */}
      <div className="bg-gray-800 p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            {configurations.length} configuration{configurations.length !== 1 ? 's' : ''} total
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              Export
            </button>
            <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              Import
            </button>
          </div>
        </div>
      </div>

      {/* Test Result */}
      {testResult && (
        <div className={`p-4 rounded-lg ${
          testResult === 'success' ? 'bg-green-900/20 border border-green-700' : 'bg-red-900/20 border border-red-700'
        }`}>
          <div className={`flex items-center space-x-2 ${
            testResult === 'success' ? 'text-green-400' : 'text-red-400'
          }`}>
            {testResult === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-sm">{testMessage}</span>
          </div>
        </div>
      )}

      {/* Modal placeholder - would contain the form for adding/editing configurations */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-100"
            >
              ✖
            </button>
            <h2 className="text-xl font-semibold text-white mb-4">
              {editingConfig ? 'Edit Configuration' : 'Add Configuration'}
            </h2>
            <p className="text-gray-400 mb-4">
              Configuration form would go here...
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrafanaConfig;
