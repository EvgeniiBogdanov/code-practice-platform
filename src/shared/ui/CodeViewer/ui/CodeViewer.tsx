import React, { useMemo } from "react";
import { highlightCode } from "../../../lib/code-editor";
import { cleanCode, getLanguageMeta } from "../lib";
import { CodeWindow, CodeWindowPre } from "./CodeWindow";
import { CodeViewerProps } from "../types";

const escapeHtmlChar = (str: string): string =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const CodeViewer = ({
  code = "",
  language = "notepad",
  className,
  showLineNumbers = true,
}: CodeViewerProps): React.JSX.Element => {
  const normalizedCode = useMemo(() => cleanCode(code), [code]);
  const linesCount = useMemo(() => normalizedCode.split("\n").length, [normalizedCode]);
  const langMeta = useMemo(() => getLanguageMeta(language), [language]);

  const highlightedHtml = useMemo(() => {
    if (langMeta.isNotepad) {
      return escapeHtmlChar(normalizedCode || "// Текст отсутствует");
    }
    return highlightCode(normalizedCode || "// Код отсутствует", language);
  }, [normalizedCode, language, langMeta.isNotepad]);

  return (
    <CodeWindow
      language={language}
      code={normalizedCode}
      linesCount={linesCount}
      showLineNumbers={showLineNumbers}
      className={className}
    >
      <CodeWindowPre>
        <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
      </CodeWindowPre>
    </CodeWindow>
  );
};
