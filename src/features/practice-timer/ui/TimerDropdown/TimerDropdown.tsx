import React, { memo, useState, useRef, useEffect } from "react";
import { Clock } from "lucide-react";
import { clsx } from "clsx";
import { Tooltip, SquareButton } from "@/shared/ui";
import { useTimerStore } from "@/entities/ui-state";
import styles from "./TimerDropdown.module.css";

export interface TimerDropdownProps {
  className?: string;
  disabled?: boolean;
}

const TIMER_OPTIONS = [15, 30, 45, 60];

export const TimerDropdown = memo(({ className, disabled = false }: TimerDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const timerSeconds = useTimerStore((state) => state.timerSeconds);
  const startTimer = useTimerStore((state) => state.startTimer);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (timerSeconds !== null) return null;

  const handleSelectOption = (mins: number) => {
    startTimer(mins);
    setIsOpen(false);
  };

  return (
    <div
      className={clsx(styles.container, disabled && styles.disabled, className)}
      ref={dropdownRef}
    >
      <Tooltip content="Таймер собеседования" side="bottom" disabled={isOpen || disabled}>
        <SquareButton
          icon={<Clock size={16} />}
          isActive={isOpen}
          disabled={disabled}
          onClick={disabled ? undefined : () => setIsOpen((prev) => !prev)}
          aria-label="Таймер собеседования"
        />
      </Tooltip>

      {isOpen && (
        <div className={styles.menu} role="menu">
          <div className={styles.header}>
            <Clock size={13} style={{ color: "var(--text-muted)" }} />
            <span>Таймер собеседования</span>
          </div>
          <div className={styles.optionsList}>
            {TIMER_OPTIONS.map((mins) => (
              <button
                key={mins}
                type="button"
                className={styles.optionItem}
                onClick={() => handleSelectOption(mins)}
                role="menuitem"
              >
                <span>{mins} минут</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

TimerDropdown.displayName = "TimerDropdown";
