// Заявку заполняют 15 минут, и черновик должен сохраняться сам. Сохранять каждое нажатие
// дорого, а параллельные запросы опасны: старый ответ может прийти последним и затереть
// новые данные. Сервер хранит версию черновика и отклоняет сохранение с устаревшей версией.
//
// Реализуйте createDraftAutosave(save, { delayMs, version, onStatus }):
// - change(values) запоминает значения и откладывает сохранение до паузы delayMs;
//   серия изменений даёт одно сохранение с последними значениями;
// - save(values, version) получает версию из последнего успешного ответа сервера
//   ({ version } из save) или начальную version, если ответов ещё не было;
// - одновременно идёт не больше одного save: изменения, пришедшие во время запроса,
//   сохраняются следующим запросом сразу после его завершения;
// - flush() сохраняет несохранённое сразу, не дожидаясь паузы (при смене шага и перед
//   отправкой), и завершается, когда сохранять больше нечего или сохранение не удалось;
//   без несохранённых изменений и запроса в полёте завершается сразу и ничего не шлёт;
// - onStatus("saving") — перед каждым запросом, onStatus("saved") — когда всё сохранено,
//   onStatus("error") — при отказе save;
// - после отказа значения не теряются: следующий change или flush сохраняет их снова,
//   а более новые изменения, пришедшие во время запроса, не затираются старыми.

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
  { delayMs, version, onStatus = () => {} }: DraftAutosaveOptions
): DraftAutosave<V> {
  return {
    change: (values: V) => {
      save(values, version).catch(() => {});
    },
    flush: async () => {},
  };
}
