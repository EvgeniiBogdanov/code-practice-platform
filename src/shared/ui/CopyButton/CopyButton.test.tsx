import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { CopyButton } from "./CopyButton";

afterEach(() => vi.unstubAllGlobals());

it("copies from an accessible icon-only control and reports completion", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal("navigator", { clipboard: { writeText } });
  render(<CopyButton textToCopy="const answer = 42;" label="Скопировать код" iconOnly />);
  const button = screen.getByRole("button", { name: "Скопировать код" });
  fireEvent.click(button);
  await waitFor(() => expect(button).toHaveAttribute("title", "Скопировано"));
  expect(writeText).toHaveBeenCalledWith("const answer = 42;");
});

it("keeps the existing text button as the default", () => {
  render(<CopyButton textToCopy="answer" />);
  expect(screen.getByRole("button", { name: "Копировать" })).toHaveTextContent("Копировать");
});
