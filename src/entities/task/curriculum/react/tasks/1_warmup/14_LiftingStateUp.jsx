import { useState } from "react";

// **Реализуйте поднятие состояния (Lifting State Up)**

// **Требования:**
// 1. Состояние активной вкладки (activeTab) хранится в родительском компоненте TabsContainer.
// 2. Дочерний компонент TabButton получает пропсы: id, label, isActive, onSelect.
// 3. При клике на TabButton вызывается onSelect(id), обновляя активную вкладку у родителя.
// 4. Родитель отображает контент, соответствующий выбранной вкладке.

const TABS = [
  { id: "overview", label: "Обзор", content: "Контент вкладки Обзор" },
  { id: "pricing", label: "Тарифы", content: "Контент вкладки Тарифы" },
  { id: "reviews", label: "Отзывы", content: "Контент вкладки Отзывы" },
];

const TabButton = ({ id, label, isActive, onSelect }) => {
  // Реализуйте дочерний компонент кнопки вкладки
  return <button>{label}</button>;
};

const TabsContainer = () => {
  // Напишите состояние и передачу пропсов

  return (
    <div>
      <div>{/* Отрендерите список кнопок вкладок */}</div>
      <div>{/* Отобразите текущий контент */}</div>
    </div>
  );
};

export default TabsContainer;
