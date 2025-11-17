import React from "react";
import type { FC } from "react";

interface StatusBadgeProps {
  value: string;
}

const StatusBadge: FC<StatusBadgeProps> = ({ value }) => {
  const status = value?.toLowerCase();

  // Determine classes based on value
  const isSuccess = status === 'success';
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const colorClasses = isSuccess
    ? "bg-green-100 text-green-800"
    : "bg-red-100 text-red-800";

  // Capitalize first letter
  const formattedValue = value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Unknown';

  return (
    <span className={`${baseClasses} ${colorClasses}`}>
      {formattedValue}
    </span>
  );
};

export default StatusBadge;