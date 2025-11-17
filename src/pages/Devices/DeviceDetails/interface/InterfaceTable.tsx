import { useState, useMemo } from 'react';
 import { Search } from 'lucide-react';
import type { InterfaceIp } from '../../../../types/interface';

interface InterfaceTableProps {
  interfaces: InterfaceIp[];
  activeTab: string;
}

export default function InterfaceTable({ interfaces, activeTab }: InterfaceTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInterfaces = useMemo(() => {
    let filtered = interfaces;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((iface) => iface.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (iface) =>
          iface.interface.toLowerCase().includes(query) ||
          iface.vrfname.toLowerCase().includes(query) ||
          iface['address/type'].toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [interfaces, statusFilter, searchQuery]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'up':
        return 'bg-green-600 text-green-100';
      case 'down':
        return 'bg-gray-600 text-gray-100';
      case 'admin-down':
        return 'bg-yellow-600 text-yellow-100';
      default:
        return 'bg-gray-600 text-gray-100';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="status-filter" className="text-sm text-gray-300">
              Filter by Status:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="up">Up</option>
              <option value="down">Down</option>
              <option value="admin-down">Admin Down</option>
            </select>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white rounded pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-700 text-left">
              <th className="px-4 py-3 text-sm font-semibold text-gray-300 border-b border-gray-600">
                VRF Name
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-300 border-b border-gray-600">
                Interface
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-300 border-b border-gray-600">
                Status
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-300 border-b border-gray-600">
                Address/Type
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredInterfaces.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  No interfaces found
                </td>
              </tr>
            ) : (
              filteredInterfaces.map((iface, index) => (
                <tr
                  key={`${iface.interface}-${index}`}
                  className="border-b border-gray-700 hover:bg-gray-750 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-gray-300">{iface.vrfname}</td>
                  <td className="px-4 py-3 text-sm text-white font-mono">{iface.interface}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(iface.status)}`}
                    >
                      {iface.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300 font-mono">
                    {iface['address/type'] || '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-400">
        Showing {filteredInterfaces.length} of {interfaces.length} interfaces
      </div>
    </div>
  );
}

