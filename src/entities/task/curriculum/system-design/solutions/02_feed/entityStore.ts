export interface Entity {
  id: string;
}

export interface EntityStore<T extends Entity> {
  upsertMany: (items: readonly T[]) => void;
  getById: (id: string) => T | undefined;
  getAll: (ids: readonly string[]) => T[];
  remove: (id: string) => void;
  subscribe: (listener: () => void) => () => void;
}

export function createEntityStore<T extends Entity>(): EntityStore<T> {
  const entities = new Map<string, T>();
  const listeners = new Set<() => void>();

  const notify = (): void => listeners.forEach((listener) => listener());

  // Сущность не изменилась, если каждое пришедшее поле уже равно хранимому.
  const hasChanges = (current: T, patch: T): boolean =>
    Object.entries(patch).some(([key, value]) => !Object.is(current[key as keyof T], value));

  const upsertMany = (items: readonly T[]): void => {
    let changed = false;
    for (const item of items) {
      const current = entities.get(item.id);
      if (!current) {
        entities.set(item.id, item);
        changed = true;
      } else if (hasChanges(current, item)) {
        entities.set(item.id, { ...current, ...item });
        changed = true;
      }
    }
    if (changed) notify();
  };

  const remove = (id: string): void => {
    if (entities.delete(id)) notify();
  };

  const getAll = (ids: readonly string[]): T[] =>
    ids.flatMap((id) => {
      const entity = entities.get(id);
      return entity ? [entity] : [];
    });

  const subscribe = (listener: () => void): (() => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  return { upsertMany, getById: (id) => entities.get(id), getAll, remove, subscribe };
}
