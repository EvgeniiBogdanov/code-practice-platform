// Реализуйте:
// 1. Paths<T> — объединение всех путей к полям объекта через точку.
//    Для Settings: "user" | "user.name" | "user.address" | "user.address.city"
//                  | "user.address.zip" | "theme"
// 2. PathValue<T, P> — тип значения по пути P.
// 3. Функцию get(obj, path), которая принимает только существующие пути
//    и возвращает значение точного типа.

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

type Paths<T> = unknown;
type PathValue<T, P> = unknown;

const get = (obj, path) => {
  return path.split(".").reduce((value, key) => value[key], obj);
};

const settings: Settings = {
  user: { name: "Alice", address: { city: "Berlin", zip: 10115 } },
  theme: "dark",
};

const city = get(settings, "user.address.city"); // должно быть string
const zip = get(settings, "user.address.zip"); // должно быть number
// get(settings, "user.phone") должно быть ошибкой (проверка во вкладке tests.ts).
