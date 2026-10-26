import { useCallback, useEffect, useRef, useState } from "react";
import { serializeBoard, type CardFlowNode, type LabeledFlowEdge } from "./boardModel";
import type { BoardValue } from "./boardTypes";
import { COMMIT_DELAY_MS } from "./useBoardCommit";

/** Older steps are dropped: a board session never needs more than this many undos. */
const MAX_HISTORY = 100;

interface Snapshot {
  json: string;
  value: BoardValue;
}

export interface BoardHistory {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const toSnapshot = (value: BoardValue): Snapshot => ({ json: JSON.stringify(value), value });

const last = (snapshots: readonly Snapshot[]): Snapshot | undefined =>
  snapshots[snapshots.length - 1];

/**
 * Undo and redo for the board. A burst of edits (a drag, typing) is one step: the board is
 * recorded after the same pause the store write uses. `apply` puts a previous board back.
 */
export const useBoardHistory = (
  nodes: readonly CardFlowNode[],
  edges: readonly LabeledFlowEdge[],
  apply: (value: BoardValue) => void
): BoardHistory => {
  const applyRef = useRef(apply);
  const pastRef = useRef<Snapshot[]>([]);
  const futureRef = useRef<Snapshot[]>([]);
  const presentRef = useRef<Snapshot | null>(null);
  const latestRef = useRef<Snapshot | null>(null);
  const [availability, setAvailability] = useState({ canUndo: false, canRedo: false });

  useEffect(() => {
    applyRef.current = apply;
  }, [apply]);

  const syncAvailability = useCallback((): void => {
    setAvailability({ canUndo: pastRef.current.length > 0, canRedo: futureRef.current.length > 0 });
  }, []);

  /** Turns the edit made since the last step (if any) into a step; a new edit drops the redo line. */
  const record = useCallback((): void => {
    const latest = latestRef.current;
    const present = presentRef.current;
    if (!latest || !present || latest.json === present.json) return;
    pastRef.current = [...pastRef.current, present].slice(-MAX_HISTORY);
    futureRef.current = [];
    presentRef.current = latest;
    syncAvailability();
  }, [syncAvailability]);

  useEffect(() => {
    const snapshot = toSnapshot(serializeBoard(nodes, edges));
    latestRef.current = snapshot;
    if (presentRef.current === null) {
      presentRef.current = snapshot;
      return;
    }
    const timer = setTimeout(record, COMMIT_DELAY_MS);
    return (): void => clearTimeout(timer);
  }, [nodes, edges, record]);

  const undo = useCallback((): void => {
    record();
    const previous = last(pastRef.current);
    const present = presentRef.current;
    if (!previous || !present) return;
    pastRef.current = pastRef.current.slice(0, -1);
    futureRef.current = [...futureRef.current, present];
    presentRef.current = previous;
    latestRef.current = previous;
    syncAvailability();
    applyRef.current(previous.value);
  }, [record, syncAvailability]);

  const redo = useCallback((): void => {
    record();
    const next = last(futureRef.current);
    const present = presentRef.current;
    if (!next || !present) return;
    futureRef.current = futureRef.current.slice(0, -1);
    pastRef.current = [...pastRef.current, present];
    presentRef.current = next;
    latestRef.current = next;
    syncAvailability();
    applyRef.current(next.value);
  }, [record, syncAvailability]);

  return { undo, redo, ...availability };
};
