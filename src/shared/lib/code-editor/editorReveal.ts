import type { TypeScriptLocation } from "./typescriptTypes";

// Switching tabs remounts the editor, so the target travels to the new instance here.
export const pendingReveal: { current: TypeScriptLocation | null } = { current: null };
export const revealers = new Set<(location: TypeScriptLocation) => boolean>();

/**
 * Selects a range in the open editor, or in the one that mounts next when the file of the range
 * is not open yet (the caller switches tabs). Lets panels outside the editor point at code.
 */
export const requestEditorReveal = (location: TypeScriptLocation): void => {
  for (const reveal of revealers) if (reveal(location)) return;
  pendingReveal.current = location;
};
