import React, { useState, useEffect, useMemo } from "react";
import type { LogEntry } from "../../types";
import { mockLogEntries } from "../../data/mockData";
import DataTable, {
  type TableColumn,
  type FilterConfig,
} from "../../components/common/ui/DataTable";
import { Eye, FileText, Calendar, Server, AlertCircle } from "lucide-react";

interface LogManagementProps {
  onClose?: () => void;
}

interface LogDetailsModalProps {
  log: LogEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

const LogDetailsModal: React.FC<LogDetailsModalProps> = ({
  log,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !log) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "emergency":
        return "text-red-300 bg-red-900";
      case "alert":
        return "text-red-300 bg-red-900";
      case "critical":
        return "text-red-400 bg-red-900";
      case "error":
        return "text-red-400 bg-red-900";
      case "warning":
        return "text-yellow-400 bg-yellow-900";
      case "notice":
        return "text-blue-400 bg-blue-900";
      case "info":
        return "text-green-400 bg-green-900";
      case "debug":
        return "text-gray-400 bg-gray-700";
      default:
        return "text-gray-400 bg-gray-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-5 py-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            Log Entry Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-sm text-gray-400 mb-1">Severity</div>
              <span
                className={`px-3 py-1 rounded text-sm font-medium ${getSeverityColor(
                  log.severity
                )}`}
              >
                {log.severity.toUpperCase()}
              </span>
            </div>
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-sm text-gray-400 mb-1">Facility</div>
              <div className="text-white font-medium">{log.facility}</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-sm text-gray-400 mb-1">Source</div>
              <div className="text-white font-medium">{log.source}</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-sm text-gray-400 mb-1">Timestamp</div>
              <div className="text-white font-medium">
                {log.timestamp.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-2">Message</div>
            <div className="text-white">{log.message}</div>
          </div>

          {/* Raw Message */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-2">Raw Message</div>
            <div className="text-gray-300 font-mono text-sm bg-gray-900 p-3 rounded overflow-x-auto">
              {log.rawMessage}
            </div>
          </div>

          {/* Parsed Fields */}
          {Object.keys(log.parsedFields || {}).length > 0 && (
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-sm text-gray-400 mb-3">Parsed Fields</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(log.parsedFields || {}).map(([key, value]) => (
                  <div key={key} className="bg-gray-800 rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">{key}</div>
                    <div className="text-white text-sm">{String(value)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {log.tags && log.tags.length > 0 && (
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-sm text-gray-400 mb-2">Tags</div>
              <div className="flex flex-wrap gap-2">
                {log.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LogManagement: React.FC<LogManagementProps> = ({ onClose }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // Load logs from mock data
    setLogs(mockLogEntries);
    setIsLoading(false);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "emergency":
        return "text-red-300 bg-red-900";
      case "alert":
        return "text-red-300 bg-red-900";
      case "critical":
        return "text-red-400 bg-red-900";
      case "error":
        return "text-red-400 bg-red-900";
      case "warning":
        return "text-yellow-400 bg-yellow-900";
      case "notice":
        return "text-blue-400 bg-blue-900";
      case "info":
        return "text-green-400 bg-green-900";
      case "debug":
        return "text-gray-400 bg-gray-700";
      default:
        return "text-gray-400 bg-gray-700";
    }
  };

  const handleView = (log: LogEntry) => {
    setSelectedLog(log);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedLog(null);
  };

  // Get unique values for filter options
  const uniqueSources = useMemo(() => {
    const sources = new Set(logs.map((log) => log.source));
    return Array.from(sources).map((source) => ({
      value: source,
      label: source,
    }));
  }, [logs]);

  const uniqueFacilities = useMemo(() => {
    const facilities = new Set(logs.map((log) => log.facility));
    return Array.from(facilities).map((facility) => ({
      value: facility,
      label: facility,
    }));
  }, [logs]);

  const severityOptions = [
    { value: "emergency", label: "Emergency" },
    { value: "alert", label: "Alert" },
    { value: "critical", label: "Critical" },
    { value: "error", label: "Error" },
    { value: "warning", label: "Warning" },
    { value: "notice", label: "Notice" },
    { value: "info", label: "Info" },
    { value: "debug", label: "Debug" },
  ];

  const columns: TableColumn<LogEntry>[] = [
    {
      key: "timestamp",
      title: "Timestamp",
      sortable: true,
      searchable: true,
      render: (value: Date) => (
        <div className="text-sm text-white">
          <div>{value.toLocaleDateString()}</div>
          <div className="text-xs text-gray-400">
            {value.toLocaleTimeString()}
          </div>
        </div>
      ),
      width: "150px",
    },
    {
      key: "severity",
      title: "Severity",
      sortable: true,
      filterable: true,
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(
            value
          )}`}
        >
          {value.toUpperCase()}
        </span>
      ),
      width: "120px",
    },
    {
      key: "facility",
      title: "Facility",
      sortable: true,
      filterable: true,
      render: (value: string) => (
        <span className="text-sm text-gray-300">{value}</span>
      ),
      width: "120px",
    },
    {
      key: "source",
      title: "Source",
      sortable: true,
      filterable: true,
      searchable: true,
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          <Server className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-white font-mono">{value}</span>
        </div>
      ),
      width: "150px",
    },
    {
      key: "message",
      title: "Message",
      searchable: true,
      render: (value: string, item: LogEntry) => (
        <div className="max-w-md">
          <div className="text-sm text-white truncate" title={value}>
            {value}
          </div>
          {item.rawMessage && item.rawMessage !== value && (
            <div
              className="text-xs text-gray-500 truncate"
              title={item.rawMessage}
            >
              {item.rawMessage.substring(0, 50)}...
            </div>
          )}
        </div>
      ),
    },
    {
      key: "tags",
      title: "Tags",
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {(value || []).slice(0, 2).map((tag: string, index: number) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded"
            >
              {tag}
            </span>
          ))}
          {(value || []).length > 2 && (
            <span className="px-2 py-0.5 text-gray-400 text-xs">
              +{(value || []).length - 2}
            </span>
          )}
        </div>
      ),
      width: "150px",
    },
    {
      key: "actions",
      title: "Actions",
      render: (_value: any, item: LogEntry) => (
        <button
          onClick={() => handleView(item)}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
        >
          <Eye className="w-4 h-4" />
          <span>View</span>
        </button>
      ),
      width: "100px",
      align: "center",
    },
  ];

  const filters: FilterConfig[] = [
    {
      key: "severity",
      type: "select",
      label: "Severity",
      options: [{ value: "all", label: "All Severities" }, ...severityOptions],
    },
    {
      key: "source",
      type: "select",
      label: "Source",
      options: [{ value: "all", label: "All Sources" }, ...uniqueSources],
    },
    {
      key: "facility",
      type: "select",
      label: "Facility",
      options: [{ value: "all", label: "All Facilities" }, ...uniqueFacilities],
    },
    // Date range filter can be added later when DataTable supports it
    // For now, using text filter for searching by date
    {
      key: "dateRange",
      type: "text",
      label: "Date Range",
      placeholder: "Search by date (e.g., 2024-01-15)",
    },
  ];

  return (
    <div className="p-5">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Log Management</h1>
      </div>

      <DataTable
        data={logs}
        columns={columns}
        filters={filters}
        searchable={true}
        searchPlaceholder="Search logs by message, source, or content..."
        loading={isLoading}
        pagination={{
          enabled: true,
          pageSize: 25,
          showSizeChanger: true,
          pageSizeOptions: [10, 25, 50, 100],
          showQuickJumper: false,
          showTotal: true,
        }}
        emptyMessage="No log entries found"
        emptyIcon={<FileText className="w-12 h-12 text-gray-600 mx-auto" />}
        onRefresh={() => {
          setIsLoading(true);
          setTimeout(() => {
            setLogs(mockLogEntries);
            setIsLoading(false);
          }, 500);
        }}
        rowClassName={(item: LogEntry) => {
          if (
            ["emergency", "alert", "critical", "error"].includes(item.severity)
          ) {
            return "hover:bg-red-900/20 border-l-2 border-red-500";
          }
          if (item.severity === "warning") {
            return "hover:bg-yellow-900/20 border-l-2 border-yellow-500";
          }
          return "";
        }}
      />

      <LogDetailsModal
        log={selectedLog}
        isOpen={isViewModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default LogManagement;
