import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MarkdownView } from "./MarkdownView";

vi.mock("../UiMermaidDiagram", () => ({
  UiMermaidDiagram: ({ code }: { code: string }) => <pre data-testid="mermaid">{code}</pre>,
}));

describe("MarkdownView", () => {
  it("draws a mermaid block as a diagram between the paragraphs around it", () => {
    render(
      <MarkdownView
        content={"До схемы.\n\n```mermaid\nflowchart LR\n  A --> B\n```\n\nПосле схемы."}
      />
    );

    expect(screen.getByText("До схемы.")).toBeInTheDocument();
    expect(screen.getByTestId("mermaid")).toHaveTextContent("flowchart LR A --> B");
    expect(screen.getByText("После схемы.")).toBeInTheDocument();
  });
});
