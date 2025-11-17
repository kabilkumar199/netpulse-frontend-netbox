import React from 'react';
import { ExternalLink } from 'lucide-react';

interface GrafanaViewProps {
  onClose?: () => void;
}

const GrafanaView: React.FC<GrafanaViewProps> = ({ onClose }) => {
  const grafanaUrl = 'http://192.168.31.209:3001/d/df3r6hqr00a9sb/router-metrics?orgId=1&var-device=device_10-3-40-1&from=1763009025434&to=1763009925434'
  // 'http://10.4.160.240:3001/public-dashboards/e2341c9d20a04894a4ea4b8bad48f180'
//   'http://10.4.160.240:3001/public-dashboards/4eebe8c71bcd4cc0a4c3a93db3da8d90';

  return (
    <div className="h-full w-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <h1 className="text-lg font-semibold text-white">Grafana Dashboard</h1>
        </div>
        <div className="flex items-center space-x-2">
          <a
            href={grafanaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open in Grafana</span>
          </a>
        </div>
      </div>

      {/* Grafana Dashboard Embed */}
      <div className="flex-1 overflow-hidden">
        <iframe
          src={grafanaUrl}
          title="Grafana Dashboard"
          className="w-full h-full border-0"
          allow="clipboard-read; clipboard-write"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>

      {/* Info Box */}
      <div className="bg-blue-900 border-t border-blue-700 px-6 py-3 text-blue-200 text-sm">
        <p>
          <strong>Note:</strong> The dashboard is displaying from Grafana. If you encounter any issues, 
          <a href={grafanaUrl} target="_blank" rel="noopener noreferrer" className="underline ml-1 hover:text-blue-100">
            open it directly in Grafana
          </a>.
        </p>
      </div>
    </div>
  );
};

export default GrafanaView;
