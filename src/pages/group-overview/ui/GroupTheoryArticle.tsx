import React, { useMemo } from "react";
import { BookOpen } from "lucide-react";
import { MarkdownView } from "@/shared/ui";
import { GroupMetaInfo } from "../model/types";
import styles from "./GroupOverviewPage.module.css";

export interface GroupTheoryArticleProps {
  groupMeta: GroupMetaInfo;
}

export const GroupTheoryArticle = ({ groupMeta }: GroupTheoryArticleProps) => {
  const rawText = useMemo(() => {
    if (!groupMeta.infoRaw) return "";
    return groupMeta.infoRaw
      .replace(/^#\s+[^\n]*\n*/g, "")
      .replace(/## 10\. Практика: задачи для закрепления[\s\S]*/g, "")
      .trim();
  }, [groupMeta.infoRaw]);

  if (!rawText) return null;

  return (
    <div className={styles.articleContent}>
      <h2 className={styles.h2Block}>
        <BookOpen size={20} className={styles.articleH2Icon} />
        <span>
          {groupMeta.guideTitle ||
            groupMeta.desc ||
            `Полное руководство по разделу ${groupMeta.title || groupMeta.name}`}
        </span>
      </h2>

      <MarkdownView content={rawText} />
    </div>
  );
};
