import React from "react";
import { Star } from "lucide-react";
import { clsx } from "clsx";
import styles from "./FinderBreadcrumbs.module.css";

export const FinderFavoritesHierarchy = (): React.JSX.Element => (
  <>
    <span className={styles.separator}>/</span>
    <div className={styles.dropdownWrapper}>
      <span className={clsx(styles.breadcrumbBtn, styles.staticItem)}>
        <Star
          size={14}
          className={styles.iconFavorites}
          color="var(--accent-yellow)"
          fill="currentColor"
        />
        <span className={styles.itemText}>Избранное</span>
      </span>
    </div>
  </>
);
