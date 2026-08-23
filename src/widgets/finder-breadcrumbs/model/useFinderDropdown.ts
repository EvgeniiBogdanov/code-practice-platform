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

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeAllDropdowns();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeAllDropdowns]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeAllDropdowns();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeAllDropdowns]);

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
