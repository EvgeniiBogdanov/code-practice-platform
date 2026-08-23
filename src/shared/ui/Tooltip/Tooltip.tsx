import React, { memo } from "react";
import { TooltipProvider } from "./TooltipProvider";
import { TooltipRoot } from "./TooltipRoot";
import { TooltipTrigger } from "./TooltipTrigger";
import { TooltipContent } from "./TooltipContent";
import { TooltipArrow } from "./TooltipArrow";
import { TooltipProps } from "./types";

interface TooltipComponent {
  (props: TooltipProps): React.ReactElement | null;
  displayName?: string;
  Provider: typeof TooltipProvider;
  Root: typeof TooltipRoot;
  Trigger: typeof TooltipTrigger;
  Content: typeof TooltipContent;
  Arrow: typeof TooltipArrow;
}

export const Tooltip: TooltipComponent = memo(
  ({
    content,
    children,
    side = "bottom",
    position,
    align = "center",
    sideOffset = 6,
    delayDuration,
    disabled = false,
    arrow = true,
    asChild = true,
    fullWidth = false,
    className,
    contentClassName,
  }: TooltipProps) => {
    if (!content) return <>{children}</>;

    const effectiveSide = position || side;

    return (
      <TooltipRoot delayDuration={delayDuration} disabled={disabled}>
        <TooltipTrigger asChild={asChild} fullWidth={fullWidth} className={className}>
          {children}
        </TooltipTrigger>
        <TooltipContent
          side={effectiveSide}
          align={align}
          sideOffset={sideOffset}
          arrow={arrow}
          className={contentClassName}
        >
          {content}
        </TooltipContent>
      </TooltipRoot>
    );
  }
) as unknown as TooltipComponent;

Tooltip.Provider = TooltipProvider;
Tooltip.Root = TooltipRoot;
Tooltip.Trigger = TooltipTrigger;
Tooltip.Content = TooltipContent;
Tooltip.Arrow = TooltipArrow;
Tooltip.displayName = "Tooltip";
