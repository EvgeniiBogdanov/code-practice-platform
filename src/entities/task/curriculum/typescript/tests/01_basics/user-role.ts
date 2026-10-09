test("admin — пользователь с допустимой ролью", () => {
  const user: UserWithRole = { name: "Bob", age: 25, role: "user" };
});

test("role принимает только допустимые значения", () => {
  // @ts-expect-error
  const hacker: UserWithRole = { name: "Eve", age: 40, role: "hacker" };
});

test("UserWithRole содержит все поля User", () => {
  const user: User = admin;
  // @ts-expect-error
  const incomplete: UserWithRole = { name: "Eve", role: "user" };
});
