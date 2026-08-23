/**
 * TypeScript Type Inference & Assignment Compatibility Checker
 */

export interface InferredType {
  type: string;
  raw: string;
  elementType?: string;
  properties?: Record<string, string>;
}

export interface TypeCompatibilityResult {
  compatible: boolean;
  reason?: string;
}

export interface TypeDiagnosticProblem {
  id: string;
  line: number;
  col: number;
  message: string;
  rule: string;
  severity: "error" | "warning";
}

export function splitTopLevelCommas(str: string): string[] {
  const parts: string[] = [];
  let current = "";
  let paren = 0;
  let brace = 0;
  let bracket = 0;
  let inStr: string | null = null;

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    const prev = i > 0 ? str[i - 1] : "";

    if (inStr) {
      if (ch === inStr && prev !== "\\") {
        inStr = null;
      }
      current += ch;
      continue;
    }

    if (ch === "'" || ch === '"' || ch === "`") {
      inStr = ch;
      current += ch;
      continue;
    }

    if (ch === "(") paren++;
    else if (ch === ")") paren--;
    else if (ch === "{") brace++;
    else if (ch === "}") brace--;
    else if (ch === "[") bracket++;
    else if (ch === "]") bracket--;

    if (ch === "," && paren === 0 && brace === 0 && bracket === 0) {
      parts.push(current.trim());
      current = "";
      continue;
    }

    current += ch;
  }

  if (current.trim()) {
    parts.push(current.trim());
  }

  return parts;
}

export function inferExpressionType(expr: string): InferredType {
  if (!expr || typeof expr !== "string") return { type: "unknown", raw: "" };
  const trimmed = expr.trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith("`") && trimmed.endsWith("`"))
  ) {
    return { type: "string", raw: trimmed };
  }

  if (/^-?(0x[0-9a-fA-F]+|0b[01]+|0o[0-7]+|\d+(\.\d+)?([eE][+-]?\d+)?)$/.test(trimmed)) {
    return { type: "number", raw: trimmed };
  }

  if (trimmed === "true" || trimmed === "false") {
    return { type: "boolean", raw: trimmed };
  }

  if (trimmed === "null") return { type: "null", raw: trimmed };
  if (trimmed === "undefined") return { type: "undefined", raw: trimmed };

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const inner = trimmed.slice(1, -1).trim();
    if (!inner) {
      return { type: "Array", elementType: "any", raw: trimmed };
    }

    const elements = splitTopLevelCommas(inner);
    const elementTypes = new Set<string>();
    for (const el of elements) {
      const inf = inferExpressionType(el);
      if (inf.type !== "unknown") {
        elementTypes.add(inf.type);
      }
    }

    let elemType = "any";
    if (elementTypes.size === 1) {
      elemType = Array.from(elementTypes)[0];
    } else if (elementTypes.size > 1) {
      elemType = Array.from(elementTypes).join(" | ");
    }

    return { type: `${elemType}[]`, elementType: elemType, raw: trimmed };
  }

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    const inner = trimmed.slice(1, -1).trim();
    const properties: Record<string, string> = {};
    if (inner) {
      const pairs = splitTopLevelCommas(inner);
      for (const pair of pairs) {
        const colonIdx = pair.indexOf(":");
        if (colonIdx !== -1) {
          const key = pair.substring(0, colonIdx).trim().replace(/['"]/g, "");
          const valExpr = pair.substring(colonIdx + 1).trim();
          const valType = inferExpressionType(valExpr);
          properties[key] = valType.type;
        } else {
          const key = pair.trim();
          if (key) properties[key] = "any";
        }
      }
    }
    return { type: "object", properties, raw: trimmed };
  }

  if (/^(\([^)]*\)|[a-zA-Z_$][a-zA-Z0-9_$]*)\s*=>/.test(trimmed)) {
    return { type: "function", raw: trimmed };
  }

  return { type: "unknown", raw: trimmed };
}

