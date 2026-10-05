import type { SelectHTMLAttributes } from "react";
export interface UiSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  readonly controlSize?: "sm" | "md";
}
