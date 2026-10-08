import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { selectTaskNote, useTaskNoteStore } from "@/entities/task-note";
import { TaskNotes } from "./TaskNotes";

describe("TaskNotes", () => {
  beforeEach(() => {
    useTaskNoteStore.setState({ notes: {} });
  });

  it("saves the note text and shows it rendered as markdown", () => {
    render(<TaskNotes taskId="algo1" />);

    fireEvent.change(screen.getByLabelText("Текст заметки"), { target: { value: "**важно**" } });
    expect(selectTaskNote("algo1")(useTaskNoteStore.getState()).text).toBe("**важно**");

    fireEvent.click(screen.getByRole("button", { name: "Просмотр" }));
    expect(screen.getByText("важно").tagName).toBe("STRONG");
  });

  it("logs a mistake only after a reason is chosen", () => {
    render(<TaskNotes taskId="algo1" />);
    const addButton = screen.getByRole("button", { name: "Записать ошибку" });
    expect(addButton).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Граничные случаи" }));
    fireEvent.change(screen.getByLabelText("Комментарий к ошибке"), {
      target: { value: "пустой массив" },
    });
    fireEvent.click(addButton);

    const { mistakes } = selectTaskNote("algo1")(useTaskNoteStore.getState());
    expect(mistakes).toHaveLength(1);
    expect(mistakes[0]).toMatchObject({ reasonId: "edge-cases", comment: "пустой массив" });
    expect(screen.getByText("пустой массив")).toBeInTheDocument();
    expect(addButton).toBeDisabled();
  });

  it("deletes a journal entry", () => {
    useTaskNoteStore.getState().addMistake("algo1", "idea");
    render(<TaskNotes taskId="algo1" />);

    fireEvent.click(screen.getByRole("button", { name: "Удалить запись об ошибке" }));

    expect(screen.getByText("Ошибок не записано.")).toBeInTheDocument();
  });
});
