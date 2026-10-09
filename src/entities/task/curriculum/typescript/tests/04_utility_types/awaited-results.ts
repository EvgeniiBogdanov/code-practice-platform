test("User — результат fetchUser после await", () => {
  type _ = Expect<Equal<User, { id: number; name: string; roles: string[] }>>;
});

test("Dashboard — пользователь и список его заказов", () => {
  type _ = Expect<
    Equal<Dashboard, [User, { id: number; userId: number; total: number }[]]>
  >;
});

test("ClientOptions — первый аргумент конструктора ApiClient", () => {
  type _ = Expect<Equal<ClientOptions, { baseUrl: string; timeout: number }>>;
});
