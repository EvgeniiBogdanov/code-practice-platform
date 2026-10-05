import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { useUIStore } from "@/entities/ui-state";
import { useLocalAccountStore } from "@/shared/auth";
import { SettingsModal } from "./SettingsModal";

vi.mock("@tanstack/react-router", () => ({ useLocation: () => ({ pathname: "/" }) }));

const confirmDialog = (): HTMLElement => {
  const dialog = screen.getByText("Выйти из профиля?").closest<HTMLElement>("[role='dialog']");
  if (!dialog) throw new Error("The sign-out confirmation is not open");
  return dialog;
};
const signOutButton = (): HTMLElement => screen.getByRole("button", { name: "Выйти из профиля" });

describe("SettingsModal sign out", () => {
  beforeEach(() => {
    localStorage.clear();
    useUIStore.setState({ settingsModalOpen: true });
    useLocalAccountStore.setState({ account: { name: "Анна", createdAt: 1 } });
  });

  it("asks for confirmation instead of signing out on the first click", () => {
    render(<SettingsModal />);
    fireEvent.click(signOutButton());

    const dialog = confirmDialog();
    expect(within(dialog).getByText(/профиля «Анна»/)).toBeInTheDocument();
    expect(useLocalAccountStore.getState().account?.name).toBe("Анна");
  });

  it("keeps the session when the user cancels", () => {
    render(<SettingsModal />);
    fireEvent.click(signOutButton());
    fireEvent.click(
      within(confirmDialog()).getByRole("button", {
        name: "Отмена",
      })
    );

    expect(screen.queryByText("Выйти из профиля?")).not.toBeInTheDocument();
    expect(useLocalAccountStore.getState().account?.name).toBe("Анна");
    expect(useUIStore.getState().settingsModalOpen).toBe(true);
  });

  it("signs out only after the user confirms", () => {
    render(<SettingsModal />);
    fireEvent.click(signOutButton());
    fireEvent.click(
      within(confirmDialog()).getByRole("button", {
        name: "Выйти",
      })
    );

    expect(useLocalAccountStore.getState().account).toBeNull();
  });

  it("closes only the confirmation on Escape, not the settings behind it", () => {
    render(<SettingsModal />);
    fireEvent.click(signOutButton());

    fireEvent.keyDown(window, { key: "Escape" });

    expect(screen.queryByText("Выйти из профиля?")).not.toBeInTheDocument();
    expect(useUIStore.getState().settingsModalOpen).toBe(true);
    expect(useLocalAccountStore.getState().account?.name).toBe("Анна");
  });
});
