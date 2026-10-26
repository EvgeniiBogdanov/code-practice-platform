import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, FileText } from "lucide-react";
import { DESIGN_TOPICS, DESIGN_TOPIC_GROUPS } from "@/entities/design-topic";
import styles from "./TopicCards.module.css";

/** The «Теория» folder: articles grouped by their role, each a link row with its summary and reading time. */
export const TopicCards = (): React.JSX.Element => (
  <div className={styles.groups}>
    {DESIGN_TOPIC_GROUPS.map((group) => {
      const topics = DESIGN_TOPICS.filter((topic) => topic.group === group.id);
      if (topics.length === 0) return null;
      return (
        <section
          key={group.id}
          className={styles.group}
          aria-labelledby={`sd-topic-group-${group.id}`}
        >
          <h3 id={`sd-topic-group-${group.id}`} className={styles.groupTitle}>
            {group.title}
          </h3>
          <ol className={styles.list}>
            {topics.map((topic) => (
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
                    <span className={styles.kicker}>Статья {DESIGN_TOPICS.indexOf(topic) + 1}</span>
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
        </section>
      );
    })}
  </div>
);
