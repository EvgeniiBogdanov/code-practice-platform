type HttpMethod = "GET" | "POST";

const request = (url: string, method: HttpMethod): void => {
  console.log(method, url);
};

// const не расширяет литерал: тип переменной — "GET".
const method = "GET";
request("/users", method);

// as const сохраняет литералы во всех полях объекта.
const options = { url: "/users", method: "POST" } as const;
request(options.url, options.method);

const routes = ["/home", "/about"] as const;
type Route = (typeof routes)[number]; // "/home" | "/about"

const home: Route = "/home";
