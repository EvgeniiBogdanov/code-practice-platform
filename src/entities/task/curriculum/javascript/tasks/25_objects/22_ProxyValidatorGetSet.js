// Валидация схемы объекта через Proxy
// Напишите функцию createValidatedSchema(target, schema), оборачивающую target в Proxy.
// При попытке чтения несуществующего поля выбрасывает ReferenceError, а при невалидной записи — TypeError.

const createValidatedSchema = (target, schema = {}) => {
  // Решение тут
};

// Пример вызова:
const schema = {
  age: (val) => typeof val === "number" && val > 0,
};

const user = createValidatedSchema({ age: 25 }, schema);
console.log(user.age); // 25

try {
  user.age = -5;
} catch (e) {
  console.log(e.name); // 'TypeError'
}
