import React, { useState, memo, useMemo, useEffect } from "react";
import { Tabs, TabItem } from "@/shared/ui";
import { CodeEditor } from "@/features/code-editor";
import { JsConsole, ReactLivePreview } from "@/features/code-runner";
import { runNodeJsCode, clearRunningTimers, NodeRunnerLogEntry } from "@/shared/lib/code-runners";
import styles from "./CodeWorkspace.module.css";

const MAX_CONSOLE_LOGS = 500;

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

export const CodeWorkspace = memo((): React.JSX.Element => {
  const [mode, setMode] = useState<"react" | "js">("react");
  const [code, setCode] = useState(mode === "react" ? DEFAULT_REACT_CODE : DEFAULT_JS_CODE);

  const [consoleLogs, setConsoleLogs] = useState<NodeRunnerLogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastExecution, setLastExecution] = useState<{
    durationMs?: number;
    exitCode?: number;
  } | null>(null);

  useEffect(() => {
    return () => {
      clearRunningTimers();
    };
  }, []);

  const langTabs: TabItem[] = useMemo(
    () => [
      { id: "react", label: "React" },
      { id: "js", label: "JavaScript" },
    ],
    []
  );

  const handleModeChange = (newMode: string) => {
    const validMode = newMode === "js" ? "js" : "react";
    setMode(validMode);
    setCode(validMode === "react" ? DEFAULT_REACT_CODE : DEFAULT_JS_CODE);
  };

  const handleRunJs = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setConsoleLogs([]);

    const result = await runNodeJsCode(code, {
      onLog: (_log, allLogs) => setConsoleLogs(allLogs.slice(-MAX_CONSOLE_LOGS)),
    });

    setConsoleLogs(result.logs.slice(-MAX_CONSOLE_LOGS));
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
        <Tabs
          variant="pills"
          size="sm"
          items={langTabs}
          activeId={mode}
          onChange={handleModeChange}
          className={styles.langToggle}
        />
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
});

CodeWorkspace.displayName = "CodeWorkspace";
