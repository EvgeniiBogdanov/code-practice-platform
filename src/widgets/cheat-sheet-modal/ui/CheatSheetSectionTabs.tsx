import { memo, useMemo } from "react";
import { BookOpen, Brain } from "lucide-react";
import { Tabs, TabItem, JavaScriptIcon, ReactIcon } from "@/shared/ui";
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
          icon: <ReactIcon size={13} className={styles.iconReact} />,
        },
        {
          id: "javascript",
          label: "JavaScript",
          icon: <JavaScriptIcon size={13} className={styles.iconJs} />,
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
