import { useState } from 'react';
 import InterfaceGrid from './InterfaceGrid';
import InterfaceTable from './InterfaceTable';
import type { InterfaceResponse } from '../../../../types/interface';

interface InterfaceViewProps {
  data?: InterfaceResponse;
  onRefresh?: () => void;
}

export default function InterfaceView({ data, onRefresh }: InterfaceViewProps) {
  const [activeTab, setActiveTab] = useState<string>('IP');

  const interfaces = data?.InterfaceIp || [];

  const tabs = ['IP', 'Management', 'Loopback', 'Routing', 'System'];

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Interface Grid Section */}
        <InterfaceGrid interfaces={interfaces} onRefresh={handleRefresh} />

        {/* Interface Table Section */}
        <div>
          <div className="flex items-center gap-2 border-b border-gray-700 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <InterfaceTable interfaces={interfaces} activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
}

