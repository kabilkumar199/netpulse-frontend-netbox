import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, X } from "lucide-react";
import { NAVIGATION_ITEMS, ICON_MAP } from "../../../router/routes";
import Logo from "./Logo";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}
interface StoredUser {
  username: string;
  email: string;
  // ... any other fields you saved
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [user, setUser] = useState<StoredUser>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : { username: "", email: "" };
  });

  const getIcon = (iconName: string | undefined) => {
    if (!iconName) return ICON_MAP.settings;
    return ICON_MAP[iconName] || ICON_MAP.settings;
  };

  const isActive = (path: string) => {
    if (!path) return false;
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const isParentActive = (item: any) => {
    if (item.children) {
      return item.children.some(
        (child: any) =>
          isActive(child.path) ||
          (child.children &&
            child.children.some((grandchild: any) => isActive(grandchild.path)))
      );
    }
    return isActive(item.path);
  };

  const toggleExpanded = (itemId: string, event?: React.MouseEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Auto-expand items with active children on mount and route change
  useEffect(() => {
    const activeItems: string[] = [];

    NAVIGATION_ITEMS.forEach((item) => {
      if (isParentActive(item)) {
        activeItems.push(item.id);

        // Check for active grandchildren
        if ("children" in item && item.children) {
          item.children.forEach((child: any) => {
            if ("children" in child && child.children) {
              const hasActiveGrandchild = child.children.some(
                (grandchild: any) => isActive(grandchild.path)
              );
              if (hasActiveGrandchild || isActive(child.path)) {
                activeItems.push(child.id);
              }
            }
          });
        }
      }
    });

    setExpandedItems((prev) => {
      const newSet = new Set([...prev, ...activeItems]);
      return Array.from(newSet);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Helper function to get initials from a username
  const getInitials = (username: string): string => {
    if (!username) return "...";

    // "gopisetti.gopi" -> "GG"
    const parts = username.split(".");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    // "admin" -> "AD"
    if (username.length >= 2) {
      return (username[0] + username[1]).toUpperCase();
    }

    return username.toUpperCase();
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col border-r border-gray-700 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:relative lg:inset-auto`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          {/* Logo */}
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
            </div>
          </div>
          <h1 className="text-xl font-bold text-white">Netpulse</h1>
        </div>
        <button
          onClick={onToggle}
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <span className="sr-only">Close sidebar</span>
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {NAVIGATION_ITEMS.map((item) => {
            const IconComponent = getIcon(item.icon);
            const hasChildren =
              "children" in item && item.children && item.children.length > 0;
            const isExpanded = expandedItems.includes(item.id);
            const isParentActiveItem = isParentActive(item);
            if ("displayInMenu" in item && item.displayInMenu === false) {
              return null;
            }
            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  onClick={(e) => {
                    if (hasChildren) {
                      toggleExpanded(item.id, e);
                    }
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isParentActiveItem && !hasChildren
                      ? "bg-blue-600 text-white"
                      : isParentActiveItem
                      ? "bg-blue-600/80 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {hasChildren && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform flex-shrink-0 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Link>

                {/* Submenu */}
                {hasChildren && isExpanded && "children" in item && (
                  <ul className="ml-6 mt-1 space-y-1">
                    {item.children.map((child: any) => {
                      const ChildIconComponent = getIcon(child.icon);
                      const hasGrandchildren =
                        "children" in child &&
                        child.children &&
                        child.children.length > 0;
                      const isChildExpanded = expandedItems.includes(child.id);
                      const isChildActive = isActive(child.path);
                      const isChildParentActive = hasGrandchildren
                        ? child.children.some((grandchild: any) =>
                            isActive(grandchild.path)
                          )
                        : false;
                      if (
                        "displayInMenu" in child &&
                        child.displayInMenu === false
                      ) {
                        return null;
                      }
                      return (
                        <li key={child.id}>
                          <Link
                            to={child.path}
                            onClick={(e) => {
                              if (hasGrandchildren) {
                                toggleExpanded(child.id, e);
                              }
                            }}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                              isChildActive || isChildParentActive
                                ? "bg-blue-700 text-white"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <ChildIconComponent className="w-4 h-4 flex-shrink-0" />
                              <span>{child.label}</span>
                            </div>
                            {hasGrandchildren && (
                              <ChevronDown
                                className={`w-3 h-3 transition-transform flex-shrink-0 ${
                                  isChildExpanded ? "rotate-180" : ""
                                }`}
                              />
                            )}
                          </Link>

                          {/* Grandchildren (third level) */}
                          {hasGrandchildren &&
                            isChildExpanded &&
                            "children" in child && (
                              <ul className="ml-6 mt-1 space-y-1">
                                {child.children.map((grandchild: any) => {
                                  const GrandchildIconComponent = getIcon(
                                    grandchild.icon
                                  );
                                  const isGrandchildActive = isActive(
                                    grandchild.path
                                  );

                                  return (
                                    <li key={grandchild.id}>
                                      <Link
                                        to={grandchild.path}
                                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                          isGrandchildActive
                                            ? "bg-blue-800 text-white"
                                            : "text-gray-500 hover:bg-gray-800 hover:text-white"
                                        }`}
                                      >
                                        <GrandchildIconComponent className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span>{grandchild.label}</span>
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {getInitials(user.username)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user.username}
            </p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
