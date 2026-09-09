const courses = [
  ["JavaScript", 40],
  ["React", 30],
  ["TypeScript", 25],
];

const coursesToObject = (arr) =>
  arr.reduce((acc, [course, hours]) => ({ ...acc, [course]: hours }), {});

// Пример вызова:
console.log(coursesToObject(courses));
// { JavaScript: 40, React: 30, TypeScript: 25 }
