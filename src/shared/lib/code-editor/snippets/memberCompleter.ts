import { fuzzyMatch } from "../fuzzyMatcher";
import {
  JS_MEMBER_COMPLETIONS,
  REACT_CSS_PROPERTIES,
  TS_GENERIC_TYPE_SUGGESTIONS,
  isTypeScriptGenericContext,
  CompletionItem,
} from "../snippetsData";

export function getMemberCompletions(
  cursorIndex: number,
  currentLineBeforeCursor: string,
  lineAfterCursor: string
): { word: string; items: CompletionItem[] } | null {
  const memberMatch = currentLineBeforeCursor.match(
    /(?:([a-zA-Z0-9_$]+|\)|\]|\})\s*(?:\.|\?\.)\s*([a-zA-Z0-9_$]*))$/
  );
  if (memberMatch) {
    const rawReceiver = memberMatch[1];
    const memberQuery = memberMatch[2] || "";
    const receiverLower = rawReceiver.toLowerCase();

    let candidateMembers: Array<{
      label: string;
      insertText: string;
      detail: string;
      kind: string;
    }> = [];

    if (receiverLower === "console") {
      candidateMembers = JS_MEMBER_COMPLETIONS.console;
    } else if (receiverLower === "react") {
      candidateMembers = JS_MEMBER_COMPLETIONS.react;
    } else if (receiverLower === "reactdom") {
      candidateMembers = JS_MEMBER_COMPLETIONS.reactdom;
    } else if (receiverLower === "math") {
      candidateMembers = JS_MEMBER_COMPLETIONS.math;
    } else if (receiverLower === "json") {
      candidateMembers = JS_MEMBER_COMPLETIONS.json;
    } else if (receiverLower === "promise") {
      candidateMembers = JS_MEMBER_COMPLETIONS.promise;
    } else if (["e", "event", "evt"].includes(receiverLower)) {
      candidateMembers = JS_MEMBER_COMPLETIONS.event;
    } else if (receiverLower === "target") {
      candidateMembers = JS_MEMBER_COMPLETIONS.target;
    } else if (
      rawReceiver === "]" ||
      /list|items|arr|array|users|todos|tasks|data|rows|elements/i.test(rawReceiver)
    ) {
      candidateMembers = [
        ...JS_MEMBER_COMPLETIONS.array,
        ...JS_MEMBER_COMPLETIONS.object.filter(
          (o) => o.label === "hasOwnProperty" || o.label === "toString"
        ),
      ];
    } else if (/str|string|text|name|title|msg|val|value|url/i.test(rawReceiver)) {
      candidateMembers = [
        ...JS_MEMBER_COMPLETIONS.string,
        ...JS_MEMBER_COMPLETIONS.object.filter(
          (o) => o.label === "hasOwnProperty" || o.label === "toString"
        ),
      ];
    } else {
      candidateMembers = [
        ...JS_MEMBER_COMPLETIONS.array,
        ...JS_MEMBER_COMPLETIONS.string.filter(
          (s) => !["length", "slice", "includes"].includes(s.label)
        ),
        ...JS_MEMBER_COMPLETIONS.object,
      ];
    }

    const scoredMembers: CompletionItem[] = [];
    const afterMemberMatch = lineAfterCursor.match(/^[a-zA-Z0-9_$]*/);
    const afterMemberLen = afterMemberMatch ? afterMemberMatch[0].length : 0;

    for (const mem of candidateMembers) {
      const { match, score } = fuzzyMatch(mem.label, memberQuery);
      if (match || !memberQuery) {
        const rawInsert = mem.insertText.replace(/\$1/g, "").replace(/\$2/g, "");
        scoredMembers.push({
          prefix: mem.label,
          label: mem.label,
          detail: mem.detail,
          kind: mem.kind,
          insertText: rawInsert,
          replaceStart: cursorIndex - memberQuery.length,
          replaceEnd: cursorIndex + afterMemberLen,
          score,
        });
      }
    }

    if (scoredMembers.length > 0) {
      scoredMembers.sort((a, b) => (b.score || 0) - (a.score || 0));
      const seen = new Set<string>();
      const uniqueMembers: CompletionItem[] = [];
      for (const m of scoredMembers) {
        if (!seen.has(m.label)) {
          seen.add(m.label);
          uniqueMembers.push(m);
        }
      }
      return {
        word: memberQuery || ".",
        items: uniqueMembers.slice(0, 12),
      };
    }
  }

  // CSS Properties in style={{ ... }}
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
          scoredCss.push({
            prefix: prop.label,
            label: prop.label,
            detail: prop.detail,
            kind: prop.kind,
            insertText: prop.insertText,
            replaceStart: cursorIndex - cssQuery.length,
            replaceEnd: cursorIndex + afterCssLen,
            score: score + 15,
          });
        }
      }

      if (scoredCss.length > 0) {
        scoredCss.sort((a, b) => (b.score || 0) - (a.score || 0));
        return {
          word: cssQuery || "style",
          items: scoredCss.slice(0, 12),
        };
      }
    }
  }

  // TypeScript Generics
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
          const cleanInsert = item.insertText.replace(/\$1/g, "").replace(/\$2/g, "");
          scoredGen.push({
            prefix: item.name,
            label: item.label,
            detail: item.detail,
            kind: "type",
            insertText: cleanInsert,
            replaceStart: cursorIndex - genQuery.length,
            replaceEnd: cursorIndex + afterGenLen,
            score: score + 12,
          });
        }
      }

      if (scoredGen.length > 0) {
        scoredGen.sort((a, b) => (b.score || 0) - (a.score || 0));
        return {
          word: genQuery || "<",
          items: scoredGen.slice(0, 12),
        };
      }
    }
  }

  return null;
}
