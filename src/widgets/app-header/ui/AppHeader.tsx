import React, { memo } from "react";
import { Tooltip } from "@/shared/ui";
import { HeaderActions } from "./HeaderActions";
import styles from "./AppHeader.module.css";

export interface AppHeaderProps {
  className?: string;
  breadcrumbs?: React.ReactNode;
}

export const AppHeader = memo(({ className, breadcrumbs }: AppHeaderProps) => {
  return (
    <header className={[styles.header, className].filter(Boolean).join(" ")}>
      <div className={styles.left}>{breadcrumbs}</div>
      <div className={styles.right}>
        <Tooltip.Provider delayDuration={600} skipDelayDuration={300}>
          <HeaderActions />
        </Tooltip.Provider>
      </div>
    </header>
  );
});

AppHeader.displayName = "AppHeader";
