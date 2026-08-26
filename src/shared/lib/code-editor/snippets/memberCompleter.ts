/**
 * Member & Receiver & CSS in JS Completer
 */

import { fuzzyMatch } from "../fuzzyMatcher";
import { JS_MEMBER_COMPLETIONS } from "../languages/javascriptKnowledge";
import { REACT_CSS_PROPERTIES, REACT_MEMBER_COMPLETIONS } from "../languages/reactKnowledge";
import { TS_GENERIC_TYPE_SUGGESTIONS } from "../languages/typescriptKnowledge";
import { isTypeScriptGenericContext, CompletionItem } from "../snippetsData";
import { LanguageCapabilities } from "../languages/languageTypes";

function resolveCandidateMembers(
  rawReceiver: string,
  capabilities: LanguageCapabilities
): Array<{ label: string; insertText: string; detail: string; kind: string }> {
  const receiverLower = rawReceiver.toLowerCase();

  if (receiverLower === "console") return JS_MEMBER_COMPLETIONS.console;
  if (receiverLower === "math") return JS_MEMBER_COMPLETIONS.math;
  if (receiverLower === "json") return JS_MEMBER_COMPLETIONS.json;
  if (receiverLower === "promise") return JS_MEMBER_COMPLETIONS.promise;
  if (["e", "event", "evt"].includes(receiverLower)) return JS_MEMBER_COMPLETIONS.event;
  if (receiverLower === "target") return JS_MEMBER_COMPLETIONS.target;

  if (capabilities.supportsReactHooks) {
    if (receiverLower === "react") return REACT_MEMBER_COMPLETIONS.react;
    if (receiverLower === "reactdom") return REACT_MEMBER_COMPLETIONS.reactdom;
  }

  if (
    rawReceiver === "]" ||
    /list|items|arr|array|users|todos|tasks|data|rows|elements/i.test(rawReceiver)
  ) {
    return [
      ...JS_MEMBER_COMPLETIONS.array,
      ...JS_MEMBER_COMPLETIONS.object.filter(
        (o) => o.label === "hasOwnProperty" || o.label === "toString"
      ),
    ];
  }

  if (/str|string|text|name|title|msg|val|value|url/i.test(rawReceiver)) {
    return [
      ...JS_MEMBER_COMPLETIONS.string,
      ...JS_MEMBER_COMPLETIONS.object.filter(
        (o) => o.label === "hasOwnProperty" || o.label === "toString"
      ),
    ];
  }

  return [
    ...JS_MEMBER_COMPLETIONS.array,
    ...JS_MEMBER_COMPLETIONS.string.filter(
      (s) => !["length", "slice", "includes"].includes(s.label)
    ),
    ...JS_MEMBER_COMPLETIONS.object,
  ];
}

