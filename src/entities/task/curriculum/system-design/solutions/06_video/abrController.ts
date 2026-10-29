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
  let estimate: number | null = null;
  let current = 0;

  const addSample = (bytes: number, ms: number): void => {
    if (ms <= 0) return;
    const sample = (bytes * 8) / (ms / 1000);
    // Экспоненциальное сглаживание: один выброс сдвигает оценку лишь на долю alpha.
    estimate = estimate === null ? sample : alpha * sample + (1 - alpha) * estimate;
  };

  /** Самое высокое качество, которое влезает в бюджет; иначе самое низкое. */
  const affordable = (budget: number): number => {
    let target = 0;
    levels.forEach((bitrate, index) => {
      if (bitrate <= budget) target = index;
    });
    return target;
  };

  const choose = (bufferSec: number): number => {
    if (estimate === null) {
      current = 0;
      return current;
    }
    const target = affordable(estimate * safety);
    // Вниз — сразу: пауза хуже мыла. Вверх — осторожно: по ступени и с запасом буфера.
    if (target < current) current = target;
    else if (target > current && bufferSec >= minBufferForUpSec) current += 1;
    return current;
  };

  return { addSample, estimate: () => estimate, choose };
}
