const team = [
  { name: "Иван", position: "Frontend Developer" },
  { name: "Анна", position: "UI/UX Designer" },
  { name: "Петр", position: "Backend Developer" },
  { name: "Елена", position: "Project Manager" },
  { name: "Сергей", position: "Frontend Developer" },
];

const findDevelopers = (team) => {
  return team.filter((member) => member.position.includes("Developer"));
};

// Пример вызова:
console.log(findDevelopers(team));
// [
//   { name: "Иван", position: "Frontend Developer" },
//   { name: "Петр", position: "Backend Developer" },
//   { name: "Сергей", position: "Frontend Developer" }
// ]
