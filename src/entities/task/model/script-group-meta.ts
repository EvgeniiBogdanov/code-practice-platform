import { getGroupMeta } from "../curriculum/javascript/data/groupConfig";
import {
  getTypeScriptGroupMeta,
  type TypeScriptGroupMeta,
} from "../curriculum/typescript/data/group-config";

export const getScriptGroupMeta = (
  groupName: string,
  section: "javascript" | "typescript"
): TypeScriptGroupMeta =>
  section === "typescript" ? getTypeScriptGroupMeta(groupName) : getGroupMeta(groupName);
