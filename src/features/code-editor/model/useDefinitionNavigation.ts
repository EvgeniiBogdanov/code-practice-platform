import { useCallback, useEffect } from "react";
import {
  pendingReveal,
  revealers,
  type TaskFile,
  type TypeScriptLocation,
} from "@/shared/lib/code-editor";

interface DefinitionNavigationOptions {
  filepath: string;
  files: TaskFile[];
  onFileSelect?: (index: number) => void;
  requestDefinition: (position: number) => Promise<TypeScriptLocation | null>;
  reveal: (start: number, end: number) => void;
}

/** F12 / Cmd+Click: jump to a declaration, opening its task file when needed. */
export const useDefinitionNavigation = ({
  filepath,
  files,
  onFileSelect,
  requestDefinition,
  reveal,
}: DefinitionNavigationOptions): ((position: number) => Promise<void>) => {
  useEffect(() => {
    const target = pendingReveal.current;
    if (target && target.filepath === filepath) {
      pendingReveal.current = null;
      reveal(target.start, target.end);
    }
    const handler = (location: TypeScriptLocation): boolean => {
      if (location.filepath !== filepath) return false;
      reveal(location.start, location.end);
      return true;
    };
    revealers.add(handler);
    return (): void => {
      revealers.delete(handler);
    };
  }, [filepath, reveal]);

  return useCallback(
    async (position: number): Promise<void> => {
      const location = await requestDefinition(position);
      if (!location) return;
      if (location.filepath === filepath) {
        reveal(location.start, location.end);
        return;
      }
      const index = files.findIndex((file) => (file.name ?? file.filepath) === location.filepath);
      if (index < 0 || !onFileSelect) return;
      pendingReveal.current = location;
      onFileSelect(index);
    },
    [filepath, files, onFileSelect, requestDefinition, reveal]
  );
};
