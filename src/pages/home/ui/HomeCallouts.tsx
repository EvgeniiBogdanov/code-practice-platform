import React, { memo } from "react";
import { Callout, GitHubIcon, TelegramIcon } from "@/shared/ui";
import styles from "./HomePage.module.css";

export const HomeCallouts = memo((): React.JSX.Element => {
  return (
    <div className={styles.calloutsGrid}>
      <Callout
        color="yellow"
        icon={
          <a
            href="https://github.com/EvgeniiBogdanov/code-practice-platform"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            className={styles.calloutIconLink}
          >
            <GitHubIcon size={20} />
          </a>
        }
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
          или внесите свой вклад в функционал платформы.
        </div>
      </Callout>

      <Callout
        color="blue"
        icon={
          <a
            href="https://t.me/johnbeelow"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram: @johnbeelow"
            className={styles.calloutIconLink}
          >
            <TelegramIcon size={20} />
          </a>
        }
        title="Идеи и сотрудничество"
        className={styles.calloutBanner}
      >
        <div className={styles.calloutText}>
          Если у вас есть идеи или предложения сотрудничества пишите:{" "}
          <a
            href="https://t.me/johnbeelow"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.textLink}
          >
            @johnbeelow
          </a>
        </div>
      </Callout>
    </div>
  );
});

HomeCallouts.displayName = "HomeCallouts";
