import { memo } from "react";
import { Lightbulb, Star } from "lucide-react";
import { Card } from "@/shared/ui";
import styles from "./HomePage.module.css";

export const HomeCallouts = memo(() => {
  return (
    <div className={styles.calloutsGrid}>
      <Card className={styles.calloutBanner}>
        <div className={styles.calloutIcon}>
          <Lightbulb size={20} style={{ color: "var(--accent-blue, #3b82f6)" }} />
        </div>
        <div className={styles.calloutContent}>
          <div className={styles.calloutTitle}>Быстрый старт</div>
          <div className={styles.calloutText}>
            Решайте задачи во встроенном редакторе или любимой IDE. Анализируйте код кандидата,
            изучайте эталонные решения O(N) / O(1), проверяйте критерии самопроверки и запускайте
            код в живой консоли и React-песочнице.
          </div>
        </div>
      </Card>

      <Card className={styles.calloutBanner}>
        <div className={styles.calloutIcon}>
          <Star size={20} style={{ color: "#f59e0b", fill: "rgba(245, 158, 11, 0.2)" }} />
        </div>
        <div className={styles.calloutContent}>
          <div className={styles.calloutTitle}>Open-Source проект</div>
          <div className={styles.calloutText}>
            Поддержите развитие платформы{" "}
            <a
              href="https://github.com/EvgeniiBogdanov/code-practice-platform"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.textLink}
            >
              звездой на GitHub
            </a>{" "}
            или внесите свой вклад новыми задачами и решениями.
          </div>
        </div>
      </Card>
    </div>
  );
});

HomeCallouts.displayName = "HomeCallouts";
