import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { HoverSignatureCard } from "./HoverSignatureCard";

vi.mock("../../model/use-content-widget-layout", () => ({
  useContentWidgetLayout: () => ({ ref: { current: null }, placement: "top", left: 10 }),
}));

const position = { top: 100, bottom: 120, left: 10 };

describe("HoverSignatureCard", () => {
  it("colours the signature with the editor's syntax theme", () => {
    const { container } = render(
      <HoverSignatureCard
        info={{ signature: "const userName: string", documentation: "" }}
        position={position}
      />
    );
    expect(container.querySelector(".hl-kw")?.textContent).toBe("const");
    expect(screen.getByRole("tooltip")).toHaveTextContent("const userName: string");
  });

  it("shows errors above the signature and warnings with their own severity", () => {
    render(
      <HoverSignatureCard
        info={{ signature: "let a: number", documentation: "" }}
        problems={[
          { id: "1", message: "TS2322: bad type", severity: "error" },
          { id: "2", message: "unused", severity: "warning" },
        ]}
        position={position}
      />
    );
    const card = screen.getByRole("tooltip");
    expect(card.textContent?.indexOf("TS2322")).toBeLessThan(
      card.textContent?.indexOf("let a") ?? 0
    );
    expect(card.querySelectorAll("svg")).toHaveLength(2);
  });
});
