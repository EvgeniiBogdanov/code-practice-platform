import React from "react";
import { Link } from "@tanstack/react-router";
import { BookOpen, Check, Code2 } from "lucide-react";
import styles from "./StageLinks.module.css";

export interface StageDrillLink {
  id: string;
  title: string;
  solved: boolean;
}

export interface StageTopicLink {
  id: string;
  title: string;
}

export interface StageLinksProps {
  topics: readonly StageTopicLink[];
  drills: readonly StageDrillLink[];
}

/** Theory to read before the stage and code drills that practise it. */
export const StageLinks = ({ topics, drills }: StageLinksProps): React.JSX.Element | null => {
  if (topics.length === 0 && drills.length === 0) return null;

  return (
    <div className={styles.links}>
      {topics.map((topic) => (
        <Link
          key={topic.id}
          to="/system-design/topics/$topicId"
          params={{ topicId: topic.id }}
          className={styles.link}
        >
          <BookOpen size={14} aria-hidden="true" />
          <span>{topic.title}</span>
        </Link>
      ))}
      {drills.map((drill) => (
        <Link
          key={drill.id}
          to="/system-design/$taskId"
          params={{ taskId: drill.id }}
          className={styles.link}
        >
          {drill.solved ? (
            <Check size={14} aria-label="Решено" />
          ) : (
            <Code2 size={14} aria-hidden="true" />
          )}
          <span>{drill.title}</span>
        </Link>
      ))}
    </div>
  );
};
