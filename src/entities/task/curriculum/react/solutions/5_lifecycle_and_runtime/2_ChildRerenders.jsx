import { memo, useState } from "react";

const Plain = () => {
  console.log("Plain"); // ✅ перерисуется: обычный ребёнок рендерится вместе с родителем
  return <p>Обычный дочерний компонент</p>;
};

const Memoized = memo(() => {
  console.log("Memoized"); // ❌ не перерисуется: пропсов нет, memo видит, что ничего не изменилось
  return <p>Мемоизированный компонент</p>;
});

const MemoizedWithProps = memo(({ options }) => {
  console.log("MemoizedWithProps"); // ✅ перерисуется: ["a", "b"] — новый массив на каждом рендере
  return <p>Опций: {options.length}</p>;
});

const Wrapper = ({ children }) => {
  const [count, setCount] = useState(0);
  console.log("Wrapper"); // ✅ перерисуется: у него изменилось состояние
  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>+1 ({count})</button>
      <Plain />
      <Memoized />
      <MemoizedWithProps options={["a", "b"]} />
      {children}
    </div>
  );
};

const FromChildren = () => {
  console.log("FromChildren"); // ❌ не перерисуется: элемент создал App, а App не рендерился
  return <p>Компонент из children</p>;
};

export default function App() {
  return (
    <Wrapper>
      <FromChildren />
    </Wrapper>
  );
}

// Ответ после клика:
// Wrapper
// Plain
// MemoizedWithProps
//
// Правило: компонент рендерится, если изменилось его состояние или контекст,
// либо перерисовался родитель, который его создал. memo пропускает рендер
// только при поверхностно равных пропсах. С React Compiler ["a", "b"] был бы
// закэширован автоматически, и MemoizedWithProps тоже бы не перерисовался.
