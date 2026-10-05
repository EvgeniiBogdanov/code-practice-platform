import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SignatureHelpCard } from "./SignatureHelpCard";

vi.mock("../../model/use-content-widget-layout", () => ({
  useContentWidgetLayout: () => ({ ref: { current: null }, placement: "top", left: 10 }),
}));

describe("SignatureHelpCard", () => {
  const text = "greet(name: string, age: number): void";
  const signature = {
    signature: text,
    activeParameter: 1,
    documentation: "",
    parameters: [
      { start: 6, end: 18 },
      { start: 20, end: 31 },
    ],
  };

  it("keeps the whole signature and emphasises only the current argument", () => {
    const { container } = render(
      <SignatureHelpCard signature={signature} position={{ top: 0, bottom: 20, left: 0 }} />
    );
    expect(container.querySelector("code")?.textContent).toBe(text);
    expect(container.querySelector("strong")?.textContent).toBe("age: number");
  });

  it("renders without emphasis when no argument is active", () => {
    const { container } = render(
      <SignatureHelpCard
        signature={{ ...signature, activeParameter: 5 }}
        position={{ top: 0, bottom: 20, left: 0 }}
      />
    );
    expect(container.querySelector("strong")).toBeNull();
    expect(container.querySelector("code")?.textContent).toBe(text);
  });
});
