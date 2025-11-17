import React from "react";
import DiscoveryWizard from "../../components/modals/DiscoveryWizard";
import type { DiscoveryScan } from "../../types";

const DiscoveryPage: React.FC = () => {
  const handleDiscoveryComplete = (scan: DiscoveryScan) => {
    // Handle scan completion if needed
    console.log("Discovery scan completed:", scan);
  };

  return (
    <div className="w-full">
      <DiscoveryWizard onComplete={handleDiscoveryComplete} />
    </div>
  );
};

export default DiscoveryPage;
