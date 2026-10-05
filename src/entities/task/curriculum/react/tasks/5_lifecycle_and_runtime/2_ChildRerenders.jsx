// React 19: Какие компоненты перерисуются?
// Среда: Browser DOM, Production (без StrictMode), React Compiler не подключён
// После монтирования пользователь один раз нажал «+1».
// Какие строки появятся в консоли после клика?

import { memo, useState } from "react";

const Plain = () => {
  console.log("Plain");
  return <p>Обычный дочерний компонент</p>;
};

const Memoized = memo(() => {
  console.log("Memoized");
  return <p>Мемоизированный компонент</p>;
});

const MemoizedWithProps = memo(({ options }) => {
  console.log("MemoizedWithProps");
  return <p>Опций: {options.length}</p>;
});

const Wrapper = ({ children }) => {
  const [count, setCount] = useState(0);
  console.log("Wrapper");
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
  console.log("FromChildren");
  return <p>Компонент из children</p>;
};

export default function App() {
  return (
    <Wrapper>
      <FromChildren />
    </Wrapper>
  );
}
