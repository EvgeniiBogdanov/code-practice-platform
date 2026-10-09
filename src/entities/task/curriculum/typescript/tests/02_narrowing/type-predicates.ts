test("isUser сужает unknown до User", () => {
  const getName = (value: unknown): string => {
    if (isUser(value)) return value.name;
    return "неизвестно";
  };
});

test("isAdmin сужает User | Admin до Admin", () => {
  const getPermissions = (person: User | Admin): string[] => {
    if (isAdmin(person)) return person.permissions;
    return [];
  };
});

test("фильтрация администраторов даёт Admin[]", () => {
  const onlyAdmins: Admin[] = people.filter(isAdmin);
  const fromTask: Admin[] = admins;
});
