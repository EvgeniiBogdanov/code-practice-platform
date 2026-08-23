import React, { useMemo } from "react";
import { clsx } from "clsx";
import { highlightJS } from "../../../lib/code-editor";
import { cleanCode, calculateGutterWidth, getLanguageMeta } from "../lib";
import { CodeViewerHeader } from "./CodeViewerHeader";
import { CodeViewerGutter } from "./CodeViewerGutter";
import { CodeViewerCanvas } from "./CodeViewerCanvas";
import { CodeViewerProps } from "../types";
import styles from "../CodeViewer.module.css";

const escapeHtmlChar = (str: string): string =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const CodeViewer = ({
  code = "",
  language = "notepad",
  className,
  showLineNumbers = true,
}: CodeViewerProps) => {
  const normalizedCode = useMemo(() => cleanCode(code), [code]);
  const lines = useMemo(() => normalizedCode.split("\n"), [normalizedCode]);
  const langMeta = useMemo(() => getLanguageMeta(language), [language]);

  const highlightedHtml = useMemo(() => {
    if (langMeta.isNotepad) {
      return escapeHtmlChar(normalizedCode || "// Текст отсутствует");
    }
    return highlightJS(normalizedCode || "// Код отсутствует");
  }, [normalizedCode, langMeta.isNotepad]);

  const gutterWidth = useMemo(() => calculateGutterWidth(lines.length), [lines.length]);

  const containerClasses = clsx(styles.codeViewer, className);

  return (
    <div className={containerClasses}>
      <CodeViewerHeader
        langName={langMeta.name}
        color={langMeta.color}
        isNotepad={langMeta.isNotepad}
      />
      <div className={styles.surface}>
        {showLineNumbers && (
          <CodeViewerGutter linesCount={lines.length} gutterWidth={gutterWidth} />
        )}
        <CodeViewerCanvas highlightedHtml={highlightedHtml} cleanCode={normalizedCode} />
      </div>
    </div>
  );
};
