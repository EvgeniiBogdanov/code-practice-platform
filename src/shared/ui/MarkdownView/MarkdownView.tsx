import React, { useMemo, useCallback } from "react";
import { clsx } from "clsx";
import DOMPurify from "dompurify";
import { parseMarkdownBlocks, MarkdownBlock } from "../../lib/markdown";
import { CodeViewer } from "../CodeViewer";
import styles from "./MarkdownView.module.css";

export interface MarkdownViewProps {
  content?: string;
  blocks?: MarkdownBlock[];
  className?: string;
}

export const MarkdownView = ({ content, blocks: initialBlocks, className }: MarkdownViewProps) => {
  const blocks = useMemo(() => {
    if (initialBlocks && initialBlocks.length > 0) {
      return initialBlocks;
    }
    if (content) {
      return parseMarkdownBlocks(content);
    }
    return [];
  }, [content, initialBlocks]);

  const handleContainerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = (e.target as HTMLElement).closest("a");
    if (!target) return;

    const href = target.getAttribute("href");
    if (href && href.startsWith("#")) {
      e.preventDefault();
      const rawId = href.replace(/^#/, "");
      const decodedId = decodeURIComponent(rawId);

      // 1. Прямой поиск элемента по ID
      let element = document.getElementById(decodedId) || document.getElementById(rawId);

      // 2. Поиск с нормализацией дефисов
      if (!element) {
        const normalizedId = decodedId.replace(/-+/g, "-");
        element =
          document.getElementById(normalizedId) ||
          (document.querySelector(`[id="${normalizedId}"]`) as HTMLElement | null);
      }

      // 3. Поиск по началу ID или тексту среди заголовков
      if (!element) {
        const allHeadings = document.querySelectorAll("h1, h2, h3, h4, h5, h6, [id]");
        for (const h of allHeadings) {
          if (
            h.id === decodedId ||
            h.id === rawId ||
            h.id.startsWith(decodedId) ||
            decodedId.startsWith(h.id)
          ) {
            element = h as HTMLElement;
            break;
          }
        }
      }

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", `#${decodedId}`);
      }
    }
  }, []);

  if (blocks.length === 0) return null;

  return (
    <div className={clsx(styles.markdownContainer, className)} onClick={handleContainerClick}>
      {blocks.map((block, idx) => {
        if (block.type === "code") {
          return (
            <CodeViewer
              key={idx}
              code={block.code || ""}
              language={block.language || "javascript"}
            />
          );
        }

        const sanitizedHtml = DOMPurify.sanitize(block.html || "", {
          ADD_ATTR: ["target", "rel", "id", "class", "style", "align"],
          ADD_TAGS: ["table", "thead", "tbody", "tr", "th", "td", "code", "pre"],
        });

        return <div key={idx} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
      })}
    </div>
  );
};
