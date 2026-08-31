import React, { memo } from "react";
import { useLocation } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { clsx } from "clsx";
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

  const setSettingsModalOpen = useUIStore((state) => state.setSettingsModalOpen);
  const settingsModalOpen = useUIStore((state) => state.settingsModalOpen);

  return (
    <div className={clsx(styles.actionsContainer, className)}>
      {!isHome && <HeaderReviewMenu />}

      {/* 2. Practice Timer */}
      <div className={clsx(styles.timerWrapper, isHome && styles.disabled)}>
        <TimerDisplay disabled={isHome} />
        <TimerDropdown disabled={isHome} />
      </div>

      {/* 3. Settings Modal Button */}
      <Tooltip content="Настройки" side="bottom">
        <SquareButton
          icon={<Settings size={16} />}
          isActive={settingsModalOpen}
          onClick={() => setSettingsModalOpen(!settingsModalOpen)}
          aria-label="Настройки"
        />
      </Tooltip>

      {/* 4. Theme Toggle */}
      <ThemeToggleButton />
    </div>
  );
});

HeaderActions.displayName = "HeaderActions";
