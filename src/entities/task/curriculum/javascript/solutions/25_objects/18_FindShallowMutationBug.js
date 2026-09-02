const updateOrderItemQuantity = (order, itemId, newQuantity) => {
  if (!order || typeof order !== "object" || !Array.isArray(order.items)) {
    return order;
  }

  let hasChanged = false;

  const newItems = order.items.map((item) => {
    if (item && item.id === itemId) {
      if (item.quantity === newQuantity) {
        return item;
      }
      hasChanged = true;
      return { ...item, quantity: newQuantity };
    }
    return item;
  });

  if (!hasChanged) {
    return order;
  }

  return {
    ...order,
    items: newItems,
  };
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
