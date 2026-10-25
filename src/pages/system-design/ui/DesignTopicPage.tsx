import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { MarkdownView } from "@/shared/ui";
import type { DesignTopic } from "@/entities/design-topic";
import styles from "./DesignTopicPage.module.css";

export interface DesignTopicPageProps {
  topic: DesignTopic;
  article: string;
}

export const DesignTopicPage = ({ topic, article }: DesignTopicPageProps): React.JSX.Element => (
  <article className={styles.page}>
    <Link to="/system-design" className={styles.back}>
      <ArrowLeft size={14} aria-hidden="true" />
      <span>Системный дизайн</span>
    </Link>
    <header className={styles.header}>
      <h1 className={styles.title}>{topic.title}</h1>
      <p className={styles.meta}>Чтение: {topic.minutes} мин</p>
    </header>
    <MarkdownView content={article} />
  </article>
);
