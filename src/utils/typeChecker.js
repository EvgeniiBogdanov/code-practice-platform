/**
 * typeChecker.js
 * Статический анализатор типов TypeScript и валидатор обязательных пропсов React-компонентов.
 * Обнаруживает несовпадения типов (Type Mismatches) и пропущенные required props в JSX в стиле VS Code & TS Language Service.
 */

/**
 * Определяет примитивный/литеральный тип JS/TS выражения
 * @param {string} expr
 * @returns {{ type: string, raw: string, elementType?: string, properties?: Record<string, string> }}
 */
export function inferExpressionType(expr) {
  if (!expr || typeof expr !== "string") return { type: "unknown", raw: "" };
  const trimmed = expr.trim();

  // 1. Строки
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith("`") && trimmed.endsWith("`"))
  ) {
    return { type: "string", raw: trimmed };
  }

  // 2. Числа
  if (/^-?(0x[0-9a-fA-F]+|0b[01]+|0o[0-7]+|\d+(\.\d+)?([eE][+-]?\d+)?)$/.test(trimmed)) {
    return { type: "number", raw: trimmed };
  }

  // 3. Булевы значения
  if (trimmed === "true" || trimmed === "false") {
    return { type: "boolean", raw: trimmed };
  }

  // 4. Null & Undefined
  if (trimmed === "null") return { type: "null", raw: trimmed };
  if (trimmed === "undefined") return { type: "undefined", raw: trimmed };

  // 5. Массивы: [1, 2, 3] или ["a", "b"]
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const inner = trimmed.slice(1, -1).trim();
    if (!inner) {
      return { type: "Array", elementType: "any", raw: trimmed };
    }

    // Разбиваем элементы массива верхнего уровня
    const elements = splitTopLevelCommas(inner);
    const elementTypes = new Set();
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

  // 6. Объекты: { name: "Ivan", age: 25 }
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    const inner = trimmed.slice(1, -1).trim();
    const properties = {};
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
          // shorthand { name }
          const key = pair.trim();
          if (key) properties[key] = "any";
        }
      }
    }
    return { type: "object", properties, raw: trimmed };
  }

  // 7. Стрелочные функции: () => ...
  if (/^(\([^)]*\)|[a-zA-Z_$][a-zA-Z0-9_$]*)\s*=>/.test(trimmed)) {
    return { type: "function", raw: trimmed };
  }

  return { type: "unknown", raw: trimmed };
}

/**
 * Разбивает список выражений через запятую только на верхнем уровне скобок
 */
