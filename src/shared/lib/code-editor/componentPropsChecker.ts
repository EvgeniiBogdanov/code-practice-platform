/**
 * React Component Contracts & Props Static Validator
 */

import { splitTopLevelCommas, TypeDiagnosticProblem } from "./typeInference";

export interface ComponentContract {
  requiredProps: string[];
  optionalProps: string[];
  neverProps: string[];
  source: string;
}

export function extractComponentContracts(code: string): Record<string, ComponentContract> {
  const contracts: Record<string, ComponentContract> = {};
  if (!code || typeof code !== "string") return contracts;

  const interfacePropsMap: Record<
    string,
    { required: string[]; optional: string[]; neverProps: string[] }
  > = {};
  const interfaceRegex = /(?:interface|type)\s+([a-zA-Z0-9_$]+Props)\s*(?:=\s*)?\{([^}]+)\}/g;
  let im: RegExpExecArray | null;
  while ((im = interfaceRegex.exec(code)) !== null) {
    const ifName = im[1];
    const body = im[2];
    const req: string[] = [];
    const opt: string[] = [];
    const neverProps: string[] = [];

    const propLines = body.split(/[;\n]/);
    for (const l of propLines) {
      const propMatch = l.match(/^\s*([a-zA-Z0-9_$]+)(\??)\s*:\s*([a-zA-Z0-9_$<>\]|&\s"'-]+|\[)/);
      if (propMatch) {
        const propName = propMatch[1];
        const isOpt = propMatch[2] === "?";
        const pType = propMatch[3].trim();
        if (pType === "never") {
          neverProps.push(propName);
        } else if (isOpt) {
          opt.push(propName);
        } else {
          req.push(propName);
        }
      }
    }
    interfacePropsMap[ifName] = { required: req, optional: opt, neverProps };
  }

  const funcCompRegex =
    /(?:function|const)\s+([A-Z][a-zA-Z0-9_$]*)\s*(?:=\s*)?(?:\([^)]*\{([^}]+)\}[^)]*\)|:\s*React\.FC<([a-zA-Z0-9_$]+)>|\s*\()/g;
  let fcm: RegExpExecArray | null;
  while ((fcm = funcCompRegex.exec(code)) !== null) {
    const compName = fcm[1];
    const destructuredParams = fcm[2];
    const typedInterface = fcm[3];

    let requiredProps: string[] = [];
    let optionalProps: string[] = [];
    let neverProps: string[] = [];

    if (destructuredParams) {
      const rawProps = splitTopLevelCommas(destructuredParams);
      for (const p of rawProps) {
        const clean = p.trim();
        if (!clean || clean.startsWith("...")) continue;

        const defIdx = clean.indexOf("=");
        if (defIdx !== -1) {
          const propName = clean.substring(0, defIdx).trim();
          optionalProps.push(propName);
        } else {
          const propName = clean.trim();
          if (propName && propName !== "children") {
            requiredProps.push(propName);
          }
        }
      }
    }

    if (typedInterface && interfacePropsMap[typedInterface]) {
      requiredProps = Array.from(
        new Set([...requiredProps, ...interfacePropsMap[typedInterface].required])
      );
      optionalProps = Array.from(
        new Set([...optionalProps, ...interfacePropsMap[typedInterface].optional])
      );
      neverProps = Array.from(
        new Set([...neverProps, ...(interfacePropsMap[typedInterface].neverProps || [])])
      );
    }

    const standardIfName = `${compName}Props`;
    if (interfacePropsMap[standardIfName]) {
      requiredProps = Array.from(
        new Set([...requiredProps, ...interfacePropsMap[standardIfName].required])
      );
      optionalProps = Array.from(
        new Set([...optionalProps, ...interfacePropsMap[standardIfName].optional])
      );
      neverProps = Array.from(
        new Set([...neverProps, ...(interfacePropsMap[standardIfName].neverProps || [])])
      );
    }

    if (requiredProps.length > 0 || optionalProps.length > 0 || neverProps.length > 0) {
      contracts[compName] = {
        requiredProps,
        optionalProps,
        neverProps,
        source: "local",
      };
    }
  }

  return contracts;
}

