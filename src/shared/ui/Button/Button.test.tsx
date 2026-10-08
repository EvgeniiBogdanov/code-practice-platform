import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";
import { buttonClassName } from "./buttonClassName";

describe("Button", () => {
  it("renders the secondary md button with the default shape", () => {
    render(<Button>Сохранить</Button>);

    const button = screen.getByRole("button", { name: "Сохранить" });
    expect(button.className).toContain("variant-secondary");
    expect(button.className).toContain("size-md");
    expect(button.className).not.toContain("shape-pill");
  });

  it("applies the pill shape on demand", () => {
    render(
      <Button variant="primary" size="xl" shape="pill">
        Начать
      </Button>
    );

    expect(screen.getByRole("button", { name: "Начать" }).className).toContain("shape-pill");
  });

  it("exposes the pill shape for non-button elements", () => {
    expect(buttonClassName({ shape: "pill" })).toContain("shape-pill");
    expect(buttonClassName()).not.toContain("shape-pill");
  });
});
