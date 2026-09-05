import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Callout } from "./Callout";
import styles from "./Callout.module.css";

describe("Callout", () => {
  it("renders with default props, role='note', title and children", () => {
    render(
      <Callout title="Внимание">
        <p>Важный текст заметки</p>
      </Callout>
    );

    const calloutElement = screen.getByRole("note");
    expect(calloutElement).toBeInTheDocument();
    expect(screen.getByText("Внимание")).toBeInTheDocument();
    expect(screen.getByText("Важный текст заметки")).toBeInTheDocument();
    expect(calloutElement).toHaveClass(styles.callout);
  });

  it("renders content when provided via content prop", () => {
    render(<Callout content="Альтернативный текст содержимого" />);
    expect(screen.getByText("Альтернативный текст содержимого")).toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    render(
      <Callout
        icon={<span data-testid="test-icon">⭐</span>}
        title="С иконкой"
      />
    );
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    expect(screen.getByText("С иконкой")).toBeInTheDocument();
  });

  it("applies size='xs' class properly for compact cards", () => {
    render(
      <Callout
        size="xs"
        color="yellow"
        title="Лайфхак для интервью"
      >
        Краткий совет
      </Callout>
    );

    const calloutElement = screen.getByRole("note");
    expect(calloutElement).toHaveClass(styles["size-xs"]);
    expect(calloutElement).toHaveClass(styles["color-yellow"]);
  });

  it("applies size='sm' class properly", () => {
    render(
      <Callout
        size="sm"
        title="Компактный callout"
      >
        Небольшой текст
      </Callout>
    );

    const calloutElement = screen.getByRole("note");
    expect(calloutElement).toHaveClass(styles["size-sm"]);
  });

  it("does not apply size modifier class for default size", () => {
    render(
      <Callout
        size="default"
        title="Стандартный callout"
      >
        Обычный размер
      </Callout>
    );

    const calloutElement = screen.getByRole("note");
    expect(calloutElement).not.toHaveClass(styles["size-xs"]);
    expect(calloutElement).not.toHaveClass(styles["size-sm"]);
  });

  it("supports custom className and color variant", () => {
    render(
      <Callout
        color="green"
        className="custom-test-class"
        title="Успешно"
      />
    );

    const calloutElement = screen.getByRole("note");
    expect(calloutElement).toHaveClass(styles["color-green"]);
    expect(calloutElement).toHaveClass("custom-test-class");
  });

  it("supports color='amber' variant properly", () => {
    render(
      <Callout
        color="amber"
        title="Лайфхак для интервью"
      >
        Тест янтарного цвета
      </Callout>
    );

    const calloutElement = screen.getByRole("note");
    expect(calloutElement).toHaveClass(styles["color-amber"]);
  });

  it("supports color='yellow' variant with icon and title", () => {
    render(
      <Callout
        color="yellow"
        icon={<span data-testid="github-icon">icon</span>}
        title="Open-Source проект"
      >
        Поддержите развитие платформы
      </Callout>
    );

    const calloutElement = screen.getByRole("note");
    expect(calloutElement).toHaveClass(styles["color-yellow"]);
    expect(screen.getByTestId("github-icon")).toBeInTheDocument();
    expect(screen.getByText("Open-Source проект")).toBeInTheDocument();
  });
});
