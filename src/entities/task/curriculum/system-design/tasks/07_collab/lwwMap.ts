// Свойства блоков документа (тип блока, выравнивание, цвет) правят несколько человек сразу.
// Посимвольная трансформация здесь не нужна, хватит правила «побеждает последняя запись».
// Но «последнюю» нельзя определять по часам браузеров: они расходятся на секунды и минуты.
// Используются логические часы Лэмпорта, и тогда все копии приходят к одному значению
// в любом порядке доставки операций. Это простейший CRDT: LWW-словарь.
//
// Реализуйте createLwwMap(site):
// - set(key, value) записывает значение локально и возвращает операцию
//   { key, value, clock: { counter, site } } для рассылки соавторам;
// - remove(key) — то же, что set со значением null (надгробие): ключ пропадает из snapshot,
//   но запись помнит часы, чтобы опоздавшая старая операция не вернула значение;
// - counter локальной операции на единицу больше наибольшего counter, который эта копия
//   уже видела (в своих или чужих операциях);
// - apply(op) применяет чужую операцию, только если её часы старше часов записи ключа:
//   сначала сравнивается counter, при равенстве — site (строки, больший побеждает);
//   возвращает true, если операция принята;
// - повторная и устаревшая операция ничего не меняют и возвращают false;
// - get(key) возвращает значение или undefined, snapshot() — объект без удалённых ключей.

export interface LwwClock {
  counter: number;
  site: string;
}

export interface LwwOp<V> {
  key: string;
  value: V | null;
  clock: LwwClock;
}

export interface LwwMap<V> {
  set: (key: string, value: V) => LwwOp<V>;
  remove: (key: string) => LwwOp<V>;
  apply: (op: LwwOp<V>) => boolean;
  get: (key: string) => V | undefined;
  snapshot: () => Record<string, V>;
}

export function createLwwMap<V>(site: string): LwwMap<V> {
  const values = new Map<string, V>();
  return {
    set: (key, value) => {
      values.set(key, value);
      return { key, value, clock: { counter: 0, site } };
    },
    remove: (key) => {
      values.delete(key);
      return { key, value: null, clock: { counter: 0, site } };
    },
    // Побеждает операция, которая пришла последней.
    apply: (op) => {
      if (op.value === null) values.delete(op.key);
      else values.set(op.key, op.value);
      return true;
    },
    get: (key) => values.get(key),
    snapshot: () => Object.fromEntries(values),
  };
}
