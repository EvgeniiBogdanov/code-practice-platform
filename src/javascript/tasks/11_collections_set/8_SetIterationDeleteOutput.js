// Удаление элементов во время итерации по Set
// Что выведет данный код?

const set = new Set([1, 2, 3, 4]);

for (const v of set) {
  console.log("iter", v);
  if (v % 2 === 0) {
    set.delete(v);
  }
}

console.log("final", [...set]);
