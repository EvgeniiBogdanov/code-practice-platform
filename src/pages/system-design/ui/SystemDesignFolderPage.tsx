import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Code2, Layers } from "lucide-react";
import { AccentButton, TopicIconBox, type TopicIconBoxColor } from "@/shared/ui";
import type { DesignCase } from "@/entities/design-case";
import { useTaskSection } from "@/entities/task/catalog";
import { CaseCards } from "./CaseCards";
import { DrillTable } from "./DrillTable";
import { TopicCards } from "./TopicCards";
import styles from "./SystemDesignFolderPage.module.css";

export type SystemDesignFolderId = "theory" | "cases" | "drills";

interface FolderMeta {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: TopicIconBoxColor;
}

const FOLDERS: Record<SystemDesignFolderId, FolderMeta> = {
  theory: {
    title: "Теория",
    description:
      "Короткие статьи, на которые ссылаются этапы кейсов: как вести дизайн-интервью, рендеринг, данные, сеть, производительность, доступность.",
    icon: <BookOpen size={26} />,
    color: "blue",
  },
  cases: {
    title: "Кейсы",
    description:
      "Разборы в формате интервью по RADIO: задание, развилки с компромиссами, свой ответ, эталон со схемой и самопроверка.",
    icon: <Layers size={26} />,
    color: "purple",
  },
  drills: {
    title: "Дриллы",
    description:
      "Код-упражнения по ключевым механизмам кейсов. Решение проверяется автотестами: зелёный прогон отмечает задачу решённой.",
    icon: <Code2 size={26} />,
    color: "emerald",
  },
};

export interface SystemDesignFolderPageProps {
  folder: SystemDesignFolderId;
  /** Loaded cases; needed only by the «Кейсы» folder. */
  cases?: readonly DesignCase[];
}

/** The page of a sidebar folder: what is inside it, as in the group pages of the other sections. */
export const SystemDesignFolderPage = ({
  folder,
  cases = [],
}: SystemDesignFolderPageProps): React.JSX.Element => {
  const { title, description, icon, color } = FOLDERS[folder];
  const { tasks: drills } = useTaskSection("system-design");
  const firstDrill = drills[0];

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <TopicIconBox colorVariant={color} size="lg">
          {icon}
        </TopicIconBox>
        <div className={styles.heroContent}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{title}</h1>
            {folder === "drills" && firstDrill && (
              <Link to="/system-design/$taskId" params={{ taskId: String(firstDrill.id) }}>
                <AccentButton colorVariant={color} size="md" rightIcon={<ArrowRight size={14} />}>
                  Решать задачи
                </AccentButton>
              </Link>
            )}
          </div>
          <p className={styles.description}>{description}</p>
        </div>
      </header>

      {folder === "theory" && <TopicCards />}
      {folder === "cases" && <CaseCards cases={cases} />}
      {folder === "drills" && <DrillTable drills={drills} />}
    </div>
  );
};
