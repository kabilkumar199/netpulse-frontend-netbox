import React from "react";
import type { ReactNode, CSSProperties } from "react";
import type { FC } from "react";

// --- Interfaces ---
export interface ColumnDef<T> {
  header: string;
  accessor: keyof T | string;
  tdClassName?: string;
  tdStyle?: CSSProperties;
  render?: (row: T) => ReactNode;
}

export interface RowAction<T> {
  label: string;
  className?: string; // For passing Tailwind classes
  onClick: (row: T) => void;
}

interface ReusableTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  loading?: boolean;
  rowActions?: RowAction<T>[];
  emptyComponent?: ReactNode | null;
}

// --- Tailwind Spinner Component ---
const TableSpinner: FC = () => (
  <div
    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
    role="status"
  >
    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
      Loading...
    </span>
  </div>
);

// --- Table Component ---
const ReusableTable = <T extends object>({
  columns = [],
  data = [],
  loading = false,
  rowActions = [],
  emptyComponent = null,
}: ReusableTableProps<T>) => {
  const actionCount = rowActions.length;
  const buttonBaseClasses = "px-2 py-1 text-xs font-medium rounded shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2";

  return (
    <div className="p-1 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-center align-middle">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
            {actionCount > 0 && (
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td
                colSpan={columns.length + (actionCount > 0 ? 1 : 0)}
                className="text-center p-10"
              >
                <TableSpinner />
              </td>
            </tr>
          ) : data?.length > 0 ? (
            data.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-gray-50">
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${col.tdClassName || ""}`}
                    style={col.tdStyle || {}}
                  >
                    {col.render
                      ? col.render(row)
                      : (row[col.accessor as keyof T] as ReactNode)}
                  </td>
                ))}
                {actionCount > 0 && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {rowActions.map((action, actionIdx) => (
                      <button
                        key={actionIdx}
                        type="button"
                        className={`${buttonBaseClasses} ${action.className || 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'} mr-2`}
                        onClick={() => action.onClick(row)}
                      >
                        {action.label}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (actionCount > 0 ? 1 : 0)}
                className="text-center p-10 text-gray-500"
              >
                {emptyComponent || <span>No Data Found</span>}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReusableTable;