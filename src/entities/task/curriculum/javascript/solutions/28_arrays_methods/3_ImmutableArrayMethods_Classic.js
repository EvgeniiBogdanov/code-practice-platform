const products = [
  { name: "Мышь", price: 1500 },
  { name: "Клавиатура", price: 3000 },
  { name: "Коврик", price: 500 },
];

// Классический вариант для окружений без ES2023: сначала копия, потом мутирующий метод
const sortByPrice = (products) => [...products].sort((a, b) => a.price - b.price);

const replaceAt = (arr, index, value) => {
  const target = index < 0 ? arr.length + index : index;
  return arr.map((item, i) => (i === target ? value : item));
};

const removeAt = (arr, index) => arr.filter((_, i) => i !== index);

const reverseCopy = (arr) => [...arr].reverse();

// Пример вызова:
console.log(sortByPrice(products).map((p) => p.name)); // ["Коврик", "Мышь", "Клавиатура"]
console.log(products[0].name); // "Мышь"
console.log(replaceAt([1, 2, 3], 1, 20)); // [1, 20, 3]
console.log(replaceAt([1, 2, 3], -1, 30)); // [1, 2, 30]
console.log(removeAt(["a", "b", "c"], 0)); // ["b", "c"]
console.log(reverseCopy([1, 2, 3])); // [3, 2, 1]
