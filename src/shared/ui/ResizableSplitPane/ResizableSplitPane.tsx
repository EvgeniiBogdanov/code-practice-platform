import React, { memo, useState, useRef, useCallback, useEffect } from "react";
import { clsx } from "clsx";
import styles from "./ResizableSplitPane.module.css";

export interface ResizableSplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  splitRatio?: number;
  onSplitRatioChange?: (ratio: number) => void;
  onReset?: () => void;
  minLeftPercent?: number;
  maxLeftPercent?: number;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

const DEFAULT_MIN = 20;
const DEFAULT_MAX = 80;
const DEFAULT_RATIO = 70;

export const ResizableSplitPane = memo(
  ({
    left,
    right,
    splitRatio = DEFAULT_RATIO,
    onSplitRatioChange,
    onReset,
    minLeftPercent = DEFAULT_MIN,
    maxLeftPercent = DEFAULT_MAX,
    className,
    disabled = false,
    ariaLabel = "Разделитель панелей кода и интерфейса",
  }: ResizableSplitPaneProps): React.JSX.Element => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [localRatio, setLocalRatio] = useState(splitRatio);

    useEffect(() => {
      setLocalRatio(splitRatio);
    }, [splitRatio]);

    const updateRatio = useCallback(
      (newRatio: number) => {
        const clamped = Math.min(maxLeftPercent, Math.max(minLeftPercent, newRatio));
        setLocalRatio(clamped);
        onSplitRatioChange?.(clamped);
      },
      [maxLeftPercent, minLeftPercent, onSplitRatioChange]
    );

    const handlePointerDown = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (disabled || e.button !== 0) return;
        e.preventDefault();
        setIsDragging(true);

        const target = e.currentTarget;
        if (target.setPointerCapture) {
          try {
            target.setPointerCapture(e.pointerId);
          } catch {
            // ignore if not supported
          }
        }
      },
      [disabled]
    );

    const handlePointerMove = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width <= 0) return;

        const currentX = e.clientX - rect.left;
        const calculatedPercent = (currentX / rect.width) * 100;
        updateRatio(calculatedPercent);
      },
      [isDragging, updateRatio]
    );

    const handlePointerUp = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        setIsDragging(false);
        const target = e.currentTarget;
        if (target.releasePointerCapture) {
          try {
            target.releasePointerCapture(e.pointerId);
          } catch {
            // ignore
          }
        }
      },
      [isDragging]
    );

    const handleDoubleClick = useCallback(() => {
      if (disabled) return;
      if (onReset) {
        onReset();
      } else {
        updateRatio(DEFAULT_RATIO);
      }
    }, [disabled, onReset, updateRatio]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return;
        const step = e.shiftKey ? 5 : 2;

        switch (e.key) {
          case "ArrowLeft":
          case "ArrowDown":
            e.preventDefault();
            updateRatio(localRatio - step);
            break;
          case "ArrowRight":
          case "ArrowUp":
            e.preventDefault();
            updateRatio(localRatio + step);
            break;
          case "Home":
            e.preventDefault();
            updateRatio(minLeftPercent);
            break;
          case "End":
            e.preventDefault();
            updateRatio(maxLeftPercent);
            break;
          case "Enter":
          case " ":
            e.preventDefault();
            handleDoubleClick();
            break;
          default:
            break;
        }
      },
      [disabled, handleDoubleClick, localRatio, maxLeftPercent, minLeftPercent, updateRatio]
    );

    return (
      <div
        ref={containerRef}
        className={clsx(styles.splitContainer, isDragging && styles.isDragging, className)}
      >
        <div
          className={clsx(styles.pane, styles.leftPane)}
          style={{ width: `${localRatio}%` }}
        >
          {left}
        </div>

        <div
          role="separator"
          tabIndex={disabled ? -1 : 0}
          aria-label={ariaLabel}
          aria-orientation="vertical"
          aria-valuenow={Math.round(localRatio)}
          aria-valuemin={minLeftPercent}
          aria-valuemax={maxLeftPercent}
          className={styles.resizer}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onDoubleClick={handleDoubleClick}
          onKeyDown={handleKeyDown}
          title="Потяните для изменения пропорции (двойной клик — сброс 70/30)"
        >
          <div className={styles.resizerBar} />
          <div className={styles.resizerGrip}>
            <div className={styles.gripDots} />
          </div>
        </div>

        <div className={clsx(styles.pane, styles.rightPane)}>{right}</div>

        {isDragging && <div className={styles.dragOverlay} aria-hidden="true" />}
      </div>
    );
  }
);

ResizableSplitPane.displayName = "ResizableSplitPane";