export function getMemberCompletions(
  cursorIndex: number,
  currentLineBeforeCursor: string,
  lineAfterCursor: string,
  capabilities: LanguageCapabilities
): { word: string; items: CompletionItem[] } | null {
  const memberMatch = currentLineBeforeCursor.match(
    /(?:([a-zA-Z0-9_$]+|\)|\]|\})\s*(?:\.|\?\.)\s*([a-zA-Z0-9_$]*))$/
  );

  if (memberMatch) {
    const rawReceiver = memberMatch[1];
    const memberQuery = memberMatch[2] || "";
    const candidateMembers = resolveCandidateMembers(rawReceiver, capabilities);

    const scoredMembers: CompletionItem[] = [];
    const afterMemberMatch = lineAfterCursor.match(/^[a-zA-Z0-9_$]*/);
    const afterMemberLen = afterMemberMatch ? afterMemberMatch[0].length : 0;

    for (const mem of candidateMembers) {
      const { match, score } = fuzzyMatch(mem.label, memberQuery);
      if (match || !memberQuery) {
        const tabStopIdx = mem.insertText.indexOf("$1");
        const rawInsert = mem.insertText.replace(/\$1/g, "").replace(/\$2/g, "");
        const cursorOffset = tabStopIdx >= 0 ? tabStopIdx : undefined;
        scoredMembers.push({
          prefix: mem.label,
          label: mem.label,
          detail: mem.detail,
          kind: mem.kind,
          insertText: rawInsert,
          cursorOffset,
          replaceStart: cursorIndex - memberQuery.length,
          replaceEnd: cursorIndex + afterMemberLen,
          score,
        });
      }
    }

    if (scoredMembers.length > 0) {
      scoredMembers.sort((a, b) => (b.score || 0) - (a.score || 0));
      const seen = new Set<string>();
      const uniqueMembers = scoredMembers.filter((m) => !seen.has(m.label) && seen.add(m.label));
      return { word: memberQuery || ".", items: uniqueMembers.slice(0, 12) };
    }
  }

  // CSS Properties in style={{ ... }} (only if React JSX style is supported)
  if (capabilities.supportsCssProperties && capabilities.supportsJsx) {
    const inStyleMatch = currentLineBeforeCursor.match(/style=\{\{\s*([^}]*?)$/);
    if (inStyleMatch) {
      const styleContent = inStyleMatch[1];
      const cssPropMatch = styleContent.match(/(?:^|[,;])\s*([a-zA-Z0-9_$]*)$/);
      if (cssPropMatch) {
        const cssQuery = cssPropMatch[1] || "";
        const afterCssMatch = lineAfterCursor.match(/^[a-zA-Z0-9_$]*/);
        const afterCssLen = afterCssMatch ? afterCssMatch[0].length : 0;
        const scoredCss: CompletionItem[] = [];

        for (const prop of REACT_CSS_PROPERTIES) {
          const { match, score } = fuzzyMatch(prop.label, cssQuery);
          if (match || !cssQuery) {
            const tabStopIdx = prop.insertText.indexOf("$1");
            const cleanInsert = prop.insertText.replace(/\$1/g, "").replace(/\$2/g, "");
            const cursorOffset = tabStopIdx >= 0 ? tabStopIdx : undefined;
            scoredCss.push({
              prefix: prop.label,
              label: prop.label,
              detail: prop.detail,
              kind: prop.kind,
              insertText: cleanInsert,
              cursorOffset,
              replaceStart: cursorIndex - cssQuery.length,
              replaceEnd: cursorIndex + afterCssLen,
              score: score + 15,
            });
          }
        }

        if (scoredCss.length > 0) {
          scoredCss.sort((a, b) => (b.score || 0) - (a.score || 0));
          return { word: cssQuery || "style", items: scoredCss.slice(0, 12) };
        }
      }
    }
  }

  // TypeScript Generics (only if TS is supported)
  if (capabilities.supportsTypeScript) {
    const isGenericContext = isTypeScriptGenericContext(currentLineBeforeCursor);
    if (isGenericContext) {
      const genericArgMatch = currentLineBeforeCursor.match(/(?:<|,|\||&)\s*([a-zA-Z0-9_$'"]*)$/);
      if (genericArgMatch) {
        const genQuery = genericArgMatch[1] || "";
        const afterGenMatch = lineAfterCursor.match(/^[a-zA-Z0-9_$'"]*/);
        const afterGenLen = afterGenMatch ? afterGenMatch[0].length : 0;
        const scoredGen: CompletionItem[] = [];

        for (const item of TS_GENERIC_TYPE_SUGGESTIONS) {
          const { match, score } = fuzzyMatch(item.name, genQuery);
          if (match || !genQuery) {
            const tabStopIdx = item.insertText.indexOf("$1");
            const cleanInsert = item.insertText.replace(/\$1/g, "").replace(/\$2/g, "");
            const cursorOffset = tabStopIdx >= 0 ? tabStopIdx : undefined;
            scoredGen.push({
              prefix: item.name,
              label: item.label,
              detail: item.detail,
              kind: "type",
              insertText: cleanInsert,
              cursorOffset,
              replaceStart: cursorIndex - genQuery.length,
              replaceEnd: cursorIndex + afterGenLen,
              score: score + 12,
            });
          }
        }

        if (scoredGen.length > 0) {
          scoredGen.sort((a, b) => (b.score || 0) - (a.score || 0));
          return { word: genQuery || "<", items: scoredGen.slice(0, 12) };
        }
      }
    }
  }

  return null;
}
