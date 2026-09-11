import type { JSX } from "react";
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { CodeButton } from "../../CodeButton";
import { Tooltip } from "../../Tooltip";
import type { ZoomControlsProps } from "../model/zoom-controls";
import styles from "./ZoomControls.module.css";

export const ZoomControls = (props: ZoomControlsProps): JSX.Element => {
  const modified = props.value !== props.defaultValue;
  return (
    <div className={styles.controls}>
      <Tooltip content={props.decreaseLabel} side="bottom">
        <CodeButton
          icon={<ZoomOut size={14} />}
          aria-label={props.decreaseLabel}
          disabled={!props.onDecrease || props.value <= props.min}
          onClick={props.onDecrease}
        />
      </Tooltip>
      <Tooltip content={props.valueLabel} side="bottom">
        <CodeButton
          className={styles.value}
          isActive={modified}
          aria-label={`${props.valueLabel}. Нажмите для сброса.`}
          disabled={!modified || !props.onReset}
          onClick={props.onReset}
        >
          {props.displayValue}
        </CodeButton>
      </Tooltip>
      <Tooltip content={props.increaseLabel} side="bottom">
        <CodeButton
          icon={<ZoomIn size={14} />}
          aria-label={props.increaseLabel}
          disabled={!props.onIncrease || props.value >= props.max}
          onClick={props.onIncrease}
        />
      </Tooltip>
      <Tooltip content={props.resetLabel} side="bottom">
        <CodeButton
          icon={<RotateCcw size={14} />}
          aria-label={props.resetLabel}
          disabled={!modified || !props.onReset}
          onClick={props.onReset}
        />
      </Tooltip>
    </div>
  );
};
