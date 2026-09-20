// Поле middleName может отсутствовать у пользователя.
// Поле id не должно изменяться после создания объекта.

interface Person {
  id: number;
  name: string;
  middleName: string;
  age: number;
}

const person: Person = {
  id: 1,
  name: "Alice",
  age: 30,
};

person.id = 2; // такое изменение должно быть запрещено
