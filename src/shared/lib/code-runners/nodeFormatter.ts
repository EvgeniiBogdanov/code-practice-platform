/**
 * Node.js REPL Style Value Formatter
 */

export interface FormattedNodeValue {
  type: string;
  text: string;
}

export interface ConsoleTableResult {
  type: "table" | "text";
  columns?: string[];
  rows?: Array<Record<string, string>>;
  text?: string;
}

export function formatNodeValue(
  val: unknown,
  depth = 0,
  seen = new WeakSet<object>()
): FormattedNodeValue {
  if (val === null) return { type: "null", text: "null" };
  if (val === undefined) return { type: "undefined", text: "undefined" };

  const type = typeof val;

  if (type === "string") {
    return { type: "string", text: depth === 0 ? (val as string) : `'${val}'` };
  }

  if (type === "number") {
    const num = val as number;
    if (Number.isNaN(num)) return { type: "nan", text: "NaN" };
    if (num === Infinity) return { type: "number", text: "Infinity" };
    if (num === -Infinity) return { type: "number", text: "-Infinity" };
    if (Object.is(num, -0)) return { type: "number", text: "-0" };
    return { type: "number", text: String(num) };
  }

  if (type === "boolean") {
    return { type: "boolean", text: String(val) };
  }

  if (type === "bigint") {
    return { type: "bigint", text: `${val}n` };
  }

  if (type === "symbol") {
    return { type: "symbol", text: (val as symbol).toString() };
  }

  if (type === "function") {
    const fn = val as (...args: unknown[]) => unknown;
    const isAsync = fn.constructor?.name === "AsyncFunction";
    const isGenerator = fn.constructor?.name === "GeneratorFunction";
    const fnPrefix = isAsync ? "AsyncFunction" : isGenerator ? "GeneratorFunction" : "Function";
    const name = fn.name ? `: ${fn.name}` : " (anonymous)";
    return { type: "function", text: `[${fnPrefix}${name}]` };
  }

  if (type === "object") {
    const obj = val as object;
    if (seen.has(obj)) {
      return { type: "circular", text: "[Circular]" };
    }

    if (depth > 4) {
      return { type: "object", text: Array.isArray(obj) ? "[Array]" : "[Object]" };
    }

    seen.add(obj);

    try {
      if (obj instanceof Error) {
        return {
          type: "error",
          text: `${obj.name}: ${obj.message}${
            obj.stack ? `\n${obj.stack.split("\n").slice(1, 4).join("\n")}` : ""
          }`,
        };
      }

      if (obj instanceof Date) {
        return {
          type: "date",
          text: isNaN(obj.getTime()) ? "Invalid Date" : obj.toISOString(),
        };
      }

      if (obj instanceof RegExp) {
        return { type: "regexp", text: obj.toString() };
      }

      if (obj instanceof Promise) {
        return { type: "promise", text: "Promise { <pending> }" };
      }

      if (obj instanceof Set) {
        const items = Array.from(obj).map((item) => formatNodeValue(item, depth + 1, seen).text);
        const inner = items.join(", ");
        return { type: "set", text: `Set(${obj.size}) { ${inner} }` };
      }

      if (obj instanceof Map) {
        const items = Array.from(obj.entries()).map(
          ([k, v]) =>
            `${formatNodeValue(k, depth + 1, seen).text} => ${
              formatNodeValue(v, depth + 1, seen).text
            }`
        );
        const inner = items.join(", ");
        return { type: "map", text: `Map(${obj.size}) { ${inner} }` };
      }

      if (Array.isArray(obj)) {
        if (obj.length === 0) return { type: "array", text: "[]" };
        const items: string[] = [];
        let emptyCount = 0;

        for (let i = 0; i < obj.length; i++) {
          if (!(i in obj)) {
            emptyCount++;
          } else {
            if (emptyCount > 0) {
              items.push(`<${emptyCount} empty item${emptyCount > 1 ? "s" : ""}>`);
              emptyCount = 0;
            }
            items.push(formatNodeValue(obj[i], depth + 1, seen).text);
          }
        }
        if (emptyCount > 0) {
          items.push(`<${emptyCount} empty item${emptyCount > 1 ? "s" : ""}>`);
        }

        const singleLine = `[ ${items.join(", ")} ]`;
        if (singleLine.length < 80 && !singleLine.includes("\n")) {
          return { type: "array", text: singleLine };
        }
        const indent = "  ".repeat(depth + 1);
        const closeIndent = "  ".repeat(depth);
        return {
          type: "array",
          text: `[\n${items.map((it) => `${indent}${it}`).join(",\n")}\n${closeIndent}]`,
        };
      }

      const keys = Object.keys(obj);
      const symbolKeys = Object.getOwnPropertySymbols(obj);
      const allKeys = [...keys, ...symbolKeys];

      if (allKeys.length === 0) {
        return { type: "object", text: "{}" };
      }

      const entries = allKeys.map((k) => {
        const keyStr =
          typeof k === "symbol"
            ? `[${k.toString()}]`
            : /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k)
              ? k
              : `'${k}'`;
        const valFormatted = formatNodeValue((obj as any)[k], depth + 1, seen).text;
        return `${keyStr}: ${valFormatted}`;
      });

      const singleLine = `{ ${entries.join(", ")} }`;
      if (singleLine.length < 80 && !singleLine.includes("\n")) {
        return { type: "object", text: singleLine };
      }
      const indent = "  ".repeat(depth + 1);
      const closeIndent = "  ".repeat(depth);
      return {
        type: "object",
        text: `{\n${entries.map((e) => `${indent}${e}`).join(",\n")}\n${closeIndent}}`,
      };
    } finally {
      seen.delete(obj);
    }
  }

  return { type: "unknown", text: String(val) };
}

export function formatConsoleTable(
  tabularData: unknown,
  properties?: string[]
): ConsoleTableResult {
  if (!tabularData || typeof tabularData !== "object") {
    return { type: "text", text: String(tabularData) };
  }

  try {
    const isArr = Array.isArray(tabularData);
    const rows: Array<Record<string, unknown>> = [];
    const keysSet = new Set<string>();

    if (isArr) {
      (tabularData as unknown[]).forEach((item, idx) => {
        if (item && typeof item === "object") {
          const itemKeys = properties || Object.keys(item);
          itemKeys.forEach((k) => keysSet.add(k));
          rows.push({ "(index)": idx, ...(item as Record<string, unknown>) });
        } else {
          keysSet.add("Values");
          rows.push({ "(index)": idx, Values: item });
        }
      });
    } else {
      Object.entries(tabularData as Record<string, unknown>).forEach(([key, item]) => {
        if (item && typeof item === "object") {
          const itemKeys = properties || Object.keys(item);
          itemKeys.forEach((k) => keysSet.add(k));
          rows.push({ "(index)": key, ...(item as Record<string, unknown>) });
        } else {
          keysSet.add("Values");
          rows.push({ "(index)": key, Values: item });
        }
      });
    }

    const columns = ["(index)", ...Array.from(keysSet)];
    return {
      type: "table",
      columns,
      rows: rows.map((row) => {
        const mapped: Record<string, string> = {};
        columns.forEach((col) => {
          mapped[col] = col in row ? formatNodeValue(row[col], 1).text : "";
        });
        return mapped;
      }),
    };
  } catch {
    return { type: "text", text: formatNodeValue(tabularData, 0).text };
  }
}
