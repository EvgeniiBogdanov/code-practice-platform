import { DESIGN_CASES } from "../content/cases";
import type { DesignCase, DesignCaseMeta } from "./types";

const CASE_LOADERS = import.meta.glob<{ designCase: DesignCase }>("../content/*/designCase.ts");

export const getDesignCaseMeta = (caseId: string): DesignCaseMeta | undefined =>
  DESIGN_CASES.find((designCase) => designCase.id === caseId);

/** Full case, fetched on first open; `null` for an unknown id. */
export const loadDesignCase = async (caseId: string): Promise<DesignCase | null> => {
  const load = CASE_LOADERS[`../content/${caseId}/designCase.ts`];
  return load ? (await load()).designCase : null;
};
