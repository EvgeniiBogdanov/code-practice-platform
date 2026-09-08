import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HomeCallouts } from "./HomeCallouts";

describe("HomeCallouts", () => {
  it("renders GitHub block first, then Telegram contact block", () => {
    const { container } = render(<HomeCallouts />);

    // Quick Start should not be present
    expect(screen.queryByText(/Быстрый старт/i)).not.toBeInTheDocument();

    // Check order: GitHub block first, Telegram second
    const calloutItems = container.querySelectorAll(`.${styles_calloutsGrid_child(container)}`);
    expect(screen.getByText(/Open-Source проект/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Если у вас есть идеи или предложения сотрудничества пишите:/i)
    ).toBeInTheDocument();

    const links = screen.getAllByRole("link");
    const githubLink = screen.getByRole("link", { name: /звездой на GitHub/i });
    const telegramTextLink = screen.getByRole("link", { name: "@johnbeelow" });
    const telegramIconLink = screen.getByRole("link", { name: "Telegram: @johnbeelow" });

    expect(githubLink).toHaveAttribute("href", "https://github.com/EvgeniiBogdanov/code-practice-platform");
    expect(telegramTextLink).toHaveAttribute("href", "https://t.me/johnbeelow");
    expect(telegramIconLink).toHaveAttribute("href", "https://t.me/johnbeelow");

    // Verify ordering in DOM: GitHub link comes before Telegram links
    expect(links.indexOf(githubLink)).toBeLessThan(links.indexOf(telegramTextLink));
  });
});

function styles_calloutsGrid_child(container: HTMLElement) {
  const grid = container.firstElementChild;
  return grid?.children[0]?.className || "";
}
