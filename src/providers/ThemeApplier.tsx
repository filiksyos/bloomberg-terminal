"use client";
import { useEffect } from "react";
import { useSettingsStore } from "@/store/settingsStore";

export function ThemeApplier() {
  const theme = useSettingsStore((s) => s.theme);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  return null;
}
