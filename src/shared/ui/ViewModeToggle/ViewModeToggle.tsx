import { memo } from "react";
import { clsx } from "clsx";
import { Eye, Code2 } from "lucide-react";
import styles from "./ViewModeToggle.module.css";

export type ViewMode = "preview" | "code";

export interface ViewModeToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
  className?: string;
}

export const ViewModeToggle = memo(({ mode, onChange, className }: ViewModeToggleProps) => {
  return (
    <div className={clsx(styles.viewModeToggleBar, className)}>
      <button
        type="button"
        className={clsx(styles.viewModeBtn, mode === "preview" && styles.active)}
        onClick={() => onChange("preview")}
        title="Просмотр UI песочницы"
        aria-label="Просмотр UI песочницы"
      >
        <Eye size={12} />
        <span>Интерфейс</span>
      </button>
      <button
        type="button"
        className={clsx(styles.viewModeBtn, mode === "code" && styles.active)}
        onClick={() => onChange("code")}
        title="Просмотр исходного кода"
        aria-label="Просмотр исходного кода"
      >
        <Code2 size={12} />
        <span>Код</span>
      </button>
    </div>
  );
});

ViewModeToggle.displayName = "ViewModeToggle";
