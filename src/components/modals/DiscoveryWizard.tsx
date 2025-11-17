import React, { useState } from "react";
import type {
  DiscoveryScan,
  SeedDevice,
  CredentialSettings,
  ExpansionSettings,
  ScanOptions,
} from "../../types";
import { mockCredentials } from "../../data/mockData";
import { useNavigate } from "react-router-dom";

interface DiscoveryWizardProps {
  onComplete?: (scan: DiscoveryScan) => void;
}

const DiscoveryWizard: React.FC<DiscoveryWizardProps> = ({
  onComplete,
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [scanName, setScanName] = useState("");
  const [seedDevices, setSeedDevices] = useState<SeedDevice[]>([]);
  const [expansionSettings, setExpansionSettings] = useState<ExpansionSettings>(
    {
      enabled: true,
      maxHops: 3,
      maxDevices: 100,
      includeVirtual: false,
      includeCloud: false,
      includeWireless: true,
      includeStorage: false,
    }
  );
  const [credentialSettings, setCredentialSettings] =
    useState<CredentialSettings>({
      selectedCredentials: [],
      priorityOrder: [],
      useAllCurrent: true,
      useAllFuture: false,
    });
  const [scanOptions, setScanOptions] = useState<ScanOptions>({
    autoMonitoring: true,
    timeout: 30,
    retries: 3,
    parallelScans: 5,
    exclusionFilters: [],
  });

  const steps = [
    { id: 1, title: "Basic Info", description: "Scan name and description" },
    {
      id: 2,
      title: "Seed Devices",
      description: "Starting points for discovery",
    },
    { id: 3, title: "Expansion", description: "Multi-hop discovery settings" },
    { id: 4, title: "Credentials", description: "Authentication methods" },
    { id: 5, title: "Options", description: "Advanced scan settings" },
    { id: 6, title: "Review", description: "Review and start scan" },
  ];

  const addSeedDevice = () => {
    const newDevice: SeedDevice = {
      id: `seed-${Date.now()}`,
      type: "ip",
      value: "",
      description: "",
      isActive: true,
    };
    setSeedDevices([...seedDevices, newDevice]);
  };

  const updateSeedDevice = (
    id: string,
    field: keyof SeedDevice,
    value: any
  ) => {
    setSeedDevices(
      seedDevices.map((device) =>
        device.id === id ? { ...device, [field]: value } : device
      )
    );
  };

  const removeSeedDevice = (id: string) => {
    setSeedDevices(seedDevices.filter((device) => device.id !== id));
  };

  const toggleCredential = (credentialId: string) => {
    const isSelected =
      credentialSettings.selectedCredentials.includes(credentialId);
    if (isSelected) {
      setCredentialSettings({
        ...credentialSettings,
        selectedCredentials: credentialSettings.selectedCredentials.filter(
          (id) => id !== credentialId
        ),
        priorityOrder: credentialSettings.priorityOrder.filter(
          (id) => id !== credentialId
        ),
      });
    } else {
      setCredentialSettings({
        ...credentialSettings,
        selectedCredentials: [
          ...credentialSettings.selectedCredentials,
          credentialId,
        ],
        priorityOrder: [...credentialSettings.priorityOrder, credentialId],
      });
    }
  };

  const moveCredentialPriority = (
    credentialId: string,
    direction: "up" | "down"
  ) => {
    const currentIndex = credentialSettings.priorityOrder.indexOf(credentialId);
    if (currentIndex === -1) return;

    const newOrder = [...credentialSettings.priorityOrder];
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex >= 0 && newIndex < newOrder.length) {
      [newOrder[currentIndex], newOrder[newIndex]] = [
        newOrder[newIndex],
        newOrder[currentIndex],
      ];
      setCredentialSettings({
        ...credentialSettings,
        priorityOrder: newOrder,
      });
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const startScan = () => {
    // Simulate a completed scan with discovered devices
    const newScan: DiscoveryScan = {
      id: `scan-${Date.now()}`,
      name: scanName,
      status: "completed",
      startTime: new Date(),
      endTime: new Date(),
      progress: 100,
      seedDevices,
      expansionSettings,
      credentialSettings,
      scanOptions,
      results: {
        totalDevices: 5,
        newDevices: 5,
        updatedDevices: 0,
        failedDevices: 0,
        devices: [], // Will be populated with mock devices
        links: [], // Will be populated with mock links
        errors: [],
        summary: {
          scanDuration: 45,
          devicesPerSecond: 0.11,
          credentialsUsed: credentialSettings.selectedCredentials,
          protocolsUsed: ["snmp", "lldp", "ping"],
          topVendors: [
            { vendor: "Cisco", count: 3 },
            { vendor: "Dell", count: 1 },
            { vendor: "Fortinet", count: 1 },
          ],
          topOS: [
            { os: "Cisco IOS", count: 3 },
            { os: "Windows Server", count: 1 },
            { os: "FortiOS", count: 1 },
          ],
          topRoles: [
            { role: "Access Switch", count: 2 },
            { role: "Core Router", count: 1 },
            { role: "Server", count: 1 },
          ],
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    if (onComplete) {
      onComplete(newScan);
    }
    navigate('/topology');
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Scan Name *
              </label>
              <input
                type="text"
                value={scanName}
                onChange={(e) => setScanName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter scan name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Optional description"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Seed Devices</h3>
              <button
                onClick={addSeedDevice}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Device
              </button>
            </div>

            <div className="space-y-4">
              {seedDevices.map((device) => (
                <div
                  key={device.id}
                  className="p-4 border border-gray-600 rounded-lg bg-gray-700"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Type
                      </label>
                      <select
                        value={device.type}
                        onChange={(e) =>
                          updateSeedDevice(device.id, "type", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="ip">Single IP</option>
                        <option value="range">IP Range</option>
                        <option value="subnet">Subnet</option>
                        <option value="cloud">Cloud Provider</option>
                        <option value="virtual">Virtualization</option>
                        <option value="wireless">Wireless</option>
                        <option value="storage">Storage</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Value *
                      </label>
                      <input
                        type="text"
                        value={device.value}
                        onChange={(e) =>
                          updateSeedDevice(device.id, "value", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="192.168.1.1 or 192.168.1.0/24"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={device.description}
                        onChange={(e) =>
                          updateSeedDevice(
                            device.id,
                            "description",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Optional description"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => removeSeedDevice(device.id)}
                        className="px-3 py-2 text-red-400 hover:text-red-300 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {seedDevices.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No seed devices added yet. Click "Add Device" to get started.
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="enableExpansion"
                checked={expansionSettings.enabled}
                onChange={(e) =>
                  setExpansionSettings({
                    ...expansionSettings,
                    enabled: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="enableExpansion"
                className="text-sm font-medium text-gray-300"
              >
                Enable multi-hop expansion
              </label>
            </div>

            {expansionSettings.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Maximum Hops
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={expansionSettings.maxHops}
                    onChange={(e) =>
                      setExpansionSettings({
                        ...expansionSettings,
                        maxHops: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Maximum Devices
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={expansionSettings.maxDevices}
                    onChange={(e) =>
                      setExpansionSettings({
                        ...expansionSettings,
                        maxDevices: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h4 className="text-md font-medium text-white">
                Include Device Types
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: "includeVirtual", label: "Virtual" },
                  { key: "includeCloud", label: "Cloud" },
                  { key: "includeWireless", label: "Wireless" },
                  { key: "includeStorage", label: "Storage" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={
                        expansionSettings[
                          key as keyof ExpansionSettings
                        ] as boolean
                      }
                      onChange={(e) =>
                        setExpansionSettings({
                          ...expansionSettings,
                          [key]: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-300">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="useAllCurrent"
                checked={credentialSettings.useAllCurrent}
                onChange={(e) =>
                  setCredentialSettings({
                    ...credentialSettings,
                    useAllCurrent: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="useAllCurrent"
                className="text-sm font-medium text-gray-300"
              >
                Use all current credentials
              </label>
            </div>

            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">
                Available Credentials
              </h4>
              <div className="space-y-2">
                {mockCredentials.map((credential) => (
                  <div
                    key={credential.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={credentialSettings.selectedCredentials.includes(
                          credential.id
                        )}
                        onChange={() => toggleCredential(credential.id)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-medium text-white">
                          {credential.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {credential.type} • Priority: {credential.priority}
                        </div>
                      </div>
                    </div>
                    {credentialSettings.selectedCredentials.includes(
                      credential.id
                    ) && (
                      <div className="flex space-x-1">
                        <button
                          onClick={() =>
                            moveCredentialPriority(credential.id, "up")
                          }
                          className="p-1 text-gray-400 hover:text-gray-600"
                          disabled={
                            credentialSettings.priorityOrder.indexOf(
                              credential.id
                            ) === 0
                          }
                        >
                          ↑
                        </button>
                        <button
                          onClick={() =>
                            moveCredentialPriority(credential.id, "down")
                          }
                          className="p-1 text-gray-400 hover:text-gray-600"
                          disabled={
                            credentialSettings.priorityOrder.indexOf(
                              credential.id
                            ) ===
                            credentialSettings.priorityOrder.length - 1
                          }
                        >
                          ↓
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Timeout (seconds)
                </label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={scanOptions.timeout}
                  onChange={(e) =>
                    setScanOptions({
                      ...scanOptions,
                      timeout: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Retries
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={scanOptions.retries}
                  onChange={(e) =>
                    setScanOptions({
                      ...scanOptions,
                      retries: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Parallel Scans
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={scanOptions.parallelScans}
                  onChange={(e) =>
                    setScanOptions({
                      ...scanOptions,
                      parallelScans: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="autoMonitoring"
                checked={scanOptions.autoMonitoring}
                onChange={(e) =>
                  setScanOptions({
                    ...scanOptions,
                    autoMonitoring: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="autoMonitoring"
                className="text-sm font-medium text-white"
              >
                Enable auto-monitoring for discovered devices
              </label>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className=" rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">
                Scan Summary
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-white mb-2">Basic Info</h4>
                  <div className="space-y-1 text-sm text-white">
                    <div>Name: {scanName}</div>
                    <div>Seed Devices: {seedDevices.length}</div>
                    <div>
                      Expansion:{" "}
                      {expansionSettings.enabled ? "Enabled" : "Disabled"}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-2">Settings</h4>
                  <div className="space-y-1 text-sm text-white">
                    <div>
                      Credentials:{" "}
                      {credentialSettings.selectedCredentials.length}
                    </div>
                    <div>Timeout: {scanOptions.timeout}s</div>
                    <div>Retries: {scanOptions.retries}</div>
                    <div>
                      Auto-monitoring:{" "}
                      {scanOptions.autoMonitoring ? "Yes" : "No"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-blue-400">ℹ️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Ready to start discovery
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      This scan will discover devices and network topology based
                      on your configuration.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-800">
          <h2 className="text-xl font-semibold text-white">Network Discovery Wizard</h2>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    currentStep >= step.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-600 text-gray-400"
                  }`}
                >
                  {step.id}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-2 ${
                      currentStep > step.id ? "bg-blue-600" : "bg-gray-600"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 text-sm text-gray-400">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
          </div>
        </div>

        {/* Content Area (scrollable) */}
        <div className="min-h-[400px] overflow-y-auto px-6 py-6 bg-gray-900">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700 bg-gray-800">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-4 py-2 text-gray-300 bg-gray-600 border border-gray-600 rounded-lg hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-300 bg-gray-600 border border-gray-600 rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>

            {currentStep === steps.length ? (
              <button
                onClick={startScan}
                disabled={!scanName || seedDevices.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Scan
              </button>
            ) : (
              <button
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && !scanName) ||
                  (currentStep === 2 && seedDevices.length === 0)
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryWizard;
