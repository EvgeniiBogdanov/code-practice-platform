const person = { name: "Vasya", age: 22 };
const position = { title: "Software Engineer" };

person.position = position;
person.position.salary = 120;

console.log(person.position);
console.log(position);
