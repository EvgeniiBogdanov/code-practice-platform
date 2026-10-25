// Одни и те же запросы автокомплита повторяются: «re», «rea», стёрли букву, снова «rea».
// Нужен кэш ответов в памяти, который не растёт бесконечно и не отдаёт устаревшее.
//
// Реализуйте createQueryCache({ maxSize, ttlMs }):
// - set(key, value) кладёт значение; get(key) возвращает его или undefined;
// - значение живёт ttlMs миллисекунд (время берите из Date.now()): позже get
//   возвращает undefined, а запись удаляется;
// - в кэше не больше maxSize записей; при переполнении вытесняется давно
//   не использованная запись (LRU): чтение через get тоже «освежает» запись;
// - повторный set того же ключа заменяет значение, продлевает срок жизни
//   и освежает запись, но не вытесняет чужие;
// - size() возвращает число живых записей (просроченные не считаются).

export interface QueryCacheOptions {
  maxSize: number;
  ttlMs: number;
}

export interface QueryCache<V> {
  get: (key: string) => V | undefined;
  set: (key: string, value: V) => void;
  size: () => number;
}

export function createQueryCache<V>(options: QueryCacheOptions): QueryCache<V> {
  return {
    get: () => undefined,
    set: () => {},
    size: () => 0,
  };
}