export function isTypeAssignable(
  declaredType: string,
  inferred: InferredType
): TypeCompatibilityResult {
  if (!declaredType || !inferred) return { compatible: true };
  const dType = declaredType.trim();

  if (dType === "any" || dType === "unknown") return { compatible: true };
  if (inferred.type === "unknown" || inferred.type === "any") return { compatible: true };

  if (dType.includes("|")) {
    const variants = dType.split("|").map((v) => v.trim());
    for (const variant of variants) {
      if (isTypeAssignable(variant, inferred).compatible) {
        return { compatible: true };
      }
    }
    return {
      compatible: false,
      reason: `Тип '${inferred.type}' не может быть присвоен объединению '${dType}'`,
    };
  }

  const isDeclaredArray = dType.endsWith("[]") || /^Array<(.+)>$/.test(dType);
  if (isDeclaredArray) {
    const expectedElement = dType.endsWith("[]")
      ? dType.slice(0, -2).trim()
      : dType.match(/^Array<(.+)>$/)![1].trim();

    if (!inferred.type.endsWith("[]") && inferred.type !== "Array") {
      return {
        compatible: false,
        reason: `Тип '${inferred.type}' не может быть присвоен массиву типа '${dType}'`,
      };
    }

    if (inferred.elementType && inferred.elementType !== "any" && expectedElement !== "any") {
      const elemRes = isTypeAssignable(expectedElement, { type: inferred.elementType, raw: "" });
      if (!elemRes.compatible) {
        return {
          compatible: false,
          reason: `Тип элемента '${inferred.elementType}[]' не может быть присвоен массиву '${dType}'`,
        };
      }
    }

    return { compatible: true };
  }

  if (inferred.type.endsWith("[]") || inferred.type === "Array") {
    return {
      compatible: false,
      reason: `Тип '${inferred.type}' не может быть присвоен типу '${dType}'`,
    };
  }

  if (dType.startsWith("{") && dType.endsWith("}")) {
    if (inferred.type !== "object") {
      return {
        compatible: false,
        reason: `Тип '${inferred.type}' не может быть присвоен объектному типу '${dType}'`,
      };
    }

    const innerProps = dType
      .slice(1, -1)
      .split(/[;,]/)
      .map((p) => p.trim())
      .filter(Boolean);
    for (const propStr of innerProps) {
      const colonIdx = propStr.indexOf(":");
      if (colonIdx !== -1) {
        let key = propStr.substring(0, colonIdx).trim();
        const propType = propStr.substring(colonIdx + 1).trim();
        const isOptional = key.endsWith("?");
        if (isOptional) key = key.slice(0, -1).trim();

        if (!inferred.properties || !(key in inferred.properties)) {
          if (!isOptional) {
            return {
              compatible: false,
              reason: `В объекте отсутствует обязательное свойство '${key}: ${propType}'`,
            };
          }
        } else {
          const actualPropType = inferred.properties[key];
          if (actualPropType && actualPropType !== "unknown" && actualPropType !== "any") {
            const propRes = isTypeAssignable(propType, { type: actualPropType, raw: "" });
            if (!propRes.compatible) {
              return {
                compatible: false,
                reason: `Свойство '${key}' типа '${actualPropType}' не совместимо с '${propType}'`,
              };
            }
          }
        }
      }
    }
    return { compatible: true };
  }

  if (
    dType === "number" ||
    dType === "string" ||
    dType === "boolean" ||
    dType === "null" ||
    dType === "undefined"
  ) {
    if (inferred.type !== dType) {
      return {
        compatible: false,
        reason: `Тип '${inferred.type}' не может быть присвоен типу '${dType}'`,
      };
    }
    return { compatible: true };
  }

  return { compatible: true };
}

