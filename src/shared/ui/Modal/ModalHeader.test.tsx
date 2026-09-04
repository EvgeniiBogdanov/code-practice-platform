import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ModalHeader } from "./ui/ModalHeader";

describe("ModalHeader", () => {
  it("renders title and description", () => {
    render(
      <ModalHeader
        title="Заголовок модалки"
        description="Поясняющий текст"
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText("Заголовок модалки")).toBeInTheDocument();
    expect(screen.getByText("Поясняющий текст")).toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    render(
      <ModalHeader
        title="С иконкой"
        icon={<span data-testid="custom-icon">Icon</span>}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("renders close button by default and triggers onClose on click", () => {
    const handleClose = vi.fn();
    render(<ModalHeader title="Заголовок" onClose={handleClose} />);

    const closeBtn = screen.getByRole("button", { name: "Закрыть модальное окно" });
    expect(closeBtn).toBeInTheDocument();

    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("hides close button when hideCloseButton is true", () => {
    render(<ModalHeader title="Заголовок" hideCloseButton={true} onClose={vi.fn()} />);

    expect(screen.queryByRole("button", { name: "Закрыть модальное окно" })).not.toBeInTheDocument();
  });
});
