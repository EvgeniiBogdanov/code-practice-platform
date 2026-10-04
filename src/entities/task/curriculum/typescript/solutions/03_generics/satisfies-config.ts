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
// const typo = routes.profle; // Ошибка: свойства profle нет
// Лишнее поле внутри маршрута, например role: "admin", тоже будет ошибкой satisfies.
