test("PublicUser — все поля, кроме пароля", () => {
  type _ = Expect<Equal<PublicUser, { id: number; name: string; email: string }>>;
});

test("RegistrationForm — только имя и пароль", () => {
  type _ = Expect<Equal<RegistrationForm, { name: string; password: string }>>;
});

test("типы остаются связанными с User", () => {
  const user: User = { id: 1, name: "Alice", email: "a@example.com", password: "secret" };
  const form: RegistrationForm = user;
  const publicUser: PublicUser = user;
  // @ts-expect-error
  const leaked: PublicUser = { id: 1, name: "Alice", email: "a@example.com", password: "x" };
});
