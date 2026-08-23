/**
 * Emmet Abbreviation Parser & Generator for React JSX / TSX
 */

const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

interface EmmetNode {
  tag: string;
  id: string;
  classNames: string[];
  attributes: Record<string, string | boolean>;
  text: string;
  children: EmmetNode[];
}

interface EmmetRoot {
  children: EmmetNode[];
}

function parseAtomicTag(token: string, itemIndex = 1): Omit<EmmetNode, "children"> {
  let rest = token;
  let text = "";

  const textMatch = rest.match(/\{([^}]*)\}/);
  if (textMatch) {
    text = textMatch[1].replace(/\$/g, String(itemIndex));
    rest = rest.replace(/\{[^}]*\}/, "");
  }

  const attributes: Record<string, string | boolean> = {};
  const attrMatch = rest.match(/\[([^\]]*)\]/);
  if (attrMatch) {
    const rawAttrs = attrMatch[1];
    rest = rest.replace(/\[[^\]]*\]/, "");

    const attrRegex = /([a-zA-Z0-9_-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^,\s\]]+)))?/g;
    let am: RegExpExecArray | null;
    while ((am = attrRegex.exec(rawAttrs)) !== null) {
      const attrName = am[1] === "class" ? "className" : am[1];
      const val =
        am[2] !== undefined
          ? am[2]
          : am[3] !== undefined
            ? am[3]
            : am[4] !== undefined
              ? am[4]
              : true;
      attributes[attrName] = typeof val === "string" ? val.replace(/\$/g, String(itemIndex)) : val;
    }
  }

  let tag = "div";
  const tagMatch = rest.match(/^([a-zA-Z0-9_-]+)/);
  if (tagMatch) {
    tag = tagMatch[1];
    rest = rest.substring(tag.length);
  }

  let id = "";
  const classNames: string[] = [];

  const modifierRegex = /([.#])([a-zA-Z0-9_$-]+)/g;
  let mm: RegExpExecArray | null;
  while ((mm = modifierRegex.exec(rest)) !== null) {
    const symbol = mm[1];
    const val = mm[2].replace(/\$/g, String(itemIndex));
    if (symbol === "#") {
      id = val;
    } else if (symbol === ".") {
      classNames.push(val);
    }
  }

  return {
    tag,
    id,
    classNames,
    attributes,
    text,
  };
}

export function parseEmmet(abbr: string): EmmetRoot | null {
  if (!abbr || typeof abbr !== "string") return null;

  const root: EmmetRoot = { children: [] };
  let currentParent: EmmetRoot | EmmetNode = root;
  const parentStack: Array<EmmetRoot | EmmetNode> = [root];

  let i = 0;
  let currentToken = "";

  const pushToken = (): EmmetNode | null => {
    if (!currentToken.trim()) return null;

    let count = 1;
    const multMatch = currentToken.match(/\*(\d+)$/);
    let baseToken = currentToken;
    if (multMatch) {
      count = Math.min(parseInt(multMatch[1], 10) || 1, 50);
      baseToken = currentToken.substring(0, multMatch.index);
    }

    const nodeGroup: EmmetNode[] = [];
    for (let c = 1; c <= count; c++) {
      const parsed = parseAtomicTag(baseToken, c);
      nodeGroup.push({
        ...parsed,
        children: [],
      });
    }

    for (const node of nodeGroup) {
      currentParent.children.push(node);
    }

    return nodeGroup[nodeGroup.length - 1] || null;
  };

  let lastNode: EmmetNode | null = null;

  while (i < abbr.length) {
    const ch = abbr[i];

    if (ch === "{") {
      const closeIdx = abbr.indexOf("}", i);
      if (closeIdx === -1) {
        currentToken += abbr.slice(i);
        break;
      }
      currentToken += abbr.slice(i, closeIdx + 1);
      i = closeIdx + 1;
      continue;
    }

    if (ch === "[") {
      const closeIdx = abbr.indexOf("]", i);
      if (closeIdx === -1) {
        currentToken += abbr.slice(i);
        break;
      }
      currentToken += abbr.slice(i, closeIdx + 1);
      i = closeIdx + 1;
      continue;
    }

    if (ch === ">") {
      lastNode = pushToken();
      if (lastNode) {
        parentStack.push(currentParent);
        currentParent = lastNode;
      }
      currentToken = "";
      i++;
      continue;
    }

    if (ch === "+") {
      pushToken();
      currentToken = "";
      i++;
      continue;
    }

    if (ch === "^") {
      pushToken();
      if (parentStack.length > 1) {
        currentParent = parentStack.pop()!;
      }
      currentToken = "";
      i++;
      continue;
    }

    currentToken += ch;
    i++;
  }

  pushToken();
  return root;
}

function renderNodeToJSX(node: EmmetNode, indentLevel = 0, indentStr = "  "): string {
  const currentIndent = indentStr.repeat(indentLevel);
  const { tag, id, classNames, attributes, text, children } = node;

  const attrs: string[] = [];
  if (id) {
    attrs.push(`id="${id}"`);
  }
  if (classNames.length > 0) {
    attrs.push(`className="${classNames.join(" ")}"`);
  }
  for (const [k, v] of Object.entries(attributes)) {
    if (v === true) {
      attrs.push(k);
    } else {
      attrs.push(`${k}="${v}"`);
    }
  }

  const attrStr = attrs.length > 0 ? " " + attrs.join(" ") : "";
  const isVoid = VOID_TAGS.has(tag.toLowerCase());

  if (isVoid) {
    return `${currentIndent}<${tag}${attrStr} />`;
  }

  if (children.length === 0 && !text) {
    return `${currentIndent}<${tag}${attrStr}></${tag}>`;
  }

  if (children.length === 0 && text) {
    return `${currentIndent}<${tag}${attrStr}>${text}</${tag}>`;
  }

  const childLines: string[] = [];
  if (text) {
    childLines.push(indentStr.repeat(indentLevel + 1) + text);
  }
  for (const child of children) {
    childLines.push(renderNodeToJSX(child, indentLevel + 1, indentStr));
  }

  return `${currentIndent}<${tag}${attrStr}>\n${childLines.join("\n")}\n${currentIndent}</${tag}>`;
}

export function expandEmmetAbbreviation(abbr: string, baseIndent = ""): string | null {
  if (!isEmmetAbbreviation(abbr)) return null;

  try {
    const ast = parseEmmet(abbr.trim());
    if (!ast || !ast.children || ast.children.length === 0) return null;

    const lines = ast.children.map((child) => renderNodeToJSX(child, 0, "  "));
    const rendered = lines.join("\n");

    if (baseIndent) {
      return rendered
        .split("\n")
        .map((line, idx) => (idx === 0 ? line : baseIndent + line))
        .join("\n");
    }

    return rendered;
  } catch {
    return null;
  }
}

export function isEmmetAbbreviation(str: string): boolean {
  if (!str || typeof str !== "string") return false;
  const trimmed = str.trim();
  if (trimmed.length < 2) return false;

  if (
    /^(const|let|var|function|return|import|export|if|for|while|switch|class|type|interface)\b/.test(
      trimmed
    )
  ) {
    return false;
  }

  const hasEmmetMarker =
    /[.#>+*[{]/.test(trimmed) ||
    /^(div|span|button|input|p|h[1-6]|ul|ol|li|section|header|footer|nav|main|form|table|tr|td|th|select|option|a|img|label)$/.test(
      trimmed
    );

  if (!hasEmmetMarker) return false;

  const withoutStrings = trimmed.replace(/\{[^}]*\}/g, "").replace(/\[[^\]]*\]/g, "");
  if (/\s/.test(withoutStrings)) return false;

  return /^[a-zA-Z0-9_$.#:>+*^=$/-]+$/.test(withoutStrings);
}
