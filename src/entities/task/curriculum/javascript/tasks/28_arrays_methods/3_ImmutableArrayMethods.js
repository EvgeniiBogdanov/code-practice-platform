// Неизменяемые методы массивов (ES2023): toSorted, toReversed, toSpliced, with
// Реализуйте функции, НЕ изменяя исходный массив:
// 1. sortByPrice(products) — новый массив, отсортированный по цене по возрастанию
// 2. replaceAt(arr, index, value) — новый массив с заменённым элементом (поддержите отрицательный индекс)
// 3. removeAt(arr, index) — новый массив без элемента по индексу
// 4. reverseCopy(arr) — перевёрнутая копия

const products = [
  { name: "Мышь", price: 1500 },
  { name: "Клавиатура", price: 3000 },
  { name: "Коврик", price: 500 },
];

const sortByPrice = (products) => {
  // Решение тут
};

const replaceAt = (arr, index, value) => {
  // Решение тут
};

const removeAt = (arr, index) => {
  // Решение тут
};

const reverseCopy = (arr) => {
  // Решение тут
};

// Пример вызова:
console.log(sortByPrice(products).map((p) => p.name)); // ["Коврик", "Мышь", "Клавиатура"]
console.log(products[0].name); // "Мышь" — исходный массив не изменился
console.log(replaceAt([1, 2, 3], 1, 20)); // [1, 20, 3]
console.log(replaceAt([1, 2, 3], -1, 30)); // [1, 2, 30]
console.log(removeAt(["a", "b", "c"], 0)); // ["b", "c"]
console.log(reverseCopy([1, 2, 3])); // [3, 2, 1]
