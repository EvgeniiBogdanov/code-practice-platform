export interface SwrCacheOptions {
  staleMs: number;
}

export interface SwrCache<V> {
  get: (key: string) => Promise<V>;
  invalidate: (key: string) => void;
}

interface Entry<V> {
  value: V;
  storedAt: number;
}

export function createSwrCache<V>(
  fetcher: (key: string) => Promise<V>,
  { staleMs }: SwrCacheOptions
): SwrCache<V> {
  const entries = new Map<string, Entry<V>>();
  // Одно обновление на ключ: повторный get не запускает второй запрос.
  const inflight = new Map<string, Promise<V>>();

  const revalidate = (key: string): Promise<V> => {
    const pending = inflight.get(key);
    if (pending) return pending;
    const request = fetcher(key)
      .then((value) => {
        entries.set(key, { value, storedAt: Date.now() });
        return value;
      })
      .finally(() => {
        inflight.delete(key);
      });
    inflight.set(key, request);
    return request;
  };

  const get = (key: string): Promise<V> => {
    const entry = entries.get(key);
    if (!entry) return revalidate(key);
    if (Date.now() - entry.storedAt >= staleMs) {
      // Ошибка фонового обновления не должна уйти наружу: запись остаётся прежней.
      revalidate(key).catch(() => {});
    }
    return Promise.resolve(entry.value);
  };

  const invalidate = (key: string): void => {
    entries.delete(key);
  };

  return { get, invalidate };
}
