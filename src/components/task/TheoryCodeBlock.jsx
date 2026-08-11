import React, { useState, useMemo } from "react";
import { FileCode, FileText, Copy, Check } from "lucide-react";
import { highlightJS } from "../../utils/codeHighlighter";

const escapeHtmlChar = (str) =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const TheoryCodeBlock = ({ code = "", language = "notepad" }) => {
  const [copied, setCopied] = useState(false);

  const cleanCode = useMemo(() => {
    if (!code) return "";
    return code.replace(/\r\n/g, "\n").trim();
  }, [code]);

  const lines = useMemo(() => cleanCode.split("\n"), [cleanCode]);

  const langInfo = useMemo(() => {
    const langLower = (language || "notepad").trim().toLowerCase();

    if (
      langLower === "notepad" ||
      langLower === "text" ||
      langLower === "plaintext" ||
      langLower === "txt" ||
      langLower === "none"
    ) {
      return { name: "Notepad", color: "#94a3b8", isNotepad: true };
    }
    if (langLower === "jsx" || langLower === "react") {
      return { name: "React JSX", color: "#61dafb", isNotepad: false };
    }
    if (langLower === "tsx") {
      return { name: "React TSX", color: "#61dafb", isNotepad: false };
    }
    if (langLower === "ts" || langLower === "typescript") {
      return { name: "TypeScript", color: "#3178c6", isNotepad: false };
    }
    if (langLower === "html") {
      return { name: "HTML", color: "#e34c26", isNotepad: false };
    }
    if (langLower === "css") {
      return { name: "CSS", color: "#38bdf8", isNotepad: false };
    }
    if (langLower === "json") {
      return { name: "JSON", color: "#a855f7", isNotepad: false };
    }
    if (langLower === "bash" || langLower === "sh" || langLower === "shell") {
      return { name: "Shell", color: "#10b981", isNotepad: false };
    }
    if (langLower === "js" || langLower === "javascript") {
      return { name: "JavaScript", color: "#f59e0b", isNotepad: false };
    }

    return {
      name: langLower.charAt(0).toUpperCase() + langLower.slice(1),
      color: "#94a3b8",
      isNotepad: false,
    };
  }, [language]);

  const highlightedHtml = useMemo(() => {
    if (langInfo.isNotepad) {
      return escapeHtmlChar(cleanCode || "// Текст отсутствует");
    }
    return highlightJS(cleanCode || "// Код отсутствует");
  }, [cleanCode, langInfo.isNotepad]);

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
          {langInfo.isNotepad ? (
            <FileText size={13} style={{ color: langInfo.color, flexShrink: 0 }} />
          ) : (
            <FileCode size={13} style={{ color: langInfo.color, flexShrink: 0 }} />
          )}
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
