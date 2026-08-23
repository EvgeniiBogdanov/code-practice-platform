// Фильтрация по нескольким статусам
// Напишите функцию filterByStatuses(candidates, statuses), которая возвращает кандидатов с указанными статусами.

const candidates = [
  { name: "Алексей", status: "interview" },
  { name: "Мария", status: "rejected" },
  { name: "Дмитрий", status: "review" },
  { name: "Елена", status: "offer" },
  { name: "Павел", status: "review" },
];

const filterByStatuses = (candidates, statuses) => {
  // Решение тут
};

// Пример вызова:
console.log(filterByStatuses(candidates, ["review", "interview"]));
// [
//   { name: "Алексей", status: "interview" },
//   { name: "Дмитрий", status: "review" },
//   { name: "Павел", status: "review" }
// ]
