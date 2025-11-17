import React from "react";
import { Edit, Trash2, Type } from "lucide-react";

const RegionsActions: React.FC = () => {
  return (
    <div className="flex gap-3 mt-4">
      <button className="bg-amber-500 hover:bg-amber-600 text-black font-medium px-4 py-2 rounded-lg flex items-center gap-1">
        <Edit size={16} /> Edit Selected
      </button>
      <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-lg flex items-center gap-1">
        <Type size={16} /> Rename Selected
      </button>
      <button className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-1">
        <Trash2 size={16} /> Delete Selected
      </button>
    </div>
  );
};

export default RegionsActions;
