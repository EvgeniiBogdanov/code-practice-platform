import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { readLocalAccount, useLocalAccountStore } from "@/shared/auth";
import { CreateAccountForm } from "./CreateAccountForm";

const typeName = (value: string): void => {
  fireEvent.change(screen.getByLabelText("Как к тебе обращаться?"), { target: { value } });
};

const submit = (): void => {
  fireEvent.click(screen.getByRole("button", { name: /Создать локальный аккаунт/ }));
};

describe("CreateAccountForm", () => {
  afterEach(() => {
    window.localStorage.clear();
    useLocalAccountStore.setState({ account: null });
  });

  it("shows a validation error and does not create the account", () => {
    const onAccountCreated = vi.fn();
    render(<CreateAccountForm onAccountCreated={onAccountCreated} />);

    typeName("  ");
    submit();

    expect(screen.getByRole("alert")).toHaveTextContent(/Введите имя/);
    expect(screen.getByLabelText("Как к тебе обращаться?")).toHaveAttribute("aria-invalid", "true");
    expect(onAccountCreated).not.toHaveBeenCalled();
    expect(readLocalAccount()).toBeNull();
  });

  it("stores the account and opens the requested workspace path", () => {
    const onAccountCreated = vi.fn();
    render(
      <CreateAccountForm
        onAccountCreated={onAccountCreated}
        target={{ path: "/javascript/js158", label: "Полифил Promise.all" }}
      />
    );

    expect(screen.getByText("Полифил Promise.all")).toBeInTheDocument();

    typeName("Ада");
    submit();

    expect(readLocalAccount()?.name).toBe("Ада");
    expect(useLocalAccountStore.getState().account?.name).toBe("Ада");
    expect(onAccountCreated).toHaveBeenCalledWith("/javascript/js158");
    expect(screen.getByRole("button", { name: /Открываем платформу/ })).toBeInTheDocument();
  });

  it("submits only once while the workspace is loading", () => {
    const onAccountCreated = vi.fn();
    render(<CreateAccountForm onAccountCreated={onAccountCreated} />);

    typeName("Линус");
    submit();
    fireEvent.click(screen.getByRole("button", { name: /Открываем платформу/ }));

    expect(onAccountCreated).toHaveBeenCalledTimes(1);
    expect(onAccountCreated).toHaveBeenCalledWith(undefined);
  });

  it("mirrors the typed name for live previews", () => {
    const onNameChange = vi.fn();
    render(<CreateAccountForm onAccountCreated={vi.fn()} onNameChange={onNameChange} />);

    typeName("Грейс");

    expect(onNameChange).toHaveBeenLastCalledWith("Грейс");
  });
});
