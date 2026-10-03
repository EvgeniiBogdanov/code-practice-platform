import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { UiKbd } from "./UiKbd";

describe("UiKbd", () => {
  it("renders every key of the shortcut as a semantic kbd element", () => {
    const { container } = render(<UiKbd keys={["⌘", "K"]} aria-label="Command K" />);
    const keys = container.querySelectorAll("kbd");

    expect(keys).toHaveLength(2);
    expect(keys[0]).toHaveTextContent("⌘");
    expect(keys[1]).toHaveTextContent("K");
    expect(container.firstChild).toHaveAttribute("aria-label", "Command K");
  });
});
