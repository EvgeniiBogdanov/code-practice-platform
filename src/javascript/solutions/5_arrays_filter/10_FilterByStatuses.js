const jobApplications = [
  { applicant: "Артем", desiredPosition: "JavaScript Developer", skills: ["JS", "React"], status: "review" },
  { applicant: "Виктория", desiredPosition: "Python Developer", skills: ["Python", "Django"], status: "accepted" },
  { applicant: "Григорий", desiredPosition: "Java Developer", skills: ["Java", "Spring"], status: "rejected" },
  { applicant: "Дарья", desiredPosition: "JavaScript Developer", skills: ["JS", "Vue"], status: "review" },
  { applicant: "Евгений", desiredPosition: "Data Analyst", skills: ["Python", "SQL"], status: "accepted" },
];

const filterByStatuses = (arr, statuses) =>
  arr.filter((app) => statuses.includes(app.status));

const result = filterByStatuses(jobApplications, ["review", "accepted"]);
console.log(result);
