import { memo, useMemo } from "react";
import { Code2, Zap, Brain, BookOpen } from "lucide-react";
import { Tabs, TabItem } from "@/shared/ui";
import { SectionType } from "../model/types";
import styles from "./CheatSheetModal.module.css";

export type { SectionType };

interface CheatSheetSectionTabsProps {
  activeSection: SectionType;
  onSelectSection: (section: SectionType) => void;
}

export const CheatSheetSectionTabs = memo(
  ({ activeSection, onSelectSection }: CheatSheetSectionTabsProps) => {
    const tabItems: TabItem[] = useMemo(
      () => [
        {
          id: "react",
          label: "React & TS",
          icon: <Code2 size={13} className={styles.iconReact} />,
        },
        {
          id: "javascript",
          label: "JavaScript",
          icon: <Zap size={13} className={styles.iconJs} />,
        },
        {
          id: "algorithms",
          label: "Алгоритмы",
          icon: <Brain size={13} className={styles.iconAlgo} />,
        },
        {
          id: "home",
          label: "Общая",
          icon: <BookOpen size={13} />,
        },
      ],
      []
    );

    return (
      <Tabs
        variant="pills"
        size="sm"
        items={tabItems}
        activeId={activeSection}
        onChange={(id) => onSelectSection(id as SectionType)}
        className={styles.sectionTabs}
      />
    );
  }
);

CheatSheetSectionTabs.displayName = "CheatSheetSectionTabs";
