import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SidebarListSkeleton } from "./SidebarListSkeleton";

describe("SidebarListSkeleton", () => {
  it("renders progress card, 4 quick actions, and 10 folder skeletons", () => {
    const { container } = render(<SidebarListSkeleton />);
    const foldersContainer = container.querySelector("[aria-label='Загрузка списка тем...']");
    expect(foldersContainer).toBeInTheDocument();
    expect(foldersContainer?.children.length).toBe(10);
  });
});
