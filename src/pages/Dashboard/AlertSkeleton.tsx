import React from 'react';

// Add 'export' here
export const AlertSkeleton = () => (
  <div className="block p-3 rounded-lg bg-gray-700 animate-pulse mr-2">
    {/* Header: Severity and Timestamp */}
    <div className="flex items-center justify-between mb-2">
      <div className="h-4 bg-gray-600 rounded w-20"></div>
      <div className="h-4 bg-gray-600 rounded w-16"></div>
    </div>
    
    {/* Body: Device ID */}
    <div className="h-5 bg-gray-600 rounded w-3/4 mb-2"></div>
    
    {/* Footer: Description */}
    <div className="h-4 bg-gray-600 rounded w-full"></div>
  </div>
);

// You could also export other components
// export const AnotherComponent = () => ( ... )