import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Clock, FileText } from "lucide-react";
import { MarkdownView, MetaBadge, MetaRow } from "@/shared/ui";
import { DESIGN_TOPICS, DESIGN_TOPIC_GROUPS, type DesignTopic } from "@/entities/design-topic";
import { SectionHero } from "./SectionHero";
import styles from "./DesignTopicPage.module.css";

export interface DesignTopicPageProps {
  topic: DesignTopic;
  article: string;
}

const HERO_ICON_SIZE = 26;
const BADGE_ICON_SIZE = 12;

/** An article of the theory, laid out like the folder pages of the other sections: hero, badges, text. */
export const DesignTopicPage = ({ topic, article }: DesignTopicPageProps): React.JSX.Element => {
  const group = DESIGN_TOPIC_GROUPS.find(({ id }) => id === topic.group);
  const position = DESIGN_TOPICS.findIndex(({ id }) => id === topic.id) + 1;

  return (
    <article className={styles.page}>
      <Link to="/system-design/topics" className={styles.back}>
        <ArrowLeft size={14} aria-hidden="true" />
        <span>Теория</span>
      </Link>

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
    </article>
  );
};
