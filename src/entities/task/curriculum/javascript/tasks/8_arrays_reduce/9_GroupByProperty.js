// Группировка объектов по свойству
// Напишите функцию groupBy(arr, key), которая группирует массив объектов по указанному ключу.

const people = [
  { age: 20, name: "Alice" },
  { age: 30, name: "Brat" },
  { age: 20, name: "Sem" },
];

const groupBy = (arr, key) => {
  // Решение тут
};

// Пример вызова:
console.log(groupBy(people, "age"));
// {
//   "20": [{ age: 20, name: "Alice" }, { age: 20, name: "Sem" }],
//   "30": [{ age: 30, name: "Brat" }]
// }
