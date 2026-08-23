const courses = [
  { count: 12, name: "JS" },
  { count: 2, name: "React" },
  { count: 8, name: "Node" },
];

const coursesToObject = (courses) => {
  return courses.reduce((acc, course) => {
    acc[course.name] = course.count;
    return acc;
  }, {});
};

// Пример вызова:
console.log(coursesToObject(courses)); // { JS: 12, React: 2, Node: 8 }
