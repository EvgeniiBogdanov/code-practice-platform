// buildUrl подставляет параметры в шаблон маршрута:
// buildUrl("/users/:userId/posts/:postId", { userId: "1", postId: "42" })
// → "/users/1/posts/42"
//
// Типизируйте buildUrl так, чтобы объект params требовал ровно те
// параметры, которые указаны в шаблоне через двоеточие:
// пропущенный или лишний параметр — ошибка типизации.

const buildUrl = (path, params) => {
  return path.replace(/:(\w+)/g, (_match, name) => encodeURIComponent(params[name]));
};

buildUrl("/users/:userId/posts/:postId", { userId: "1", postId: "42" });
buildUrl("/users/:userId/posts/:postId", { userId: "1" }); // должно быть ошибкой
buildUrl("/users/:userId", { userId: "1", extra: "x" }); // должно быть ошибкой
buildUrl("/about", {});
