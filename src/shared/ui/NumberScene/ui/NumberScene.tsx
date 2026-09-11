import { useEffect, useRef, useState, useCallback, memo, type JSX, type KeyboardEvent } from "react";
import { clsx } from "clsx";
import { createNumberScene } from "../lib/create-number-scene";
import type { NumberSceneController, NumberSceneProps } from "../model/number-scene";
import styles from "./NumberScene.module.css";

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.5;

export const NumberScene = memo((props: NumberSceneProps): JSX.Element => {
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<NumberSceneController | null>(null);
  const latest = useRef(props);
  latest.current = props;

  const [isPanned, setIsPanned] = useState(false);

  const handleInteraction = useCallback((newZoom: number, pan: { x: number; y: number }): void => {
    setIsPanned(pan.x !== 0 || pan.y !== 0);
    latest.current.onZoomChange?.(newZoom);
  }, []);

  useEffect(() => {
    // Let the tab and controls paint before synchronous WebGL initialization.
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        if (!host.current) return;
        try {
          const inst = createNumberScene(host.current, latest.current, handleInteraction);
          controller.current = inst;
          if (typeof latest.current.zoom === "number") {
            inst.setZoom(latest.current.zoom);
          }
        } catch {
          latest.current.onUnavailable();
        }
      });
    });
    return (): void => {
      cancelAnimationFrame(frame);
      controller.current?.dispose();
      controller.current = null;
    };
  }, [handleInteraction]);

  useEffect(() => {
    try {
      controller.current?.update(props);
      if (typeof props.zoom === "number") {
        controller.current?.setZoom(props.zoom);
      }
    } catch {
      props.onUnavailable();
    }
  }, [props]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>): void => {
      const currentZoom = props.zoom ?? 1;
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        const next = Math.min(MAX_ZOOM, Math.round((currentZoom + 0.25) * 100) / 100);
        controller.current?.setZoom(next);
        props.onZoomChange?.(next);
      } else if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        const next = Math.max(MIN_ZOOM, Math.round((currentZoom - 0.25) * 100) / 100);
        controller.current?.setZoom(next);
        props.onZoomChange?.(next);
      } else if (event.key === "0") {
        event.preventDefault();
        controller.current?.resetView();
        setIsPanned(false);
        props.onZoomChange?.(1);
      }
    },
    [props]
  );

  const effectiveZoom = props.zoom ?? 1;
  const isModified = effectiveZoom !== 1 || isPanned;

  return (
    <div
      ref={host}
      className={clsx(styles.viewport, isModified && styles.draggable)}
      tabIndex={0}
      role="group"
      aria-label="Числовая сцена. Для длинного массива доступна горизонтальная прокрутка."
      onKeyDown={handleKeyDown}
    />
  );
});

