import React, { useEffect, useState } from "react";
import type { Device } from "../../types";
import type { NetBoxAPIResponse, NetBoxDevice } from "../../types/netbox";
import DeviceList from "../../components/tables/DeviceList";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../helpers/url_helper";
import { toast } from "react-toastify";
import axios from "axios";
import { adaptNetBoxDevice } from "../../services/netboxAdapter";
import { NETBOX_CONFIG } from "../../config/netbox";

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
        `${NETBOX_CONFIG.BASE_URL}${
          API_ENDPOINTS.GET_NETBOX_DEVICES_URL || "/api/dcim/devices"
        }`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Token ${NETBOX_CONFIG.TOKEN}`,
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
      onReload={fetchDevices}
      netboxBaseUrl={NETBOX_CONFIG.BASE_URL}
      netboxToken={NETBOX_CONFIG.TOKEN}
    />
  );
};

export default DevicesPage;
