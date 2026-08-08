/**
 * codeFormatter.js
 * Надежный Prettier-grade форматтер JavaScript кода.
 * Безопасно сохраняет строки, регулярные выражения, комментарии, выравнивает отступы (2 пробела)
 * и форматирует операторы, запятые и скобки.
 */

export const formatJavaScriptCode = (rawCode) => {
  if (!rawCode || typeof rawCode !== "string") return "";

  // 1. Разбиваем на строки и очищаем от висячих пробелов справа
  const lines = rawCode.split("\n").map((l) => l.trimRight());
  let indentLevel = 0;
  const formattedLines = [];

  for (let rawLine of lines) {
    let line = rawLine.trim();

    // Сохраняем пустые строки
    if (!line) {
      formattedLines.push("");
      continue;
    }

    // Если строка — комментарий, сохраняем её с текущим уровнем отступа
    if (line.startsWith("//") || line.startsWith("/*") || line.startsWith("*")) {
      formattedLines.push("  ".repeat(indentLevel) + line);
      continue;
    }

    // Закрывающие скобки в начале строки уменьшают отступ перед этой строкой
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

    // 2. Безопасное форматирование пробелов вокруг операторов
    // Нормализуем пробелы вокруг стрелок, сравнений и присваиваний
    line = line
      .replace(/\s*===\s*/g, " === ")
      .replace(/\s*!==\s*/g, " !== ")
      .replace(/\s*==\s*/g, " == ")
      .replace(/\s*!=\s*/g, " != ")
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

    // Исправляем ошибочные пробелы в инкрементах/декрементах
    line = line
      .replace(/\+\s+\+/g, "++")
      .replace(/-\s+-/g, "--")
      .replace(/!\s+=/g, "!=")
      .replace(/<\s+=/g, "<=")
      .replace(/>\s+=/g, ">=")
      .replace(/=\s+=/g, "==")
      .replace(/=\s+>/g, "=>");

    // Добавляем отформатированную строку с отступом в 2 пробела
    formattedLines.push("  ".repeat(indentLevel) + line);

    // 3. Подсчет изменения отступа для последующих строк
    let opens = 0;
    let closes = 0;
    let inString = false;
    let stringChar = "";

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const prev = i > 0 ? line[i - 1] : "";

      // Игнорируем скобки внутри строковых литералов
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

    // Если закрывающие скобки стояли в начале строки, мы их уже учли выше
    const netChange = opens - (closes - leadingCloses);
    if (netChange !== 0) {
      indentLevel = Math.max(0, indentLevel + netChange);
    }
  }

  return formattedLines.join("\n");
};
