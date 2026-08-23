import { memo } from "react";
import { Code2, Zap, Brain, Layers } from "lucide-react";
import { Button } from "@/shared/ui";
import styles from "./CommandPalette.module.css";

export type PaletteSection = "all" | "react" | "javascript" | "algorithms";

interface CommandPaletteTabsProps {
  activeSection: PaletteSection;
  onSelectSection: (section: PaletteSection) => void;
}

export const CommandPaletteTabs = memo(
  ({ activeSection, onSelectSection }: CommandPaletteTabsProps) => {
    return (
      <div className={styles.sectionTabs}>
        <Button
          size="sm"
          variant={activeSection === "all" ? "secondary" : "ghost"}
          isActive={activeSection === "all"}
          onClick={() => onSelectSection("all")}
          leftIcon={<Layers size={12} />}
          className={styles.sectionTabBtn}
        >
          Все
        </Button>

        <Button
          size="sm"
          variant={activeSection === "react" ? "secondary" : "ghost"}
          isActive={activeSection === "react"}
          onClick={() => onSelectSection("react")}
          leftIcon={<Code2 size={12} style={{ color: "#61dafb" }} />}
          className={styles.sectionTabBtn}
        >
          React
        </Button>

        <Button
          size="sm"
          variant={activeSection === "javascript" ? "secondary" : "ghost"}
          isActive={activeSection === "javascript"}
          onClick={() => onSelectSection("javascript")}
          leftIcon={<Zap size={12} style={{ color: "#f59e0b" }} />}
          className={styles.sectionTabBtn}
        >
          JavaScript
        </Button>

        <Button
          size="sm"
          variant={activeSection === "algorithms" ? "secondary" : "ghost"}
          isActive={activeSection === "algorithms"}
          onClick={() => onSelectSection("algorithms")}
          leftIcon={<Brain size={12} style={{ color: "#a855f7" }} />}
          className={styles.sectionTabBtn}
        >
          Алгоритмы
        </Button>
      </div>
    );
  }
);

CommandPaletteTabs.displayName = "CommandPaletteTabs";
