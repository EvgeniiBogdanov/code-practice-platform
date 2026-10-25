import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, FileText } from "lucide-react";
import { DESIGN_TOPICS } from "@/entities/design-topic";
import styles from "./TopicCards.module.css";

/** The «Теория» folder: every article is a link row with its summary and reading time. */
export const TopicCards = (): React.JSX.Element => (
  <ol className={styles.list}>
    {DESIGN_TOPICS.map((topic, index) => (
      <li key={topic.id}>
        <Link
          to="/system-design/topics/$topicId"
          params={{ topicId: topic.id }}
          className={styles.article}
        >
          <span className={styles.icon} aria-hidden="true">
            <FileText size={20} />
          </span>
          <span className={styles.body}>
            <span className={styles.kicker}>Статья {index + 1}</span>
            <span className={styles.title}>{topic.title}</span>
            <span className={styles.summary}>{topic.summary}</span>
          </span>
          <span className={styles.meta}>
            <span className={styles.minutes}>
              <Clock size={13} aria-hidden="true" />
              {topic.minutes} мин
            </span>
            <ArrowRight size={16} className={styles.arrow} aria-hidden="true" />
          </span>
        </Link>
      </li>
    ))}
  </ol>
);
