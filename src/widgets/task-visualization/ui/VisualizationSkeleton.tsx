import type { JSX } from "react";
import { UiSkeleton } from "@/shared/ui";
import styles from "./AlgorithmLab.module.css";

export const VisualizationSkeleton = (): JSX.Element => (
  <div
    className={styles.skeleton}
    role="status"
    aria-label="Загрузка визуализации"
    aria-busy="true"
  >
    <UiSkeleton className={styles.skeletonTitle} />
    <UiSkeleton className={styles.skeletonInput} />
    <div className={styles.skeletonScene}>
      {["a", "b", "c", "d", "e", "f"].map((id) => (
        <UiSkeleton key={id} className={styles.skeletonCell} />
      ))}
    </div>
    <UiSkeleton className={styles.skeletonInput} />
    <UiSkeleton className={styles.skeletonCode} />
    <span className={styles.muted}>Загружаем сцену и пошаговый разбор…</span>
  </div>
);
