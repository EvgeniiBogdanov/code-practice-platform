import type { TraceStep } from "@/entities/algorithm-trace";

export const getActiveCodeLine = (
  code: string,
  step: Pick<TraceStep, "line" | "occurrence">
): number => {
  const matches = code
    .split("\n")
    .flatMap((line, index) => (line.includes(step.line) ? [index + 1] : []));
  return matches[step.occurrence ?? 0] ?? 0;
};

// Убирает // комментарии вне строковых литералов. Строки, состоявшие только из комментария,
// удаляются целиком, чтобы код в визуализации не расползался пустыми промежутками.
const stripLineComment = (line: string): string => {
  let quote = "";
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (quote) {
      if (char === "\\") i++;
      else if (char === quote) quote = "";
    } else if (char === '"' || char === "'" || char === "`") {
      quote = char;
    } else if (char === "/" && line[i + 1] === "/") {
      return line.slice(0, i).trimEnd();
    }
  }
  return line;
};

export const stripComments = (code: string): string =>
  code
    .split("\n")
    .flatMap((line) => {
      const stripped = stripLineComment(line);
      return stripped.trim() === "" && line.trim() !== "" ? [] : [stripped];
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

export const getSolutionCode = (source: string): string =>
  stripComments(source.split("// Пример вызова:")[0]);
