import { memo } from "react";
import { APP_VERSION } from "@/shared/config/ui-constants";
import styles from "./HomePage.module.css";

interface HomeHeroHeaderProps {
  grandTotal: number;
}

export const HomeHeroHeader = memo(({ grandTotal }: HomeHeroHeaderProps) => {
  return (
    <div className={styles.pageHeader}>
      <div className={styles.titleRow}>
        <h1 className={styles.mainTitle}>Code Practice Platform</h1>
        <span className={styles.versionTag}>v{APP_VERSION || "2.2.8"}</span>
      </div>
      <p className={styles.subtitle}>
        Интерактивная платформа для подготовки к техническим собеседованиям и практики решения задач
        ({grandTotal > 0 ? `${grandTotal} задач` : "280+ задач"}). Встроенный редактор кода с
        анализом типов, песочница кандидата, живой запуск React и интерактивная веб-консоль, умное
        интервальное повторение и эталонные решения.
      </p>
    </div>
  );
});

HomeHeroHeader.displayName = "HomeHeroHeader";
