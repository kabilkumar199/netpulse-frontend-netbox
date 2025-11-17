import React, { useEffect, useState } from "react";
import type { FC } from "react";
import axios from 'axios';
import api from '../../services/api/api'; // Adjust path
import { toast } from 'react-toastify';
import ReusableTable from "../../components/common/ui/ReusableTable";
import type { ColumnDef } from "../../components/common/ui/ReusableTable";
import StatusBadge from "../../components/common/ui/StatusBadge";
import { API_ENDPOINTS } from '../../helpers/url_helper';
import { Eye, FileText, Calendar, Server, AlertCircle } from "lucide-react";      
import { api8081 } from "../../helpers/api/apiHelper";

// --- TypeScript Interfaces ---
// --- TypeScript Interfaces ---
interface Log {
  id: string;
  deviceId: string | null;
  userName: string;
  alarmType: string;
  createdDate: string;
  description: string;
  status: string;
  result: "Success" | "Failure" | string;
}

interface ApiResponse {
  totalPages: number;
  pageSize: number;
  hasPrevious: boolean;
  hasNext: boolean;
  currentPage: number;
  logs: Log[];
  totalElements: number;
}

const ITEMS_PER_PAGE = 15;

// --- Table Columns ---
const columns: ColumnDef<Log>[] = [
  {
    header: "Event Type",
    accessor: "alarmType",
  },
  {
    header: "Event Date",
    accessor: "createdDate",
    render: (row: Log) => new Date(row.createdDate).toLocaleString(),
  },
  {
    header: "Description",
    accessor: "description",
    tdClassName: "text-left text-wrap",
    tdStyle: { width: "450px" },
    render: (row: Log) => row.description || "-",
  },
  {
    header: "Status",
    accessor: "result",
    tdClassName: "text-center",
    render: (row: Log) => <StatusBadge value={row.result || "failure"} />,
  },
];

// --- Component ---
const EventPage: FC = () => {
  document.title = "Netpulse | Events";

  const [eventData, setEventData] = useState<ApiResponse | null>(null);
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [selectedDetails, setSelectedDetails] = useState<Log | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

   useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          size: ITEMS_PER_PAGE,
        };
        // Use api.get, which handles auth
        const response = await api.get<ApiResponse>("/events", { params });
        setEventData(response.data);
      } catch (error) {
        console.error("Failed to fetch event data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [currentPage]);
 

  const showDetails = (item: Log) => {
    setSelectedDetails(item);
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setSelectedDetails(null);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0) {
      setCurrentPage(newPage);
    }
  };

  const handleClearAll = () => {
    console.warn("Clear All functionality not implemented.");
  };

  // --- Tailwind Classes for Darker Theme ---
  const buttonBaseClasses =
    "px-3 py-1 text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800"; // Changed offset color
  const buttonDisabledClasses = "bg-slate-600 cursor-not-allowed opacity-50"; // Changed disabled color
  const buttonEnabledClasses = "bg-slate-700 hover:bg-slate-600 focus:ring-slate-500"; // Changed pagination color

  return (
    // Page container with darker background
    <div className="w-full mx-auto p-4 sm:p-6 lg:p-8 bg-slate-900 text-slate-200 min-h-screen">
      <div className="w-full">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center p-2 mb-4">
          <h4 className="text-2xl font-semibold mb-0 text-white">
            Events ({eventData?.totalElements || 0})
          </h4>
          <button
            type="button"
            className={`${buttonBaseClasses} bg-red-600 hover:bg-red-700 focus:ring-red-500`}
            onClick={handleClearAll}
          >
            Clear All
          </button>
        </div>

        {/* Card container for the table */}
        <div className="mt-2 bg-slate-800 shadow-xl rounded-lg overflow-hidden border border-slate-700">
          <ReusableTable<Log>
            columns={columns}
            data={eventData?.logs || []}
            loading={loading}
            rowActions={[
              {
                label: (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </>
                ),
                className:
                  "px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1 mr-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-800", // Changed offset color
                onClick: showDetails,
              },
            ]}
          />

          {/* Pagination */}
          <div className="flex justify-end items-center flex-wrap gap-3 px-4 py-3 bg-slate-800 border-t border-slate-700">
            <button
              type="button"
              className={`${buttonBaseClasses} ${
                !eventData?.hasPrevious
                  ? buttonDisabledClasses
                  : buttonEnabledClasses
              }`}
              disabled={!eventData?.hasPrevious}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
            <span className="text-sm text-slate-400">
              Page {eventData?.currentPage ? eventData.currentPage + 1 : 1} of{" "}
              {eventData?.totalPages || 1}
            </span>
            <button
              type="button"
              className={`${buttonBaseClasses} ${
                !eventData?.hasNext ? buttonDisabledClasses : buttonEnabledClasses
              }`}
              disabled={!eventData?.hasNext}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>

        {/* Dark Theme Details Popup */}
        {popupVisible && selectedDetails && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
            onClick={closePopup}
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Content */}
            <div
              className="bg-slate-800 text-slate-200 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-700">
                <h4 className="text-lg font-semibold text-white text-capitalize">
                  {(
                    selectedDetails?.alarmType ||
                    (selectedDetails as any)?.eventType ||
                    "Event"
                  )
                    .replace(/_/g, " ")
                    .toLowerCase()
                    .replace(/\b\w/g, (c: string) => c.toUpperCase())}
                </h4>
                <button
                  onClick={closePopup}
                  className="text-slate-400 hover:text-white text-2xl font-bold"
                  title="Close"
                >
                  &times;
                </button>
              </div>
              {/* Modal Body (Scrollable) */}
              <div className="p-4 overflow-y-auto">
                <table className="table-auto w-full border-collapse border border-slate-700">
                  <tbody className="divide-y divide-slate-700">
                    {Object.entries(selectedDetails as Log)
                      .filter(
                        ([_, value]) => value !== null && value !== undefined
                      )
                      .map(([key, value]) => (
                        <tr key={key} className="bg-slate-800 even:bg-slate-700">
                          {/* Key */}
                          <td className="border-r border-slate-700 p-3 font-semibold align-top w-1/3 text-slate-400">
                            {key
                              .replace(/_/g, " ")
                              .toLowerCase()
                              .replace(/\b\w/g, (c) => c.toUpperCase())}
                            :
                          </td>
                          {/* Value */}
                          <td
                            className="p-3 align-top text-slate-200"
                            style={{
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                            }}
                          >
                            {typeof value === "object"
                              ? JSON.stringify(value, null, 2)
                              : key.toLowerCase().includes("date") ||
                                key.toLowerCase().includes("time")
                              ? new Date(value).toLocaleString()
                              : value?.toString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPage;