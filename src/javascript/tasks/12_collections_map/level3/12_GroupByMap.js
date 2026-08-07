// Напишите функцию groupBy(items, key), которая группирует массив объектов
// в Map по значению указанного свойства.

// Вывод:
// Map(2) {
//   'Москва' => [ { name: 'Аня', ... }, { name: 'Оля', ... } ],
//   'Питер' => [ { name: 'Петя', ... } ]
// }

const users = [
  { name: "Аня", city: "Москва" },
  { name: "Петя", city: "Питер" },
  { name: "Оля", city: "Москва" },
];

const groupBy = (items, key) => {
  // Ваш код здесь
};

console.log(groupBy(users, "city"));
