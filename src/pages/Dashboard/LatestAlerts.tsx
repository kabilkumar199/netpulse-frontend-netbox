// src/components/shared/LatestAlerts.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { AlertTriangle, Loader2, CheckCircle } from 'lucide-react';
import { AlertSkeleton } from './AlertSkeleton';
// --- Type Definitions ---
interface Alert {
  id: string;
  severity: "critical" | "warning" | "info";
  description: string;
  timestamp: string;
  deviceId: string;
  link: string;
}

interface LatestAlertsProps {
  alerts: Alert[];
  isLoading?: boolean;
  error?: string | null;
}

const LatestAlerts: React.FC<LatestAlertsProps> = ({ alerts, isLoading = false, error = null }) => {
  const navigate = useNavigate();
  const getSeverityClasses = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
      default:
        return 'bg-blue-500 text-white';
    }
  };

  const getSeverityIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'info':
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };
 

  return (
    <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-4 h-full">
      <h3 className="text-lg font-semibold text-white mb-4">
        Recent Alarms
      </h3>
      
      
      <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2 -mr-2">
  {isLoading ? (
    <>
      <AlertSkeleton />
      <AlertSkeleton />
      <AlertSkeleton />
      <AlertSkeleton />
    </>
  ) : error ? (
    <div className="flex flex-col items-center justify-center text-red-400 py-10">
      <AlertTriangle className="w-10 h-10 mb-2" />
      <p className="font-semibold text-center">{error}</p>
    </div>
  ) : alerts.length > 0 ? (
    alerts.slice(0,5).map((alert) => (
      <a 
        key={alert.id} 
        onClick={() => navigate("/management/alerts")}
        className="block p-3 rounded-lg bg-gray-700 transition-colors hover:bg-gray-600"
      >
        <div className="flex items-center justify-between mb-1">
          <div className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded ${getSeverityClasses(alert.severity)}`}>
            {getSeverityIcon(alert.severity)}
            <span className="ml-1.5 capitalize">{alert.severity}</span>
          </div>
          <span className="text-xs text-gray-400">{alert.timestamp}</span>
        </div>
        <p className="text-sm font-medium text-gray-200 truncate" title={alert.deviceId}>
          {alert.deviceId}
        </p>
        <p className="text-xs text-gray-400 truncate" title={alert.description}>
          {alert.description}
        </p>
      </a>
    ))
  ) : (
    <p className="text-gray-500 text-center py-10">No recent alerts.</p>
  )}
</div>
    </div>
  );
};

export default LatestAlerts;