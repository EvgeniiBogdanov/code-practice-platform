// Настройка дескрипторов свойств: Object.defineProperty
// Напишите функцию createImmutableProperty(obj, prop, value), которая создает неперечислимое и неизменяемое свойство.

const createImmutableProperty = (obj, prop, value) => {
  // Решение тут
};

// Пример вызова:
const item = {};
createImmutableProperty(item, "id", 999);
console.log(item.id); // 999
item.id = 1;
console.log(item.id); // 999 (не изменилось)
console.log(Object.keys(item)); // [] (не перечисляется)
