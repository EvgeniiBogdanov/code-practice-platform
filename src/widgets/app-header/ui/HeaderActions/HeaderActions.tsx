import React, { memo } from "react";
import { useLocation } from "@tanstack/react-router";
import { BarChart2, Lightbulb, Search, Settings } from "lucide-react";
import { useUIStore } from "@/entities/ui-state";
import { ThemeToggleButton } from "@/features/theme-toggle";
import { TimerDisplay, TimerDropdown } from "@/features/practice-timer";
import { Tooltip, SquareButton } from "@/shared/ui";
import { HeaderReviewMenu } from "../HeaderReviewMenu";
import styles from "./HeaderActions.module.css";

export interface HeaderActionsProps {
  className?: string;
}

export const HeaderActions = memo(({ className }: HeaderActionsProps) => {
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "/home";

  const setPaletteOpen = useUIStore((state) => state.setPaletteOpen);
  const setStatsModalOpen = useUIStore((state) => state.setStatsModalOpen);
  const setCheatSheetOpen = useUIStore((state) => state.setCheatSheetOpen);
  const setSettingsModalOpen = useUIStore((state) => state.setSettingsModalOpen);
  const statsModalOpen = useUIStore((state) => state.statsModalOpen);
  const cheatSheetOpen = useUIStore((state) => state.cheatSheetOpen);
  const settingsModalOpen = useUIStore((state) => state.settingsModalOpen);

  return (
    <div className={[styles.actionsContainer, className].filter(Boolean).join(" ")}>
      {/* 1. Review Menu */}
      <HeaderReviewMenu />

      {/* 2. Stats Modal Button */}
      <Tooltip content="Статистика повторений" side="bottom">
        <SquareButton
          icon={<BarChart2 size={16} />}
          isActive={statsModalOpen}
          onClick={() => setStatsModalOpen(!statsModalOpen)}
          aria-label="Статистика повторений"
        />
      </Tooltip>

      {/* 3. CheatSheet Modal Button */}
      <Tooltip content="Шпаргалка" side="bottom">
        <SquareButton
          icon={<Lightbulb size={16} />}
          isActive={cheatSheetOpen}
          disabled={isHome}
          onClick={isHome ? undefined : () => setCheatSheetOpen(!cheatSheetOpen)}
          aria-label="Шпаргалка"
        />
      </Tooltip>

      {/* 4. Command Palette Cmd+K */}
      <Tooltip content="Поиск по задачам (⌘K)" side="bottom">
        <SquareButton
          icon={<Search size={16} />}
          onClick={() => setPaletteOpen(true)}
          aria-label="Поиск по задачам (Cmd+K)"
        />
      </Tooltip>

      {/* 5. Practice Timer */}
      <div className={[styles.timerWrapper, isHome && styles.disabled].filter(Boolean).join(" ")}>
        <TimerDisplay disabled={isHome} />
        <TimerDropdown disabled={isHome} />
      </div>

      {/* 6. Settings Modal Button */}
      <Tooltip content="Настройки" side="bottom">
        <SquareButton
          icon={<Settings size={16} />}
          isActive={settingsModalOpen}
          onClick={() => setSettingsModalOpen(!settingsModalOpen)}
          aria-label="Настройки"
        />
      </Tooltip>

      {/* 7. Theme Toggle */}
      <ThemeToggleButton />
    </div>
  );
});

HeaderActions.displayName = "HeaderActions";
