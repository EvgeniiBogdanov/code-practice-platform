const rob = (nums) => {
  // best — максимум для уже рассмотренных домов, beforeBest — максимум без последнего из них
  let beforeBest = 0;
  let best = 0;

  for (const money of nums) {
    // Либо пропускаем этот дом (best), либо грабим его и берём лучшее без соседа
    [beforeBest, best] = [best, Math.max(best, beforeBest + money)];
  }

  return best;
};

// Пример вызова:
console.log(rob([5, 1, 1, 5]));          // 10
console.log(rob([3, 10, 3, 1, 2]));      // 12
console.log(rob([6, 7, 1, 3, 8, 2, 4])); // 19
console.log(rob([10]));                  // 10
