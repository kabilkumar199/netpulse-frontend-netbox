import React from "react";
import { Search } from "lucide-react";

interface Props {
  onSearch: (value: string) => void;
}

const DeviceRolesToolbar: React.FC<Props> = ({ onSearch }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="relative w-96">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search device roles..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
    </div>
  );
};

export default DeviceRolesToolbar;
