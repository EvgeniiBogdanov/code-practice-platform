import React, { memo } from "react";
import { clsx } from "clsx";
import { Eye, Code2, Columns2 } from "lucide-react";
import { Tooltip } from "../Tooltip";
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
            <Tooltip key={opt.value} content={opt.title || opt.label} side="bottom">
              <button
                type="button"
                className={clsx(styles.viewModeBtn, isActive && styles.active)}
                onClick={() => onChange(opt.value)}
                aria-label={opt.ariaLabel || opt.title || opt.label}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            </Tooltip>
          );
        })}
      </div>
    );
  }

  return (
    <div className={clsx(styles.viewModeToggleBar, className)}>
      {allowSplit && (
        <Tooltip content="Сплит: Код слева и Интерфейс справа" side="bottom">
          <button
            type="button"
            className={clsx(
              styles.viewModeBtn,
              (mode as unknown as ViewMode) === "split" && styles.active
            )}
            onClick={() => onChange("split" as unknown as T)}
            aria-label="Сплит: Код слева и Интерфейс справа"
          >
            <Columns2 size={12} />
            <span>Сплит</span>
          </button>
        </Tooltip>
      )}
      <Tooltip content="Просмотр исходного кода" side="bottom">
        <button
          type="button"
          className={clsx(
            styles.viewModeBtn,
            (mode as unknown as ViewMode) === "code" && styles.active
          )}
          onClick={() => onChange("code" as unknown as T)}
          aria-label="Просмотр исходного кода"
        >
          <Code2 size={12} />
          <span>Код</span>
        </button>
      </Tooltip>
      <Tooltip content="Просмотр UI песочницы" side="bottom">
        <button
          type="button"
          className={clsx(
            styles.viewModeBtn,
            (mode as unknown as ViewMode) === "preview" && styles.active
          )}
          onClick={() => onChange("preview" as unknown as T)}
          aria-label="Просмотр UI песочницы"
        >
          <Eye size={12} />
          <span>Интерфейс</span>
        </button>
      </Tooltip>
    </div>
  );
};

ViewModeToggleComponent.displayName = "ViewModeToggle";

export const ViewModeToggle = memo(ViewModeToggleComponent) as (<T extends string = ViewMode>(
  props: ViewModeToggleProps<T>
) => React.JSX.Element) & { displayName?: string };

ViewModeToggle.displayName = "ViewModeToggle";
