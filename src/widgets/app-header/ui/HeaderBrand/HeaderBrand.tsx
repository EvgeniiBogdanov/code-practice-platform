import React from "react";
import { Link } from "@tanstack/react-router";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { clsx } from "clsx";
import { useUIStore } from "@/entities/ui-state";
import { PlatformLogo } from "@/shared/ui";
import styles from "./HeaderBrand.module.css";

export interface HeaderBrandProps {
  className?: string;
}

export function HeaderBrand({ className }: HeaderBrandProps): React.JSX.Element {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <div className={clsx(styles.brandContainer, className)}>
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
        <PlatformLogo size={26} className={styles.logoIcon} />
        <span>CodePractice</span>
      </Link>
    </div>
  );
}
