test("маршруты доступны по своим ключам", () => {
  const home: string = routes.home.path;
  const profile: string = routes.profile.path;
});

test("опечатка в ключе маршрута — ошибка", () => {
  // @ts-expect-error
  routes.profle;
});

test("необязательный флаг auth остаётся доступным", () => {
  const auth: boolean | undefined = routes.profile.auth;
});
