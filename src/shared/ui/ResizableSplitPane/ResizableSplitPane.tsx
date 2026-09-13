import React, { memo, useState, useRef, useCallback, useEffect } from "react";
import { clsx } from "clsx";
import { Tooltip } from "../Tooltip";
import styles from "./ResizableSplitPane.module.css";

export interface ResizableSplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  splitRatio?: number;
  defaultRatio?: number;
  onSplitRatioChange?: (ratio: number) => void;
  onReset?: () => void;
  minLeftPercent?: number;
  maxLeftPercent?: number;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  layout?: "split" | "stack";
}

const DEFAULT_MIN = 20;
const DEFAULT_MAX = 80;
const DEFAULT_RATIO = 70;
const DRAG_THRESHOLD = 3;

export const ResizableSplitPane = memo(
  ({
    left,
    right,
    splitRatio = DEFAULT_RATIO,
    defaultRatio = DEFAULT_RATIO,
    onSplitRatioChange,
    onReset,
    minLeftPercent = DEFAULT_MIN,
    maxLeftPercent = DEFAULT_MAX,
    className,
    disabled = false,
    ariaLabel = "Разделитель панелей кода и интерфейса",
    layout = "split",
  }: ResizableSplitPaneProps): React.JSX.Element => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [localRatio, setLocalRatio] = useState(splitRatio);

    const isPointerDownRef = useRef(false);
    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const startRatioRef = useRef(splitRatio);
    const activePointerIdRef = useRef<number | null>(null);
    const lastPointerUpTimeRef = useRef(0);
    const resetFromPointerUpRef = useRef(false);

    useEffect(() => {
      if (!isDraggingRef.current) {
        setLocalRatio(splitRatio);
      }
    }, [splitRatio]);

    const updateRatio = useCallback(
      (newRatio: number) => {
        const clamped = Math.min(maxLeftPercent, Math.max(minLeftPercent, newRatio));
        setLocalRatio(clamped);
        onSplitRatioChange?.(clamped);
      },
      [maxLeftPercent, minLeftPercent, onSplitRatioChange]
    );

    const performReset = useCallback(() => {
      if (disabled) return;
      updateRatio(defaultRatio);
      onReset?.();
    }, [defaultRatio, disabled, onReset, updateRatio]);

    const handlePointerDown = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (disabled || e.button !== 0) return;

        resetFromPointerUpRef.current = false;
        isPointerDownRef.current = true;
        isDraggingRef.current = false;
        startXRef.current = e.clientX;
        startRatioRef.current = localRatio;
        activePointerIdRef.current = e.pointerId;

        const target = e.currentTarget;
        if (target.setPointerCapture) {
          try {
            target.setPointerCapture(e.pointerId);
          } catch {
            // ignore if not supported
          }
        }
      },
      [disabled, localRatio]
    );

    const handlePointerMove = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isPointerDownRef.current || !containerRef.current) return;

        const deltaX = e.clientX - startXRef.current;

        if (!isDraggingRef.current) {
          if (Math.abs(deltaX) > DRAG_THRESHOLD) {
            isDraggingRef.current = true;
            setIsDragging(true);
          } else {
            return;
          }
        }

        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width <= 0) return;

        const deltaPercent = (deltaX / rect.width) * 100;
        updateRatio(startRatioRef.current + deltaPercent);
      },
      [updateRatio]
    );

    const handlePointerUp = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isPointerDownRef.current) return;
        isPointerDownRef.current = false;

        const target = e.currentTarget;
        if (target.releasePointerCapture && activePointerIdRef.current !== null) {
          try {
            target.releasePointerCapture(activePointerIdRef.current);
          } catch {
            // ignore
          }
        }
        activePointerIdRef.current = null;

        const wasDragging = isDraggingRef.current;
        isDraggingRef.current = false;

        if (wasDragging) {
          setIsDragging(false);
          return;
        }

        const now = Date.now();
        const timeSinceLastUp = now - lastPointerUpTimeRef.current;

        if (lastPointerUpTimeRef.current !== 0 && timeSinceLastUp <= 350) {
          lastPointerUpTimeRef.current = 0;
          resetFromPointerUpRef.current = true;
          performReset();
        } else {
          lastPointerUpTimeRef.current = now;
        }
      },
      [performReset]
    );

    const handlePointerCancel = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
      isPointerDownRef.current = false;
      isDraggingRef.current = false;
      setIsDragging(false);

      const target = e.currentTarget;
      if (target.releasePointerCapture && activePointerIdRef.current !== null) {
        try {
          target.releasePointerCapture(activePointerIdRef.current);
        } catch {
          // ignore
        }
      }
      activePointerIdRef.current = null;
    }, []);

    const handleDoubleClick = useCallback(() => {
      if (resetFromPointerUpRef.current) {
        resetFromPointerUpRef.current = false;
        return;
      }
      performReset();
    }, [performReset]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return;
        resetFromPointerUpRef.current = false;
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
            performReset();
            break;
          default:
            break;
        }
      },
      [disabled, localRatio, maxLeftPercent, minLeftPercent, performReset, updateRatio]
    );

    const isStacked = layout === "stack";

    return (
      <div
        ref={containerRef}
        className={clsx(
          styles.splitContainer,
          isStacked && styles.stacked,
          isDragging && styles.isDragging,
          className
        )}
      >
        <div
          className={clsx(styles.pane, styles.leftPane, isStacked && styles.stackedPane)}
          style={isStacked ? undefined : { width: `${localRatio}%` }}
        >
          {left}
        </div>

        {!isStacked && (
          <Tooltip
            content="Потяните для изменения пропорции (двойной клик — сброс 70/30)"
            side="top"
          >
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
              onPointerCancel={handlePointerCancel}
              onDoubleClick={handleDoubleClick}
              onKeyDown={handleKeyDown}
            >
              <div className={styles.resizerBar} />
              <div className={styles.resizerGrip}>
                <div className={styles.gripDots} />
              </div>
            </div>
          </Tooltip>
        )}

        <div className={clsx(styles.pane, styles.rightPane, isStacked && styles.stackedPane)}>
          {right}
        </div>

        {isDragging && !isStacked && <div className={styles.dragOverlay} aria-hidden="true" />}
      </div>
    );
  }
);

ResizableSplitPane.displayName = "ResizableSplitPane";
