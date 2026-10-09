// Конфигурация маршрутов должна соответствовать типу Routes:
// у каждого маршрута есть path и необязательный флаг auth.
// При этом нужно сохранить точные ключи объекта, чтобы:
// - routes.profile.path был доступен как существующее поле;
// - опечатка в ключе (routes.profle) была ошибкой — проверка во вкладке tests.ts;
// - лишнее поле или неверный тип в описании маршрута тоже были ошибкой.

interface Route {
  path: string;
  auth?: boolean;
}

interface Routes {
  [name: string]: Route;
}

const routes: Routes = {
  home: { path: "/" },
  profile: { path: "/profile", auth: true },
};

const profilePath = routes.profile.path;
