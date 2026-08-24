/**
 * Type Signatures & Hover Engine
 */

import { TYPE_SIGNATURES, TypeSignatureInfo, TypeSignatureParam } from "./typeSignaturesData";
import { getLanguageId, getLanguageCapabilities } from "./languages/languageDetector";

export { TYPE_SIGNATURES };
export type { TypeSignatureInfo, TypeSignatureParam };

export interface HoverInfo extends Partial<TypeSignatureInfo> {
  symbol: string;
  documentation?: string;
}

export interface SignatureHelpInfo {
  functionName: string;
  signature: string;
  description: string;
  module: string;
  parameters: TypeSignatureParam[];
  activeParameter: number;
  returns?: string;
}

export type SignatureHelpResult = SignatureHelpInfo | null;

export function getHoverInfo(
  wordOrCode: string,
  codeOrOffset?: string | number,
  _cursorIndex?: number,
  context: { filepath?: string } = {}
): HoverInfo | null {
  if (!wordOrCode || typeof wordOrCode !== "string") return null;

  const filepath = context.filepath || "main.jsx";
  const languageId = getLanguageId(filepath);
  const capabilities = getLanguageCapabilities(languageId);

  let word = wordOrCode;
  let code = typeof codeOrOffset === "string" ? codeOrOffset : undefined;

  if (typeof codeOrOffset === "number") {
    code = wordOrCode;
    const offset = codeOrOffset;
    const wordMatch = code.slice(0, offset).match(/([a-zA-Z_$][a-zA-Z0-9_$]*)$/);
    if (wordMatch) {
      word = wordMatch[1];
    } else {
      return null;
    }
  }

  const cleanWord = word.trim();
  const strippedReact = cleanWord.replace(/^React\./, "");

  const matchedSig = TYPE_SIGNATURES[cleanWord] || TYPE_SIGNATURES[strippedReact];
  if (matchedSig) {
    // If it's a React signature but environment doesn't support React, check if React is imported
    if (matchedSig.module === "react" && !capabilities.supportsReactHooks) {
      const hasReactImport =
        code && (code.includes("from 'react'") || code.includes('from "react"'));
      if (!hasReactImport) {
        return null;
      }
    }
    return {
      symbol: cleanWord,
      documentation: matchedSig.description,
      ...matchedSig,
    };
  }

  if (code) {
    const fnRegex = new RegExp(
      `(?:function\\s+${cleanWord}\\s*\\(([^)]*)\\)|const\\s+${cleanWord}\\s*=\\s*(?:\\(([^)]*)\\)|([a-zA-Z0-9_$]+))\\s*=>)`
    );
    const fnMatch = fnRegex.exec(code);
    if (fnMatch) {
      const params = fnMatch[1] || fnMatch[2] || fnMatch[3] || "";
      return {
        symbol: cleanWord,
        signature: `function ${cleanWord}(${params}): any`,
        description: `Локальная функция, объявленная в текущем файле.`,
        documentation: `Локальная функция, объявленная в текущем файле.`,
        module: "local",
        parameters: params
          ? params.split(",").map((p) => ({ name: p.trim(), type: "any", doc: "" }))
          : [],
      };
    }
  }

  return null;
}

export function getSignatureHelp(
  code: string,
  cursorIndex: number,
  options: { filepath?: string } = {}
): SignatureHelpInfo | null {
  if (!code || cursorIndex <= 0 || cursorIndex > code.length) return null;

  const filepath = options.filepath || "main.jsx";
  const languageId = getLanguageId(filepath);
  const capabilities = getLanguageCapabilities(languageId);

  const textBefore = code.substring(0, cursorIndex);
  const searchStart = Math.max(0, textBefore.lastIndexOf("\n", Math.max(0, cursorIndex - 300)));
  const relevantText = textBefore.substring(searchStart);

  const callStack: Array<{
    name: string;
    parenDepth: number;
    braceDepth: number;
    bracketDepth: number;
    commaCount: number;
  }> = [];
  let inString: string | null = null;
  let inComment = false;

  for (let i = 0; i < relevantText.length; i++) {
    const ch = relevantText[i];
    const nextCh = relevantText[i + 1];

    if (inComment) {
      if (ch === "*" && nextCh === "/") {
        inComment = false;
        i++;
      }
      continue;
    }

    if (inString) {
      if (ch === "\\" && nextCh) {
        i++;
      } else if (ch === inString) {
        inString = null;
      }
      continue;
    }

    if (ch === "/" && nextCh === "/") {
      const nl = relevantText.indexOf("\n", i);
      if (nl === -1) break;
      i = nl;
      continue;
    }

    if (ch === "/" && nextCh === "*") {
      inComment = true;
      i++;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      inString = ch;
      continue;
    }

    if (ch === "(") {
      const beforeParen = relevantText.substring(0, i).trimEnd();
      const fnMatch = beforeParen.match(/([a-zA-Z0-9_$]+)(?:<[^>]*>)?$/);
      const isControlFlow =
        fnMatch && ["if", "for", "while", "switch", "catch"].includes(fnMatch[1]);

      if (fnMatch && !isControlFlow) {
        callStack.push({
          name: fnMatch[1],
          parenDepth: 1,
          braceDepth: 0,
          bracketDepth: 0,
          commaCount: 0,
        });
      } else if (callStack.length > 0) {
        callStack[callStack.length - 1].parenDepth++;
      }
      continue;
    }

    if (callStack.length === 0) continue;

    const currentCall = callStack[callStack.length - 1];

    if (ch === ")") {
      currentCall.parenDepth--;
      if (currentCall.parenDepth === 0) {
        callStack.pop();
      }
    } else if (ch === "{") {
      currentCall.braceDepth++;
    } else if (ch === "}") {
      if (currentCall.braceDepth > 0) currentCall.braceDepth--;
    } else if (ch === "[") {
      currentCall.bracketDepth++;
    } else if (ch === "]") {
      if (currentCall.bracketDepth > 0) currentCall.bracketDepth--;
    } else if (ch === ",") {
      if (
        currentCall.parenDepth === 1 &&
        currentCall.braceDepth === 0 &&
        currentCall.bracketDepth === 0
      ) {
        currentCall.commaCount++;
      }
    }
  }

  if (callStack.length === 0) return null;

  const activeCall = callStack[callStack.length - 1];
  const functionName = activeCall.name;
  const typeInfo = TYPE_SIGNATURES[functionName];
  if (!typeInfo || !Array.isArray(typeInfo.parameters)) return null;

  if (typeInfo.module === "react" && !capabilities.supportsReactHooks) {
    const hasReactImport = code.includes("from 'react'") || code.includes('from "react"');
    if (!hasReactImport) {
      return null;
    }
  }

  return {
    functionName,
    signature: typeInfo.signature,
    description: typeInfo.description,
    module: typeInfo.module,
    parameters: typeInfo.parameters,
    activeParameter: activeCall.commaCount,
    returns: typeInfo.returns,
  };
}
