import React, { useState, useEffect } from "react";
import { Palette, Check, Moon, Sun, Droplet } from "lucide-react";
import useLocalStorage from "../../hooks/auth/useLocalStorage";

interface ThemeColor {
  name: string;
  value: string;
  primary: string;
  primaryDark: string;
  primaryLight: string;
}

const themeColors: ThemeColor[] = [
  {
    name: "Blue",
    value: "blue",
    primary: "#2563eb",
    primaryDark: "#1e40af",
    primaryLight: "#3b82f6",
  },
  {
    name: "Green",
    value: "green",
    primary: "#16a34a",
    primaryDark: "#15803d",
    primaryLight: "#22c55e",
  },
  {
    name: "Purple",
    value: "purple",
    primary: "#9333ea",
    primaryDark: "#7e22ce",
    primaryLight: "#a855f7",
  },
  {
    name: "Orange",
    value: "orange",
    primary: "#ea580c",
    primaryDark: "#c2410c",
    primaryLight: "#f97316",
  },
  {
    name: "Red",
    value: "red",
    primary: "#dc2626",
    primaryDark: "#b91c1c",
    primaryLight: "#ef4444",
  },
  {
    name: "Indigo",
    value: "indigo",
    primary: "#6366f1",
    primaryDark: "#4f46e5",
    primaryLight: "#818cf8",
  },
  {
    name: "Pink",
    value: "pink",
    primary: "#db2777",
    primaryDark: "#be185d",
    primaryLight: "#ec4899",
  },
  {
    name: "Teal",
    value: "teal",
    primary: "#14b8a6",
    primaryDark: "#0d9488",
    primaryLight: "#2dd4bf",
  },
];

interface ThemeSettingsProps {
  onClose?: () => void;
}

const ThemeSettings: React.FC<ThemeSettingsProps> = () => {
  const [themeMode, setThemeMode] = useLocalStorage<"light" | "dark">(
    "theme-mode",
    "dark"
  );
  const [themeColor, setThemeColor] = useLocalStorage<string>(
    "theme-color",
    "blue"
  );

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", themeMode);
    root.setAttribute("data-color", themeColor);

    // Update CSS custom properties
    const selectedColor = themeColors.find((c) => c.value === themeColor);
    if (selectedColor) {
      root.style.setProperty("--theme-primary", selectedColor.primary);
      root.style.setProperty("--theme-primary-dark", selectedColor.primaryDark);
      root.style.setProperty(
        "--theme-primary-light",
        selectedColor.primaryLight
      );
    }
  }, [themeMode, themeColor]);

  const handleThemeModeChange = (mode: "light" | "dark") => {
    setThemeMode(mode);
  };

  const handleColorChange = (color: string) => {
    setThemeColor(color);
  };

  const selectedColor = themeColors.find((c) => c.value === themeColor);

  return (
    <div className="p-5">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Theme Settings</h1>
        <p className="text-gray-400">
          Customize the appearance of your application
        </p>
      </div>

      <div className="space-y-6">
        {/* Theme Mode */}
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-5">
          <div className="flex items-center space-x-2 mb-4">
            {themeMode === "dark" ? (
              <Moon className="w-5 h-5 text-gray-400" />
            ) : (
              <Sun className="w-5 h-5 text-gray-400" />
            )}
            <h2 className="text-lg font-semibold text-white">Theme Mode</h2>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Choose between light and dark theme
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => handleThemeModeChange("dark")}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                themeMode === "dark"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <Moon className="w-5 h-5" />
              <span>Dark</span>
              {themeMode === "dark" && <Check className="w-5 h-5" />}
            </button>
            <button
              onClick={() => handleThemeModeChange("light")}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                themeMode === "light"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <Sun className="w-5 h-5" />
              <span>Light</span>
              {themeMode === "light" && <Check className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Theme Color */}
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-5">
          <div className="flex items-center space-x-2 mb-4">
            <Palette className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-white">Theme Color</h2>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Select your preferred accent color
          </p>
          <div className="grid grid-cols-4 gap-4">
            {themeColors.map((color) => (
              <button
                key={color.value}
                onClick={() => handleColorChange(color.value)}
                className={`relative aspect-square rounded-lg transition-all ${
                  themeColor === color.value
                    ? "ring-4 ring-offset-2 ring-offset-gray-800 ring-blue-500"
                    : "hover:scale-105"
                }`}
                style={{
                  backgroundColor: color.primary,
                }}
                title={color.name}
              >
                {themeColor === color.value && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white rounded-full p-1">
                      <Check className="w-4 h-4 text-gray-900" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
          {selectedColor && (
            <div className="mt-4 p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Selected Color:</span>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-gray-500"
                    style={{ backgroundColor: selectedColor.primary }}
                  />
                  <span className="text-sm font-medium text-white">
                    {selectedColor.name}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-5">
          <div className="flex items-center space-x-2 mb-4">
            <Droplet className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-white">Preview</h2>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            See how your theme will look
          </p>
          <div className="space-y-3">
            <div className="flex space-x-3">
              <button
                className="px-4 py-2 rounded-lg font-medium text-white"
                style={{
                  backgroundColor: selectedColor?.primary || "#2563eb",
                }}
              >
                Primary Button
              </button>
              <button
                className="px-4 py-2 rounded-lg font-medium border-2 border-gray-600 text-white hover:bg-gray-700"
                style={{
                  borderColor: selectedColor?.primary || "#2563eb",
                }}
              >
                Secondary Button
              </button>
            </div>
            <div className="p-4 rounded-lg bg-gray-700">
              <div className="space-y-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: "75%",
                    backgroundColor: selectedColor?.primary || "#2563eb",
                  }}
                />
                <div className="h-2 rounded-full bg-gray-600" style={{ width: "50%" }} />
                <div className="h-2 rounded-full bg-gray-600" style={{ width: "30%" }} />
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gray-700">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: selectedColor?.primary || "#2563eb",
                  }}
                />
                <span className="text-sm text-white">Sample text with theme color</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <p className="text-sm text-blue-300">
            <strong>Note:</strong> Your theme preferences are saved automatically
            and will be applied across all pages.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;

