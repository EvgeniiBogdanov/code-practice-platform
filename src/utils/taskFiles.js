/**
 * taskFiles.js
 * Универсальный парсер и сборщик файлов для многофайловых задач (Redux Toolkit, useReducer, модули).
 */

export const getTaskFiles = (task, type = "candidate") => {
  if (!task) return [];

  // 1. Если у задачи явно задан массив files
  if (Array.isArray(task.files) && task.files.length > 0) {
    return task.files.map((f) => ({
      name: f.name || (f.filepath ? f.filepath.split("/").pop() : "main.js"),
      filepath: f.filepath || f.name || "main.js",
      code:
        type === "candidate"
          ? (f.candidateCode !== undefined ? f.candidateCode : (f.code || ""))
          : (f.solutionCode !== undefined ? f.solutionCode : (f.code || "")),
    }));
  }

  // 2. Извлечение исходного сырого текста
  const rawText =
    type === "candidate"
      ? (task.rawCandidate || (typeof task.candidate === "string" ? task.candidate : ""))
      : (task.rawSolution || (typeof task.solution === "string" ? task.solution : ""));

  if (!rawText) {
    const defaultName = task.filepath ? task.filepath.split("/").pop() : (type === "candidate" ? "index.jsx" : "solution.js");
    return [
      {
        name: defaultName,
        filepath: task.filepath || defaultName,
        code: "",
      },
    ];
  }

  // 3. Парсинг структуры с комментариями вида `// index.jsx`, `// usersSlice.js`, `// store.js`
  const fileBlocks = [];
  const lines = rawText.split("\n");
  let currentFile = null;
  let currentLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Остановка парсинга файлов, если начался блок разбора решения
    if (line.startsWith("/*") && (line.includes("Разбор решения") || line.includes("==="))) {
      break;
    }

    const match = line.match(/^\/\/\s*([a-zA-Z0-9_-]+\.[a-zA-Z0-9]+)\s*$/);
    if (match) {
      if (currentFile && currentLines.length > 0) {
        fileBlocks.push({
          name: currentFile,
          filepath: (task.filepath ? task.filepath.substring(0, task.filepath.lastIndexOf("/") + 1) : "") + currentFile,
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
      filepath: (task.filepath ? task.filepath.substring(0, task.filepath.lastIndexOf("/") + 1) : "") + currentFile,
      code: currentLines.join("\n").trim(),
    });
  }

  // Если были найдены размеченные файлы `// filename.ext`
  if (fileBlocks.length > 0) {
    return fileBlocks;
  }

  // Одиночный файл задачи
  const defaultName = task.filepath ? task.filepath.split("/").pop() : (type === "candidate" ? "index.jsx" : "solution.js");
  return [
    {
      name: defaultName,
      filepath: task.filepath || defaultName,
      code: rawText,
    },
  ];
};
