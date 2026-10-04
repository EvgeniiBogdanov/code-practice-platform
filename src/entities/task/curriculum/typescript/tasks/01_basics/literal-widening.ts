// Код не компилируется: TypeScript «расширяет» значения до string.
// Исправьте объявления так, чтобы вызовы request проходили проверку,
// не меняя сигнатуру request и не используя приведение as HttpMethod.
// Тип Route должен выводиться из массива routes: "/home" | "/about".

type HttpMethod = "GET" | "POST";

const request = (url: string, method: HttpMethod): void => {
  console.log(method, url);
};

let method = "GET";
request("/users", method);

const options = { url: "/users", method: "POST" };
request(options.url, options.method);

const routes = ["/home", "/about"];
type Route = string;
