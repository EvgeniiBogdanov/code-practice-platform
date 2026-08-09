import React, { useState, useMemo } from "react";
import { FileCode, Copy, Check } from "lucide-react";
import { highlightJS } from "../../utils/codeHighlighter";

export const TheoryCodeBlock = ({ code = "", language = "javascript" }) => {
  const [copied, setCopied] = useState(false);

  const cleanCode = useMemo(() => {
    if (!code) return "";
    return code.replace(/\r\n/g, "\n").trim();
  }, [code]);

  const lines = useMemo(() => cleanCode.split("\n"), [cleanCode]);

  const langInfo = useMemo(() => {
    const langLower = (language || "javascript").toLowerCase();

    if (langLower === "jsx" || langLower === "react") {
      return { name: "React JSX", color: "#61dafb" };
    }
    if (langLower === "tsx") {
      return { name: "React TSX", color: "#61dafb" };
    }
    if (langLower === "ts" || langLower === "typescript") {
      return { name: "TypeScript", color: "#3178c6" };
    }
    if (langLower === "html") {
      return { name: "HTML", color: "#e34c26" };
    }
    if (langLower === "css") {
      return { name: "CSS", color: "#38bdf8" };
    }
    if (langLower === "json") {
      return { name: "JSON", color: "#a855f7" };
    }
    if (langLower === "bash" || langLower === "sh" || langLower === "shell") {
      return { name: "Shell", color: "#10b981" };
    }

    const isReactCode =
      /<[a-zA-Z0-9_]+(\s+[^>]*|\s*\/)?>|<\/[a-zA-Z0-9_]+>|<>/m.test(cleanCode) ||
      /import\s+.*React|from\s+['"]react['"]|export\s+default\s+function/m.test(cleanCode);

    if (isReactCode) {
      return { name: "React JSX", color: "#61dafb" };
    }

    return { name: "JavaScript", color: "#f59e0b" };
  }, [language, cleanCode]);

  const highlightedHtml = useMemo(() => {
    return highlightJS(cleanCode || "// Код отсутствует");
  }, [cleanCode]);

  const handleCopy = () => {
    if (!cleanCode) return;
    navigator.clipboard.writeText(cleanCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="theory-code-editor"
      style={{ margin: "16px 0" }}
    >
      {/* Шапка редактора: Формат файла */}
      <div className="vscode-editor-header">
        <div className="vscode-editor-single-file">
          <FileCode size={13} style={{ color: langInfo.color, flexShrink: 0 }} />
          <span className="file-tab-name" style={{ fontWeight: 500 }}>
            {langInfo.name}
          </span>
        </div>
      </div>

      {/* Поверхность редактора с номерами строк, аккуратной иконкой скопировать без текста (вверху справа в самом коде) и подсвеченным кодом */}
      <div className="vscode-editor-surface wrap-off">
        {(() => {
          const digits = String(Math.max(lines.length, 1)).length;
          const dynamicGutterWidth = Math.max(32, 20 + digits * 9);

          return (
            <div
              className="vscode-gutter"
              aria-hidden="true"
              style={{ width: `${dynamicGutterWidth}px`, minWidth: `${dynamicGutterWidth}px` }}
            >
              {lines.map((_, i) => (
                <div key={i} className="vscode-gutter-line">
                  {i + 1}
                </div>
              ))}
            </div>
          );
        })()}

        <div className="vscode-canvas" style={{ position: "relative" }}>
          {/* Notion-style плавающая иконка скопировать без текста вверху справа */}
          <button
            type="button"
            className={`notion-code-copy-btn ${copied ? "copied" : ""}`}
            onClick={handleCopy}
            title={copied ? "Скопировано в буфер обмена" : "Скопировать код"}
            aria-label="Скопировать код"
          >
            {copied ? (
              <Check size={13} style={{ color: "#34d399" }} />
            ) : (
              <Copy size={13} />
            )}
          </button>

          <pre className="vscode-pre-only">
            <code
              dangerouslySetInnerHTML={{
                __html: highlightedHtml,
              }}
            />
          </pre>
        </div>
      </div>
    </div>
  );
};

export default TheoryCodeBlock;
