// Лесенка качеств: 360p, 480p, 720p, 1080p.
const LEVELS = [500_000, 1_000_000, 2_500_000, 5_000_000];
const MBIT = 1_000_000;

const start = (options = {}) =>
  createAbrController(LEVELS, { alpha: 0.5, safety: 0.8, minBufferForUpSec: 10, ...options });

// Сегмент, скачанный со скоростью mbps мегабит в секунду за одну секунду.
const sampleAt = (abr, mbps) => abr.addSample((mbps * MBIT) / 8, 1000);

describe("оценка сети", () => {
  test("без замеров оценки нет, первый замер становится оценкой", () => {
    const abr = start();
    expect(abr.estimate()).toBe(null);
    abr.addSample(250_000, 1000);
    expect(abr.estimate()).toBe(2 * MBIT);
  });

  test("следующие замеры сглаживаются с весом alpha", () => {
    const abr = start();
    sampleAt(abr, 2);
    sampleAt(abr, 4);
    expect(abr.estimate()).toBe(3 * MBIT);
    sampleAt(abr, 1);
    expect(abr.estimate()).toBe(2 * MBIT);
  });

  test("замеры с нулевой или отрицательной длительностью игнорируются", () => {
    const abr = start();
    sampleAt(abr, 2);
    abr.addSample(1_000_000, 0);
    abr.addSample(1_000_000, -5);
    expect(abr.estimate()).toBe(2 * MBIT);
  });
});

describe("выбор качества", () => {
  test("без замеров стартуем с самого низкого качества", () => {
    expect(start().choose(30)).toBe(0);
  });

  test("цель — лучшее качество, которое влезает в оценку с запасом", () => {
    const abr = start();
    sampleAt(abr, 3);
    // 3 Мбит/с × 0.8 = 2.4: 720p (2.5) уже не влезает, цель — 480p.
    expect(abr.choose(30)).toBe(1);
    expect(abr.choose(30)).toBe(1);
  });

  test("вверх — по одной ступени за раз", () => {
    const abr = start();
    sampleAt(abr, 20);
    expect([abr.choose(30), abr.choose(30), abr.choose(30), abr.choose(30)]).toEqual([1, 2, 3, 3]);
  });

  test("при маленьком буфере качество не повышается", () => {
    const abr = start();
    sampleAt(abr, 20);
    expect(abr.choose(5)).toBe(0);
    expect(abr.choose(9.9)).toBe(0);
    expect(abr.choose(10)).toBe(1);
  });

  test("вниз — сразу до цели, даже при пустом буфере", () => {
    const abr = start({ alpha: 1 });
    sampleAt(abr, 20);
    [1, 2, 3].forEach(() => abr.choose(30));
    sampleAt(abr, 0.4);
    expect(abr.choose(0)).toBe(0);
  });

  test("один медленный сегмент не обваливает качество", () => {
    const abr = start({ alpha: 0.25 });
    sampleAt(abr, 12);
    [1, 2, 3].forEach(() => abr.choose(30));
    sampleAt(abr, 0.8);
    // Оценка 0.25 × 0.8 + 0.75 × 12 = 9.2 Мбит/с: 1080p всё ещё влезает.
    expect(abr.choose(30)).toBe(3);
  });
});
