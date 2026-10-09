import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { TestStatusItem } from "./TestStatusItem";

describe("TestStatusItem", () => {
  it("announces the status in words, not only with an icon", () => {
    render(
      <ul>
        <TestStatusItem status="failed" title="random не принимает строку" />
      </ul>
    );
    expect(screen.getByRole("listitem")).toHaveTextContent(
      "random не принимает строку: не пройден"
    );
  });

  it("is a plain row without details", () => {
    render(
      <ul>
        <TestStatusItem status="idle" title="Тест" />
      </ul>
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("expands its details through a button wired with aria-expanded", () => {
    const onToggle = vi.fn();
    const { rerender } = render(
      <ul>
        <TestStatusItem status="failed" title="Тест" onToggle={onToggle}>
          Ожидалось number
        </TestStatusItem>
      </ul>
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Ожидалось number")).not.toBeInTheDocument();
    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalledOnce();

    rerender(
      <ul>
        <TestStatusItem status="failed" title="Тест" isExpanded onToggle={onToggle}>
          Ожидалось number
        </TestStatusItem>
      </ul>
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Ожидалось number")).toBeInTheDocument();
  });
});
