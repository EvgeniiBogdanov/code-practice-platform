import { Task } from "../types";
import { TaskSourceFile } from "@/shared/lib/code-runners";

export function getTaskFiles(
  task?: Task | null,
  type: "candidate" | "solution" = "candidate"
): TaskSourceFile[] {
  if (!task) return [];

  // 1. If explicit files array
  if (Array.isArray(task.files) && task.files.length > 0) {
    return task.files.map((f) => ({
      name: f.name || (f.filepath ? f.filepath.split("/").pop() || "main.js" : "main.js"),
      filepath: f.filepath || f.name || "main.js",
      code:
        type === "candidate"
          ? f.candidateCode !== undefined
            ? f.candidateCode
            : f.code || ""
          : f.solutionCode !== undefined
            ? f.solutionCode
            : f.solution || f.rawSolution || f.code || "",
    }));
  }

  // 2. Raw text extraction
  const rawText =
    type === "candidate"
      ? task.rawCandidate || (typeof task.candidate === "string" ? task.candidate : "")
      : task.rawSolution || (typeof task.solution === "string" ? task.solution : "");

  const defaultName = task.filepath
    ? task.filepath.split("/").pop() || (task.section === "react" ? "index.jsx" : "solution.js")
    : task.section === "react"
      ? "index.jsx"
      : "solution.js";

  if (!rawText) {
    return [
      {
        name: defaultName,
        filepath: task.filepath || defaultName,
        code: "",
      },
    ];
  }

  // 3. Multi-file blocks: // filename.ext
  const fileBlocks: TaskSourceFile[] = [];
  const lines = rawText.split("\n");
  let currentFile: string | null = null;
  let currentLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("/*") && (line.includes("Разбор решения") || line.includes("==="))) {
      break;
    }

    const match = line.match(/^\/\/\s*([a-zA-Z0-9_-]+\.[a-zA-Z0-9]+)\s*$/);
    if (match) {
      if (currentFile && currentLines.length > 0) {
        fileBlocks.push({
          name: currentFile,
          filepath:
            (task.filepath ? task.filepath.substring(0, task.filepath.lastIndexOf("/") + 1) : "") +
            currentFile,
          code: currentLines.join("\n").trim(),
        });
      }
      currentFile = match[1];
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  if (currentFile && currentLines.length > 0) {
    fileBlocks.push({
      name: currentFile,
      filepath:
        (task.filepath ? task.filepath.substring(0, task.filepath.lastIndexOf("/") + 1) : "") +
        currentFile,
      code: currentLines.join("\n").trim(),
    });
  }

  if (fileBlocks.length > 0) {
    return fileBlocks;
  }

  return [
    {
      name: defaultName,
      filepath: task.filepath || defaultName,
      code: rawText,
    },
  ];
}

export function hasTaskVisualComponent(task?: Task | null, files: TaskSourceFile[] = []): boolean {
  if (!task) return false;
  if (task.isRaw) return false;
  if (task.section === "react") return true;
  return files.length > 0 && files.some((f) => /\.(jsx|tsx)$/.test(f.name || f.filepath || ""));
}
