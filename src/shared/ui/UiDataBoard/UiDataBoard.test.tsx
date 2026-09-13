import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UiDataBoard } from "./UiDataBoard";

describe("UiDataBoard", () => {
  it("renders real entries and section with aria-label", () => {
    render(
      <UiDataBoard
        label="Test Board"
        variant="prefix"
        entries={[
          { key: "P[0]", value: "2" },
          { key: "P[1]", value: "9", active: true },
        ]}
      />
    );

    expect(screen.getByRole("region", { name: "Test Board" })).toBeInTheDocument();
    expect(screen.getByText("P[0]")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("P[1]")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
  });

  it("renders placeholder stubs up to minSlots to prevent layout jumping", () => {
    const { container } = render(
      <UiDataBoard
        label="Prefix sums"
        variant="prefix"
        entries={[{ key: "P[0]", value: "2" }]}
        minSlots={4}
      />
    );

    const items = container.querySelectorAll("dl > div");
    expect(items).toHaveLength(4);

    const placeholders = container.querySelectorAll("dl > div[aria-hidden='true']");
    expect(placeholders).toHaveLength(3);
  });

  it("renders explicit placeholder keys when provided", () => {
    render(
      <UiDataBoard
        label="Prefix sums"
        variant="prefix"
        entries={[{ key: "P[0]", value: "2" }]}
        placeholders={[{ key: "P[0]" }, { key: "P[1]" }, { key: "P[2]" }, { key: "P[3]" }]}
      />
    );

    expect(screen.getByText("P[0]")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("P[1]")).toBeInTheDocument();
    expect(screen.getByText("P[2]")).toBeInTheDocument();
    expect(screen.getByText("P[3]")).toBeInTheDocument();
  });

  it("renders a standard height placeholder stub when completely empty", () => {
    const { container } = render(<UiDataBoard label="Empty Map" variant="buckets" entries={[]} />);

    const items = container.querySelectorAll("dl > div");
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("∅")).toBeInTheDocument();
    expect(screen.getByText("пусто")).toBeInTheDocument();
  });

  it("renders bucket placeholders with character keys and preserves structure when value appears", () => {
    const placeholders = [
      { key: "a", value: "—" },
      { key: "n", value: "—" },
      { key: "g", value: "—" },
    ];

    // State 1: all 3 placeholders
    const { rerender, container } = render(
      <UiDataBoard label="Map" variant="buckets" entries={[]} placeholders={placeholders} />
    );

    expect(container.querySelectorAll("dl > div")).toHaveLength(3);
    expect(screen.getByText("a")).toBeInTheDocument();
    expect(screen.getByText("n")).toBeInTheDocument();
    expect(screen.getByText("g")).toBeInTheDocument();

    // State 2: first entry populated with active: true
    rerender(
      <UiDataBoard
        label="Map"
        variant="buckets"
        entries={[{ key: "a", value: "1", active: true }]}
        placeholders={placeholders}
      />
    );

    expect(container.querySelectorAll("dl > div")).toHaveLength(3);
    expect(screen.getByText("1")).toBeInTheDocument();
    const activeItem = container.querySelector("dl > div:not([aria-hidden='true'])");
    expect(activeItem).toBeInTheDocument();
    expect(activeItem?.textContent).toContain("a1");
  });
});
