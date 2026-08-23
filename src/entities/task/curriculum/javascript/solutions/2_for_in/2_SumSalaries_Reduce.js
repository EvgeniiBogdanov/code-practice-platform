const sumSalaries = (salaries) => {
  return Object.values(salaries).reduce((acc, salary) => acc + salary, 0);
};

// Пример вызова:
const salaries = {
  John: 1000,
  Ann: 1600,
  Pete: 1300,
};

console.log(sumSalaries(salaries)); // 3900
console.log(sumSalaries({}));         // 0
