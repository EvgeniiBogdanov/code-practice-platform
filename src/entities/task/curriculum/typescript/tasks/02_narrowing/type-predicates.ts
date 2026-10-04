// 1. Напишите функцию isUser, которая проверяет, что произвольное значение
//    имеет форму User. После проверки TypeScript должен знать тип значения.
// 2. Напишите функцию isAdmin и отфильтруйте people так, чтобы
//    тип admins был Admin[], а не (User | Admin)[].

interface User {
  id: number;
  name: string;
}

interface Admin extends User {
  permissions: string[];
}

const isUser = (value) => {
  // ...
};

const isAdmin = (person) => {
  // ...
};

const input: unknown = JSON.parse('{"id": 1, "name": "Alice"}');

if (isUser(input)) {
  console.log(input.name);
}

const people: (User | Admin)[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob", permissions: ["users:write"] },
];

const admins = people.filter(isAdmin);
