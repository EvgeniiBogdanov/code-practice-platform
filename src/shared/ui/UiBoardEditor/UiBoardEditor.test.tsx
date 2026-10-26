import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import type { BoardValue } from "./boardTypes";
import { UiBoardEditor } from "./UiBoardEditor";

const value: BoardValue = {
  nodes: [
    { id: "n1", x: 0, y: 0, text: "Клиент" },
    { id: "n2", x: 240, y: 0, text: "API" },
  ],
  edges: [{ id: "e1", source: "n1", target: "n2", label: "HTTP" }],
};

describe("UiBoardEditor", () => {
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

  it("shows the saved cards", async () => {
    render(<UiBoardEditor label="Ваша схема" value={value} onChange={vi.fn()} />);

    expect(await screen.findByDisplayValue("Клиент")).toBeInTheDocument();
    expect(screen.getByDisplayValue("API")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Ваша схема" })).toBeInTheDocument();
    // Arrows are drawn only once the library has measured both cards, which jsdom cannot do:
    // their captions are checked in the browser instead.
  });

  it("reports a card added with the toolbar", async () => {
    const onChange = vi.fn();
    render(<UiBoardEditor label="Ваша схема" value={value} onChange={onChange} />);

    fireEvent.click(await screen.findByRole("button", { name: "Добавить карточку" }));

    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1), { timeout: 2000 });
    const [board] = onChange.mock.calls[0] as [BoardValue];
    expect(board.nodes.map((node) => node.id)).toEqual(["n1", "n2", "n3"]);
  });

  it("reports edited card text", async () => {
    const onChange = vi.fn();
    render(<UiBoardEditor label="Ваша схема" value={value} onChange={onChange} />);

    fireEvent.change(await screen.findByDisplayValue("Клиент"), {
      target: { value: "Браузер" },
    });

    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1), { timeout: 2000 });
    const [board] = onChange.mock.calls[0] as [BoardValue];
    expect(board.nodes[0]?.text).toBe("Браузер");
  });

  it("undoes and redoes an added card with the toolbar", async () => {
    render(<UiBoardEditor label="Ваша схема" value={value} onChange={vi.fn()} />);
    const undo = await screen.findByRole("button", { name: "Отменить" });
    const redo = screen.getByRole("button", { name: "Вернуть" });
    expect(undo).toBeDisabled();
    expect(redo).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Добавить карточку" }));
    await waitFor(() => expect(undo).toBeEnabled(), { timeout: 2000 });
    expect(screen.getAllByLabelText("Текст карточки")).toHaveLength(3);

    fireEvent.click(undo);
    await waitFor(() => expect(screen.getAllByLabelText("Текст карточки")).toHaveLength(2));
    expect(redo).toBeEnabled();

    fireEvent.click(redo);
    await waitFor(() => expect(screen.getAllByLabelText("Текст карточки")).toHaveLength(3));
  });

  it("undoes with Ctrl+Z on the board but leaves it to the browser inside a text field", async () => {
    render(<UiBoardEditor label="Ваша схема" value={value} onChange={vi.fn()} />);
    const undo = await screen.findByRole("button", { name: "Отменить" });
    fireEvent.click(screen.getByRole("button", { name: "Добавить карточку" }));
    await waitFor(() => expect(undo).toBeEnabled(), { timeout: 2000 });

    fireEvent.keyDown(screen.getAllByLabelText("Текст карточки")[0] as HTMLElement, {
      key: "z",
      ctrlKey: true,
    });
    expect(screen.getAllByLabelText("Текст карточки")).toHaveLength(3);

    fireEvent.keyDown(screen.getByTestId("rf__wrapper"), { key: "z", ctrlKey: true });
    await waitFor(() => expect(screen.getAllByLabelText("Текст карточки")).toHaveLength(2));
  });

  it("hints how to start on an empty board and cannot delete anything yet", async () => {
    render(
      <UiBoardEditor label="Ваша схема" value={{ nodes: [], edges: [] }} onChange={vi.fn()} />
    );

    expect(await screen.findByText(/Добавьте карточку и соедините/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Удалить выбранное" })).toBeDisabled();
  });
});
