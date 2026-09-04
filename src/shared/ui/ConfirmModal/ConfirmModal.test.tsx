import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ConfirmModal } from "./ConfirmModal";

describe("ConfirmModal", () => {
  it("renders correctly when open with title, description and actions", () => {
    const handleAction = vi.fn();
    const handleClose = vi.fn();

    render(
      <ConfirmModal
        isOpen={true}
        title="Сброс данных"
        description="Вы уверены, что хотите продолжить?"
        actions={[{ label: "Подтвердить сброс", onClick: handleAction, variant: "danger" }]}
        onClose={handleClose}
      />
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Сброс данных")).toBeInTheDocument();
    expect(screen.getByText("Вы уверены, что хотите продолжить?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Подтвердить сброс" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Отмена" })).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(
      <ConfirmModal
        isOpen={false}
        title="Сброс данных"
        description="Описание"
        actions={[]}
        onClose={vi.fn()}
      />
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("triggers action handler when action button is clicked", () => {
    const handleAction = vi.fn();
    render(
      <ConfirmModal
        isOpen={true}
        title="Подтверждение"
        description="Описание действия"
        actions={[{ label: "Удалить", onClick: handleAction }]}
        onClose={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Удалить" }));
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it("triggers onClose when cancel button is clicked", () => {
    const handleClose = vi.fn();
    render(
      <ConfirmModal
        isOpen={true}
        title="Подтверждение"
        description="Описание"
        cancelText="Отменить операцию"
        actions={[]}
        onClose={handleClose}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Отменить операцию" }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("triggers onClose when close icon button in header is clicked", () => {
    const handleClose = vi.fn();
    render(
      <ConfirmModal
        isOpen={true}
        title="Подтверждение"
        description="Описание"
        actions={[]}
        onClose={handleClose}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Закрыть модальное окно" }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
