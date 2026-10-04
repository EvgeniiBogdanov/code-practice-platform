// 1. findById должна работать с массивом любых сущностей, у которых
//    есть числовое поле id, и возвращать элемент исходного типа
//    со всеми его полями.
// 2. ApiResponse описывает ответ сервера. Если тип данных не указан,
//    data должна иметь тип unknown.
// 3. longest возвращает более длинное из двух значений, у которых
//    есть поле length (массивы, строки). Числа передавать нельзя.

const findById = (items, id) => items.find((item) => item.id === id);

interface ApiResponse {
  status: number;
  data;
}

const longest = (a, b) => (a.length >= b.length ? a : b);

const products = [{ id: 1, title: "Книга", price: 500 }];
const product = findById(products, 1);

const raw: ApiResponse = { status: 200, data: "ok" };
const typed: ApiResponse<string[]> = { status: 200, data: ["a", "b"] };

const longer = longest([1, 2], [1, 2, 3]);
longest(10, 100); // должно быть ошибкой
