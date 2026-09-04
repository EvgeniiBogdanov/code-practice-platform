import { useState, useEffect, useMemo } from 'react';

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

const parseFiltersFromUrl = (searchString) => {
  const params = new URLSearchParams(searchString);

  return {
    query: params.get('query') || '',
    category: params.get('category') || 'all',
    inStock: params.get('inStock') === 'true',
    sort: params.get('sort') || 'none',
  };
};

const serializeFiltersToQuery = (filters) => {
  const params = new URLSearchParams();

  if (filters.query.trim()) {
    params.set('query', filters.query.trim());
  }

  if (filters.category && filters.category !== 'all') {
    params.set('category', filters.category);
  }

  if (filters.inStock) {
    params.set('inStock', 'true');
  }

  if (filters.sort && filters.sort !== 'none') {
    params.set('sort', filters.sort);
  }

  return params.toString();
};

export default function ProductCatalogUrlSync() {
  const [filters, setFilters] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_FILTERS;
    return parseFiltersFromUrl(window.location.search);
  });

  const updateFiltersAndUrl = (updater) => {
    setFilters((prev) => {
      const nextFilters = typeof updater === 'function' ? updater(prev) : updater;
      const queryString = serializeFiltersToQuery(nextFilters);
      const newUrl = queryString ? `?${queryString}` : window.location.pathname;

      window.history.replaceState(null, '', newUrl);
      return nextFilters;
    });
  };

  useEffect(() => {
    const handlePopState = () => {
      setFilters(parseFiltersFromUrl(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleQueryChange = (e) => {
    const value = e.target.value;
    updateFiltersAndUrl((prev) => ({ ...prev, query: value }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    updateFiltersAndUrl((prev) => ({ ...prev, category: value }));
  };

  const handleInStockToggle = (e) => {
    const checked = e.target.checked;
    updateFiltersAndUrl((prev) => ({ ...prev, inStock: checked }));
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    updateFiltersAndUrl((prev) => ({ ...prev, sort: value }));
  };

  const handleResetFilters = () => {
    updateFiltersAndUrl(DEFAULT_FILTERS);
  };

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter((item) => {
      const matchesQuery = item.name
        .toLowerCase()
        .includes(filters.query.trim().toLowerCase());
      const matchesCategory =
        filters.category === 'all' || item.category === filters.category;
      const matchesStock = !filters.inStock || item.inStock;

      return matchesQuery && matchesCategory && matchesStock;
    });

    if (filters.sort === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [filters]);

  const currentQueryString = serializeFiltersToQuery(filters);

  return (
    <div>
      <h2>Каталог товаров</h2>

      <div>
        <input
          type="text"
          value={filters.query}
          onChange={handleQueryChange}
          placeholder="Поиск товара..."
        />

        <select value={filters.category} onChange={handleCategoryChange}>
          <option value="all">Все категории</option>
          <option value="laptops">Ноутбуки</option>
          <option value="phones">Смартфоны</option>
          <option value="accessories">Аксессуары</option>
        </select>

        <select value={filters.sort} onChange={handleSortChange}>
          <option value="none">Без сортировки</option>
          <option value="price-asc">Сначала дешевле</option>
          <option value="price-desc">Сначала дороже</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={handleInStockToggle}
          />
          Только в наличии
        </label>
      </div>

      <div>
        <p>URL Query: {currentQueryString ? `?${currentQueryString}` : '—'}</p>
        <button type="button" onClick={handleResetFilters}>
          Сбросить фильтры
        </button>
      </div>

      <div>
        <p>Найдено: {filteredProducts.length}</p>

        {filteredProducts.length === 0 ? (
          <p>По заданным фильтрам ничего не найдено.</p>
        ) : (
          <ul>
            {filteredProducts.map((product) => (
              <li key={product.id}>
                <span>
                  {product.name} ({product.category}) — {product.price} ₽
                  {product.inStock ? ' [в наличии]' : ' [нет на складе]'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
