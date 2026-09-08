import React from "react";
import { clsx } from "clsx";
import { PlatformLogo } from "@/shared/ui";
import styles from "./FinderBreadcrumbs.module.css";

export const FinderHomeHierarchy = (): React.JSX.Element => {
  return (
    <>
      <span className={styles.separator}>/</span>
      <div className={styles.dropdownWrapper}>
        <button
          type="button"
          className={clsx(styles.breadcrumbBtn, styles.staticItem)}
        >
          <PlatformLogo size={14} className={styles.iconMuted} />
          <span className={styles.itemText}>Обзор платформы</span>
        </button>
      </div>
    </>
  );
};
