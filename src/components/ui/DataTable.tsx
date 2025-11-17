import React, { useState, useMemo } from "react";
import {
  ChevronUp,
  ChevronDown,
  Search,
  Filter,
  Download,
  RefreshCw
} from "lucide-react";

// Types for the DataTable component
export interface TableColumn<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  className?: string;
  headerClassName?: string;
  width?: string | number;
  align?: "left" | "center" | "right";
}

export interface FilterConfig {
  key: string;
  type: "text" | "select" | "multiselect" | "date" | "daterange";
  label: string;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  className?: string;
}

export interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

export interface PaginationConfig {
  enabled: boolean;
  pageSize: number;
  showSizeChanger: boolean;
  pageSizeOptions: number[];
  showQuickJumper: boolean;
  showTotal: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  filters?: FilterConfig[];
  pagination?: PaginationConfig;
  searchable?: boolean;
  searchPlaceholder?: string;
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  onRowClick?: (item: T, index: number) => void;
  onRowDoubleClick?: (item: T, index: number) => void;
  onSort?: (sortConfig: SortConfig) => void;
  onFilter?: (filters: Record<string, any>) => void;
  onSearch?: (searchTerm: string) => void;
  onRefresh?: () => void;
  onImport?:React.ReactNode;
  onExport?: () => void;
  className?: string;
  headerActions?: React.ReactNode;
  rowClassName?: (item: T, index: number) => string;
  selectedRows?: T[];
  onSelectionChange?: (selectedRows: T[]) => void;
  selectable?: boolean;
  bulkActions?: React.ReactNode;
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  filters = [],
  pagination = {
    enabled: true,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: [10, 25, 50, 100],
    showQuickJumper: false,
    showTotal: true,
  },
  searchable = true,
  searchPlaceholder = "Search...",
  loading = false,
  emptyMessage = "No data available",
  emptyIcon,
  onRowClick,
  onRowDoubleClick,
  onSort,
  onFilter,
  onSearch,
  onRefresh,
  onImport,
  onExport,
  className = "",
  headerActions,
  rowClassName,
  selectedRows = [],
  onSelectionChange,
  selectable = false,
  bulkActions,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(pagination.pageSize);

