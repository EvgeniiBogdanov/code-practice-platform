/**
 * codeFormatter.js
 * Форматирование кода через Prettier standalone с безопасным фоллбэком.
 */
import prettier from "prettier/standalone";
import parserBabel from "prettier/plugins/babel";
import parserEstree from "prettier/plugins/estree";

export const formatJavaScriptCodeSync = (rawCode) => {
  if (!rawCode || typeof rawCode !== "string") return "";

  const lines = rawCode.split("\n").map((l) => l.trimEnd());
  let indentLevel = 0;
  const formattedLines = [];

  for (let rawLine of lines) {
    let line = rawLine.trim();

    if (!line) {
      formattedLines.push("");
      continue;
    }

    if (line.startsWith("//") || line.startsWith("/*") || line.startsWith("*")) {
      formattedLines.push("  ".repeat(indentLevel) + line);
      continue;
    }

    let leadingCloses = 0;
    for (let char of line) {
      if (char === "}" || char === "]" || char === ")") {
        leadingCloses++;
      } else {
        break;
      }
    }
    if (leadingCloses > 0) {
      indentLevel = Math.max(0, indentLevel - leadingCloses);
    } else if (line.startsWith("} catch") || line.startsWith("} else") || line.startsWith("} finally")) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    line = line
      .replace(/\s*===\s*/g, " === ")
      .replace(/\s*!==\s*/g, " !== ")
      .replace(/\s*==\s*/g, " == ")
      .replace(/\s*!=\s*/g, " !=")
      .replace(/\s*<=\s*/g, " <= ")
      .replace(/\s*>=\s*/g, " >= ")
      .replace(/\s*=>\s*/g, " => ")
      .replace(/\s*&&\s*/g, " && ")
      .replace(/\s*\|\|\s*/g, " || ")
      .replace(/\s*\+=\s*/g, " += ")
      .replace(/\s*-=\s*/g, " -= ")
      .replace(/\s*\*=\s*/g, " *= ")
      .replace(/\s*\/=\s*/g, " /= ")
      .replace(/\s*=\s*/g, " = ")
      .replace(/,\s*/g, ", ")
      .replace(/;\s*/g, "; ")
      .replace(/\s*;\s*$/, ";")
      .replace(/\s*{\s*$/, " {")
      .trim();

    line = line
      .replace(/\+\s+\+/g, "++")
      .replace(/-\s+-/g, "--")
      .replace(/!\s+=/g, "!=")
      .replace(/<\s+=/g, "<=")
      .replace(/>\s+=/g, ">=")
      .replace(/=\s+=/g, "==")
      .replace(/=\s+>/g, "=>");

    formattedLines.push("  ".repeat(indentLevel) + line);

    let opens = 0;
    let closes = 0;
    let inString = false;
    let stringChar = "";

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const prev = i > 0 ? line[i - 1] : "";

      if ((char === '"' || char === "'" || char === "`") && prev !== "\\") {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (stringChar === char) {
          inString = false;
        }
      }

      if (!inString) {
        if (char === "{" || char === "[" || char === "(") {
          opens++;
        } else if (char === "}" || char === "]" || char === ")") {
          closes++;
        }
      }
    }

    const netChange = opens - (closes - leadingCloses);
    if (netChange !== 0) {
      indentLevel = Math.max(0, indentLevel + netChange);
    }
  }

  return formattedLines.join("\n");
};

export const formatJavaScriptCode = async (rawCode) => {
  if (!rawCode || typeof rawCode !== "string") return "";

  try {
    const formatted = await prettier.format(rawCode, {
      parser: "babel",
      plugins: [parserBabel, parserEstree],
      semi: true,
      singleQuote: false,
      tabWidth: 2,
      trailingComma: "es5",
      bracketSpacing: true,
      arrowParens: "always",
    });
    return formatted.trimEnd();
  } catch (err) {
    console.warn("Prettier formatting notice (using fallback):", err.message);
    return formatJavaScriptCodeSync(rawCode);
  }
};
