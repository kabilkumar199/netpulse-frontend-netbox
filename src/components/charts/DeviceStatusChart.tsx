import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, HelpCircle } from 'lucide-react';

interface DeviceStatusChartProps {
  data: {
    up: number;
    down: number;
    warning: number;
    unknown: number;
  };
}

const DeviceStatusChart: React.FC<DeviceStatusChartProps> = ({ data }) => {
  const total = data.up + data.down + data.warning + data.unknown;
  const percentages = {
    up: (data.up / total) * 100,
    down: (data.down / total) * 100,
    warning: (data.warning / total) * 100,
    unknown: (data.unknown / total) * 100
  };

  const statusItems = [
    { label: 'Up', count: data.up, percentage: percentages.up, color: 'bg-green-500', icon: CheckCircle },
    { label: 'Down', count: data.down, percentage: percentages.down, color: 'bg-red-500', icon: XCircle },
    { label: 'Warning', count: data.warning, percentage: percentages.warning, color: 'bg-yellow-500', icon: AlertTriangle },
    { label: 'Unknown', count: data.unknown, percentage: percentages.unknown, color: 'bg-orange-500', icon: HelpCircle }
  ];

  return (
    <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-white mb-4">
        Device Status Overview
      </h3>
      
      {/* Circular Progress */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            {/* Up devices */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${percentages.up * 2.51} 251`}
              strokeDashoffset="0"
              className="text-green-500"
            />
            {/* Down devices */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${percentages.down * 2.51} 251`}
              strokeDashoffset={`-${percentages.up * 2.51}`}
              className="text-red-500"
            />
            {/* Warning devices */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${percentages.warning * 2.51} 251`}
              strokeDashoffset={`-${(percentages.up + percentages.down) * 2.51}`}
              className="text-yellow-500"
            />
            {/* Unknown devices */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${percentages.unknown * 2.51} 251`}
              strokeDashoffset={`-${(percentages.up + percentages.down + percentages.warning) * 2.51}`}
              className="text-gray-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {total}
              </div>
              <div className="text-sm text-gray-400">
                Total
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-4">
        {statusItems.map((item) => (
          <div key={item.label} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
            <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center`}>
              <item.icon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-300">
                {item.label}
              </div>
              <div className="text-xs text-gray-400">
                {item.count} ({item.percentage.toFixed(1)}%)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceStatusChart;