export function checkComponentProps(
  code: string,
  options: { files?: Array<{ code?: string }> } = {}
): TypeDiagnosticProblem[] {
  const problems: TypeDiagnosticProblem[] = [];
  if (!code || typeof code !== "string") return problems;

  let allContracts = extractComponentContracts(code);
  if (options.files && Array.isArray(options.files)) {
    for (const f of options.files) {
      if (f && f.code) {
        const fileContracts = extractComponentContracts(f.code);
        allContracts = { ...fileContracts, ...allContracts };
      }
    }
  }

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

    const jsxTagRegex = /<([A-Z][a-zA-Z0-9_$]*)\b([^>]*?)(\/?>)/g;
    let jm: RegExpExecArray | null;
    while ((jm = jsxTagRegex.exec(line)) !== null) {
      const compName = jm[1];
      const attrStr = jm[2] || "";
      const col = jm.index + 1;

      if (attrStr.includes("{...")) {
        continue;
      }

      const contract = allContracts[compName];
      if (contract) {
        const passedProps = new Set<string>();
        const propRegex = /([a-zA-Z0-9_$]+)(?:=|\s|$)/g;
        let pm: RegExpExecArray | null;
        while ((pm = propRegex.exec(attrStr)) !== null) {
          const propKey = pm[1];
          if (propKey && propKey !== "className" && propKey !== "style" && propKey !== "key") {
            passedProps.add(propKey);
          }
        }

        if (contract.neverProps && contract.neverProps.length > 0) {
          for (const np of contract.neverProps) {
            if (passedProps.has(np)) {
              problems.push({
                id: `ts-never-prop-${lineNum}-${col}-${np}`,
                line: lineNum,
                col,
                message: `Type '{ ${Array.from(passedProps).join(", ")} }' is not assignable to type '${compName}Props'. Property '${np}' is incompatible with type 'never'.`,
                rule: "ts-never-mutual-prop",
                severity: "error",
              });
            }
          }
        }

        if (contract.requiredProps && contract.requiredProps.length > 0) {
          const missing = contract.requiredProps.filter((req) => !passedProps.has(req));
          if (missing.length > 0) {
            problems.push({
              id: `missing-props-${lineNum}-${col}-${compName}`,
              line: lineNum,
              col,
              message: `Компонент <${compName}> ожидает обязательные пропсы: ${missing.map((m) => `'${m}'`).join(", ")}`,
              rule: "react-missing-required-props",
              severity: "warning",
            });
          }
        }
      }
    }

    const imgRegex = /<img\b([^>]*?)(\/?>)/g;
    let imgM: RegExpExecArray | null;
    while ((imgM = imgRegex.exec(line)) !== null) {
      const attrStr = imgM[1] || "";
      const col = imgM.index + 1;
      const hasSrc = /\bsrc\s*=\s*/.test(attrStr);
      const hasAlt = /\balt\s*=\s*/.test(attrStr);

      if (!hasSrc || !hasAlt) {
        const missingAttrs: string[] = [];
        if (!hasSrc) missingAttrs.push("'src'");
        if (!hasAlt) missingAttrs.push("'alt'");

        problems.push({
          id: `a11y-img-${lineNum}-${col}`,
          line: lineNum,
          col,
          message: `Тег <img> должен содержать атрибуты ${missingAttrs.join(" и ")} для корректного отображения и доступности`,
          rule: "jsx-a11y-img-has-alt",
          severity: "warning",
        });
      }
    }

    const aRegex = /<a\b([^>]*?)(\/?>)/g;
    let aM: RegExpExecArray | null;
    while ((aM = aRegex.exec(line)) !== null) {
      const attrStr = aM[1] || "";
      const col = aM.index + 1;
      const isBlank = /target\s*=\s*["']_blank["']/.test(attrStr);
      const hasRel = /rel\s*=\s*["'][^"']*(noreferrer|noopener)[^"']*["']/.test(attrStr);

      if (isBlank && !hasRel) {
        problems.push({
          id: `security-link-${lineNum}-${col}`,
          line: lineNum,
          col,
          message: `Использование target="_blank" без rel="noreferrer" небезопасно для внешних ссылок`,
          rule: "react-no-target-blank",
          severity: "warning",
        });
      }
    }
  }

  return problems;
}
