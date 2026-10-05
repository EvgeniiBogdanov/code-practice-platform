// Вариант без Set: includes на каждой итерации даёт O(n²)
const unique = (arr) =>
  arr.reduce((acc, item) => {
    if (!acc.includes(item)) {
      acc.push(item);
    }
    return acc;
  }, []);

// Пример вызова:
console.log(unique([1, 2, 2, 3, 4, 4, 5, 1])); // [1, 2, 3, 4, 5]
console.log(unique(["a", "b", "a", "a", "c"])); // ["a", "b", "c"]
console.log(unique([NaN, NaN, 0, -0])); // [NaN, 0] — includes тоже использует SameValueZero
console.log(unique([])); // []
