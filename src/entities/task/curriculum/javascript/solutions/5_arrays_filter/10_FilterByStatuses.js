const candidates = [
  { name: "Алексей", status: "interview" },
  { name: "Мария", status: "rejected" },
  { name: "Дмитрий", status: "review" },
  { name: "Елена", status: "offer" },
  { name: "Павел", status: "review" },
];

const filterByStatuses = (candidates, statuses) => {
  return candidates.filter((candidate) => statuses.includes(candidate.status));
};

// Пример вызова:
console.log(filterByStatuses(candidates, ["review", "interview"]));
// [
//   { name: "Алексей", status: "interview" },
//   { name: "Дмитрий", status: "review" },
//   { name: "Павел", status: "review" }
// ]
