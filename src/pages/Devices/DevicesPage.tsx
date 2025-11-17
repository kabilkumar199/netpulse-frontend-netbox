import React, { useEffect, useState } from "react";
import type { Device } from "../../types";
import type { NetBoxAPIResponse, NetBoxDevice } from "../../types/netbox";
import { adaptNetBoxDevice } from "../../services/netboxAdapter";
import DeviceList from "../../components/tables/DeviceList";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../helpers/url_helper";
import { toast } from "react-toastify";
import axios from "axios";

const NETBOX_TOKEN = "f860879ea8dc32e1e80ce72357fe84f40c1b8f18";
const NETBOX_BASE_URL = "http://172.27.1.69:8000";

const DevicesPage: React.FC = () => {
  const navigate = useNavigate();

  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleDeviceSelect = (device: Device) => {
    navigate(`/device/${device.id}`, {
      state: {
        deviceData: device,
      },
    });
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const response = await axios.get<NetBoxAPIResponse<NetBoxDevice>>(
        `${NETBOX_BASE_URL}${API_ENDPOINTS.GET_NETBOX_DEVICES_URL || "/api/dcim/devices"}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Token ${NETBOX_TOKEN}`,
          },
        }
      );

      // Handle NetBox API response structure
      const netboxDevices: NetBoxDevice[] = response.data.results || [];

      // Map NetBox devices to internal Device format
      const mappedDevices = netboxDevices.map(adaptNetBoxDevice);
      setDevices(mappedDevices);
    } catch (error: any) {
      console.error("Error fetching devices:", error);
      toast.error(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch devices"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DeviceList
      onDeviceSelect={handleDeviceSelect}
      devices={devices}
      loading={loading}
    />
  );
};

export default DevicesPage;
