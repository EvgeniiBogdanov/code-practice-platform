// Напишите функцию groupBy(items, key), которая группирует массив объектов
// в Map по значению указанного свойства.

const users = [
  { name: "Аня", city: "Москва" },
  { name: "Петя", city: "Питер" },
  { name: "Оля", city: "Москва" },
];

const groupBy = (items, key) => {
  // Решение тут
};

// Пример вызова:
console.log(groupBy(users, "city"));
// Map(2) {
//   'Москва' => [ { name: 'Аня', city: 'Москва' }, { name: 'Оля', city: 'Москва' } ],
//   'Питер' => [ { name: 'Петя', city: 'Питер' } ]
// }
