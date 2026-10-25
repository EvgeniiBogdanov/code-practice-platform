// Поле автокомплита шлёт запрос на каждое нажатие клавиши: сервер перегружен,
// а ответы приходят вперемешку, и в списке остаются подсказки к старому запросу.
//
// Реализуйте createDebouncedSearch(delayMs, handlers):
// - search(query) ждёт паузу delayMs без новых вызовов и только потом отправляет
//   GET /api/search?q=<запрос>; в серии нажатий уходит один запрос, с последним текстом;
// - запрос обрезается по краям (trim) и кодируется через encodeURIComponent;
// - пустой запрос не уходит на сервер: сразу onResults([]);
// - новый вызов search отменяет и ожидающую паузу, и запрос, который уже в полёте
//   (AbortController), поэтому устаревший ответ не затирает свежий;
// - ответ — JSON-массив строк, он передаётся в onResults;
// - сетевая ошибка и ответ не 2xx уходят в onError; отмена (AbortError) — не ошибка;
// - cancel() отменяет всё ожидающее и запрос в полёте.

export interface SearchHandlers {
  onResults: (items: string[]) => void;
  onError: (error: unknown) => void;
}

export interface DebouncedSearch {
  search: (query: string) => void;
  cancel: () => void;
}

export function createDebouncedSearch(delayMs: number, handlers: SearchHandlers): DebouncedSearch {
  return {
    search: () => {},
    cancel: () => {},
  };
}
