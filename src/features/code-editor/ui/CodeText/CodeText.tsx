import React, { useMemo } from "react";
import { highlightCode } from "@/shared/lib/code-editor";

export interface CodeTextProps {
  code: string;
  /** Names the language to colour; TypeScript quick info is the common case. */
  filepath?: string;
}

/** Inline code coloured with the editor's own syntax theme (hover and parameter hints). */
export const CodeText = ({
  code,
  filepath = "quick-info.ts",
}: CodeTextProps): React.JSX.Element => {
  // The highlighter escapes the text, so the markup it returns is safe to insert.
  const html = useMemo(() => highlightCode(code, filepath), [code, filepath]);
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};
