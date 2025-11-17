import React from "react";
import { Trash2, Eye } from "lucide-react";

const DeviceRolesActions: React.FC = () => {
  return (
    <div className="flex justify-between items-center pt-4">
      <div className="text-sm text-gray-400">Bulk Actions:</div>
      <div className="flex gap-2">
        <button className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded flex items-center gap-1 text-sm">
          <Trash2 size={14} /> Delete Selected
        </button>
        <button className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded flex items-center gap-1 text-sm">
          <Eye size={14} /> View Details
        </button>
      </div>
    </div>
  );
};

export default DeviceRolesActions;
