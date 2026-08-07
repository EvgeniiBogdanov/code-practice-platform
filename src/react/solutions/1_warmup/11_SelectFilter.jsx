import { useState } from 'react';

const PRODUCTS = [
  { id: 1, name: "Ноутбук", category: "Электроника" },
  { id: 2, name: "Футболка", category: "Одежда" },
  { id: 3, name: "Книга по React", category: "Книги" },
  { id: 4, name: "Смартфон", category: "Электроника" },
  { id: 5, name: "Джинсы", category: "Одежда" },
];

const CATEGORY = {
  all: "Все",
  electronics: "Электроника",
  cloth: "Одежда",
  books: "Книги",
};

const SelectFilter = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts =
    selectedCategory === "all"
      ? PRODUCTS
      : PRODUCTS.filter((prod) => prod.category === CATEGORY[selectedCategory]);

  return (
    <div>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="all">{CATEGORY.all}</option>
        <option value="electronics">{CATEGORY.electronics}</option>
        <option value="cloth">{CATEGORY.cloth}</option>
        <option value="books">{CATEGORY.books}</option>
      </select>
      <ul>
        {filteredProducts.map((prod) => (
          <li key={prod.id}>{`${prod.name} (${prod.category})`}</li>
        ))}
      </ul>
    </div>
  );
};

export default SelectFilter;