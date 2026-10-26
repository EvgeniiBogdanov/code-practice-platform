import { useCallback, useEffect, useRef } from "react";
import { serializeBoard, type CardFlowNode, type LabeledFlowEdge } from "./boardModel";
import type { BoardValue } from "./boardTypes";

/** Dragging and typing change the board many times a second; the store gets one write after a pause. */
export const COMMIT_DELAY_MS = 300;

interface Snapshot {
  json: string;
  value: BoardValue;
}

/**
 * Reports board changes to `onChange`, debounced, and flushes a pending change on unmount.
 * The first render is only the baseline: opening a stage never writes an unchanged board.
 */
export const useBoardCommit = (
  nodes: readonly CardFlowNode[],
  edges: readonly LabeledFlowEdge[],
  onChange: (value: BoardValue) => void
): void => {
  const onChangeRef = useRef(onChange);
  const committedRef = useRef<string | null>(null);
  const latestRef = useRef<Snapshot | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const flush = useCallback((): void => {
    const latest = latestRef.current;
    if (!latest || latest.json === committedRef.current) return;
    committedRef.current = latest.json;
    onChangeRef.current(latest.value);
  }, []);

  useEffect(() => {
    const value = serializeBoard(nodes, edges);
    const json = JSON.stringify(value);
    latestRef.current = { json, value };
    if (committedRef.current === null) {
      committedRef.current = json;
      return;
    }
    const timer = setTimeout(flush, COMMIT_DELAY_MS);
    return (): void => clearTimeout(timer);
  }, [nodes, edges, flush]);

  useEffect(() => flush, [flush]);
};
