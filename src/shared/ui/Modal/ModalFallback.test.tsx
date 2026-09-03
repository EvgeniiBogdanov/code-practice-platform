import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ModalFallback } from "./ModalFallback";

describe("ModalFallback", () => {
  it("renders modal backdrop and spinner with accessible attributes", () => {
    const { baseElement } = render(<ModalFallback />);
    const dialog = baseElement.querySelector("[role='dialog']");
    expect(dialog).not.toBeNull();
    expect(dialog?.getAttribute("aria-modal")).toBe("true");
    expect(dialog?.getAttribute("aria-busy")).toBe("true");
    expect(baseElement.querySelector("[role='status']")).not.toBeNull();
  });

  it("applies paletteBackdrop class when isPalette is true", () => {
    const { baseElement } = render(<ModalFallback isPalette />);
    const dialog = baseElement.querySelector("[role='dialog']");
    expect(dialog?.className).toContain("paletteBackdrop");
  });
});
