import React from "react";
import { highlightJS } from "../../utils/codeHighlighter";

export const SyntaxHighlighter = ({ code, className = "", style = {} }) => {
  if (!code) return null;
  
  const highlighted = highlightJS(code);

  return (
    <pre className={`code-preview-block ${className}`} style={style}>
      <code dangerouslySetInnerHTML={{ __html: highlighted }} />
    </pre>
  );
};

export default SyntaxHighlighter;
