import React from "react";
import { Edit2, Trash2, Eye } from "lucide-react";

interface ManufacturersActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

const ManufacturersActions: React.FC<ManufacturersActionsProps> = ({
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <div className="flex gap-2 justify-end">
      <button
        onClick={onView}
        className="text-blue-600 hover:text-blue-800"
        title="View"
      >
        <Eye size={16} />
      </button>
      <button
        onClick={onEdit}
        className="text-emerald-600 hover:text-emerald-800"
        title="Edit"
      >
        <Edit2 size={16} />
      </button>
      <button
        onClick={onDelete}
        className="text-red-600 hover:text-red-800"
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default ManufacturersActions;
