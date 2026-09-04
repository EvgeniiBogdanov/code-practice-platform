import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useUIStore } from "@/entities/ui-state";
import { Task } from "@/entities/task";
import {
  buildFilesMap,
  buildSandboxIframeSrcDoc,
  clearLiveSandboxTimers,
  TaskSourceFile,
} from "@/shared/lib/code-runners";

export interface UseReactLiveSandboxParams {
  task?: Task;
  files?: TaskSourceFile[];
  activeFileIdx?: number;
  currentCode?: string;
  storagePrefix?: "cand" | "sol";
  variantIdx?: number;
}

export interface UseReactLiveSandboxReturn {
  activeFile: TaskSourceFile;
  srcDoc: string | null;
  compileError: Error | null;
  iframeHeight: number;
  reloadKey: number;
  hasFiles: boolean;
  urlSearch: string;
  handleManualReload: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleIframeLoad: (e: React.SyntheticEvent<HTMLIFrameElement>) => void;
}

export const useReactLiveSandbox = ({
  task,
  files = [],
  activeFileIdx = 0,
  currentCode,
  storagePrefix = "cand",
  variantIdx = 0,
}: UseReactLiveSandboxParams): UseReactLiveSandboxReturn => {
  const [reloadKey, setReloadKey] = useState(0);
  const [iframeHeight, setIframeHeight] = useState(260);
  const [urlSearch, setUrlSearch] = useState("");
  const theme = useUIStore((state) => state.theme) || "dark";

  const activeFile = files[activeFileIdx] || files[0] || { name: "index.jsx", code: "" };

  const filesMap = useMemo(() => {
    return buildFilesMap(files, storagePrefix, task?.id, activeFileIdx, currentCode, variantIdx);
  }, [files, storagePrefix, task?.id, activeFileIdx, currentCode, variantIdx, reloadKey]);

  const { srcDoc, error: compileError } = useMemo(() => {
    return buildSandboxIframeSrcDoc({
      filesMap,
      entryFileName: activeFile?.name,
      theme,
    });
  }, [filesMap, activeFile?.name, theme]);

  useEffect(() => {
    return () => {
      clearLiveSandboxTimers();
    };
  }, [task?.id, reloadKey]);

  useEffect(() => {
    setIframeHeight(260);
    setUrlSearch("");
  }, [task?.id, storagePrefix, variantIdx, activeFileIdx, reloadKey]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === "SANDBOX_RESIZE" && typeof e.data.height === "number") {
        const targetH = Math.max(260, Math.ceil(e.data.height));
        setIframeHeight((prev) => (Math.abs(prev - targetH) > 2 ? targetH : prev));
      }
      if (e.data && e.data.type === "SANDBOX_URL_CHANGE") {
        setUrlSearch(typeof e.data.search === "string" ? e.data.search : "");
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleIframeLoad = useCallback((e: React.SyntheticEvent<HTMLIFrameElement>): void => {
    try {
      const iframe = e.target as HTMLIFrameElement;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        const rootEl = doc.getElementById("root");
        if (rootEl) {
          const rootRect = rootEl.getBoundingClientRect?.()?.height || 0;
          const rootScroll = rootEl.scrollHeight || 0;
          const rootOffset = rootEl.offsetHeight || 0;
          const rootHeight = Math.max(rootRect, rootScroll, rootOffset);
          if (rootHeight > 0) {
            setIframeHeight(Math.max(260, Math.ceil(rootHeight + 48)));
          }
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleManualReload = useCallback((e: React.MouseEvent<HTMLButtonElement>): void => {
    e?.stopPropagation();
    clearLiveSandboxTimers();
    setUrlSearch("");
    setReloadKey((k) => k + 1);
  }, []);

  return {
    activeFile,
    srcDoc,
    compileError,
    iframeHeight,
    reloadKey,
    hasFiles: Object.keys(filesMap).length > 0,
    urlSearch,
    handleManualReload,
    handleIframeLoad,
  };
};
