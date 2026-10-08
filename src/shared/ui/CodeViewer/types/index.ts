import type { ReactNode } from "react";

export interface LanguageMeta {
  name: string;
  color: string;
  isNotepad: boolean;
}

export interface CodeViewerProps {
  code: string;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
}

export interface CodeViewerHeaderProps {
  langName: string;
  color: string;
  isNotepad: boolean;
  className?: string;
  /** Controls on the right of the header, e.g. a language picker. */
  children?: ReactNode;
}

export interface CodeViewerGutterProps {
  linesCount: number;
  gutterWidth: number;
  className?: string;
}

export interface CodeCopyButtonProps {
  code: string;
  className?: string;
}
