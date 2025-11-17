import React from 'react';

// Common table utility functions and components

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'up': return 'bg-green-900 text-green-300';
    case 'down': return 'bg-red-900 text-red-300';
    case 'warning': return 'bg-yellow-900 text-yellow-300';
    case 'unknown': return 'bg-gray-700 text-gray-300';
    case 'active': return 'bg-green-900 text-green-300';
    case 'inactive': return 'bg-gray-700 text-gray-300';
    case 'pending': return 'bg-yellow-900 text-yellow-300';
    case 'error': return 'bg-red-900 text-red-300';
    default: return 'bg-gray-700 text-gray-300';
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'up': return '🟢';
    case 'down': return '🔴';
    case 'warning': return '🟡';
    case 'unknown': return '⚪';
    case 'active': return '🟢';      
    case 'inactive': return '⚪';
    case 'pending': return '🟡';
    case 'error': return '🔴';
    case 'Reachable': return '🟢';
    case 'Unreachable': return '🔴';
    default: return '⚪';
  }
};

export const formatLastSeen = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatNumber = (num: number, decimals = 0) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const formatDuration = (seconds: number) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
};

// Common status badge component
export const StatusBadge: React.FC<{ status: string; className?: string }> = ({ 
  status, 
  className = '' 
}) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)} ${className}`}>
    <span className="mr-1">{getStatusIcon(status)}</span>
    {status.toUpperCase()}
  </span>
);

// Common device icon component
export const DeviceIcon: React.FC<{ vendor: string; className?: string }> = ({ 
  vendor, 
  className = 'h-10 w-10' 
}) => {
  const getIcon = (vendor: string) => {
    switch (vendor.toLowerCase()) {
      case 'cisco': return '🔷';
      case 'dell': return '💻';
      case 'fortinet': return '🛡️';
      case 'juniper': return '🌲';
      case 'aruba': return '📡';
      case 'hp': return '🖥️';
      case 'netgear': return '📶';
      case 'mikrotik': return '🔧';
      default: return '🖥️';
    }
  };

  return (
    <div className={`${className} rounded-lg bg-gray-600 flex items-center justify-center`}>
      <span className="text-lg">{getIcon(vendor)}</span>
    </div>
  );
};

// Common action buttons component
export const ActionButtons: React.FC<{
  actions: Array<{
    label: string;
    onClick: (e: React.MouseEvent) => void;
    className?: string;
    icon?: React.ReactNode;
  }>;
  className?: string;
}> = ({ actions, className = '' }) => (
  <div className={`flex space-x-2 ${className}`}>
    {actions.map((action, index) => (
      <button
        key={index}
        onClick={action.onClick}
        className={`text-sm font-medium ${action.className || 'text-blue-400 hover:text-blue-300'}`}
      >
        {action.icon && <span className="mr-1">{action.icon}</span>}
        {action.label}
      </button>
    ))}
  </div>
);

// Common progress bar component
export const ProgressBar: React.FC<{
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
}> = ({ value, max = 100, className = '', showLabel = true }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
        {showLabel && (
          <>
            <span>{value}</span>
            <span>{percentage.toFixed(1)}%</span>
          </>
        )}
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Common chip/tag component
export const Chip: React.FC<{
  label: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ label, color = 'gray', size = 'md', className = '' }) => {
  const colorClasses = {
    blue: 'bg-blue-900 text-blue-300',
    green: 'bg-green-900 text-green-300',
    yellow: 'bg-yellow-900 text-yellow-300',
    red: 'bg-red-900 text-red-300',
    gray: 'bg-gray-700 text-gray-300'
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colorClasses[color]} ${sizeClasses[size]} ${className}`}>
      {label}
    </span>
  );
};

// Common loading skeleton component
export const TableSkeleton: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
}> = ({ rows = 5, columns = 4, className = '' }) => (
  <div className={`animate-pulse ${className}`}>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4 py-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div
            key={colIndex}
            className="h-4 bg-gray-700 rounded"
            style={{ width: `${Math.random() * 40 + 60}%` }}
          />
        ))}
      </div>
    ))}
  </div>
);

export default {
  getStatusColor,
  getStatusIcon,
  formatLastSeen,
  formatDate,
  formatNumber,
  formatBytes,
  formatDuration,
  StatusBadge,
  DeviceIcon,
  ActionButtons,
  ProgressBar,
  Chip,
  TableSkeleton
};
