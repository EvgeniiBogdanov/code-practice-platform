import { SectionType, Task } from "@/entities/task";

export type FinderActiveDropdown = "section" | "group" | "subgroup" | "task" | null;

export interface FinderHierarchyProps {
  paramId: string | null;
  currentTask: Task | null;
  activeDropdown: FinderActiveDropdown;
  toggleDropdown: (name: "section" | "group" | "subgroup" | "task") => void;
  closeAllDropdowns: () => void;
}

export interface FinderSectionDropdownProps {
  section: "home" | SectionType;
  activeDropdown: FinderActiveDropdown;
  toggleDropdown: (name: "section" | "group" | "subgroup" | "task") => void;
  closeAllDropdowns: () => void;
}
