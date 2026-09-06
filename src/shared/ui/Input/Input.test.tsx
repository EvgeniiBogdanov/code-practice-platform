import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { Input } from "./Input";

describe("Input", () => {
  it("renders input correctly with default props", () => {
    render(<Input placeholder="Введите текст" />);
    const inputEl = screen.getByPlaceholderText("Введите текст");
    expect(inputEl).toBeInTheDocument();
    expect(inputEl.className).toMatch(/size-md/);
  });

  it("applies size='sm' class when size='sm'", () => {
    render(<Input size="sm" placeholder="Компактный" />);
    const inputEl = screen.getByPlaceholderText("Компактный");
    expect(inputEl.className).toMatch(/size-sm/);
  });

  it("applies size='lg' class when size='lg'", () => {
    render(<Input size="lg" placeholder="Большой" />);
    const inputEl = screen.getByPlaceholderText("Большой");
    expect(inputEl.className).toMatch(/size-lg/);
  });

  it("applies variant='transparent' class when variant='transparent'", () => {
    render(<Input variant="transparent" placeholder="Прозрачный" />);
    const inputEl = screen.getByPlaceholderText("Прозрачный");
    expect(inputEl.className).toMatch(/variant-transparent/);
  });

  it("renders label when provided", () => {
    render(<Input label="Имя пользователя" id="username" />);
    expect(screen.getByText("Имя пользователя")).toBeInTheDocument();
  });

  it("renders leftIcon and rightIcon properly", () => {
    render(
      <Input
        leftIcon={<span data-testid="left-icon">🔍</span>}
        rightIcon={<span data-testid="right-icon">✕</span>}
      />
    );
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("renders error message and applies error class", () => {
    render(<Input error="Обязательное поле" placeholder="Поле с ошибкой" />);
    expect(screen.getByText("Обязательное поле")).toBeInTheDocument();
    const inputEl = screen.getByPlaceholderText("Поле с ошибкой");
    expect(inputEl.className).toMatch(/hasError/);
  });

  it("forwards ref to native input element", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("handles user input change", () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} placeholder="Поле" />);
    const inputEl = screen.getByPlaceholderText("Поле");
    fireEvent.change(inputEl, { target: { value: "Тест" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("respects disabled state", () => {
    render(<Input disabled placeholder="Отключено" />);
    const inputEl = screen.getByPlaceholderText("Отключено");
    expect(inputEl).toBeDisabled();
  });

  it("applies custom containerClassName and className", () => {
    const { container } = render(
      <Input containerClassName="custom-container" className="custom-input" />
    );
    expect(container.firstChild).toHaveClass("custom-container");
    const input = container.querySelector("input");
    expect(input).toHaveClass("custom-input");
  });
});
