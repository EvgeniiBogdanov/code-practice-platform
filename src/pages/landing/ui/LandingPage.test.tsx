import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { CURRICULUM_COUNTS } from "@/entities/task/meta";
import { useLocalAccountStore } from "@/shared/auth";
import { useCreateAccountDialog } from "../model/createAccountDialog";
import { LandingPage } from "./LandingPage";

const TOTAL = Object.values(CURRICULUM_COUNTS).reduce((sum, count) => sum + count, 0);

describe("LandingPage", () => {
  afterEach(() => {
    window.localStorage.clear();
    useLocalAccountStore.setState({ account: null });
    useCreateAccountDialog.getState().close();
  });

  it("renders the hero and every section anchored from the navigation", () => {
    render(<LandingPage onAccountCreated={vi.fn()} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Практика, которая держит тебя в форме"
    );
    for (const id of ["practice", "catalog", "probability", "editor", "runner", "start"]) {
      expect(document.getElementById(id)).toBeInTheDocument();
    }
    expect(screen.getAllByText(new RegExp(`${TOTAL} задач`)).length).toBeGreaterThan(0);
  });

  it("opens the sign-up dialog from the hero call to action", () => {
    render(<LandingPage onAccountCreated={vi.fn()} />);
    const hero = screen.getByRole("region", { name: /Практика, которая/ });

    fireEvent.click(within(hero).getByRole("button", { name: /Создать локальный аккаунт/ }));

    expect(screen.getByRole("dialog")).toHaveTextContent("Займёт пять секунд");
  });

  it("remembers the task picked in the palette demo as the post sign-up target", () => {
    render(<LandingPage onAccountCreated={vi.fn()} />);
    const search = screen.getByRole("textbox", { name: /Command Palette/ });

    fireEvent.focus(search);
    fireEvent.change(search, { target: { value: "promise" } });
    fireEvent.keyDown(search, { key: "Enter" });

    expect(useCreateAccountDialog.getState().target).toEqual({
      path: "/javascript/js158",
      label: "Полифил Promise.all",
    });
    expect(screen.getByRole("dialog")).toHaveTextContent("Полифил Promise.all");
  });
});
