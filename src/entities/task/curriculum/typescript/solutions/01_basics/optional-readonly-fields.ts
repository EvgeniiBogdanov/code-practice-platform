interface Person {
  readonly id: number;
  name: string;
  middleName?: string;
  age: number;
}

const person: Person = {
  id: 1,
  name: "Alice",
  age: 30,
};

// person.id = 2 — ошибка: поле id доступно только для чтения (проверяется в tests.ts)
