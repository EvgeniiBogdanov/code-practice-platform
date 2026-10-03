import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SidebarHomeSkeleton } from "./SidebarHomeSkeleton";

describe("SidebarHomeSkeleton", () => {
  it("renders the progress card placeholder and 5 overview item skeletons", () => {
    const { container } = render(<SidebarHomeSkeleton />);
    const list = container.querySelector("[aria-label='Загрузка навигации...']");
    expect(list).toBeInTheDocument();
    expect(list?.children.length).toBe(6);
  });
});
