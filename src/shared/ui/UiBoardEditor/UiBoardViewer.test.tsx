import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import type { BoardValue } from "./boardTypes";
import { UiBoardViewer } from "./UiBoardViewer";

const value: BoardValue = {
  nodes: [
    { id: "client", x: 0, y: 0, text: "Клиент" },
    { id: "api", x: 240, y: 0, text: "API" },
  ],
  edges: [{ id: "e1", source: "client", target: "api", label: "HTTP" }],
};

describe("UiBoardViewer", () => {
  beforeAll(() => {
    // React Flow measures nodes with these browser APIs, which jsdom does not provide.
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe(): void {}
        unobserve(): void {}
        disconnect(): void {}
      }
    );
    vi.stubGlobal(
      "DOMMatrixReadOnly",
      class {
        m22 = 1;
      }
    );
  });

  it("shows the cards as plain text without editing tools", async () => {
    render(<UiBoardViewer label="Эталон" value={value} />);

    expect(await screen.findByText("Клиент")).toBeInTheDocument();
    expect(screen.getByText("API")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Эталон" })).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Добавить карточку" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Показать всё" })).toBeInTheDocument();
  });

  it("marks the highlighted cards", async () => {
    render(<UiBoardViewer label="Эталон" value={value} highlightedIds={["api"]} />);

    const highlighted = (await screen.findByText("API")).closest(".react-flow__node");
    const plain = screen.getByText("Клиент").closest(".react-flow__node");
    expect(highlighted?.className).toMatch(/highlighted/);
    expect(plain?.className).not.toMatch(/highlighted/);
  });
});