export function checkTypeScriptTypes(code: string): TypeDiagnosticProblem[] {
  const problems: TypeDiagnosticProblem[] = [];
  if (!code || typeof code !== "string") return problems;

  const lines = code.split("\n");

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const lineNum = lineIdx + 1;

    const trimmedLine = line.trim();
    if (
      trimmedLine.startsWith("//") ||
      trimmedLine.startsWith("/*") ||
      trimmedLine.startsWith("*")
    ) {
      continue;
    }

    const varDeclRegex =
      /\b(const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*([a-zA-Z0-9_$<>\]{}|&,;:?\s"'-]+|\[)\s*=\s*([^;]+)(?:;|$)/g;
    let vm: RegExpExecArray | null;
    while ((vm = varDeclRegex.exec(line)) !== null) {
      const varName = vm[2];
      const declaredType = vm[3].trim();
      const valExpr = vm[4].trim();

      if (declaredType && valExpr && !declaredType.includes("=>")) {
        const inferred = inferExpressionType(valExpr);
        const assignable = isTypeAssignable(declaredType, inferred);
        if (!assignable.compatible) {
          const col = vm.index + line.substring(vm.index).indexOf(varName) + 1;
          problems.push({
            id: `ts-type-mismatch-${lineNum}-${col}`,
            line: lineNum,
            col,
            message:
              assignable.reason ||
              `Тип '${inferred.type}' не может быть присвоен типу '${declaredType}'`,
            rule: "ts-type-mismatch",
            severity: "error",
          });
        }
      }
    }

    const arrowReturnRegex = /=\s*\([^)]*\)\s*:\s*([a-zA-Z0-9_$<>\]|]+|\[)\s*=>\s*([^;{]+)(?:;|$)/g;
    let am: RegExpExecArray | null;
    while ((am = arrowReturnRegex.exec(line)) !== null) {
      const declaredReturnType = am[1].trim();
      const returnExpr = am[2].trim();
      const inferred = inferExpressionType(returnExpr);
      const assignable = isTypeAssignable(declaredReturnType, inferred);
      if (!assignable.compatible) {
        const col = am.index + 1;
        problems.push({
          id: `ts-return-mismatch-${lineNum}-${col}`,
          line: lineNum,
          col,
          message: `Тип возвращаемого значения '${inferred.type}' не может быть присвоен типу '${declaredReturnType}'`,
          rule: "ts-return-type-mismatch",
          severity: "error",
        });
      }
    }
  }

  const refDecls: Array<{ name: string; type: string; declLine: number }> = [];
  const refDeclRegex =
    /\b(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(?:React\.)?useRef\s*<([^>]+)>\s*\(\s*null\s*\)/g;
  for (let lIdx = 0; lIdx < lines.length; lIdx++) {
    const l = lines[lIdx];
    let rm: RegExpExecArray | null;
    while ((rm = refDeclRegex.exec(l)) !== null) {
      const refName = rm[1];
      const genericType = rm[2].trim();
      if (!genericType.includes("null") && !genericType.includes("undefined")) {
        refDecls.push({ name: refName, type: genericType, declLine: lIdx + 1 });
      }
    }
  }

  for (const ref of refDecls) {
    const assignRegex = new RegExp(`\\b${ref.name}\\.current\\s*=\\s*`);
    for (let lIdx = 0; lIdx < lines.length; lIdx++) {
      const l = lines[lIdx];
      const lineNum = lIdx + 1;
      const m = assignRegex.exec(l);
      if (m) {
        const col = m.index + 1;
        problems.push({
          id: `ts-readonly-ref-${lineNum}-${col}`,
          line: lineNum,
          col,
          message: `Cannot assign to 'current' because it is a read-only property. (RefObject<${ref.type}> is read-only). Did you mean 'useRef<${ref.type} | null>(null)'?`,
          rule: "ts-readonly-ref-assignment",
          severity: "error",
        });
      }
    }
  }

  const genericArrowRegex = /=\s*<([A-Z][a-zA-Z0-9_$]*)>\s*\(/g;
  for (let lIdx = 0; lIdx < lines.length; lIdx++) {
    const l = lines[lIdx];
    const lineNum = lIdx + 1;
    let gm: RegExpExecArray | null;
    while ((gm = genericArrowRegex.exec(l)) !== null) {
      const paramName = gm[1];
      const col = gm.index + 1;
      problems.push({
        id: `ts-generic-comma-${lineNum}-${col}`,
        line: lineNum,
        col,
        message: `In TSX files, generic arrow parameter '<${paramName}>' conflicts with JSX tags. Use '<${paramName},>' or '<${paramName} extends unknown>'.`,
        rule: "ts-generic-tsx-trailing-comma",
        severity: "error",
      });
    }
  }

  return problems;
}
