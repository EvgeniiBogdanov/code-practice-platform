// Поле middleName может отсутствовать у пользователя.
// Поле id не должно изменяться после создания объекта: присвоение person.id
// должно приводить к ошибке типов (проверка — во вкладке tests.ts).

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
