import type { TypeScriptRenameEdit } from "@/shared/lib/code-editor";

export interface RenamedFile {
  name: string;
  code: string;
}

export const applyRenameEdits = (
  files: ReadonlyArray<RenamedFile>,
  edits: ReadonlyArray<TypeScriptRenameEdit>,
  newName: string
): RenamedFile[] =>
  files.map((file) => {
    let next = file.code;
    for (const edit of edits
      .filter((item) => item.filepath === file.name)
      .sort((left, right) => right.start - left.start)) {
      next = next.slice(0, edit.start) + newName + next.slice(edit.end);
    }
    return { name: file.name, code: next };
  });
