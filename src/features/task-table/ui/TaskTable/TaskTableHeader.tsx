import React from "react";
import { Star } from "lucide-react";
import styles from "./TaskTable.module.css";

export const TaskTableHeader = (): React.JSX.Element => (
  <div className={styles.columnsHeader} aria-hidden="true">
    <span className={styles.columnName}>Папка / Файл</span>
    <div className={styles.columnMeta}>
      <span className={styles.columnSolution}>Решение</span>
      <span className={styles.columnReview}>Повторение</span>
      <span className={styles.columnStatus}>Статус</span>
      <span className={styles.columnFavorite}>
        <Star size={13} className={styles.favoriteHeaderIcon} />
      </span>
    </div>
  </div>
);
