test("ActivePermission — все права, кроме banned", () => {
  type _ = Expect<Equal<ActivePermission, "read" | "create" | "update" | "delete">>;
});

test("WritePermission — только create и update", () => {
  type _ = Expect<Equal<WritePermission, "create" | "update">>;
});

test("новые типы выводятся из Permission", () => {
  const active: Permission = "read" as ActivePermission;
  // @ts-expect-error
  const banned: ActivePermission = "banned";
});
