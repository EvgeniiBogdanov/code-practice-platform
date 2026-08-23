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
}

export interface CodeViewerGutterProps {
  linesCount: number;
  gutterWidth: number;
  className?: string;
}

export interface CodeViewerCanvasProps {
  highlightedHtml: string;
  cleanCode: string;
  className?: string;
}

export interface CodeCopyButtonProps {
  code: string;
  className?: string;
}
