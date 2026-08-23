import React from "react";
import { BookOpen } from "lucide-react";
import styles from "./FinderBreadcrumbs.module.css";

export const FinderHomeHierarchy = () => {
  return (
    <>
      <span className={styles.separator}>/</span>
      <div className={styles.dropdownWrapper}>
        <button
          type="button"
          className={[styles.breadcrumbBtn, styles.staticItem].join(" ")}
          title="Обзор платформы"
        >
          <BookOpen size={14} className={styles.iconMuted} />
          <span className={styles.itemText}>Обзор платформы</span>
        </button>
      </div>
    </>
  );
};
