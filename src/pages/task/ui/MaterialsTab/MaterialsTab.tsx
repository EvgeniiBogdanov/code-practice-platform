import React, { useMemo } from "react";
import { BookOpen, Clock, ExternalLink } from "lucide-react";
import { parseMarkdownBlocks } from "@/shared/lib/markdown";
import { Callout, MetaRow, MetaBadge, MarkdownView } from "@/shared/ui";
import { Task, TASK_EXPLANATIONS } from "@/entities/task";
import styles from "./MaterialsTab.module.css";

export interface TaskArticleItem {
  title: string;
  url: string;
  urlTitle?: string;
}

export interface MaterialsTabProps {
  task: Task & { articles?: TaskArticleItem[] };
  className?: string;
}

export const MaterialsTab = ({ task, className }: MaterialsTabProps): React.JSX.Element => {
  let explanationText =
    (TASK_EXPLANATIONS as Record<string, string>)[String(task.id)] || task.explanation || null;

  if (explanationText) {
    explanationText = explanationText
      .replace(/^###\s*Разбор решения[:\s]*[^\n]*\n*/gi, "")
      .replace(/^#\s+[^\n]*\n*/g, "")
      .replace(/^(?:Ссылка на оригинал|Источник|Оригинал)[:\s]*[^\n]*\n*/gim, "")
      .replace(/^##\s*Уровень сложности\s*\n+[^\n]*\n*/gim, "")
      .replace(/^Уровень сложности[^\n]*\n*/gim, "")
      .replace(/\n*##+\s*(?:\d+\.\s*)?Полезные материалы[\s\S]*$/gi, "")
      .replace(/\n*##+\s*(?:\d+\.\s*)?Материалы по теме[\s\S]*$/gi, "")
      .trim();
  }

  const blocks = useMemo(() => {
    if (!explanationText) return [];
    return parseMarkdownBlocks(explanationText);
  }, [explanationText]);

  const readingTimeMinutes = useMemo(() => {
    if (!explanationText) return 1;
    const cleanText = explanationText
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/#+|_|\*|`|\[.*?\]\(.*?\)/g, " ")
      .trim();
    const words = cleanText.split(/\s+/).filter(Boolean).length;
    const codeBlocks = (explanationText.match(/```[\s\S]*?```/g) || []).length;
    return Math.max(1, Math.ceil(words / 140 + codeBlocks * 0.7));
  }, [explanationText]);

  const hasExplanation = Boolean(explanationText) && blocks.length > 0;
  const articles = task.articles || [];
  const hasArticles = articles.length > 0;

  if (!hasExplanation && !hasArticles) {
    return <div className={styles.empty}>Материалы и разбор для данной задачи формируются.</div>;
  }

  return (
    <div className={[styles.container, className].filter(Boolean).join(" ")}>
      {hasExplanation && (
        <article className={styles.articlePage}>
          <header className={styles.header}>
            <h1 className={styles.title}>Разбор решения: {task.title}</h1>
            <MetaRow>
              <MetaBadge variant="blue" icon={<BookOpen size={12} />}>
                Разбор решения
              </MetaBadge>
              <MetaBadge variant="yellow" icon={<Clock size={12} />}>
                ~{readingTimeMinutes} мин чтения
              </MetaBadge>
              {hasArticles && (
                <MetaBadge variant="purple" icon={<ExternalLink size={12} />}>
                  Ссылки на материалы и статьи
                </MetaBadge>
              )}
            </MetaRow>
          </header>

          <hr className={styles.divider} />

          <div className={styles.content}>
            <MarkdownView blocks={blocks} />

            {hasArticles && (
              <Callout color="purple" icon="📚" title="Полезные материалы и статьи">
                <ul className={styles.articlesList}>
                  {articles.map((art: TaskArticleItem, idx: number) => (
                    <li key={art.url || `${art.title}-${idx}`}>
                      <span className={styles.articleTopic}>{art.title}: </span>
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
          </div>
        </article>
      )}

      {!hasExplanation && hasArticles && (
        <Callout color="purple" icon="📚" title="Полезные материалы и статьи">
          <ul className={styles.articlesList}>
            {articles.map((art: TaskArticleItem, idx: number) => (
              <li key={art.url || `${art.title}-${idx}`}>
                <span className={styles.articleTopic}>{art.title}: </span>
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
    </div>
  );
};
