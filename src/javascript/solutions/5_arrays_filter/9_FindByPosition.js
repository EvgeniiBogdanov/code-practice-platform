const employees = [
  { name: "Алексей", position: "Frontend Developer", salary: 120000, experience: 3 },
  { name: "Екатерина", position: "Backend Developer", salary: 140000, experience: 5 },
  { name: "Дмитрий", position: "UI/UX Designer", salary: 100000, experience: 2 },
  { name: "Светлана", position: "Data Scientist", salary: 160000, experience: 4 },
  { name: "Михаил", position: "DevOps Engineer", salary: 150000, experience: 6 },
  { name: "Наталья", position: "Frontend Developer", salary: 130000, experience: 4 },
];

const findByPosition = (arr, position) =>
  arr.filter((emp) => emp.position.includes(position));

const result = findByPosition(employees, "Developer");
console.log(result);
