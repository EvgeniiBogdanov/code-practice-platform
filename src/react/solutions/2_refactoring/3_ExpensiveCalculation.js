import React, { useState, useMemo } from 'react';

// Имитация тяжелой функции
const computeHeavyTask = (num) => {
  console.log('Выполняются сложные вычисления...');
  let result = 0;
  for (let i = 0; i < 1000000000; i++) {
    result += num;
  }
  return result;
};

export default function ExpensiveComponent() {
  const [text, setText] = useState('');
  const [number, setNumber] = useState(5);

  //  ПРАВИЛЬНО: Вычисление закэшировано. 
  // При изменении `text` React просто вернет сохраненный результат.
  const expensiveResult = useMemo(() => computeHeavyTask(number), [number]);

  return (
    <div>
      <input 
        type="text" 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        placeholder="Введите текст..."
      />
      <p>Введенный текст: {text}</p>
      
      <button onClick={() => setNumber(number + 1)}>
        Увеличить число (Текущее: {number})
      </button>
      <p>Результат вычислений: {expensiveResult}</p>
    </div>
  );
}

/*
=== Разбор решения ===
Проблема в том, что при каждом изменении text (каждое нажатие клавиши) компонент перерисовывается полностью. Из-за этого computeHeavyTask запускается заново, замораживая интерфейс. Мы должны сказать React: "Пересчитывай это значение только тогда, когда меняется number".

Как надо (Рефакторинг): Оборачиваем вызов функции в useMemo.
*/
