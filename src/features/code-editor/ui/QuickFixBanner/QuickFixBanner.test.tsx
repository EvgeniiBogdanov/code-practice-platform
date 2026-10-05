import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QuickFixBanner } from "./QuickFixBanner";

const diagnostic = {
  line: 3,
  message: "TS2304: Cannot find name 'useState'.",
  severity: "error" as const,
};

describe("QuickFixBanner", () => {
  it("shows the problem without the TS prefix and applies the chosen fix", () => {
    const onApply = vi.fn();
    render(
      <QuickFixBanner
        diagnostic={diagnostic}
        fixes={[{ description: 'Add import from "react"' }, { description: "Declare it" }]}
        onApply={onApply}
      />
    );
    expect(screen.getByText("Стр 3: Cannot find name 'useState'.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Declare it" }));
    expect(onApply).toHaveBeenCalledWith(1);
  });

  it("renders nothing without fixes", () => {
    const { container } = render(
      <QuickFixBanner diagnostic={diagnostic} fixes={[]} onApply={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
