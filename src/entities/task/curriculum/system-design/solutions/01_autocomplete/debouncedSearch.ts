export interface SearchHandlers {
  onResults: (items: string[]) => void;
  onError: (error: unknown) => void;
}

export interface DebouncedSearch {
  search: (query: string) => void;
  cancel: () => void;
}

export function createDebouncedSearch(
  delayMs: number,
  { onResults, onError }: SearchHandlers
): DebouncedSearch {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let controller: AbortController | undefined;
  // Номер последней «эпохи»: любой ответ из прошлой эпохи устарел и отбрасывается.
  let epoch = 0;

  const cancel = (): void => {
    clearTimeout(timer);
    controller?.abort();
    controller = undefined;
    epoch += 1;
  };

  const request = async (query: string): Promise<void> => {
    const current = epoch;
    controller = new AbortController();
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const items: string[] = await response.json();
      if (current === epoch) onResults(items);
    } catch (error) {
      if (current === epoch) onError(error);
    }
  };

  const search = (query: string): void => {
    cancel();
    const text = query.trim();
    if (text === "") {
      onResults([]);
      return;
    }
    timer = setTimeout(() => void request(text), delayMs);
  };

  return { search, cancel };
}
