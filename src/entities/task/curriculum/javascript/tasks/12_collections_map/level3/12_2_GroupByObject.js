// Возьмите предыдущее задание и верните вместо Map обычный объект Object.

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
// {
//   Москва: [ { name: 'Аня', city: 'Москва' }, { name: 'Оля', city: 'Москва' } ],
//   Питер: [ { name: 'Петя', city: 'Питер' } ]
// }
