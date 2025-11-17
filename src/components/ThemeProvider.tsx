import { useEffect } from "react";
import useLocalStorage from "../hooks/auth/useLocalStorage";

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode] = useLocalStorage<"light" | "dark">("theme-mode", "dark");
  const [themeColor] = useLocalStorage<string>("theme-color", "blue");

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", themeMode);
    root.setAttribute("data-color", themeColor);

    // Theme colors
    const themeColors: Record<string, { primary: string; primaryDark: string; primaryLight: string }> = {
      blue: { primary: "#2563eb", primaryDark: "#1e40af", primaryLight: "#3b82f6" },
      green: { primary: "#16a34a", primaryDark: "#15803d", primaryLight: "#22c55e" },
      purple: { primary: "#9333ea", primaryDark: "#7e22ce", primaryLight: "#a855f7" },
      orange: { primary: "#ea580c", primaryDark: "#c2410c", primaryLight: "#f97316" },
      red: { primary: "#dc2626", primaryDark: "#b91c1c", primaryLight: "#ef4444" },
      indigo: { primary: "#6366f1", primaryDark: "#4f46e5", primaryLight: "#818cf8" },
      pink: { primary: "#db2777", primaryDark: "#be185d", primaryLight: "#ec4899" },
      teal: { primary: "#14b8a6", primaryDark: "#0d9488", primaryLight: "#2dd4bf" },
    };

    const selectedColor = themeColors[themeColor] || themeColors.blue;
    
    root.style.setProperty("--theme-primary", selectedColor.primary);
    root.style.setProperty("--theme-primary-dark", selectedColor.primaryDark);
    root.style.setProperty("--theme-primary-light", selectedColor.primaryLight);
  }, [themeMode, themeColor]);

  return <>{children}</>;
};

export default ThemeProvider;

