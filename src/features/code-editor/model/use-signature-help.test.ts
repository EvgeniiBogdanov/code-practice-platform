import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { TypeScriptSignature } from "@/shared/lib/code-editor";
import { useSignatureHelp } from "./use-signature-help";

const SIGNATURE: TypeScriptSignature = {
  signature: "log(...data: any[]): void",
  activeParameter: 0,
  documentation: "",
  parameters: [{ start: 4, end: 20 }],
};

const setup = (triggerOnType = false) => {
  const pending: Array<(signature: TypeScriptSignature | null) => void> = [];
  const requestSignature = vi.fn(
    () => new Promise<TypeScriptSignature | null>((resolve) => pending.push(resolve))
  );
  const textareaRef = { current: document.createElement("textarea") };
  const hook = renderHook(
    ({ code, offset }: { code: string; offset: number }) =>
      useSignatureHelp({
        code,
        cursorOffset: offset,
        enabled: true,
        triggerOnType,
        textareaRef,
        requestSignature,
      }),
    { initialProps: { code: "log", offset: 3 } }
  );
  return { ...hook, pending, requestSignature };
};

describe("useSignatureHelp", () => {
  it("does not open while typing a call", () => {
    const { result, rerender, requestSignature } = setup();

    rerender({ code: "log(", offset: 4 });
    rerender({ code: "log(x,", offset: 6 });
    expect(requestSignature).not.toHaveBeenCalled();
    expect(result.current.signature).toBeNull();
  });

  it("follows the caret once opened", async () => {
    const { result, rerender, pending } = setup();

    rerender({ code: "log(", offset: 4 });
    act(() => result.current.trigger());
    await act(async () => pending[0](SIGNATURE));
    rerender({ code: "log(x", offset: 5 });
    await act(async () => pending[1]({ ...SIGNATURE, activeParameter: 0 }));
    expect(result.current.signature).not.toBeNull();
  });

  it("opens on demand and closes when the caret leaves the call", async () => {
    const { result, rerender, pending } = setup();

    act(() => result.current.trigger());
    await act(async () => pending[0](SIGNATURE));
    expect(result.current.signature).toEqual(SIGNATURE);

    rerender({ code: "log", offset: 2 });
    await act(async () => pending[1](null));
    expect(result.current.signature).toBeNull();
  });

  it("opens on `(` when the setting allows it and survives fast typing", async () => {
    const { result, rerender, pending, requestSignature } = setup(true);

    rerender({ code: "log(", offset: 4 });
    rerender({ code: "log(x", offset: 5 });
    expect(requestSignature).toHaveBeenCalledTimes(2);

    await act(async () => {
      pending[0](SIGNATURE);
      pending[1](SIGNATURE);
    });
    expect(result.current.signature).toEqual(SIGNATURE);
  });
});
