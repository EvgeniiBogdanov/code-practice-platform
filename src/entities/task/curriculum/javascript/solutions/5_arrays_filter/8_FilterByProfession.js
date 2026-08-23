const people = [
  { name: "Иван", profession: "инженер" },
  { name: "Мария", profession: "дизайнер" },
  { name: "Петр", profession: "инженер" },
  { name: "Ольга", profession: "учитель" },
  { name: "Сергей", profession: "дизайнер" },
  { name: "Анна", profession: "инженер" },
];

const filterByProfession = (people, profession) => {
  return people.filter((person) => person.profession === profession);
};

// Пример вызова:
console.log(filterByProfession(people, "инженер"));
// [
//   { name: "Иван", profession: "инженер" },
//   { name: "Петр", profession: "инженер" },
//   { name: "Анна", profession: "инженер" }
// ]
