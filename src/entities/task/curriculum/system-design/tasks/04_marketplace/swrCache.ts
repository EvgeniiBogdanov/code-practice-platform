// Карточка товара открывается часто, а цены и остатки меняются. Ждать сеть при каждом
// открытии медленно, показывать старую цену без попытки обновить — неверно.
// Нужен кэш stale-while-revalidate.
//
// Реализуйте createSwrCache(fetcher, { staleMs }):
// - get(key) без записи ждёт fetcher(key), сохраняет результат и возвращает его;
// - свежая запись (моложе staleMs) отдаётся без запроса к серверу;
// - устаревшая запись отдаётся сразу, а fetcher запускается в фоне и обновляет запись;
// - параллельные get устаревшего ключа не запускают второй запрос: пока обновление идёт,
//   новое не стартует;
// - ошибка фонового обновления не трогает запись и не отменяет ответ, который уже отдан;
// - invalidate(key) удаляет запись: следующий get ждёт сервер.

export interface SwrCacheOptions {
  staleMs: number;
}

export interface SwrCache<V> {
  get: (key: string) => Promise<V>;
  invalidate: (key: string) => void;
}

export function createSwrCache<V>(
  fetcher: (key: string) => Promise<V>,
  { staleMs }: SwrCacheOptions
): SwrCache<V> {
  return {
    get: (key: string) => fetcher(key),
    invalidate: () => {},
  };
}
