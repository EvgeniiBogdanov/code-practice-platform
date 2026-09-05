import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "@tanstack/react-router";
import { FinderActiveDropdown } from "./types";

export const useFinderDropdown = () => {
  const [activeDropdown, setActiveDropdown] = useState<FinderActiveDropdown>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const closeAllDropdowns = useCallback(() => {
    setActiveDropdown(null);
  }, []);

  const toggleDropdown = useCallback((name: "section" | "group" | "subgroup" | "task") => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  }, []);

  // Close on click outside or Escape key
  useEffect(() => {
    if (!activeDropdown) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeAllDropdowns();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeAllDropdowns();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeDropdown, closeAllDropdowns]);

  // Close on route navigation
  useEffect(() => {
    closeAllDropdowns();
  }, [location.pathname, closeAllDropdowns]);

  return {
    activeDropdown,
    containerRef,
    toggleDropdown,
    closeAllDropdowns,
  };
};
