import React, { useState } from 'react';
import type { Device, Site, DiscoveryScan } from '../types';
import TopologyScansView from '../pages/Network/TopologyScansView';
import { mockDiscoveryScans } from '../data/mockData';
import { netboxTopologyData, scanMetadata } from '../data/netboxMockData';
import { adaptSlurpitTopology } from '../services/netboxAdapter';

const TopologyPage: React.FC = () => {
  // Initialize with NetBox data converted to internal format
  const netboxScan = adaptSlurpitTopology(
    netboxTopologyData,
    scanMetadata.scan_name
  );

  const [discoveryScans] = useState<DiscoveryScan[]>([
    netboxScan,
    ...mockDiscoveryScans,
  ]);

  const handleDeviceSelect = (device: Device) => {
    console.log('Device selected:', device);
  };

  const handleSiteSelect = (site: Site) => {
    console.log('Site selected:', site);
  };

  return (
    <TopologyScansView
      onDeviceSelect={handleDeviceSelect}
      onSiteSelect={handleSiteSelect}
      scans={discoveryScans}
    />
  );
};

export default TopologyPage;
