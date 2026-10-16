import { expect, test } from "./fixtures";

/** ~600 lines of valid JSX, ten times a typical task file: no diagnostics repaint the layer. */
const LONG_FILE = `import { useState } from "react";\n\n${Array.from(
  { length: 60 },
  (_, index) => `export function Item${index}({ value }) {
  const [open, setOpen] = useState(false);
  const label = value > 10 ? "big" : "small";
  return (
    <li className="item" onClick={() => setOpen((o) => !o)}>
      {label}: {open ? value * 2 : value}
    </li>
  );
}
`
).join("\n")}`;
/** Generous on purpose: timing on shared CI runners is noisy, the DOM checks are exact. */
const KEYSTROKE_BUDGET_MS = 50;

interface TypingReport {
  /** Median time from input to the end of the synchronous React commit. */
  medianMs: number;
  /** Most highlight-layer rows a single keystroke rewrote, added or removed. */
  maxRowsTouched: number;
  /** Rows of the highlight layer touched while the caret only moved. */
  caretMoveRows: number;
}

test("typing in a long file rewrites only the edited line", async ({ page }) => {
  await page.goto("editor");
  const editor = page.getByRole("textbox", { name: "Редактор кода" });
  await expect(editor).toBeVisible();

  const report = await editor.evaluate(async (node, longFile): Promise<TypingReport> => {
    if (!(node instanceof HTMLTextAreaElement)) throw new Error("The editor is not a textarea");
    const textarea = node;
    const rows = textarea.parentElement?.querySelector("pre code");
    if (!rows) throw new Error("The highlight layer is missing");
    const tick = (): Promise<void> =>
      new Promise((resolve) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = () => resolve();
        channel.port2.postMessage(null);
      });
    const settle = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
    // A rewritten row reports itself as the target; added or removed rows report the layer.
    const countRows = (records: MutationRecord[]): number => {
      const touched = new Set<Node>();
      let addedOrRemoved = 0;
      for (const record of records) {
        if (record.target === rows)
          addedOrRemoved += record.addedNodes.length + record.removedNodes.length;
        else touched.add(record.target);
      }
      return touched.size + addedOrRemoved;
    };

    textarea.focus();
    textarea.select();
    document.execCommand("insertText", false, longFile);
    // The language service starts cold: let the first analysis land before measuring.
    await settle(3000);
    // Typing inside a string literal keeps the analysis of the file unchanged.
    const caret = textarea.value.indexOf('"small"', textarea.value.length / 2) + 3;
    textarea.setSelectionRange(caret, caret);

    let pending: MutationRecord[] = [];
    const observer = new MutationObserver((records) => pending.push(...records));
    const flush = (): MutationRecord[] => {
      const records = [...pending, ...observer.takeRecords()];
      pending = [];
      return records;
    };
    observer.observe(rows, { childList: true, subtree: true });
    const times: number[] = [];
    let maxRowsTouched = 0;
    for (let index = 0; index < 30; index++) {
      const start = performance.now();
      document.execCommand("insertText", false, "a");
      await tick();
      times.push(performance.now() - start);
      maxRowsTouched = Math.max(maxRowsTouched, countRows(flush()));
      await settle(10);
    }

    await settle(1000);
    flush();
    for (let index = 0; index < 10; index++) {
      const next = textarea.selectionStart + 1;
      textarea.setSelectionRange(next, next);
      textarea.dispatchEvent(new KeyboardEvent("keyup", { key: "ArrowRight", bubbles: true }));
      await tick();
    }
    const caretMoveRows = countRows(flush());
    observer.disconnect();

    times.sort((a, b) => a - b);
    return { medianMs: times[times.length >> 1], maxRowsTouched, caretMoveRows };
  }, LONG_FILE);

  // The edited line is rewritten in place; the other ~600 rows keep their DOM.
  expect(report.maxRowsTouched).toBe(1);
  expect(report.caretMoveRows).toBe(0);
  expect(report.medianMs).toBeLessThan(KEYSTROKE_BUDGET_MS);
});
