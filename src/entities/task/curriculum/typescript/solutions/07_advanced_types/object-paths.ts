interface Settings {
  user: {
    name: string;
    address: {
      city: string;
      zip: number;
    };
  };
  theme: "light" | "dark";
}

type Paths<T> = T extends object
  ? {
      [K in keyof T & string]: K | `${K}.${Paths<T[K]>}`;
    }[keyof T & string]
  : never;

type PathValue<T, P extends string> = P extends `${infer Head}.${infer Rest}`
  ? Head extends keyof T
    ? PathValue<T[Head], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;

const readKey = (source: unknown, key: string): unknown =>
  typeof source === "object" && source !== null
    ? (source as Record<string, unknown>)[key]
    : undefined;

// Публичная сигнатура строгая; обход во время выполнения работает с unknown,
// поэтому связь с PathValue фиксируется одним утверждением в реализации.
const get = <T extends object, P extends Paths<T>>(obj: T, path: P): PathValue<T, P> =>
  path.split(".").reduce<unknown>(readKey, obj) as PathValue<T, P>;

const settings: Settings = {
  user: { name: "Alice", address: { city: "Berlin", zip: 10115 } },
  theme: "dark",
};

const city = get(settings, "user.address.city"); // string
const zip = get(settings, "user.address.zip"); // number
const theme = get(settings, "theme"); // "light" | "dark"
// get(settings, "user.phone"); // Ошибка: такого пути нет