function splitTopLevelCommas(str) {
  const parts = [];
  let current = "";
  let paren = 0;
  let brace = 0;
  let bracket = 0;
  let inStr = null;

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

/**
 * Проверяет совместимость выведенного типа с объявленным типом TS
 * @param {string} declaredType Объявленный тип (например, "number", "string[]", "string | number")
 * @param {{ type: string, elementType?: string, properties?: Record<string, string> }} inferred
 * @returns {{ compatible: boolean, reason?: string }}
 */
export function isTypeAssignable(declaredType, inferred) {
  if (!declaredType || !inferred) return { compatible: true };
  const dType = declaredType.trim();

  // any, unknown, never, void принимают/игнорируют любые проверки
  if (dType === "any" || dType === "unknown") return { compatible: true };

  // Если выведенный тип unknown (например, вызов функции или переменная), не ругаемся
  if (inferred.type === "unknown" || inferred.type === "any") return { compatible: true };

  // 1. Union Types: "string | number | null"
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

  // 2. Массивы: "string[]" или "Array<string>"
  const isDeclaredArray = dType.endsWith("[]") || /^Array<(.+)>$/.test(dType);
  if (isDeclaredArray) {
    const expectedElement = dType.endsWith("[]")
      ? dType.slice(0, -2).trim()
      : dType.match(/^Array<(.+)>$/)[1].trim();

    if (!inferred.type.endsWith("[]") && inferred.type !== "Array") {
      return {
        compatible: false,
        reason: `Тип '${inferred.type}' не может быть присвоен массиву типа '${dType}'`,
      };
    }

    if (inferred.elementType && inferred.elementType !== "any" && expectedElement !== "any") {
      const elemRes = isTypeAssignable(expectedElement, { type: inferred.elementType });
      if (!elemRes.compatible) {
        return {
          compatible: false,
          reason: `Тип элемента '${inferred.elementType}[]' не может быть присвоен массиву '${dType}'`,
        };
      }
    }

    return { compatible: true };
  }

  // Если объявлен примитив, а присвоен массив
  if (inferred.type.endsWith("[]") || inferred.type === "Array") {
    return {
      compatible: false,
      reason: `Тип '${inferred.type}' не может быть присвоен типу '${dType}'`,
    };
  }

  // 3. Объекты: "{ name: string; age: number }"
  if (dType.startsWith("{") && dType.endsWith("}")) {
    if (inferred.type !== "object") {
      return {
        compatible: false,
        reason: `Тип '${inferred.type}' не может быть присвоен объектному типу '${dType}'`,
      };
    }

    // Парсим сигнатуру типа объекта
    const innerProps = dType.slice(1, -1).split(/[;,]/).map((p) => p.trim()).filter(Boolean);
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
            const propRes = isTypeAssignable(propType, { type: actualPropType });
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

  // 4. Примитивные типы (number, string, boolean, null, undefined)
  if (dType === "number" || dType === "string" || dType === "boolean" || dType === "null" || dType === "undefined") {
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

/**
 * Анализирует код на наличие ошибок типизации TypeScript
 * (Type Mismatches в const/let/var, возвращаемых типах функций)
 * @param {string} code
 * @returns {Array<{ line: number, col: number, message: string, rule: string, severity: 'error' | 'warning' }>}
 */
export function checkTypeScriptTypes(code) {
  const problems = [];
  if (!code || typeof code !== "string") return problems;

  const lines = code.split("\n");

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const lineNum = lineIdx + 1;

    // Игнорируем закомментированные строки
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("//") || trimmedLine.startsWith("/*") || trimmedLine.startsWith("*")) {
      continue;
    }

    // 1. Поиск объявлений переменных с аннотацией типа:
    // const/let/var name: Type = Value;
    const varDeclRegex = /\b(const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*([a-zA-Z0-9_$<>\[\]{}|&,;:?\s"'-]+?)\s*=\s*([^;]+)(?:;|$)/g;
    let vm;
    while ((vm = varDeclRegex.exec(line)) !== null) {
      const varName = vm[2];
      const declaredType = vm[3].trim();
      const valExpr = vm[4].trim();

      // Проверяем, если это не generic JSX выражение
      if (declaredType && valExpr && !declaredType.includes("=>")) {
        const inferred = inferExpressionType(valExpr);
        const assignable = isTypeAssignable(declaredType, inferred);
        if (!assignable.compatible) {
          const col = vm.index + line.substring(vm.index).indexOf(varName) + 1;
          problems.push({
            id: `ts-type-mismatch-${lineNum}-${col}`,
            line: lineNum,
            col,
            message: assignable.reason || `Тип '${inferred.type}' не может быть присвоен типу '${declaredType}'`,
            rule: "ts-type-mismatch",
            severity: "error",
          });
        }
      }
    }

    // 2. Поиск возвращаемых типов функций с непосредственным return литерала:
    // function getFoo(): number { return "123"; }
    // const getFoo = (): number => "123";
    const arrowReturnRegex = /=\s*\([^)]*\)\s*:\s*([a-zA-Z0-9_$<>\[\]|]+)\s*=>\s*([^;{]+)(?:;|$)/g;
    let am;
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

    // 3. Поиск объявлений read-only useRef<T>(null) и попыток перезаписи .current
    // const timerRef = useRef<number>(null); timerRef.current = 123;
  }

  // Поиск всех объявлений useRef<T>(null) в файле
  const refDecls = [];
  const refDeclRegex = /\b(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(?:React\.)?useRef\s*<([^>]+)>\s*\(\s*null\s*\)/g;
  for (let lIdx = 0; lIdx < lines.length; lIdx++) {
    const l = lines[lIdx];
    let rm;
    while ((rm = refDeclRegex.exec(l)) !== null) {
      const refName = rm[1];
      const genericType = rm[2].trim();
      if (!genericType.includes("null") && !genericType.includes("undefined")) {
        refDecls.push({ name: refName, type: genericType, declLine: lIdx + 1 });
      }
    }
  }

  // Проверка присваиваний .current = ... для read-only рефов
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

  // 4. Проверка синтаксиса TSX для generic стрелочных функций: const id = <T>(x: T) => ...
  const genericArrowRegex = /=\s*<([A-Z][a-zA-Z0-9_$]*)>\s*\(/g;
  for (let lIdx = 0; lIdx < lines.length; lIdx++) {
    const l = lines[lIdx];
    const lineNum = lIdx + 1;
    let gm;
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

/**
 * Извлекает контракты компонентов и их обязательные пропсы из исходного кода
 * @param {string} code
 * @returns {Record<string, { requiredProps: string[], optionalProps: string[], neverProps: string[], source: string }>}
 */
export function extractComponentContracts(code) {
  const contracts = {};
  if (!code || typeof code !== "string") return contracts;

  // 1. Поиск интерфейсов/типов пропсов: interface ButtonProps { label: string; onClick: () => void; disabled?: boolean }
  const interfacePropsMap = {};
  const interfaceRegex = /(?:interface|type)\s+([a-zA-Z0-9_$]+Props)\s*(?:=\s*)?\{([^}]+)\}/g;
  let im;
  while ((im = interfaceRegex.exec(code)) !== null) {
    const ifName = im[1];
    const body = im[2];
    const req = [];
    const opt = [];
    const neverProps = [];

    const propLines = body.split(/[;\n]/);
    for (const l of propLines) {
      const propMatch = l.match(/^\s*([a-zA-Z0-9_$]+)(\??)\s*:\s*([a-zA-Z0-9_$<>\[\]|&\s"'-]+)/);
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

  // 2. Поиск функциональных компонентов с деструктуризацией:
  // function Button({ label, onClick, variant = "primary" }: ButtonProps)
  // const Card = ({ title, children, isHeader = false }) =>
  const funcCompRegex = /(?:function|const)\s+([A-Z][a-zA-Z0-9_$]*)\s*(?:=\s*)?(?:\([^)]*\{([^}]+)\}[^)]*\)|:\s*React\.FC<([a-zA-Z0-9_$]+)>|\s*\()/g;
  let fcm;
  while ((fcm = funcCompRegex.exec(code)) !== null) {
    const compName = fcm[1];
    const destructuredParams = fcm[2];
    const typedInterface = fcm[3];

    let requiredProps = [];
    let optionalProps = [];
    let neverProps = [];

    if (destructuredParams) {
      const rawProps = splitTopLevelCommas(destructuredParams);
      for (const p of rawProps) {
        const clean = p.trim();
        if (!clean || clean.startsWith("...")) continue; // rest props ...rest

        const defIdx = clean.indexOf("=");
        if (defIdx !== -1) {
          // Имеется значение по умолчанию -> prop опциональный
          const propName = clean.substring(0, defIdx).trim();
          optionalProps.push(propName);
        } else {
          // Нет значения по умолчанию -> обязательный prop
          const propName = clean.trim();
          if (propName && propName !== "children") {
            requiredProps.push(propName);
          }
        }
      }
    }

    if (typedInterface && interfacePropsMap[typedInterface]) {
      requiredProps = Array.from(new Set([...requiredProps, ...interfacePropsMap[typedInterface].required]));
      optionalProps = Array.from(new Set([...optionalProps, ...interfacePropsMap[typedInterface].optional]));
      neverProps = Array.from(new Set([...neverProps, ...(interfacePropsMap[typedInterface].neverProps || [])]));
    }

    // Если интерфейс назван ${compName}Props
    const standardIfName = `${compName}Props`;
    if (interfacePropsMap[standardIfName]) {
      requiredProps = Array.from(new Set([...requiredProps, ...interfacePropsMap[standardIfName].required]));
      optionalProps = Array.from(new Set([...optionalProps, ...interfacePropsMap[standardIfName].optional]));
      neverProps = Array.from(new Set([...neverProps, ...(interfacePropsMap[standardIfName].neverProps || [])]));
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

/**
 * Валидирует вызовы компонентов в JSX на наличие пропущенных обязательных пропсов
 * и атрибуты доступности стандартных тегов (<img>, <a>)
 * @param {string} code
 * @param {Object} options
 * @returns {Array<{ line: number, col: number, message: string, rule: string, severity: 'error' | 'warning' }>}
 */
export function checkComponentProps(code, options = {}) {
  const problems = [];
  if (!code || typeof code !== "string") return problems;

  // 1. Собираем контракты компонентов из текущего файла и связанных файлов задачи
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

    // Игнорируем закомментированные строки
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("//") || trimmedLine.startsWith("/*") || trimmedLine.startsWith("*")) {
      continue;
    }

    // 2. Поиск вызовов JSX компонентов: <Button ... /> или <Card ... >
    // Ищем теги, начинающиеся с заглавной буквы
    const jsxTagRegex = /<([A-Z][a-zA-Z0-9_$]*)\b([^>]*?)(\/?>)/g;
    let jm;
    while ((jm = jsxTagRegex.exec(line)) !== null) {
      const compName = jm[1];
      const attrStr = jm[2] || "";
      const col = jm.index + 1;

      // Если в атрибутах есть спред-оператор {...props}, пропускаем проверку (пропсы могут прийти через спред)
      if (attrStr.includes("{...")) {
        continue;
      }

      const contract = allContracts[compName];
      if (contract) {
        // Парсим переданные пропсы в вызове
        const passedProps = new Set();
        const propRegex = /([a-zA-Z0-9_$]+)(?:=|\s|$)/g;
        let pm;
        while ((pm = propRegex.exec(attrStr)) !== null) {
          const propKey = pm[1];
          if (propKey && propKey !== "className" && propKey !== "style" && propKey !== "key") {
            passedProps.add(propKey);
          }
        }

        // Проверяем never props (взаимоисключающие пропсы)
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

        // Проверяем отсутствующие обязательные пропсы
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

    // 3. Проверка тега <img> на наличие атрибутов src и alt
    const imgRegex = /<img\b([^>]*?)(\/?>)/g;
    let imgM;
    while ((imgM = imgRegex.exec(line)) !== null) {
      const attrStr = imgM[1] || "";
      const col = imgM.index + 1;
      const hasSrc = /\bsrc\s*=\s*/.test(attrStr);
      const hasAlt = /\balt\s*=\s*/.test(attrStr);

      if (!hasSrc || !hasAlt) {
        const missingAttrs = [];
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

    // 4. Проверка ссылки <a target="_blank"> на наличие rel="noreferrer" / "noopener"
    const aRegex = /<a\b([^>]*?)(\/?>)/g;
    let aM;
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
