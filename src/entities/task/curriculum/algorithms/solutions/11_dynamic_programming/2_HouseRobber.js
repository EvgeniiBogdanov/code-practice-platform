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
console.log(rob([1, 2, 3, 1]));    // 4
console.log(rob([2, 7, 9, 3, 1])); // 12
console.log(rob([5]));             // 5
