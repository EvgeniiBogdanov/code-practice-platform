import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UiChoiceList, type UiChoiceOption } from "./UiChoiceList";

const options: UiChoiceOption[] = [
  { id: "ssr", label: "SSR", description: "Быстрый первый экран", tags: "Рекомендуем" },
  { id: "csr", label: "CSR" },
];

const renderList = (value?: string, onChange = vi.fn()): ReturnType<typeof vi.fn> => {
  render(
    <>
      <h3 id="question">Как рендерить?</h3>
      <UiChoiceList
        options={options}
        value={value}
        onChange={onChange}
        labelledBy="question"
        showKeys
      />
    </>
  );
  return onChange;
};

describe("UiChoiceList", () => {
  it("is a radio group named by the question, each option named by its label only", () => {
    renderList();
    expect(screen.getByRole("radiogroup", { name: "Как рендерить?" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "SSR" })).toHaveAccessibleDescription(
      "Рекомендуем Быстрый первый экран"
    );
    expect(screen.getByRole("radio", { name: "CSR" })).not.toHaveAccessibleDescription();
  });

  it("reports the clicked option and marks the current value as checked", () => {
    const onChange = renderList("csr");
    expect(screen.getByRole("radio", { name: "CSR" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "SSR" })).not.toBeChecked();

    fireEvent.click(screen.getByText("SSR"));
    expect(onChange).toHaveBeenCalledWith("ssr");
  });

  it("keeps the letter keys out of the accessible names", () => {
    renderList();
    expect(screen.getByText("A").closest('[aria-hidden="true"]')).not.toBeNull();
    expect(screen.getByText("B").closest('[aria-hidden="true"]')).not.toBeNull();
  });
});
