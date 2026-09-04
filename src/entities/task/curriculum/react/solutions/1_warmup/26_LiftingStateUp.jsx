import { useState } from "react";

const TABS = [
  { id: "overview", label: "Обзор", content: "Контент вкладки Обзор" },
  { id: "pricing", label: "Тарифы", content: "Контент вкладки Тарифы" },
  { id: "reviews", label: "Отзывы", content: "Контент вкладки Отзывы" },
];

const TabButton = ({ id, label, isActive, onSelect }) => {
  return (
    <button onClick={() => onSelect(id)} disabled={isActive}>
      {label} {isActive ? "✓" : ""}
    </button>
  );
};

const TabsContainer = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const currentTab = TABS.find((tab) => tab.id === activeTab) || TABS[0];

  return (
    <div>
      <div>
        {TABS.map((tab) => (
          <TabButton
            key={tab.id}
            id={tab.id}
            label={tab.label}
            isActive={tab.id === activeTab}
            onSelect={setActiveTab}
          />
        ))}
      </div>
      <div>
        <p>{currentTab.content}</p>
      </div>
    </div>
  );
};

export default TabsContainer;
