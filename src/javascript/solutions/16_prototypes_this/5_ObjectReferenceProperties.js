const person = { name: "Vasya", age: 22 };
const position = { title: "Software Engineer" };

person.position = position;
person.position.salary = 120;

console.log(person.position); // { title: 'Software Engineer', salary: 120 }
console.log(position); // { title: 'Software Engineer', salary: 120 }

// Объекты присваиваются по ссылке, поэтому модификация person.position меняет исходный position.
