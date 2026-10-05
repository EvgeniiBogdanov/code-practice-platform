import { useState, useEffect } from 'react';

export const PRODUCTS = [
  { id: 1, name: 'MacBook Pro 16', category: 'laptops', price: 240000, inStock: true },
  { id: 2, name: 'iPhone 15 Pro', category: 'phones', price: 120000, inStock: true },
  { id: 3, name: 'AirPods Pro 2', category: 'accessories', price: 25000, inStock: false },
  { id: 4, name: 'Asus ROG Zephyrus', category: 'laptops', price: 180000, inStock: false },
  { id: 5, name: 'Samsung Galaxy S24', category: 'phones', price: 95000, inStock: true },
  { id: 6, name: 'Apple Magic Mouse', category: 'accessories', price: 9000, inStock: true },
  { id: 7, name: 'Lenovo ThinkPad X1', category: 'laptops', price: 160000, inStock: true },
  { id: 8, name: 'Чехол Leather Case', category: 'accessories', price: 4500, inStock: false },
];

const DEFAULT_FILTERS = {
  query: '',
  category: 'all',
  inStock: false,
  sort: 'none',
};

const CATEGORIES = {
  laptops: 'Ноутбуки',
  phones: 'Смартфоны',
  accessories: 'Аксессуары',
};

const SORTERS = {
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
};

// URL → фильтры. Все значения из URL — строки, поэтому boolean сравниваем явно:
// Boolean("false") === true, а нужно false
const parseFiltersFromUrl = (search) => {
  const params = new URLSearchParams(search);
  return {
    query: params.get('query') ?? DEFAULT_FILTERS.query,
    category: params.get('category') ?? DEFAULT_FILTERS.category,
    inStock: params.get('inStock') === 'true',
    sort: params.get('sort') ?? DEFAULT_FILTERS.sort,
  };
};

// Фильтры → строка запроса. Значения по умолчанию и пустые поля в URL не попадают
const serializeFiltersToQuery = (filters) => {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set('query', filters.query.trim());
  if (filters.category !== DEFAULT_FILTERS.category) params.set('category', filters.category);
  if (filters.inStock) params.set('inStock', 'true');
  if (filters.sort !== DEFAULT_FILTERS.sort) params.set('sort', filters.sort);
  return params.toString();
};

export default function ProductCatalogUrlSync() {
  // Начальное состояние читается из URL один раз — ленивой инициализацией
  const [filters, setFilters] = useState(() => parseFiltersFromUrl(window.location.search));

  // Кнопки «Назад» / «Вперёд»: браузер меняет URL, а мы подтягиваем из него фильтры
  useEffect(() => {
    const handlePopState = () => setFilters(parseFiltersFromUrl(window.location.search));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // State и URL обновляются в обработчике события, а не в функции-обновлении setState:
  // updater должен быть чистым, а запись в историю — это побочный эффект.
  // pushState создаёт запись в истории (её отменит «Назад»), replaceState — заменяет текущую
  const applyFilters = (nextFilters, { replace = false } = {}) => {
    setFilters(nextFilters);
    const query = serializeFiltersToQuery(nextFilters);
    const url = query ? `?${query}` : window.location.pathname;
    if (replace) window.history.replaceState(null, '', url);
    else window.history.pushState(null, '', url);
  };

  const updateFilter = (key, value, options) => applyFilters({ ...filters, [key]: value }, options);

  // Производные данные — при рендере. Для 8 товаров useMemo не нужен
  const normalizedQuery = filters.query.trim().toLowerCase();
  const filteredProducts = PRODUCTS.filter(
    (item) =>
      item.name.toLowerCase().includes(normalizedQuery) &&
      (filters.category === 'all' || item.category === filters.category) &&
      (!filters.inStock || item.inStock)
  );
  const sorter = SORTERS[filters.sort];
  const visibleProducts = sorter ? filteredProducts.toSorted(sorter) : filteredProducts;
  const currentQueryString = serializeFiltersToQuery(filters);

  return (
    <div>
      <h2>Каталог товаров</h2>

      <div>
        <input
          type="search"
          value={filters.query}
          // Ввод текста заменяет запись в истории — иначе «Назад» пришлось бы жать на каждый символ
          onChange={(e) => updateFilter('query', e.target.value, { replace: true })}
          placeholder="Поиск товара..."
        />

        <select value={filters.category} onChange={(e) => updateFilter('category', e.target.value)}>
          <option value="all">Все категории</option>
          {Object.entries(CATEGORIES).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)}>
          <option value="none">Без сортировки</option>
          <option value="price-asc">Сначала дешевле</option>
          <option value="price-desc">Сначала дороже</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => updateFilter('inStock', e.target.checked)}
          />
          Только в наличии
        </label>
      </div>

      <div>
        <p>URL Query: {currentQueryString ? `?${currentQueryString}` : '—'}</p>
        <button type="button" onClick={() => applyFilters(DEFAULT_FILTERS)}>
          Сбросить фильтры
        </button>
      </div>

      <p>Найдено: {visibleProducts.length}</p>
      {visibleProducts.length === 0 ? (
        <p>По заданным фильтрам ничего не найдено.</p>
      ) : (
        <ul>
          {visibleProducts.map((product) => (
            <li key={product.id}>
              {product.name} ({CATEGORIES[product.category]}) — {product.price} ₽
              {product.inStock ? ' [в наличии]' : ' [нет на складе]'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
