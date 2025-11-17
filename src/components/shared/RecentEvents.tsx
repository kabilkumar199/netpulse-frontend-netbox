import React from 'react';
import type { Event } from '../../types';
import { AlertCircle, AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react';

interface RecentEventsProps {
  events: Event[];
}

const RecentEvents: React.FC<RecentEventsProps> = ({ events }) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return AlertCircle;
      case 'error': return AlertTriangle;
      case 'warning': return AlertTriangle;
      case 'info': return Info;
      default: return CheckCircle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400';
      case 'error': return 'text-orange-400';
      case 'warning': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          Recent Events
        </h3>
        <button className="text-sm text-blue-400 hover:text-blue-300">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {events.slice(0, 5).map((event) => {
          const IconComponent = getSeverityIcon(event.severity);
          return (
          <div key={event.id} className="flex items-start space-x-4 p-4 bg-gray-700 rounded-lg">
            <div className="flex-shrink-0">
              <IconComponent className={`w-5 h-5 ${getSeverityColor(event.severity)}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className={`text-sm font-medium ${getSeverityColor(event.severity)}`}>
                  {event.type.replace('_', ' ').toUpperCase()}
                </p>
                <p className="text-xs text-gray-500">
                  {formatTimestamp(event.timestamp)}
                </p>
              </div>
              <p className="text-sm text-gray-300 mt-1">
                {event.message}
              </p>
              {event.deviceId && (
                <p className="text-xs text-gray-400 mt-1">
                  Device: {event.deviceId}
                </p>
              )}
              <div className="flex items-center space-x-4 mt-2">
                {event.acknowledged ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Acknowledged
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-900 text-yellow-300">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </span>
                )}
                {event.resolved && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900 text-blue-300">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Resolved
                  </span>
                )}
              </div>
            </div>
          </div>
          );
        })}
      </div>
      
      {events.length === 0 && (
        <div className="text-center py-8">
          <span className="text-4xl text-gray-600">📭</span>
          <p className="text-gray-400 mt-2">No recent events</p>
        </div>
      )}
    </div>
  );
};

export default RecentEvents;
