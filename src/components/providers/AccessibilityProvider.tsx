"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface AccessibilitySettings {
  fontSize: "normal" | "large" | "xlarge";
  highContrast: boolean;
  reducedMotion: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (settings: Partial<AccessibilitySettings>) => void;
}

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: "normal",
    highContrast: false,
    reducedMotion: false,
  });

  // Load settings from memory on mount
  useEffect(() => {
    const saved = {
      fontSize:
        (typeof window !== "undefined" && (window as any).__a11yFontSize) ||
        "normal",
      highContrast:
        (typeof window !== "undefined" && (window as any).__a11yHighContrast) ||
        false,
      reducedMotion:
        (typeof window !== "undefined" &&
          (window as any).__a11yReducedMotion) ||
        false,
    };
    setSettings(saved);
  }, []);

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;

    // Font size
    root.classList.remove("text-normal", "text-large", "text-xlarge");
    root.classList.add(`text-${settings.fontSize}`);

    // High contrast
    if (settings.highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }

    // Save to memory
    if (typeof window !== "undefined") {
      (window as any).__a11yFontSize = settings.fontSize;
      (window as any).__a11yHighContrast = settings.highContrast;
      (window as any).__a11yReducedMotion = settings.reducedMotion;
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility must be used within AccessibilityProvider",
    );
  }
  return context;
}
