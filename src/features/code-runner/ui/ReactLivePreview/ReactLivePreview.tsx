import React, { memo } from "react";
import { clsx } from "clsx";
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
  fullHeight?: boolean;
  className?: string;
  previewTarget?: "candidate" | "solution";
  onPreviewTargetChange?: (target: "candidate" | "solution") => void;
  hasSolutionReference?: boolean;
}

export const ReactLivePreview = memo(
  ({
    task,
    files = [],
    activeFileIdx = 0,
    currentCode,
    storagePrefix = "cand",
    variantIdx = 0,
    fullHeight = false,
    className,
    previewTarget,
    onPreviewTargetChange,
    hasSolutionReference,
  }: ReactLivePreviewProps): React.JSX.Element => {
    const {
      activeFile,
      srcDoc,
      compileError,
      iframeHeight,
      reloadKey,
      hasFiles,
      urlSearch,
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
      <div
        className={clsx(
          styles.browserMockup,
          fullHeight && styles.fullHeight,
          className
        )}
      >
        <BrowserMockupHeader
          fileName={activeFile?.name || "index.jsx"}
          urlSearch={urlSearch}
          onReload={handleManualReload}
          previewTarget={previewTarget}
          onPreviewTargetChange={onPreviewTargetChange}
          hasSolutionReference={hasSolutionReference}
        />

        <BrowserMockupBody
          compileError={compileError}
          srcDoc={srcDoc}
          iframeKey={iframeKey}
          iframeHeight={iframeHeight}
          title={`Preview: ${activeFile?.name || "index.jsx"}`}
          hasFiles={hasFiles}
          fullHeight={fullHeight}
          onIframeLoad={handleIframeLoad}
        />
      </div>
    );
  }
);

ReactLivePreview.displayName = "ReactLivePreview";
