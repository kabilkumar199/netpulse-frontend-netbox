import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import TopologyView from "./TopologyView";
import type { LldpResponse } from "../../../types/topology";
import { API_ENDPOINTS } from "../../../helpers/url_helper";
import { api } from "../../../services/api/api";

const TopologyPage: React.FC = () => {
  const [topologyData, setTopologyData] = useState<LldpResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Use the same base URL configuration as other API calls

  const fetchTopologyData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch LLDP topology data from API
      const response = await api.get<any>(`${API_ENDPOINTS.LLDP_TOPOLOGY}`, {
        headers: {
          Accept: "application/json",
        },
      });

      // Handle different response formats
      let lldpData: LldpResponse | null = null;

      // Check if response already has LldpResponse structure
      if (response && response.nodes && response.edges) {
        lldpData = response as LldpResponse;
      }
      // Check if response is wrapped in a property

      if (lldpData) {
        setTopologyData(lldpData);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      console.error("Error fetching LLDP topology:", err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.detail ||
          err?.message ||
          "Failed to fetch topology data"
      );
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.detail ||
          err?.message ||
          "Failed to fetch topology data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopologyData();
  }, []);

  const handleRefresh = () => {
    fetchTopologyData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading topology data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 max-w-md">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!topologyData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <p className="text-gray-400">No topology data available</p>
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return <TopologyView data={topologyData} onRefresh={handleRefresh} />;
};

export default TopologyPage;
