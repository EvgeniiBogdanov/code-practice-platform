import { useState } from 'react';

const RAW_PRODUCTS = [
  { name: 'Ноутбук', price: 1000 },
  { name: 'Смартфон', price: 500 },
  { name: 'Наушники', price: 150 },
];

const ListKeys = () => {
  // Обогащаем список уникальными id ЕДИНОЖДЫ при инициализации состояния
  const [products, setProducts] = useState(() =>
    RAW_PRODUCTS.map((product) => ({
      ...product,
      id: crypto.randomUUID(),
    }))
  );

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <span>{product.name} — {product.price} $</span>
          <button onClick={() => handleDelete(product.id)}>Удалить</button>
        </li>
      ))}
    </ul>
  );
};

export default ListKeys;
