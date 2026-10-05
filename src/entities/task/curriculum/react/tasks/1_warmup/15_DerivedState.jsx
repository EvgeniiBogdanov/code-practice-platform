import { useState } from "react";

// **Реализуйте вычисляемое состояние (Derived State) без лишнего useState и useEffect**

// **Требования:**
// 1. В корзине есть товары: { id, name, price, count }.
// 2. Рассчитайте общее количество товаров (totalCount) и итоговую стоимость (totalPrice)
//    напрямую во время рендеринга (производное состояние).
// 3. НЕ используйте отдельный useState или useEffect для хранения totalCount или totalPrice.
// 4. Реализуйте кнопки "+" и "-" для изменения count товара (при count < 1 товар удаляется).

const INITIAL_CART = [
  { id: "1", name: "Клавиатура", price: 100, count: 1 },
  { id: "2", name: "Мышь", price: 50, count: 2 },
  { id: "3", name: "Коврик", price: 20, count: 1 },
];

const ShoppingCart = () => {
  const [items, setItems] = useState(INITIAL_CART);

  // Рассчитайте totalCount и totalPrice прямо в теле функции без useState/useEffect

  // Реализуйте функцию изменения количества товара handleUpdateCount(id, delta)

  return (
    <div>
      <h3>Корзина покупок</h3>
      <ul>{/* Список товаров */}</ul>
      <div>
        <p>Всего товаров: {/* totalCount */}</p>
        <p>Итого к оплате: {/* totalPrice */} $</p>
      </div>
    </div>
  );
};

export default ShoppingCart;
