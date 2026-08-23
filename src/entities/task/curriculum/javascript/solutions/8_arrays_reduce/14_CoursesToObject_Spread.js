let courses = [
  { course: 'JavaScript', price: '30000' },
  { course: 'React', price: '40000' },
  { course: 'HTML + CSS', price: '25000' },
];

const coursesToObject = (arr) =>
  arr.reduce((acc, item) => ({ ...acc, [item.course]: item.price }), {});

// Пример вызова:
console.log(coursesToObject(courses));
