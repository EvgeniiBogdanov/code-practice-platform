import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Folder } from "lucide-react";
import { Task, SectionType } from "@/entities/task";
import { TopicIconBox, AccentButton, AccentButtonColor } from "@/shared/ui";
import { GroupMetaInfo } from "../model/types";
import styles from "./GroupOverviewPage.module.css";

export interface GroupHeroHeaderProps {
  groupMeta: GroupMetaInfo;
  firstTask?: Task;
  section: SectionType;
  taskRoute: string;
}

const getFolderColorVariant = (color?: string, section?: SectionType): AccentButtonColor => {
  if (!color) {
    if (section === "javascript") return "amber";
    if (section === "react") return "blue";
    return "purple";
  }
  const c = color.toLowerCase();
  if (
    c.includes("f59e0b") ||
    c.includes("fbbf24") ||
    c.includes("eab308") ||
    c.includes("amber") ||
    c.includes("yellow")
  ) {
    return "amber";
  }
  if (c.includes("3b82f6") || c.includes("2383e2") || c.includes("60a5fa") || c.includes("blue")) {
    return "blue";
  }
  if (
    c.includes("10b981") ||
    c.includes("059669") ||
    c.includes("16a34a") ||
    c.includes("green") ||
    c.includes("emerald")
  ) {
    return "emerald";
  }
  if (
    c.includes("a855f7") ||
    c.includes("8b5cf6") ||
    c.includes("c084fc") ||
    c.includes("9333ea") ||
    c.includes("purple") ||
    c.includes("violet")
  ) {
    return "purple";
  }
  if (
    c.includes("ff6b6b") ||
    c.includes("f43f5e") ||
    c.includes("ef4444") ||
    c.includes("dc2626") ||
    c.includes("red") ||
    c.includes("coral") ||
    c.includes("rose")
  ) {
    return "red";
  }
  if (c.includes("06b6d4") || c.includes("0891b2") || c.includes("cyan")) {
    return "cyan";
  }
  if (c.includes("ec4899") || c.includes("db2777") || c.includes("pink")) {
    return "pink";
  }
  if (c.includes("f97316") || c.includes("ea580c") || c.includes("orange")) {
    return "orange";
  }
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
