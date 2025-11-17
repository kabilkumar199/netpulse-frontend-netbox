import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
 import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Get page title and subtitle based on current route
  const getPageInfo = () => {
    const path = location.pathname;

    if (path === "/dashboard") {
      return {
        title: "Dashboard",
        subtitle: "Network overview and quick actions",
      };
    } else if (path === "/devices") {
      return { title: "Devices", subtitle: "Manage network devices" };
    } else if (path === "/discovery") {
      return {
        title: "Discovery",
        subtitle: "Discover and import network devices",
      };
    } else if (path === "/topology") {
      return { title: "Topology", subtitle: "Visualize network topology" };
    } else if (path.startsWith("/organization")) {
      return {
        title: "Organization",
        subtitle: "Manage organizational structure",
      };
    } else if (path.startsWith("/monitoring")) {
      return {
        title: "Monitoring",
        subtitle: "Monitor network performance and health",
      };
    } else if (path.startsWith("/management")) {
      return {
        title: "Management",
        subtitle: "System management and administration",
      };
    } else if (path.startsWith("/settings")) {
      return { title: "Settings", subtitle: "Configure system settings" };
    }

    return { title: "Netpulse", subtitle: "" };
  };

  const { title, subtitle } = getPageInfo();

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onMenuClick={toggleSidebar} title={title} subtitle={subtitle} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 bg-gray-900">
          <Outlet />
        </main>
        {/* Footer */}
        <footer className="border-t border-gray-800 bg-gray-900 px-5 py-3 text-center">
          <p className="text-sm text-gray-500">
            {" "}
            © {new Date().getFullYear()} Exaware Routing Ltd. — NMS 2.1.6
            </p>
        </footer>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-75 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default Layout;
