import React from "react";
import { BookOpen, Clock, Zap, ExternalLink } from "lucide-react";
import { MetaRow, MetaBadge } from "@/shared/ui";

export interface GroupMetaBadgesProps {
  readingTimeMinutes: number;
  hasPracticeTasks: boolean;
  hasArticleLinks: boolean;
  hasArticle: boolean;
}

export const GroupMetaBadges = ({
  readingTimeMinutes,
  hasPracticeTasks,
  hasArticleLinks,
  hasArticle,
}: GroupMetaBadgesProps): React.JSX.Element | null => {
  const hasBadges = hasArticle || hasPracticeTasks || hasArticleLinks;

  if (!hasBadges) return null;

  return (
    <MetaRow>
      {hasArticle && (
        <MetaBadge variant="blue" icon={<BookOpen size={12} />}>
          Теоретическое руководство
        </MetaBadge>
      )}

      {hasArticle && (
        <MetaBadge variant="yellow" icon={<Clock size={12} />}>
          ~{readingTimeMinutes} мин чтения
        </MetaBadge>
      )}

      {hasPracticeTasks && (
        <MetaBadge variant="green" icon={<Zap size={12} />}>
          Задачи для закрепления
        </MetaBadge>
      )}

      {hasArticleLinks && (
        <MetaBadge variant="purple" icon={<ExternalLink size={12} />}>
          Ссылки на материалы и статьи
        </MetaBadge>
      )}
    </MetaRow>
  );
};
