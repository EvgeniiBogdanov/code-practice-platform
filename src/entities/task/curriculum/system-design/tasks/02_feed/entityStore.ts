// Один и тот же пост виден в ленте, в профиле автора и в закладках. Если хранить
// копию в каждом списке, лайк придётся обновлять в трёх местах. Нормализованное
// хранилище держит каждую сущность один раз, а списки хранят только id.
//
// Реализуйте createEntityStore<T extends { id: string }>():
// - upsertMany(items): добавляет новые сущности, а для существующих объединяет поля
//   ({ ...старая, ...новая }), так что приход только части полей не стирает остальные;
// - getById(id) возвращает сущность или undefined; getAll(ids) — сущности по списку id
//   (неизвестные id пропускаются);
// - если после upsertMany сущность не изменилась, её объект остаётся тем же самым:
//   тогда React.memo не перерисует карточку; изменившаяся получает новый объект;
// - remove(id) удаляет сущность;
// - subscribe(listener) вызывает listener после каждого реального изменения
//   (не после upsertMany без изменений) и возвращает функцию отписки.

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
  return {
    upsertMany: () => {},
    getById: () => undefined,
    getAll: () => [],
    remove: () => {},
    subscribe: () => () => {},
  };
}
