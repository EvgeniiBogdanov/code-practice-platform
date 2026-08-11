let courses = [
  { course: 'JavaScript', price: '30000' },
  { course: 'React', price: '40000' },
  { course: 'HTML + CSS', price: '25000' },
];

const coursesToObject = (arr) => {
  return arr.reduce((acc, { course, price }) => {
    acc[course] = price;

    return acc;
  }, {});
};

// Пример вызова:
console.log(coursesToObject(courses));
