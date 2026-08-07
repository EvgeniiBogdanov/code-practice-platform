// Найти кандидатов со статусом "review" или "accepted"

const jobApplications = [
  { applicant: "Артем", desiredPosition: "JavaScript Developer", skills: ["JS", "React"], status: "review" },
  { applicant: "Виктория", desiredPosition: "Python Developer", skills: ["Python", "Django"], status: "accepted" },
  { applicant: "Григорий", desiredPosition: "Java Developer", skills: ["Java", "Spring"], status: "rejected" },
  { applicant: "Дарья", desiredPosition: "JavaScript Developer", skills: ["JS", "Vue"], status: "review" },
  { applicant: "Евгений", desiredPosition: "Data Analyst", skills: ["Python", "SQL"], status: "accepted" }
];

// Тут код:
const filterByStatuses = () => {};

// Проверка
const result = filterByStatuses(jobApplications, ["review", "accepted"]);
console.log(result);
