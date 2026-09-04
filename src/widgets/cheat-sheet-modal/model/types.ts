export type SectionType = "react" | "javascript" | "algorithms" | "home";

export interface CategoryConfig {
  id: string;
  name: string;
}

export interface SectionConfig {
  title: string;
  categories: CategoryConfig[];
  defaultCategory?: string;
}

export interface CheatItem {
  title: string;
  desc?: string;
  code: string;
  tip?: string;
}
