import React, { useRef, useState } from "react";
import { FileCode, Lock, Minus, Plus, Terminal } from "lucide-react";
import { clsx } from "clsx";
import { ReactIcon } from "@/shared/ui";
import { CodeLines } from "./CodeLines";
import { PreviewWindow } from "./PreviewCard";
import styles from "./SectionPreviews.module.css";
import local from "./EditorPreviews.module.css";

const COUNTER_CODE = `export const Counter = () => {
  const [n, setN] = useState(0);
  const dec = () => setN(n - 1);
  const inc = () => setN(n + 1);
  console.log("render:", n);

  return (
    <div className="counter">
      <b>{n}</b>
      <button onClick={dec}>−</button>
      <button onClick={inc}>+</button>
    </div>
  );
};`;

const MAX_LOGS = 3;

interface RenderLog {
  id: number;
  count: number;
}

/** Split mode: TSX on the left, a live (clickable) component and its console on the right. */
export const SplitRunnerPreview = (): React.JSX.Element => {
  const [count, setCount] = useState(0);
  const [logs, setLogs] = useState<RenderLog[]>([{ id: 0, count: 0 }]);
  const nextLogIdRef = useRef(1);

  const update = (delta: number): void => {
    const next = count + delta;
    const id = nextLogIdRef.current;
    nextLogIdRef.current += 1;
    setCount(next);
    setLogs((previous) => [...previous, { id, count: next }].slice(-MAX_LOGS));
  };

  return (
    <PreviewWindow
      className={clsx(styles.absolute, local.runnerWindow)}
      icon={<ReactIcon size={13} />}
      title="Counter.tsx — сплит-режим"
    >
      <div className={local.split}>
        <div className={local.editorPane} aria-hidden="true">
          <div className={styles.fileBar}>
            <FileCode size={13} />
            Counter.tsx
          </div>
          <CodeLines code={COUNTER_CODE} activeLine={3} className={local.runnerCode} />
        </div>
        <span className={local.splitHandle} aria-hidden="true" />
        <div className={local.browser}>
          <div className={local.addressBar} aria-hidden="true">
            <Lock size={11} />
            localhost:4000
            <span className={local.liveDot} />
          </div>
          <div className={local.viewport}>
            <div className={local.counter}>
              <span className={local.counterLabel}>Счётчик</span>
              <b className={local.counterValue} aria-live="polite">
                {count}
              </b>
              <div className={local.counterActions}>
                <button
                  type="button"
                  className={local.counterButton}
                  aria-label="Уменьшить счётчик"
                  onClick={() => update(-1)}
                >
                  <Minus size={16} />
                </button>
                <button
                  type="button"
                  className={clsx(local.counterButton, local.counterButtonPrimary)}
                  aria-label="Увеличить счётчик"
                  onClick={() => update(1)}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={clsx(styles.consolePanel, local.runnerConsole)} aria-hidden="true">
        <div className={styles.consoleHeader}>
          <Terminal size={13} />
          Консоль
          <span>React 19 · iframe</span>
        </div>
        <ul className={local.logList}>
          {logs.map((log) => (
            <li key={log.id} className={local.logItem}>
              <span className={local.logLevel}>log</span>
              render: {log.count}
            </li>
          ))}
        </ul>
      </div>
    </PreviewWindow>
  );
};
