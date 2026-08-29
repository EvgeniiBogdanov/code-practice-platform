import React from "react";
import List from "./List";

export default function App() {
  const [visibleList, setVisibleList] = React.useState(true);
  const [numbers, setNumbers] = React.useState([
    { id: 1, value: 1 },
    { id: 2, value: 2 },
    { id: 3, value: 3 },
  ]);
  const nextId = React.useRef(4);

  const toggleVisibleList = () => {
    setVisibleList((prev) => !prev);
  };

  const addRandomNumber = React.useCallback(() => {
    const random = Math.floor(Math.random() * 10) + 1;
    setNumbers((prev) => [...prev, { id: nextId.current++, value: random }]);
  }, []);

  const removeNumber = React.useCallback((id) => {
    setNumbers((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <div className="App">
      <button onClick={toggleVisibleList}>Показать / Скрыть список</button>
      <br />
      <br />
      {visibleList && (
        <List
          numbers={numbers}
          addRandomNumber={addRandomNumber}
          removeNumber={removeNumber}
        />
      )}
    </div>
  );
}
