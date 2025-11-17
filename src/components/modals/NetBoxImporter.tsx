import React, { useState } from 'react';
import { Upload, Server, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { adaptSlurpitTopology, fetchNetBoxTopology } from '../../services/netboxAdapter';
import type { DiscoveryScan } from '../../types';
import type { SlurpitTopology } from '../../types/netbox';

interface NetBoxImporterProps {
  onComplete?: (scan: DiscoveryScan) => void;
  onCancel?: () => void;
}

const NetBoxImporter: React.FC<NetBoxImporterProps> = ({ onComplete, onCancel }) => {
  const [netboxUrl, setNetboxUrl] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [scanName, setScanName] = useState('NetBox Import');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [importMethod, setImportMethod] = useState<'api' | 'json'>('api');
  const [jsonData, setJsonData] = useState('');

  const handleApiImport = async () => {
    if (!netboxUrl || !apiToken) {
      setError('Please provide NetBox URL and API Token');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch data from NetBox API
      const topologyData = await fetchNetBoxTopology(netboxUrl, apiToken);
      
      // Convert to internal format
      const scan = adaptSlurpitTopology(topologyData, scanName);
      
      setSuccess(true);
      setTimeout(() => {
        onComplete?.(scan);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import from NetBox');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJsonImport = () => {
    if (!jsonData) {
      setError('Please provide JSON data');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Parse JSON data
      const topologyData: SlurpitTopology = JSON.parse(jsonData);
      
      // Convert to internal format
      const scan = adaptSlurpitTopology(topologyData, scanName);
      
      setSuccess(true);
      setTimeout(() => {
        onComplete?.(scan);
      }, 1000);
    } catch (err) {
      setError('Invalid JSON format. Please check your data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonData(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
          onClick={onCancel}
        ></div>

        <div className="relative bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Server className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Import from NetBox</h2>
                  <p className="text-sm text-gray-400">Import network topology from NetBox or Slurpit</p>
                </div>
              </div>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Scan Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Scan Name
              </label>
              <input
                type="text"
                value={scanName}
                onChange={(e) => setScanName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter scan name"
              />
            </div>

            {/* Import Method Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Import Method
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setImportMethod('api')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    importMethod === 'api'
                      ? 'border-blue-600 bg-blue-600/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <Server className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-white font-medium">NetBox API</div>
                  <div className="text-xs text-gray-400 mt-1">Direct connection</div>
                </button>
                <button
                  onClick={() => setImportMethod('json')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    importMethod === 'json'
                      ? 'border-blue-600 bg-blue-600/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-white font-medium">JSON File</div>
                  <div className="text-xs text-gray-400 mt-1">Upload data</div>
                </button>
              </div>
            </div>

            {/* API Import Form */}
            {importMethod === 'api' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    NetBox URL
                  </label>
                  <input
                    type="text"
                    value={netboxUrl}
                    onChange={(e) => setNetboxUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://netbox.example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    API Token
                  </label>
                  <input
                    type="password"
                    value={apiToken}
                    onChange={(e) => setApiToken(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your NetBox API token"
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    Your API token can be found in NetBox under Profile → API Tokens
                  </p>
                </div>
              </div>
            )}

            {/* JSON Import Form */}
            {importMethod === 'json' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upload JSON File
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="json-file-input"
                    />
                    <label
                      htmlFor="json-file-input"
                      className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 cursor-pointer transition-colors flex items-center space-x-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Choose File</span>
                    </label>
                    {jsonData && (
                      <span className="text-sm text-gray-400">
                        File loaded ({(jsonData.length / 1024).toFixed(1)} KB)
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Or Paste JSON Data
                  </label>
                  <textarea
                    value={jsonData}
                    onChange={(e) => setJsonData(e.target.value)}
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder='{"devices": [], "interfaces": [], "cables": []...}'
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-900/20 border border-red-700 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-red-400 font-medium">Import Failed</div>
                  <div className="text-red-300 text-sm mt-1">{error}</div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mt-4 p-4 bg-green-900/20 border border-green-700 rounded-lg flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-green-400 font-medium">Import Successful</div>
                  <div className="text-green-300 text-sm mt-1">Redirecting to topology view...</div>
                </div>
              </div>
            )}

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
              <div className="flex items-start space-x-3">
                <Server className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm text-blue-300">
                  <div className="font-medium mb-1">NetBox Integration</div>
                  <ul className="list-disc list-inside space-y-1 text-blue-200">
                    <li>Imports devices, interfaces, cables, and LLDP neighbors</li>
                    <li>Supports NetBox v3.x and v4.x API format</li>
                    <li>Compatible with Slurpit plugin output</li>
                    <li>Automatically creates topology visualization</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-700 bg-gray-750">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onCancel}
                disabled={isLoading}
                className="px-4 py-2 text-gray-300 bg-gray-600 border border-gray-600 rounded-lg hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={importMethod === 'api' ? handleApiImport : handleJsonImport}
                disabled={isLoading || success}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Importing...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Import Topology</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetBoxImporter;

