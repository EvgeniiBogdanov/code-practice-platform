import React, { memo } from "react";
import { Lightbulb } from "lucide-react";
import { Callout, GitHubIcon } from "@/shared/ui";
import styles from "./HomePage.module.css";

export const HomeCallouts = memo((): React.JSX.Element => {
  return (
    <div className={styles.calloutsGrid}>
      <Callout
        color="blue"
        icon={<Lightbulb size={20} />}
        title="Быстрый старт"
        className={styles.calloutBanner}
      >
        <div className={styles.calloutText}>
          Решайте задачи во встроенном редакторе или любимой IDE. Анализируйте код кандидата,
          изучайте эталонные решения O(N) / O(1), проверяйте критерии самопроверки и запускайте
          код в живой консоли и React-песочнице.
        </div>
      </Callout>

      <Callout
        color="yellow"
        icon={<GitHubIcon size={20} />}
        title="Open-Source проект"
        className={styles.calloutBanner}
      >
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
      </Callout>
    </div>
  );
});

HomeCallouts.displayName = "HomeCallouts";
