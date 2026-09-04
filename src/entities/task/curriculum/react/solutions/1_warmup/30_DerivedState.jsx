import { useState } from "react";

const INITIAL_CART = [
  { id: "1", name: "Клавиатура", price: 100, count: 1 },
  { id: "2", name: "Мышь", price: 50, count: 2 },
  { id: "3", name: "Коврик", price: 20, count: 1 },
];

const ShoppingCart = () => {
  const [items, setItems] = useState(INITIAL_CART);

  // Производное состояние (derived state) рассчитывается на лету при каждом рендере.
  // Никаких лишних useState и useEffect не требуется!
  const totalCount = items.reduce((sum, item) => sum + item.count, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.count, 0);

  const handleUpdateCount = (id, delta) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;
          const nextCount = item.count + delta;
          return nextCount > 0 ? { ...item, count: nextCount } : null;
        })
        .filter(Boolean)
    );
  };

  return (
    <div>
      <h3>Корзина покупок</h3>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <span>{item.name} ({item.price} $) — {item.count} шт. </span>
            <button onClick={() => handleUpdateCount(item.id, 1)}>+</button>
            <button onClick={() => handleUpdateCount(item.id, -1)}>-</button>
          </li>
        ))}
      </ul>
      <div>
        <p>Всего товаров: {totalCount} шт.</p>
        <p>Итого к оплате: {totalPrice} $</p>
      </div>
    </div>
  );
};

export default ShoppingCart;
