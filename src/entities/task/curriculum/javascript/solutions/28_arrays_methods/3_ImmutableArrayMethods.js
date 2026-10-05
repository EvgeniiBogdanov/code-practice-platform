const products = [
  { name: "Мышь", price: 1500 },
  { name: "Клавиатура", price: 3000 },
  { name: "Коврик", price: 500 },
];

// toSorted — как sort, но возвращает новый массив
const sortByPrice = (products) => products.toSorted((a, b) => a.price - b.price);

// with(index, value) — копия с заменой одного элемента, поддерживает отрицательный индекс
const replaceAt = (arr, index, value) => arr.with(index, value);

// toSpliced — как splice, но без мутации; возвращает массив-результат, а не удалённые элементы
const removeAt = (arr, index) => arr.toSpliced(index, 1);

// toReversed — перевёрнутая копия
const reverseCopy = (arr) => arr.toReversed();

// Пример вызова:
console.log(sortByPrice(products).map((p) => p.name)); // ["Коврик", "Мышь", "Клавиатура"]
console.log(products[0].name); // "Мышь" — исходный массив не изменился
console.log(replaceAt([1, 2, 3], 1, 20)); // [1, 20, 3]
console.log(replaceAt([1, 2, 3], -1, 30)); // [1, 2, 30]
console.log(removeAt(["a", "b", "c"], 0)); // ["b", "c"]
console.log(reverseCopy([1, 2, 3])); // [3, 2, 1]
