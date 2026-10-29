// Плеер качает видео сегментами и перед каждым выбирает качество. Скорость последнего сегмента
// для этого не годится: один медленный сегмент уронит качество, один быстрый задерёт, и картинка
// будет скакать. Нужна сглаженная оценка сети и осторожные переключения.
//
// Реализуйте createAbrController(levels, { alpha, safety, minBufferForUpSec }):
// - levels — битрейты качеств в бит/с по возрастанию; контроллер работает с индексами levels;
// - addSample(bytes, ms) добавляет замер загрузки сегмента: скорость = bytes * 8 / (ms / 1000);
//   первый замер становится оценкой, дальше оценка = alpha * замер + (1 - alpha) * оценка;
//   замеры с ms <= 0 игнорируются;
// - estimate() возвращает оценку в бит/с или null, если замеров ещё не было;
// - choose(bufferSec) выбирает качество следующего сегмента и запоминает его как текущее:
//   - без замеров — самое низкое качество: старт должен быть быстрым;
//   - цель — самое высокое качество с битрейтом не больше estimate * safety,
//     если такого нет — самое низкое;
//   - вниз переключаемся сразу до цели, чтобы не кончился буфер;
//   - вверх — только на одну ступень за раз и только если буфер не меньше minBufferForUpSec,
//     иначе остаёмся на текущем качестве.

export interface AbrOptions {
  alpha: number;
  safety: number;
  minBufferForUpSec: number;
}

export interface AbrController {
  addSample: (bytes: number, ms: number) => void;
  estimate: () => number | null;
  choose: (bufferSec: number) => number;
}

export function createAbrController(
  levels: readonly number[],
  { alpha, safety, minBufferForUpSec }: AbrOptions
): AbrController {
  // Оценка — скорость последнего сегмента, качество — лучшее, что в неё влезает.
  let last: number | null = null;
  return {
    addSample: (bytes, ms) => {
      last = (bytes * 8) / (ms / 1000);
    },
    estimate: () => last,
    choose: () => {
      let index = 0;
      levels.forEach((bitrate, i) => {
        if (last !== null && bitrate <= last) index = i;
      });
      return index;
    },
  };
}
