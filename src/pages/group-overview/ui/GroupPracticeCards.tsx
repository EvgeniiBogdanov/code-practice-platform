import React from "react";
import { Link } from "@tanstack/react-router";
import { Callout } from "@/shared/ui";
import { PracticeTaskItem, ArticleLinkItem } from "../model/types";
import styles from "./GroupOverviewPage.module.css";

export interface GroupPracticeCardsProps {
  practiceTasksList: PracticeTaskItem[];
  articleLinksList: ArticleLinkItem[];
  taskRoute: string;
}

export const GroupPracticeCards = ({
  practiceTasksList,
  articleLinksList,
  taskRoute,
}: GroupPracticeCardsProps) => {
  if (practiceTasksList.length === 0 && articleLinksList.length === 0) return null;

  return (
    <>
      {/* Section 10: Practice Tasks */}
      {practiceTasksList.length > 0 && (
        <Callout
          color="orange"
          icon="🎯"
          title="10. Практика: задачи для закрепления"
          id="10-практика-задачи-для-закрепления"
        >
          <p className={styles.folderHeroDesc}>
            Рекомендуемый порядок для отработки навыка (от простого к сложному):
          </p>
          <ul className={styles.solutionPracticeList}>
            {practiceTasksList.map((item, idx) => (
              <li key={idx}>
                <span className={styles.articleTopic}>
                  {idx + 1}. {item.title}
                </span>{" "}
                — {item.desc}.{" "}
                {item.isInternal && item.id ? (
                  <Link to={taskRoute} params={{ taskId: item.id }} className={styles.articleLink}>
                    Решать на платформе →
                  </Link>
                ) : item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.articleLink}
                  >
                    LeetCode ↗
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </Callout>
      )}

      {/* Section 11: Useful Materials */}
      {articleLinksList.length > 0 && (
        <Callout
          color="purple"
          icon="📚"
          title="11. Полезные материалы"
          id="11-полезные-материалы"
          className={styles.solutionArticlesCard}
        >
          <ul className={styles.solutionArticlesList}>
            {articleLinksList.map((art, idx) => (
              <li key={idx}>
                <span className={styles.articleTopic}>{art.title}:</span>{" "}
                <a
                  href={art.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.articleLink}
                >
                  {art.urlTitle || "Читать статью"} ↗
                </a>
              </li>
            ))}
          </ul>
        </Callout>
      )}
    </>
  );
};
