const sumSalaries = (salaries) => {
  return Object.values(salaries).reduce((acc, salary) => acc + salary, 0);
};

// Пример вызова:
const salaries = {
  Olga: 1200,
  Timur: 950,
  Lena: 1450,
};

console.log(sumSalaries(salaries)); // 3600
console.log(sumSalaries({}));         // 0
