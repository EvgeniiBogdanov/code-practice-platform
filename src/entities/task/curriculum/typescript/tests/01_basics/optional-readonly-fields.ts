test("middleName необязательно", () => {
  const person: Person = { id: 1, name: "Alice", age: 30 };
});

test("id нельзя изменить после создания", () => {
  const person: Person = { id: 1, name: "Alice", age: 30 };
  // @ts-expect-error
  person.id = 2;
});

test("остальные поля можно изменять", () => {
  const person: Person = { id: 1, name: "Alice", age: 30 };
  person.name = "Bob";
  person.age = 31;
  person.middleName = "Ivanovna";
});