  // Filter and search data
  const filteredData = useMemo(() => {
    let result = Array.isArray(data) ? [...data] : [];

    // Apply search
    if (searchTerm && searchable) {
      result = result.filter((item) => {
        return columns.some((column) => {
          if (!column.searchable) return false;
          const value =
            column.key === "string"
              ? item[column.key]
              : typeof column.key === "string"
              ? item[column.key]
              : "";
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        });
      });
    }

    // Apply filters
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          result = result.filter((item) => value.includes(item[key]));
        } else {
          result = result.filter((item) =>
            String(item[key])
              .toLowerCase()
              .includes(String(value).toLowerCase())
          );
        }
      }
    });

    return result;
  }, [data, searchTerm, filterValues, columns, searchable]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination.enabled) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize, pagination.enabled]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handle sorting
  const handleSort = (key: string) => {
    const column = columns.find((col) => col.key === key);
    if (!column?.sortable) return;

    const newSortConfig: SortConfig = {
      key,
      direction:
        sortConfig?.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    };

    setSortConfig(newSortConfig);
    onSort?.(newSortConfig);
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filterValues, [key]: value };
    setFilterValues(newFilters);
    onFilter?.(newFilters);
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  // Handle row selection
  const handleRowSelect = (item: T, checked: boolean) => {
    if (!onSelectionChange) return;

    if (checked) {
      onSelectionChange([...selectedRows, item]);
    } else {
      onSelectionChange(selectedRows.filter((row) => row !== item));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;

    if (checked) {
      onSelectionChange([...paginatedData]);
    } else {
      onSelectionChange([]);
    }
  };

  const isRowSelected = (item: T) => selectedRows.includes(item);
  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((item) => isRowSelected(item));
  const isIndeterminate = selectedRows.length > 0 && !isAllSelected;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Actions Row */}
      {(headerActions || onRefresh || onImport || onExport) && (
        <div className="  rounded-lg shadow-sm   border-gray-700 p-4">
          <div className="flex items-center justify-end gap-2">
            {headerActions}
              {onImport && (
              <>{onImport}</>
            )}
            
            {onExport && (
              <button
                onClick={onExport}
                className="px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            )}
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="px-3 py-2 text-sm border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-4">
        <div className="flex flex-wrap gap-4">
          {/* Search Row */}
          {searchable && (
            <div className=" rounded-lg shadow-sm   border-gray-700 p-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Filters Row */}
          {Array.isArray(filters) && filters.length > 0 && (
            <>
              {filters.map((filter) => (
                <div key={filter.key} className="min-w-0">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {filter.label}
                  </label>
                  {filter.type === "text" && (
                    <input
                      type="text"
                      value={filterValues[filter.key] || ""}
                      onChange={(e) =>
                        handleFilterChange(filter.key, e.target.value)
                      }
                      placeholder={filter.placeholder}
                      className={`px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        filter.className || ""
                      }`}
                    />
                  )}
                  {filter.type === "select" && (
                    <select
                      value={filterValues[filter.key] || ""}
                      onChange={(e) =>
                        handleFilterChange(filter.key, e.target.value)
                      }
                      className={`px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        filter.className || ""
                      }`}
                    >
                      <option value="">All {filter.label}</option>
                      {filter.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                  {filter.type === "multiselect" && (
                    <select
                      multiple
                      value={filterValues[filter.key] || []}
                      onChange={(e) => {
                        const values = Array.from(
                          e.target.selectedOptions,
                          (option) => option.value
                        );
                        handleFilterChange(filter.key, values);
                      }}
                      className={`px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        filter.className || ""
                      }`}
                    >
                      {filter.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {bulkActions && selectedRows.length > 0 && (
        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-300 text-sm">
              {selectedRows.length} item{selectedRows.length !== 1 ? "s" : ""}{" "}
              selected
            </span>
            {bulkActions}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                {selectable && (
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(input) => {
                        if (input) input.indeterminate = isIndeterminate;
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                )}
                {Array.isArray(columns) && columns.map((column, index) => (
                  <th
                    key={index}
                    className={`px-6 py-3 text-${
                      column.align || "left"
                    } text-xs font-medium text-gray-300 uppercase tracking-wider ${
                      column.headerClassName || ""
                    } ${
                      column.sortable ? "cursor-pointer hover:bg-gray-600" : ""
                    }`}
                    onClick={() =>
                      column.sortable && handleSort(String(column.key))
                    }
                    style={{ width: column.width }}
                  >
                    <div className="flex items-center gap-2">
                      {column.title}
                      {column.sortable && (
                        <div className="flex flex-col">
                          <ChevronUp
                            className={`h-3 w-3 ${
                              sortConfig?.key === column.key &&
                              sortConfig.direction === "asc"
                                ? "text-blue-400"
                                : "text-gray-400"
                            }`}
                          />
                          <ChevronDown
                            className={`h-3 w-3 -mt-1 ${
                              sortConfig?.key === column.key &&
                              sortConfig.direction === "desc"
                                ? "text-blue-400"
                                : "text-gray-400"
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td
                    colSpan={(Array.isArray(columns) ? columns.length : 0) + (selectable ? 1 : 0)}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    <div className="flex items-center justify-center">
                      <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={(Array.isArray(columns) ? columns.length : 0) + (selectable ? 1 : 0)}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center">
                      {emptyIcon || (
                        <span className="text-4xl text-gray-600">📋</span>
                      )}
                      <p className="text-gray-400 mt-2">{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr
                    key={index}
                    onClick={() => onRowClick?.(item, index)}
                    onDoubleClick={() => onRowDoubleClick?.(item, index)}
                    className={`${
                      onRowClick ? "cursor-pointer hover:bg-gray-700" : ""
                    } ${rowClassName ? rowClassName(item, index) : ""} ${
                      isRowSelected(item) ? "bg-blue-900/20" : ""
                    }`}
                  >
                    {selectable && (
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={isRowSelected(item)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleRowSelect(item, e.target.checked);
                          }}
                          className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    )}
                    {Array.isArray(columns) && columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className={`px-6 py-4 text-${
                          column.align || "left"
                        } text-sm ${column.className || "text-white"}`}
                      >
                        {column.render
                          ? column.render(item[column.key], item, index)
                          : String(item[column.key] || "")}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.enabled && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {pagination.showTotal && (
                  <span className="text-sm text-gray-400">
                    Showing {(currentPage - 1) * pageSize + 1} to{" "}
                    {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
                    {sortedData.length} entries
                  </span>
                )}
                {pagination.showSizeChanger && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Show:</span>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="px-2 py-1 border border-gray-600 rounded bg-gray-700 text-white text-sm"
                    >
                      {Array.isArray(pagination.pageSizeOptions) && pagination.pageSizeOptions.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-600 rounded bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                >
                  First
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-600 rounded bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                >
                  Previous
                </button>

                {pagination.showQuickJumper && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Page</span>
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      value={currentPage}
                      onChange={(e) => {
                        const page = Math.max(
                          1,
                          Math.min(totalPages, Number(e.target.value))
                        );
                        setCurrentPage(page);
                      }}
                      className="w-16 px-2 py-1 border border-gray-600 rounded bg-gray-700 text-white text-sm text-center"
                    />
                    <span className="text-sm text-gray-400">
                      of {totalPages}
                    </span>
                  </div>
                )}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-600 rounded bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-600 rounded bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DataTable;
