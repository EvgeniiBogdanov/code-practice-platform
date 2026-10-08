import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { clsx } from "clsx";
import styles from "./Textarea.module.css";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, className, containerClassName, id, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;

    return (
      <div className={clsx(styles.container, containerClassName)}>
        {label && (
          <label htmlFor={textareaId} className={styles.label}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={clsx(styles.textarea, className)}
          {...props}
        />
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
