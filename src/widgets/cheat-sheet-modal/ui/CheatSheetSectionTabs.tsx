import { memo } from "react";
import { Code2, Zap, Brain, BookOpen } from "lucide-react";
import { clsx } from "clsx";
import styles from "./CheatSheetModal.module.css";

export type SectionType = "react" | "javascript" | "algorithms" | "home";

interface CheatSheetSectionTabsProps {
  activeSection: SectionType;
  onSelectSection: (section: SectionType) => void;
}

const SECTIONS = [
  {
    id: "react" as SectionType,
    label: "React & TS",
    icon: <Code2 size={13} className={styles.iconReact} />,
  },
  {
    id: "javascript" as SectionType,
    label: "JavaScript",
    icon: <Zap size={13} className={styles.iconJs} />,
  },
  {
    id: "algorithms" as SectionType,
    label: "Алгоритмы",
    icon: <Brain size={13} className={styles.iconAlgo} />,
  },
  {
    id: "home" as SectionType,
    label: "Общая",
    icon: <BookOpen size={13} />,
  },
];

export const CheatSheetSectionTabs = memo(
  ({ activeSection, onSelectSection }: CheatSheetSectionTabsProps) => {
    return (
      <div className={styles.sectionTabs}>
        {SECTIONS.map((sec) => (
          <button
            key={sec.id}
            type="button"
            className={clsx(styles.sectionTabBtn, activeSection === sec.id && styles.active)}
            onClick={() => onSelectSection(sec.id)}
          >
            {sec.icon}
            <span>{sec.label}</span>
          </button>
        ))}
      </div>
    );
  }
);

CheatSheetSectionTabs.displayName = "CheatSheetSectionTabs";
