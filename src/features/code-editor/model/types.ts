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

export interface CursorPosition {
  line: number;
  col: number;
}

export interface TypoInfo {
  line: number;
  typo: string;
  correct: string;
}

export interface MissingImportInfo {
  line: number;
  symbol: string;
  module: string;
  isDefault?: boolean;
}

export interface LanguageInfo {
  name: string;
  iconClass: string;
}
