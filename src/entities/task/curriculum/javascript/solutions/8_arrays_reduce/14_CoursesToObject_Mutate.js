const courses = [
  ["JavaScript", 40],
  ["React", 30],
  ["TypeScript", 25],
];

const coursesToObject = (arr) => {
  return arr.reduce((acc, [course, hours]) => {
    acc[course] = hours;

    return acc;
  }, {});
};

// Пример вызова:
console.log(coursesToObject(courses));
// { JavaScript: 40, React: 30, TypeScript: 25 }
