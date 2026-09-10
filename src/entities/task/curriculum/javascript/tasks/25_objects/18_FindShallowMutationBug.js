// Поиск скрытой мутации после Shallow Copy (Code Review)
// Исправьте ошибку скрытой мутации вложенного объекта товара в корзине заказов с сохранением structural sharing.
// Напишите функцию updateOrderItemQuantity(order, itemId, newQuantity), которая:
// 1. Возвращает новый объект заказа с обновленным количеством указанного товара.
// 2. Не мутирует исходный объект order и его дочерние элементы.
// 3. Сохраняет ссылки на неизмененные товары (structural sharing).
// 4. Если товар с таким itemId не найден или его количество уже равно newQuantity, возвращает исходный order без изменений.

const updateOrderItemQuantity = (order, itemId, newQuantity) => {
  // Решение тут
};

// Пример вызова:
const originalOrder = {
  id: 101,
  customer: "Anna",
  items: [
    { id: "item_1", name: "Клавиатура", quantity: 1, price: 5000 },
    { id: "item_2", name: "Мышь", quantity: 2, price: 2500 },
  ],
};

const updatedOrder = updateOrderItemQuantity(originalOrder, "item_1", 3);

console.log(updatedOrder.items[0].quantity); // 3
console.log(originalOrder.items[0].quantity); // 1
console.log(originalOrder.items[0] !== updatedOrder.items[0]); // true
console.log(originalOrder.items[1] === updatedOrder.items[1]); // true
console.log(originalOrder !== updatedOrder); // true
