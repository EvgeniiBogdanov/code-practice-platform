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
      next =
        next.slice(0, edit.start) +
        (edit.prefixText ?? "") +
        newName +
        (edit.suffixText ?? "") +
        next.slice(edit.end);
    }
    return { name: file.name, code: next };
  });

/** Where the renamed symbol ends in the edited file, with earlier edits already applied. */
export const getRenamedSelection = (
  edits: ReadonlyArray<TypeScriptRenameEdit>,
  current: TypeScriptRenameEdit,
  newName: string
): { start: number; end: number } => {
  const delta = (edit: TypeScriptRenameEdit): number =>
    (edit.prefixText?.length ?? 0) +
    newName.length +
    (edit.suffixText?.length ?? 0) -
    (edit.end - edit.start);
  const shift = edits
    .filter((edit) => edit.filepath === current.filepath && edit.start < current.start)
    .reduce((total, edit) => total + delta(edit), 0);
  const start = current.start + shift + (current.prefixText?.length ?? 0);
  return { start, end: start + newName.length };
};
