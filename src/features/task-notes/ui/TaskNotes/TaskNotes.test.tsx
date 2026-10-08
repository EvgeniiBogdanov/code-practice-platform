import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useTaskNoteStore } from "@/entities/task-note";
import { TaskNotes } from "./TaskNotes";

describe("TaskNotes", () => {
  beforeEach(() => {
    useTaskNoteStore.setState({ notes: {} });
  });

  it("shows the saved markdown as a rendered page, without the markup", async () => {
    useTaskNoteStore.getState().setNoteText("algo1", "# Идея\n\nВажно: **два указателя**");
    render(<TaskNotes taskId="algo1" />);

    expect(await screen.findByRole("heading", { name: "Идея" })).toBeInTheDocument();
    expect(screen.getByText("два указателя").tagName).toBe("STRONG");
    expect(screen.queryByText(/#|\*\*/)).not.toBeInTheDocument();
  });

  it("offers the empty page as an editable area", async () => {
    render(<TaskNotes taskId="algo1" />);

    expect(await screen.findByLabelText("Текст заметки")).toHaveAttribute(
      "contenteditable",
      "true"
    );
  });
});
