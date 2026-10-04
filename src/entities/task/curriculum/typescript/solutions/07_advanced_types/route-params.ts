type ParamNames<Path extends string> = Path extends `${string}:${infer Param}/${infer Rest}`
  ? Param | ParamNames<Rest>
  : Path extends `${string}:${infer Param}`
    ? Param
    : never;

type RouteParams<Path extends string> = Record<ParamNames<Path>, string>;

const buildUrl = <Path extends string>(path: Path, params: RouteParams<Path>): string => {
  // Для подстановки достаточно словаря строк: имена уже проверены типом params.
  const values: Record<string, string> = params;
  return path.replace(/:(\w+)/g, (_match, name: string) => encodeURIComponent(values[name] ?? ""));
};

type UserPostParams = RouteParams<"/users/:userId/posts/:postId">;
// { userId: string; postId: string }

buildUrl("/users/:userId/posts/:postId", { userId: "1", postId: "42" }); // "/users/1/posts/42"
// buildUrl("/users/:userId/posts/:postId", { userId: "1" }); // Ошибка: нет postId
// buildUrl("/users/:userId", { userId: "1", extra: "x" }); // Ошибка: лишний параметр
buildUrl("/about", {});
