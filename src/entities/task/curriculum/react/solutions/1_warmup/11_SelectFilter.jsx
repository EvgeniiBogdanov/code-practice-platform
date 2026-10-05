import { useState } from 'react';

const PRODUCTS = [
  { id: 1, name: 'Ноутбук', category: 'Электроника' },
  { id: 2, name: 'Футболка', category: 'Одежда' },
  { id: 3, name: 'Книга по React', category: 'Книги' },
  { id: 4, name: 'Смартфон', category: 'Электроника' },
  { id: 5, name: 'Джинсы', category: 'Одежда' },
];

const ALL = 'all';

// Список категорий выводится из данных: новая категория появится в селекте без правок разметки
const CATEGORIES = [...new Set(PRODUCTS.map((product) => product.category))];

const SelectFilter = () => {
  const [category, setCategory] = useState(ALL);

  const visibleProducts =
    category === ALL ? PRODUCTS : PRODUCTS.filter((product) => product.category === category);

  return (
    <div>
      <label>
        Категория{' '}
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value={ALL}>Все</option>
          {CATEGORIES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <ul>
        {visibleProducts.map((product) => (
          <li key={product.id}>
            {product.name} ({product.category})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectFilter;
