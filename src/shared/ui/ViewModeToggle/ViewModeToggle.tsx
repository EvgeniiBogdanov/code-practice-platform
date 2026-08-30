import React, { memo } from "react";
import { clsx } from "clsx";
import { Eye, Code2, Columns2 } from "lucide-react";
import styles from "./ViewModeToggle.module.css";

export type ViewMode = "split" | "preview" | "code";

export interface ViewModeOption<T extends string = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  title?: string;
  ariaLabel?: string;
}

export interface ViewModeToggleProps<T extends string = ViewMode> {
  mode: T;
  onChange: (mode: T) => void;
  options?: ViewModeOption<T>[];
  allowSplit?: boolean;
  className?: string;
}

const ViewModeToggleComponent = <T extends string = ViewMode>({
  mode,
  onChange,
  options,
  allowSplit = false,
  className,
}: ViewModeToggleProps<T>): React.JSX.Element => {
  if (options && options.length > 0) {
    return (
      <div className={clsx(styles.viewModeToggleBar, className)}>
        {options.map((opt) => {
          const isActive = mode === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              className={clsx(styles.viewModeBtn, isActive && styles.active)}
              onClick={() => onChange(opt.value)}
              title={opt.title || opt.label}
              aria-label={opt.ariaLabel || opt.title || opt.label}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={clsx(styles.viewModeToggleBar, className)}>
      {allowSplit && (
        <button
          type="button"
          className={clsx(
            styles.viewModeBtn,
            (mode as unknown as ViewMode) === "split" && styles.active
          )}
          onClick={() => onChange("split" as unknown as T)}
          title="Сплит: Код слева и Интерфейс справа"
          aria-label="Сплит: Код слева и Интерфейс справа"
        >
          <Columns2 size={12} />
          <span>Сплит</span>
        </button>
      )}
      <button
        type="button"
        className={clsx(
          styles.viewModeBtn,
          (mode as unknown as ViewMode) === "code" && styles.active
        )}
        onClick={() => onChange("code" as unknown as T)}
        title="Просмотр исходного кода"
        aria-label="Просмотр исходного кода"
      >
        <Code2 size={12} />
        <span>Код</span>
      </button>
      <button
        type="button"
        className={clsx(
          styles.viewModeBtn,
          (mode as unknown as ViewMode) === "preview" && styles.active
        )}
        onClick={() => onChange("preview" as unknown as T)}
        title="Просмотр UI песочницы"
        aria-label="Просмотр UI песочницы"
      >
        <Eye size={12} />
        <span>Интерфейс</span>
      </button>
    </div>
  );
};

ViewModeToggleComponent.displayName = "ViewModeToggle";

export const ViewModeToggle = memo(ViewModeToggleComponent) as (<T extends string = ViewMode>(
  props: ViewModeToggleProps<T>
) => React.JSX.Element) & { displayName?: string };

ViewModeToggle.displayName = "ViewModeToggle";
