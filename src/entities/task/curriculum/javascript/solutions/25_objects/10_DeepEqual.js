const deepEqual = (a, b) => {
  // 1. Проверка SameValue (включая NaN === NaN и одинаковые ссылки)
  if (Object.is(a, b)) {
    return true;
  }

  // 2. Если хотя бы один из аргументов не объект или null — они не равны
  if (
    a === null ||
    typeof a !== "object" ||
    b === null ||
    typeof b !== "object"
  ) {
    return false;
  }

  // 3. Если один массив, а другой нет — не равны
  if (Array.isArray(a) !== Array.isArray(b)) {
    return false;
  }

  // 4. Сравнение количества ключей
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // 5. Рекурсивное сравнение каждого ключа
  for (const key of keysA) {
    if (!Object.hasOwn(b, key) || !deepEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
};

// Пример вызова:
console.log(deepEqual(1, 1));                                                // true
console.log(deepEqual(NaN, NaN));                                            // true
console.log(deepEqual(null, undefined));                                     // false
console.log(deepEqual([1, [2, 3]], [1, [2, 3]]));                            // true
console.log(deepEqual([1, 2], [1, 2, 3]));                                   // false
console.log(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }));        // true
console.log(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 }));                      // true
console.log(deepEqual({ a: 1 }, { a: 1, b: undefined }));                    // false
