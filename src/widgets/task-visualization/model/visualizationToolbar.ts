export interface AlgorithmLabToolbarProps {
  readonly title?: string;
  readonly isFullscreen?: boolean;
  readonly onToggleFullscreen?: () => void;
  readonly className?: string;
  readonly zoom?: number;
  readonly onIncreaseZoom?: () => void;
  readonly onDecreaseZoom?: () => void;
  readonly onResetZoom?: () => void;
}
