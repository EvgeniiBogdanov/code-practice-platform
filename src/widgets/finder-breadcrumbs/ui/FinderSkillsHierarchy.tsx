import React from "react";
import { Waypoints } from "lucide-react";
import { clsx } from "clsx";
import styles from "./FinderBreadcrumbs.module.css";

export const FinderSkillsHierarchy = (): React.JSX.Element => (
  <>
    <span className={styles.separator}>/</span>
    <div className={styles.dropdownWrapper}>
      <span className={clsx(styles.breadcrumbBtn, styles.staticItem)}>
        <Waypoints size={14} className={styles.iconMuted} />
        <span className={styles.itemText}>Карта навыков</span>
      </span>
    </div>
  </>
);
