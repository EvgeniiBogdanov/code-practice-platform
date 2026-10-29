export type SaveStatus = "saving" | "saved" | "error";

export interface DraftAutosaveOptions {
  delayMs: number;
  version: number;
  onStatus?: (status: SaveStatus) => void;
}

export interface DraftAutosave<V> {
  change: (values: V) => void;
  flush: () => Promise<void>;
}

export function createDraftAutosave<V>(
  save: (values: V, version: number) => Promise<{ version: number }>,
  { delayMs, version: initialVersion, onStatus = () => {} }: DraftAutosaveOptions
): DraftAutosave<V> {
  let version = initialVersion;
  // Обёртка отличает «нечего сохранять» от значений, которые сами могут быть пустыми.
  let pending: { values: V } | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let inflight: Promise<void> | null = null;

  const drain = async (): Promise<void> => {
    while (pending) {
      const { values } = pending;
      pending = null;
      onStatus("saving");
      try {
        ({ version } = await save(values, version));
      } catch {
        // Если во время запроса пришли новые значения, они важнее неудачных.
        if (!pending) pending = { values };
        onStatus("error");
        return;
      }
    }
    onStatus("saved");
  };

  const flush = (): Promise<void> => {
    if (timer !== null) clearTimeout(timer);
    timer = null;
    // Запрос уже идёт: новые значения он заберёт сам, когда завершится.
    if (inflight) return inflight;
    if (!pending) return Promise.resolve();
    inflight = drain().finally(() => {
      inflight = null;
    });
    return inflight;
  };

  const change = (values: V): void => {
    pending = { values };
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      void flush();
    }, delayMs);
  };

  return { change, flush };
}
