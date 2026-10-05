import React, { useState } from 'react';

/**
 * Задача: Глобальное состояние на Context + useReducer
 *
 * Сейчас корзина живёт в App и пробрасывается через пропсы на несколько уровней (prop drilling).
 *
 * Требования:
 * 1. Вынесите корзину в CartProvider на базе useReducer с действиями add, remove, clear.
 *    При повторном добавлении товара увеличивается quantity, а не дублируется позиция.
 * 2. Создайте ДВА контекста: CartStateContext (данные) и CartDispatchContext (dispatch).
 *    Компоненты, которые только отправляют действия, не должны перерисовываться при изменении корзины.
 * 3. Создайте хуки useCart() и useCartDispatch() с ошибкой при вызове вне провайдера.
 * 4. ProductList, CartBadge и CartSummary получают данные через хуки, а не через пропсы.
 */

const PRODUCTS = [
  { id: 1, name: 'Клавиатура', price: 100 },
  { id: 2, name: 'Мышь', price: 50 },
];

const ProductList = ({ onAdd }) => (
  <ul>
    {PRODUCTS.map((p) => (
      <li key={p.id}>
        {p.name} — {p.price}$ <button onClick={() => onAdd(p)}>В корзину</button>
      </li>
    ))}
  </ul>
);

const CartBadge = ({ items }) => <p>🛒 {items.reduce((sum, i) => sum + i.quantity, 0)}</p>;

const CartSummary = ({ items, onRemove, onClear }) => (
  <div>
    {items.map((i) => (
      <p key={i.id}>
        {i.name} × {i.quantity} <button onClick={() => onRemove(i.id)}>✕</button>
      </p>
    ))}
    <button onClick={onClear}>Очистить</button>
  </div>
);

const Shop = ({ items, onAdd, onRemove, onClear }) => (
  <div>
    <CartBadge items={items} />
    <ProductList onAdd={onAdd} />
    <CartSummary items={items} onRemove={onRemove} onClear={onClear} />
  </div>
);

const App = () => {
  const [items, setItems] = useState([]);
  const onAdd = (product) => setItems((prev) => [...prev, { ...product, quantity: 1 }]);
  const onRemove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const onClear = () => setItems([]);

  return <Shop items={items} onAdd={onAdd} onRemove={onRemove} onClear={onClear} />;
};

export default App;
