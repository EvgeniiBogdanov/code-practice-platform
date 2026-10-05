export interface CodeStepViewerProps {
  readonly code: string;
  readonly ariaLabel?: string;
  readonly language?: string;
  readonly filename?: string;
  readonly activeLine?: number;
  readonly className?: string;
  readonly fontSize?: number;
  readonly minFontSize?: number;
  readonly maxFontSize?: number;
  readonly defaultFontSize?: number;
  readonly onIncreaseFontSize?: () => void;
  readonly onDecreaseFontSize?: () => void;
  readonly onResetFontSize?: () => void;
}
