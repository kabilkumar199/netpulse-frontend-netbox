import React from "react";
import { Plus } from "lucide-react";

interface ManufacturersToolbarProps {
  onAdd: () => void;
  onSearch: (value: string) => void;
}

const ManufacturersToolbar: React.FC<ManufacturersToolbarProps> = ({
  onAdd,
  onSearch,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <input
        type="text"
        placeholder="Search manufacturers..."
        className="border rounded-lg px-3 py-2 w-1/2"
        onChange={(e) => onSearch(e.target.value)}
      />
      <button
        onClick={onAdd}
        className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700"
      >
        <Plus size={16} /> Add Manufacturer
      </button>
    </div>
  );
};

export default ManufacturersToolbar;
