import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UiSelect } from "./UiSelect";

import styles from "./UiSelect.module.css";

describe("UiSelect", () => {
  it("renders with options and handles change", () => {
    const onChange = vi.fn();
    render(
      <UiSelect aria-label="Speed" value="1" onChange={onChange}>
        <option value="1">1×</option>
        <option value="2">2×</option>
      </UiSelect>
    );

    const select = screen.getByRole("combobox", { name: "Speed" });
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue("1");

    fireEvent.change(select, { target: { value: "2" } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("applies control size class", () => {
    const { container } = render(
      <UiSelect controlSize="sm" aria-label="Small select">
        <option value="sm">Small</option>
      </UiSelect>
    );

    const select = container.querySelector("select");
    expect(select).toHaveClass(styles.sm);
  });
});
