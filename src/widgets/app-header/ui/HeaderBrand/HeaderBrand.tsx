import React, { memo } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, PanelLeft } from "lucide-react";
import { clsx } from "clsx";
import { useUIStore } from "@/entities/ui-state";
import { PlatformLogo, SquareButton } from "@/shared/ui";
import styles from "./HeaderBrand.module.css";

export interface HeaderBrandProps {
  className?: string;
}

export const HeaderBrand = memo(({ className }: HeaderBrandProps): React.JSX.Element => {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <div className={clsx(styles.brandContainer, className)}>
      <SquareButton
        icon={sidebarOpen ? <PanelLeft size={18} /> : <Menu size={18} />}
        className={styles.sidebarToggle}
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? "Скрыть панель навигации" : "Показать панель навигации"}
        title={sidebarOpen ? "Скрыть сайдбар" : "Показать сайдбар"}
      />

      <Link to="/" className={styles.logoLink}>
        <PlatformLogo size={26} className={styles.logoIcon} />
        <span>CodePractice</span>
      </Link>
    </div>
  );
});

HeaderBrand.displayName = "HeaderBrand";
