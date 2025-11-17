import React from "react";
import type { ReactNode, CSSProperties, FC } from "react";

// --- Interfaces ---
export interface ColumnDef<T> {
  header: string;
  accessor: keyof T | string;
  tdClassName?: string;
  tdStyle?: CSSProperties;
  render?: (row: T) => ReactNode;
}

export interface RowAction<T> {
  label: React.ReactNode;
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
    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em]"
    role="status"
  >
    <span className="sr-only">Loading...</span>
  </div>
);

// --- Dark Themed Table ---
const ReusableTable = <T extends object>({
  columns = [],
  data = [],
  loading = false,
  rowActions = [],
  emptyComponent = null,
}: ReusableTableProps<T>) => {
  const actionCount = rowActions.length;

  return (
    <div className="p-4 bg-[#0f172a] min-h-screen text-gray-100">
      <div className="bg-[#1e293b] shadow-xl rounded-2xl overflow-hidden border border-gray-700">
        <table className="min-w-full text-center align-middle">
          <thead className="bg-[#334155] text-gray-200">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className="px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
              {actionCount > 0 && (
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
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
                <tr
                  key={rowIdx}
                  className={`${
                    rowIdx % 2 === 0 ? "bg-[#1e293b]" : "bg-[#273449]"
                  } hover:bg-[#334155] transition-colors`}
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={`px-6 py-4 whitespace-nowrap text-sm ${col.tdClassName || ""}`}
                      style={col.tdStyle || {}}
                    >
                      {col.render
                        ? col.render(row)
                        : (row[col.accessor as keyof T] as ReactNode)}
                    </td>
                  ))}

                  {actionCount > 0 && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-center">
                      {rowActions.map((action, actionIdx) => (
                        <button
                          key={actionIdx}
                          type="button"
                          className={
                            action.className ||
                            "px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1 mr-2"
                          }
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
                  className="text-center p-10 text-gray-400"
                >
                  {emptyComponent || <span>No Data Found</span>}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReusableTable;
