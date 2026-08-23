import React from "react";
import { Link } from "@tanstack/react-router";
import { PanelLeftOpen, PanelLeftClose, Code2 } from "lucide-react";
import { useUIStore } from "@/entities/ui-state";
import styles from "./HeaderBrand.module.css";

export interface HeaderBrandProps {
  className?: string;
}

export function HeaderBrand({ className }: HeaderBrandProps) {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <div className={[styles.brandContainer, className].filter(Boolean).join(" ")}>
      <button
        type="button"
        className={styles.sidebarToggle}
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? "Скрыть панель навигации" : "Показать панель навигации"}
        title={sidebarOpen ? "Скрыть сайдбар" : "Показать сайдбар"}
      >
        {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
      </button>

      <Link to="/" className={styles.logoLink}>
        <span className={styles.logoIcon}>
          <Code2 size={16} />
        </span>
        <span>CodePractice</span>
      </Link>
    </div>
  );
}
