import React, { memo } from "react";
import { Task } from "@/entities/task";
import { TaskSourceFile } from "@/shared/lib/code-runners";
import { useReactLiveSandbox } from "../../model/use-react-live-sandbox";
import { BrowserMockupHeader } from "./BrowserMockupHeader";
import { BrowserMockupBody } from "./BrowserMockupBody";
import styles from "./ReactLivePreview.module.css";

export interface ReactLivePreviewProps {
  task?: Task;
  files?: TaskSourceFile[];
  activeFileIdx?: number;
  currentCode?: string;
  storagePrefix?: "cand" | "sol";
  variantIdx?: number;
  className?: string;
}

export const ReactLivePreview = memo(
  ({
    task,
    files = [],
    activeFileIdx = 0,
    currentCode,
    storagePrefix = "cand",
    variantIdx = 0,
    className,
  }: ReactLivePreviewProps): React.JSX.Element => {
    const {
      activeFile,
      srcDoc,
      compileError,
      iframeHeight,
      reloadKey,
      hasFiles,
      handleManualReload,
      handleIframeLoad,
    } = useReactLiveSandbox({
      task,
      files,
      activeFileIdx,
      currentCode,
      storagePrefix,
      variantIdx,
    });

    const iframeKey = `${task?.id}_${storagePrefix}_${variantIdx}_${reloadKey}`;

    return (
      <div className={[styles.browserMockup, className].filter(Boolean).join(" ")}>
        <BrowserMockupHeader
          fileName={activeFile?.name || "index.jsx"}
          onReload={handleManualReload}
        />

        <BrowserMockupBody
          compileError={compileError}
          srcDoc={srcDoc}
          iframeKey={iframeKey}
          iframeHeight={iframeHeight}
          title={`Preview: ${activeFile?.name || "index.jsx"}`}
          hasFiles={hasFiles}
          onIframeLoad={handleIframeLoad}
        />
      </div>
    );
  }
);

ReactLivePreview.displayName = "ReactLivePreview";
