import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeHeroHeader } from "./HomeHeroHeader";
import styles from "./HomePage.module.css";

describe("HomeHeroHeader", () => {
  it("renders app icon, title heading and version badge", () => {
    const { container } = render(<HomeHeroHeader grandTotal={345} />);

    // App icon
    const icon = container.querySelector(`.${styles.titleIcon}`);
    expect(icon).toBeInTheDocument();
    expect(icon?.tagName.toLowerCase()).toBe("svg");

    // Main heading
    const heading = screen.getByRole("heading", { level: 1, name: "Code Practice Platform" });
    expect(heading).toBeInTheDocument();

    // Version badge
    const badge = container.querySelector(`.${styles.versionTag}`);
    expect(badge).toBeInTheDocument();
    expect(badge?.textContent).toMatch(/^v\d+\.\d+\.\d+/);

    // Subtitle
    expect(screen.getByText(/345 задач/)).toBeInTheDocument();
  });
});
