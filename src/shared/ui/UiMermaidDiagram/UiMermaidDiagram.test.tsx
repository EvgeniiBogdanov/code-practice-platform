import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UiMermaidDiagram } from "./UiMermaidDiagram";

const renderMermaid = vi.fn<(code: string, width: number) => Promise<string>>();

vi.mock("./lib/renderMermaid", () => ({
  renderMermaid: (code: string, width: number) => renderMermaid(code, width),
}));

const CODE = "flowchart LR\n  A --> B";
const OTHER_CODE = "flowchart LR\n  C --> D";

describe("UiMermaidDiagram", () => {
  beforeEach(() => {
    renderMermaid.mockReset();
  });

  it("shows the drawn diagram under its accessible name", async () => {
    renderMermaid.mockResolvedValue('<svg data-testid="diagram"></svg>');
    render(<UiMermaidDiagram code={CODE} label="Поток данных" />);

    expect(screen.getByRole("status", { name: "Рисуем диаграмму" })).toBeInTheDocument();
    expect(await screen.findByRole("img", { name: "Поток данных" })).toContainElement(
      screen.getByTestId("diagram")
    );
    expect(renderMermaid).toHaveBeenCalledWith(CODE, expect.any(Number));
  });

  it("shows the source and draws again on «Повторить» when drawing fails", async () => {
    renderMermaid.mockRejectedValueOnce(new Error("Parse error"));
    renderMermaid.mockResolvedValueOnce("<svg></svg>");
    render(<UiMermaidDiagram code={CODE} />);

    expect(await screen.findByText(/Не удалось нарисовать диаграмму/)).toBeInTheDocument();
    expect(screen.getByText(/A --> B/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Повторить" }));

    expect(await screen.findByRole("img", { name: "Диаграмма" })).toBeInTheDocument();
    expect(renderMermaid).toHaveBeenCalledTimes(2);
  });

  it("does not show the previous diagram while another source is being drawn", async () => {
    renderMermaid.mockResolvedValueOnce('<svg data-testid="first"></svg>');
    const { rerender } = render(<UiMermaidDiagram code={CODE} />);
    await screen.findByTestId("first");

    renderMermaid.mockReturnValueOnce(new Promise<string>(() => {}));
    rerender(<UiMermaidDiagram code={OTHER_CODE} />);

    expect(screen.queryByTestId("first")).not.toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Рисуем диаграмму" })).toBeInTheDocument();
  });

  it("draws the diagram again when the theme changes", async () => {
    renderMermaid.mockResolvedValue("<svg></svg>");
    render(<UiMermaidDiagram code={CODE} />);
    await screen.findByRole("img", { name: "Диаграмма" });

    document.documentElement.setAttribute("data-theme", "light");

    await vi.waitFor(() => expect(renderMermaid).toHaveBeenCalledTimes(2));
    document.documentElement.removeAttribute("data-theme");
  });
});
