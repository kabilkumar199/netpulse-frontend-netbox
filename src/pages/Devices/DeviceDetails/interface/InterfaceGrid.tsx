 import type { InterfaceIp } from '../../../../types/interface';
 import { RefreshCw, HelpCircle } from 'lucide-react';
import { organizeInterfaces } from '../../../../utils/interfaceParser';

interface InterfaceGridProps {
  interfaces: InterfaceIp[];
  onRefresh?: () => void;
}

// Ethernet Port Icon Component
const EthernetIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h1 1 14z"/>
    <rect x="6" y="2" width="2" height="4" rx="0.5" />
    <rect x="9" y="2" width="2" height="4" rx="0.5" />
    <rect x="12" y="2" width="2" height="4" rx="0.5" />
    <rect x="15" y="2" width="2" height="4" rx="0.5" />
    <path d="M5 6h14c1.1 0 2 0.9 2 2v10c0 1.1-0.9 2-2 2H5c-1.1 0-2-0.9-2-2V8c0-1.1 0.9-2 2-2z" />
    <path d="M8 20v-3H6v3h2zm4 0v-3h-2v3h2zm4 0v-3h-2v3h2z" fill="currentColor" />
  </svg>
);

// Management Icon (Gear/Settings)
const ManagementIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
  </svg>
);

// Loopback Icon (Circular Arrow)
const LoopbackIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
  </svg>
);

