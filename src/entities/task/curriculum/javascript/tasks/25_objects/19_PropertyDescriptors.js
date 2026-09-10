// Настройка дескрипторов свойств (writable, enumerable, configurable)
// Напишите функцию createSecureEntity(id, secretToken, initialRole = "user"), которая:
// 1. Создает защищенный объект entity через Object.defineProperty.
// 2. Поле id: значение id, writable: false, enumerable: true, configurable: false (нельзя изменить или удалить).
// 3. Поле secretToken: значение secretToken, writable: false, enumerable: false, configurable: false (скрыто из Object.keys и JSON.stringify).
// 4. Поле role: геттер возвращает текущую роль, сеттер валидирует новую роль (разрешены только "user" и "admin", иначе TypeError), enumerable: true, configurable: false.
// 5. Возвращает настроенный объект entity.

const createSecureEntity = (id, secretToken, initialRole = "user") => {
  // Решение тут
};

// Пример вызова:
const entity = createSecureEntity(101, "tok_secret_999", "admin");

console.log(Object.keys(entity)); // [ 'id', 'role' ]
console.log(entity.id); // 101
console.log(entity.secretToken); // 'tok_secret_999'
console.log(entity.role); // 'admin'
console.log(JSON.stringify(entity)); // '{"id":101,"role":"admin"}'
console.log(delete entity.id); // false
console.log(entity.id); // 101
