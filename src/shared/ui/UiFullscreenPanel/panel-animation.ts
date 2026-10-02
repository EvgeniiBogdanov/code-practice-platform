type WorkspaceDirection = "expand" | "collapse";

export const getWorkspaceViewTransition = (
  direction: WorkspaceDirection
): false | { types: string[] } => {
  if (
    typeof window === "undefined" ||
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  ) {
    return false;
  }

  return { types: [`workspace-${direction}`] };
};

// Reserve the inline footprint while its only child is in the top layer.
// WAAPI holds the measured geometry without inline styles or a duplicate DOM tree.
export const holdPanelSpace = (anchor: HTMLElement): Animation | null => {
  if (typeof anchor.animate !== "function") return null;
  const height = `${anchor.getBoundingClientRect().height}px`;
  return anchor.animate([{ height }, { height }], { duration: 0, fill: "forwards" });
};

export const animatePanelBounds = (
  panel: HTMLDialogElement,
  before: DOMRect,
  padding: string,
  expanding: boolean
): Animation | null => {
  if (typeof panel.animate !== "function") return null;
  const after = panel.getBoundingClientRect();
  const tokens = getComputedStyle(document.documentElement);
  const geometry = (rect: DOMRect): Keyframe => ({
    position: "fixed",
    inset: "auto",
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    margin: "0",
    maxWidth: "none",
    maxHeight: "none",
    overflow: "hidden",
    zIndex: tokens.getPropertyValue("--z-fullscreen").trim(),
  });
  return panel.animate(
    [
      { ...geometry(before), padding },
      { ...geometry(after), padding: getComputedStyle(panel).padding },
    ],
    {
      duration: parseFloat(
        tokens.getPropertyValue(
          expanding ? "--duration-workspace-expand" : "--duration-workspace-collapse"
        )
      ),
      easing: tokens.getPropertyValue("--ease-workspace").trim(),
    }
  );
};
