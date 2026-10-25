/** Folders of the system design sidebar, in display order. */
export const SYSTEM_DESIGN_GROUP_IDS = ["theory", "cases", "drills"] as const;

export type SystemDesignGroupId = (typeof SYSTEM_DESIGN_GROUP_IDS)[number];
