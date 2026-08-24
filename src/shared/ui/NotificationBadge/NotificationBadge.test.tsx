import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { NotificationBadge } from "./NotificationBadge";

describe("NotificationBadge", () => {
  it("renders count correctly", () => {
    render(<NotificationBadge count={5} />);
    const badge = screen.getByRole("status");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("5");
    expect(badge).toHaveAttribute("aria-label", "5 уведомлений");
  });

  it("formats count over maxCount with a plus sign", () => {
    render(<NotificationBadge count={120} maxCount={99} />);
    const badge = screen.getByRole("status");
    expect(badge).toHaveTextContent("99+");
    expect(badge).toHaveAttribute("aria-label", "120 уведомлений");
  });

  it("does not render when count is 0 and showZero is false", () => {
    const { container } = render(<NotificationBadge count={0} showZero={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders when count is 0 if showZero is true", () => {
    render(<NotificationBadge count={0} showZero={true} />);
    const badge = screen.getByRole("status");
    expect(badge).toHaveTextContent("0");
  });

  it("does not render when count is undefined or null", () => {
    const { container } = render(<NotificationBadge count={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders dot mode with proper aria-label", () => {
    render(<NotificationBadge dot ariaLabel="Непрочитанные сообщения" />);
    const badge = screen.getByRole("status");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("aria-label", "Непрочитанные сообщения");
    expect(badge).toBeEmptyDOMElement();
  });

  it("supports custom string count and custom ariaLabel", () => {
    render(<NotificationBadge count="NEW" ariaLabel="Новое событие" />);
    const badge = screen.getByRole("status");
    expect(badge).toHaveTextContent("NEW");
    expect(badge).toHaveAttribute("aria-label", "Новое событие");
  });
});
