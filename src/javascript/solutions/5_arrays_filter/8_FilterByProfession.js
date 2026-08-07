const people = [
  { name: "Анна", profession: "врач", age: 32 },
  { name: "Иван", profession: "программист", age: 28 },
  { name: "Мария", profession: "учитель", age: 45 },
  { name: "Петр", profession: "врач", age: 39 },
  { name: "Ольга", profession: "дизайнер", age: 26 },
  { name: "Сергей", profession: "программист", age: 31 },
];

const filterByProfession = (arr, profession) =>
  arr.filter((person) => person.profession === profession);

const result = filterByProfession(people, "программист");
console.log(result);
