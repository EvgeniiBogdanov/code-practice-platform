import React, { useState } from "react";
import { clsx } from "clsx";
import { CodeEditor } from "@/features/code-editor";
import { JsConsole, ReactLivePreview } from "@/features/code-runner";
import { runNodeJsCode, clearRunningTimers, NodeRunnerLogEntry } from "@/shared/lib/code-runners";
import styles from "./CodeWorkspace.module.css";

const DEFAULT_REACT_CODE = `import React, { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>Песочница React</h2>
      <p>Счётчик: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>
        Увеличить
      </button>
    </div>
  );
};`;

const DEFAULT_JS_CODE = `// Песочница JavaScript
function greet(name) {
  return \`Привет, \${name}!\`;
}

console.log(greet("Разработчик"));
console.table([
  { id: 1, name: "Alice", role: "Frontend" },
  { id: 2, name: "Bob", role: "Backend" },
]);
`;

export function CodeWorkspace() {
  const [mode, setMode] = useState<"react" | "js">("react");
  const [code, setCode] = useState(mode === "react" ? DEFAULT_REACT_CODE : DEFAULT_JS_CODE);

  const [consoleLogs, setConsoleLogs] = useState<NodeRunnerLogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastExecution, setLastExecution] = useState<{
    durationMs?: number;
    exitCode?: number;
  } | null>(null);

  const handleModeChange = (newMode: "react" | "js") => {
    setMode(newMode);
    setCode(newMode === "react" ? DEFAULT_REACT_CODE : DEFAULT_JS_CODE);
  };

  const handleRunJs = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setConsoleLogs([]);

    const result = await runNodeJsCode(code, {
      onLog: (_log, allLogs) => setConsoleLogs(allLogs),
    });

    setConsoleLogs(result.logs);
    setLastExecution({ durationMs: result.durationMs, exitCode: result.exitCode });
    setIsRunning(false);
  };

  const handleStopJs = () => {
    clearRunningTimers();
    setIsRunning(false);
  };

  return (
    <div className={styles.workspace}>
      <div className={styles.header}>
        <h1 className={styles.title}>Интерактивная песочница</h1>
        <div className={styles.langToggle}>
          <button
            type="button"
            className={clsx(styles.langBtn, mode === "react" && styles.activeLang)}
            onClick={() => handleModeChange("react")}
          >
            React
          </button>
          <button
            type="button"
            className={clsx(styles.langBtn, mode === "js" && styles.activeLang)}
            onClick={() => handleModeChange("js")}
          >
            JavaScript
          </button>
        </div>
      </div>

      <CodeEditor
        code={code}
        onChange={setCode}
        onRun={mode === "js" ? handleRunJs : undefined}
        onReset={() => setCode(mode === "react" ? DEFAULT_REACT_CODE : DEFAULT_JS_CODE)}
        filepath={mode === "react" ? "App.jsx" : "main.js"}
      />

      {mode === "react" ? (
        <ReactLivePreview
          files={[{ name: "App.jsx", code }]}
          activeFileIdx={0}
          currentCode={code}
          storagePrefix="cand"
        />
      ) : (
        <JsConsole
          logs={consoleLogs}
          isRunning={isRunning}
          lastExecution={lastExecution}
          filename="main.js"
          onRun={handleRunJs}
          onStop={handleStopJs}
          onClear={() => setConsoleLogs([])}
        />
      )}
    </div>
  );
}
