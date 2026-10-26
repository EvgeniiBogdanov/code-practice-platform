import React from "react";
import { Link } from "@tanstack/react-router";
import { clsx } from "clsx";
import { ArrowLeft, ArrowRight, BookOpen, Clock, FileText } from "lucide-react";
import { MarkdownView, MetaBadge, MetaRow } from "@/shared/ui";
import {
  DESIGN_TOPICS,
  DESIGN_TOPIC_GROUPS,
  getAdjacentDesignTopics,
  type DesignTopic,
} from "@/entities/design-topic";
import { SectionHero } from "./SectionHero";
import styles from "./DesignTopicPage.module.css";

export interface DesignTopicPageProps {
  topic: DesignTopic;
  article: string;
  /**
   * The reader came here with «Следующая статья» or «Предыдущая статья»: «back» leads to the previous
   * article. Otherwise (from the folder page or the sidebar) it leads to the folder.
   */
  isReadingInOrder?: boolean;
}

const HERO_ICON_SIZE = 26;
const BADGE_ICON_SIZE = 12;
const NAV_ICON_SIZE = 14;
/** Marks the next page as a step of reading in order. */
const READING_IN_ORDER = { readingInOrder: true } as const;

/** An article of the theory, laid out like the folder pages of the other sections: hero, badges, text. */
export const DesignTopicPage = ({
  topic,
  article,
  isReadingInOrder = false,
}: DesignTopicPageProps): React.JSX.Element => {
  const group = DESIGN_TOPIC_GROUPS.find(({ id }) => id === topic.group);
  const position = DESIGN_TOPICS.findIndex(({ id }) => id === topic.id) + 1;
  const { previous, next } = getAdjacentDesignTopics(topic.id);
  const backTo = isReadingInOrder ? previous : undefined;

  return (
    <article className={styles.page}>
      <nav className={styles.topNav} aria-label="Навигация по статьям">
        {backTo ? (
          <Link
            to="/system-design/topics/$topicId"
            params={{ topicId: backTo.id }}
            state={READING_IN_ORDER}
            className={styles.navLink}
          >
            <ArrowLeft size={NAV_ICON_SIZE} aria-hidden="true" />
            <span className={styles.navLabel}>Предыдущая статья: {backTo.title}</span>
          </Link>
        ) : (
          <Link to="/system-design/topics" className={styles.navLink}>
            <ArrowLeft size={NAV_ICON_SIZE} aria-hidden="true" />
            <span className={styles.navLabel}>Теория</span>
          </Link>
        )}
        {next && (
          <Link
            to="/system-design/topics/$topicId"
            params={{ topicId: next.id }}
            state={READING_IN_ORDER}
            className={clsx(styles.navLink, styles.navNext)}
          >
            <span className={styles.navLabel}>Следующая статья: {next.title}</span>
            <ArrowRight size={NAV_ICON_SIZE} aria-hidden="true" />
          </Link>
        )}
      </nav>

      <SectionHero
        icon={<FileText size={HERO_ICON_SIZE} />}
        color="blue"
        title={topic.title}
        description={topic.summary}
      />

      <MetaRow>
        {group && (
          <MetaBadge variant="blue" icon={<BookOpen size={BADGE_ICON_SIZE} />}>
            {group.title}
          </MetaBadge>
        )}
        <MetaBadge variant="yellow" icon={<Clock size={BADGE_ICON_SIZE} />}>
          ~{topic.minutes} мин чтения
        </MetaBadge>
        {position > 0 && (
          <MetaBadge variant="green" icon={<FileText size={BADGE_ICON_SIZE} />}>
            Статья {position} из {DESIGN_TOPICS.length}
          </MetaBadge>
        )}
      </MetaRow>

      <div className={styles.articleContent}>
        <MarkdownView content={article} />
      </div>

      {next && (
        <Link
          to="/system-design/topics/$topicId"
          params={{ topicId: next.id }}
          state={READING_IN_ORDER}
          className={styles.nextCard}
        >
          <span className={styles.nextBody}>
            <span className={styles.nextKicker}>Следующая статья</span>{" "}
            <span className={styles.nextTitle}>{next.title}</span>
          </span>
          <ArrowRight size={16} className={styles.nextArrow} aria-hidden="true" />
        </Link>
      )}
    </article>
  );
};
