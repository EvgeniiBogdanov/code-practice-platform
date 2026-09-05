import { memo, useMemo } from "react";
import { Layers, Brain } from "lucide-react";
import { Tabs, TabItem, JavaScriptIcon, ReactIcon } from "@/shared/ui";
import styles from "./CommandPalette.module.css";

export type PaletteSection = "all" | "react" | "javascript" | "algorithms";

interface CommandPaletteTabsProps {
  activeSection: PaletteSection;
  onSelectSection: (section: PaletteSection) => void;
}

export const CommandPaletteTabs = memo(
  ({ activeSection, onSelectSection }: CommandPaletteTabsProps) => {
    const tabItems: TabItem[] = useMemo(
      () => [
        {
          id: "all",
          label: "Все",
          icon: <Layers size={13} />,
        },
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
      ],
      []
    );

    return (
      <div className={styles.sectionTabsWrapper}>
        <Tabs
          variant="pills"
          size="sm"
          items={tabItems}
          activeId={activeSection}
          onChange={(id) => onSelectSection(id as PaletteSection)}
          className={styles.sectionTabs}
        />
      </div>
    );
  }
);

CommandPaletteTabs.displayName = "CommandPaletteTabs";
