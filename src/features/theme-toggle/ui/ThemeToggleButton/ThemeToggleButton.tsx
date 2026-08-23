import React, { memo } from "react";
import { Sun, Moon } from "lucide-react";
import { useUIStore } from "@/entities/ui-state";
import { Tooltip, SquareButton } from "@/shared/ui";

export interface ThemeToggleButtonProps {
  className?: string;
}

export const ThemeToggleButton = memo(({ className }: ThemeToggleButtonProps) => {
  const theme = useUIStore((state) => state.theme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);
  const isDark = theme === "dark";

  const tooltipLabel = isDark ? "Светлая тема" : "Тёмная тема";

  return (
    <Tooltip content={tooltipLabel} side="bottom">
      <SquareButton
        icon={isDark ? <Sun size={16} /> : <Moon size={16} />}
        className={className}
        onClick={toggleTheme}
        aria-label={isDark ? "Переключить на светлую тему" : "Переключить на тёмную тему"}
      />
    </Tooltip>
  );
});

ThemeToggleButton.displayName = "ThemeToggleButton";
