interface Identifiable {
  id: number;
}

const findById = <T extends Identifiable>(
  items: readonly T[],
  id: number
): T | undefined => items.find((item) => item.id === id);

interface ApiResponse<T = unknown> {
  status: number;
  data: T;
}

const longest = <T extends { length: number }>(a: T, b: T): T =>
  a.length >= b.length ? a : b;

const products = [{ id: 1, title: "Книга", price: 500 }];
const product = findById(products, 1); // { id: number; title: string; price: number } | undefined

const raw: ApiResponse = { status: 200, data: "ok" }; // data: unknown
const typed: ApiResponse<string[]> = { status: 200, data: ["a", "b"] };

const longer = longest([1, 2], [1, 2, 3]); // number[]
// longest(10, 100); // Ошибка: у number нет поля length