export default function InterfaceGrid({ interfaces, onRefresh }: InterfaceGridProps) {
  const grouped = organizeInterfaces(interfaces);
  const now = new Date();
  const lastUpdated = now.toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  // Render main 0/0 interface grid (48 interfaces in 2 rows: even on top, odd on bottom)
  const renderMainGrid = () => {
    const port0Group = grouped['0/0'] || [];
    const interfacesBySubport: { [key: number]: typeof port0Group[0] } = {};

    port0Group.forEach((iface) => {
      const subport = iface.subport ?? 0;
      interfacesBySubport[subport] = iface;
    });

    const renderInterfaceIcon = (subport: number) => {
      const iface = interfacesBySubport[subport];
      const status = iface?.original.status || 'down';
      const hasSubinterface = iface?.subinterface !== undefined;
      const hasAddress = iface?.original['address/type'] !== '';

      const statusBg = status === 'up' ? 'bg-green-500' : status === 'admin-down' ? 'bg-orange-500' : 'bg-gray-800';
      const iconColor = status === 'up' ? 'text-green-300' : status === 'admin-down' ? 'text-orange-300' : 'text-gray-600';

      return (
        <div
          key={subport}
          className="flex flex-col items-center"
          title={iface ? `${iface.original.interface} - ${status}${hasAddress ? ` - ${iface.original['address/type']}` : ''}` : `0/0/${subport} (empty)`}
        >
          <span className="text-[7px] font-mono text-gray-500 mb-0.5 whitespace-nowrap">{`0/0/${subport}`}</span>
          <div className={`w-10 h-10 ${statusBg} rounded relative cursor-pointer hover:opacity-80 transition-opacity border border-gray-700/50 flex items-center justify-center`}>
            {/* Ethernet Port Icon */}
            <EthernetIcon className={`w-6 h-6 ${iconColor}`} />
            {/* Subinterface indicator - small dot top-right */}
            {hasSubinterface && (
              <div className="absolute top-1 right-1 w-1 h-1 bg-white/80 rounded-full z-10" />
            )}
            {/* Address indicator - small dot bottom-right */}
            {hasAddress && (
              <div className="absolute bottom-1 right-1 w-1 h-1 bg-white/80 rounded-full z-10" />
            )}
          </div>
        </div>
      );
    };

    // Create 2 rows - even on top (0,2,4...), odd on bottom (1,3,5...)
    const evenRow = Array.from({ length: 24 }, (_, i) => i * 2);
    const oddRow = Array.from({ length: 24 }, (_, i) => i * 2 + 1);

    return (
      <div className="border border-gray-700/50 rounded p-2 bg-gray-900/30">
        <div className="flex flex-col gap-1">
          {/* Top row - even numbers (0, 2, 4, ..., 46) */}
          <div className="flex gap-1">
            {evenRow.map((subport) => renderInterfaceIcon(subport))}
          </div>
          {/* Bottom row - odd numbers (1, 3, 5, ..., 47) */}
          <div className="flex gap-1">
            {oddRow.map((subport) => renderInterfaceIcon(subport))}
          </div>
        </div>
      </div>
    );
  };

  // Render 0/1 interfaces in vertical stack (only 2)
  const renderPort01Stack = () => {
    const port1Group = grouped['0/1'] || [];
    const interfacesBySubport: { [key: number]: typeof port1Group[0] } = {};

    port1Group.forEach((iface) => {
      const subport = iface.subport ?? 0;
      interfacesBySubport[subport] = iface;
    });

    const renderInterfaceIcon = (subport: number) => {
      const iface = interfacesBySubport[subport];
      const status = iface?.original.status || 'down';
      const hasAddress = iface?.original['address/type'] !== '';

      const statusBg = status === 'up' ? 'bg-green-500' : status === 'admin-down' ? 'bg-orange-500' : 'bg-gray-800';
      const iconColor = status === 'up' ? 'text-green-300' : status === 'admin-down' ? 'text-orange-300' : 'text-gray-600';

      return (
        <div
          key={subport}
          className="flex flex-col items-center"
          title={iface ? `${iface.original.interface} - ${status}${hasAddress ? ` - ${iface.original['address/type']}` : ''}` : `0/1/${subport} (empty)`}
        >
          <span className="text-[7px] font-mono text-gray-500 mb-0.5">{`0/1/${subport}`}</span>
          <div className={`w-14 h-8 ${statusBg} rounded relative cursor-pointer hover:opacity-80 transition-opacity border border-gray-700/50 flex items-center justify-center`}>
            {/* Ethernet Port Icon */}
            <EthernetIcon className={`w-5 h-5 ${iconColor}`} />
            {/* Address indicator */}
            {hasAddress && (
              <div className="absolute bottom-1 right-1 w-1 h-1 bg-white/80 rounded-full z-10" />
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="border border-gray-700/50 rounded p-2 bg-gray-900/30 flex flex-col gap-1">
        {[0, 1].map((subport) => renderInterfaceIcon(subport))}
      </div>
    );
  };

  // Render management interface
  const renderManagementInterface = () => {
    const mgmtInterfaces = grouped.mgmt || [];
    if (mgmtInterfaces.length === 0) return null;

    return (
      <div className="border border-gray-700/50 rounded p-2 bg-gray-900/30">
        {mgmtInterfaces.map((iface) => {
          const status = iface.original.status;
          const hasAddress = iface.original['address/type'] !== '';

          const statusBg = status === 'up' ? 'bg-green-500' : 'bg-gray-800';
          const iconColor = status === 'up' ? 'text-green-300' : 'text-gray-600';

          return (
            <div
              key={iface.original.interface}
              className="flex flex-col items-center"
              title={`${iface.original.interface} - ${status}${hasAddress ? ` - ${iface.original['address/type']}` : ''}`}
            >
              <span className="text-[7px] font-mono text-gray-500 mb-0.5">{iface.displayName}</span>
              <div className={`w-14 h-14 ${statusBg} rounded relative cursor-pointer hover:opacity-80 transition-opacity border border-gray-700/50 flex items-center justify-center`}>
                {/* Management Icon */}
                <ManagementIcon className={`w-7 h-7 ${iconColor}`} />
                {/* Address indicator */}
                {hasAddress && (
                  <div className="absolute bottom-1 right-1 w-1 h-1 bg-white/80 rounded-full z-10" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render loopback interfaces
  const renderLoopbackInterfaces = () => {
    const loopbackInterfaces = grouped.loopback || [];
    if (loopbackInterfaces.length === 0) return null;

    return (
      <div className="border border-gray-700/50 rounded p-2 bg-gray-900/30">
        <div className="flex flex-wrap gap-2">
          {loopbackInterfaces.map((iface) => {
            const status = iface.original.status;
            const hasAddress = iface.original['address/type'] !== '';

            const statusBg = status === 'up' ? 'bg-green-500' : 'bg-gray-800';
            const iconColor = status === 'up' ? 'text-green-300' : 'text-gray-600';

            return (
              <div
                key={iface.original.interface}
                className="flex flex-col items-center"
                title={`${iface.original.interface} - ${status}${hasAddress ? ` - ${iface.original['address/type']}` : ''}`}
              >
                <span className="text-[7px] font-mono text-gray-500 mb-0.5">{iface.displayName}</span>
                <div className={`w-12 h-12 ${statusBg} rounded relative cursor-pointer hover:opacity-80 transition-opacity border border-gray-700/50 flex items-center justify-center`}>
                  {/* Loopback Icon */}
                  <LoopbackIcon className={`w-6 h-6 ${iconColor}`} />
                  {/* Address indicator */}
                  {hasAddress && (
                    <div className="absolute bottom-1 right-1 w-1 h-1 bg-white/80 rounded-full z-10" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-sm font-semibold text-white">Interface Status</h2>
          <p className="text-[9px] text-gray-400 mt-0.5">x-eth0/0/16 - up</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-[9px] text-gray-400">
            Last updated: {lastUpdated}
          </div>
          <button
            onClick={onRefresh}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-3 h-3 text-gray-400" />
          </button>
          <button
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title="Help"
          >
            <HelpCircle className="w-3 h-3 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2 items-start">
          {/* Main grid (0/0) - takes most of the space */}
          <div className="flex-1">
            {renderMainGrid()}
          </div>

          {/* Right side - 0/1 stack and management */}
          <div className="flex gap-2 items-start">
            {/* 0/1 interfaces in vertical stack (only 2) */}
            {renderPort01Stack()}

            {/* Management interface */}
            {renderManagementInterface()}
          </div>
        </div>

        {/* Loopback interfaces below main grid */}
        {renderLoopbackInterfaces()}
      </div>
    </div>
  );
}
