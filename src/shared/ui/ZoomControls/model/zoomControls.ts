export interface ZoomControlsProps {
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly defaultValue: number;
  readonly displayValue: string;
  readonly valueLabel: string;
  readonly decreaseLabel: string;
  readonly increaseLabel: string;
  readonly resetLabel: string;
  readonly onDecrease?: () => void;
  readonly onIncrease?: () => void;
  readonly onReset?: () => void;
}
