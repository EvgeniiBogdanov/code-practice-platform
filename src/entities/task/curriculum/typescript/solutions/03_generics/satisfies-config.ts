interface Route {
  path: string;
  auth?: boolean;
}

interface Routes {
  [name: string]: Route;
}

const routes = {
  home: { path: "/" },
  profile: { path: "/profile", auth: true },
} satisfies Routes;

const profilePath = routes.profile.path; // string
// routes.profle — ошибка: такого свойства нет (проверяется в tests.ts)
// Лишнее поле внутри маршрута, например role: "admin", тоже будет ошибкой satisfies.
