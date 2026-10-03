import React from "react";
import { CheckCircle2, Play, Terminal, Timer } from "lucide-react";
import { clsx } from "clsx";
import { PreviewCard } from "./PreviewCard";
import styles from "./HeroPreviews.module.css";

/** Built-in console after running the debounce example (lines stream in one by one). */
export const ConsolePreview = (): React.JSX.Element => (
  <PreviewCard className={styles.consoleCard}>
    <div className={styles.consoleHead}>
      <Terminal size={13} />
      <span>Консоль</span>
      <span className={styles.consoleRun}>
        <Play size={11} />
      </span>
    </div>
    <div className={styles.consoleBody}>
      <div className={clsx(styles.consoleLine, styles.streamLine1)}>
        <span className={styles.consolePrompt}>›</span> log(&quot;a&quot;); log(&quot;b&quot;);
        log(&quot;c&quot;);
      </div>
      <div className={clsx(styles.consoleLine, styles.consoleMuted, styles.streamLine2)}>
        <Timer size={12} />
        тишина 300 мс…
      </div>
      <div className={clsx(styles.consoleLine, styles.streamLine3)}>
        <span className={styles.consoleString}>&quot;c&quot;</span>
      </div>
      <div className={clsx(styles.consoleLine, styles.consoleSuccess, styles.streamLine4)}>
        <CheckCircle2 size={12} />
        Выполнено за 0.42 мс
      </div>
    </div>
  </PreviewCard>
);
