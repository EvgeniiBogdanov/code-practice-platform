import React from "react";
import { TaskFile } from "@/shared/lib/code-editor";
import type { CodeHistoryScope } from "./useCodeHistory";

export interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  onFilesChange?: (files: Array<{ name: string; code: string }>) => void;
  onRun?: () => void;
  onReset?: () => void;
  files?: TaskFile[];
  activeFileIdx?: number;
  onFileSelect?: (idx: number) => void;
  filepath?: string;
  historyScope?: CodeHistoryScope;
  isModified?: boolean;
  readOnly?: boolean;
  bottomConsole?: React.ReactNode;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onPreloadFullscreen?: () => void;
  isFullscreenTransitioning?: boolean;
  fillHeight?: boolean;
  className?: string;
}

/** Replaces the document, records history and selects the given range after render. */
export type ApplyEdit = (code: string, selectionStart: number, selectionEnd?: number) => void;

export interface CursorPosition {
  line: number;
  col: number;
  offset: number;
}
