import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Folder } from "lucide-react";
import { Task, SectionType } from "@/entities/task";
import { TopicIconBox, AccentButton, AccentButtonColor, resolveColorVariant } from "@/shared/ui";
import { GroupMetaInfo } from "../model/types";
import styles from "./GroupOverviewPage.module.css";

export interface GroupHeroHeaderProps {
  groupMeta: GroupMetaInfo;
  firstTask?: Task;
  section: SectionType;
  taskRoute: string;
}

const getFolderColorVariant = (color?: string, section?: SectionType): AccentButtonColor => {
  if (color) {
    const resolved = resolveColorVariant(undefined, color);
    if (resolved !== "default") return resolved;
  }
  if (section === "javascript") return "amber";
  if (section === "react") return "blue";
  return "purple";
};

export const GroupHeroHeader = ({
  groupMeta,
  firstTask,
  section,
  taskRoute,
}: GroupHeroHeaderProps) => {
  const colorVariant = getFolderColorVariant(groupMeta.color, section);
  const IconComp = groupMeta.icon || Folder;

  return (
    <header className={styles.articleHeader}>
      <div className={styles.folderHero}>
        <TopicIconBox colorVariant={colorVariant} size="lg">
          {groupMeta.renderIcon ? groupMeta.renderIcon(26) : <IconComp size={26} />}
        </TopicIconBox>

        <div className={styles.folderHeroContent}>
          <div className={styles.heroTitleRow}>
            <h1 className={styles.folderHeroTitle}>
              {groupMeta.name || groupMeta.title || "Раздел"}
            </h1>

            {firstTask && (
              <Link to={taskRoute} params={{ taskId: String(firstTask.id) }}>
                <AccentButton
                  colorVariant={colorVariant}
                  size="md"
                  rightIcon={<ArrowRight size={14} />}
                >
                  Решать задачи
                </AccentButton>
              </Link>
            )}
          </div>

          <p className={styles.folderHeroDesc}>
            {groupMeta.desc ||
              `Все практические задачи и упражнения раздела «${groupMeta.name || "Раздел"}».`}
          </p>
        </div>
      </div>
    </header>
  );
};
