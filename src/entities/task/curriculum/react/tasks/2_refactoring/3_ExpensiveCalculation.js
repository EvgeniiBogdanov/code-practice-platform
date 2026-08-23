// Проведите рефакторинг: в компоненте при вводе каждого символа в input
// интерфейс зависает из-за тяжелых вычислений. Оптимизируйте компонент, чтобы ввод текста происходил плавно.

import React, { useState } from 'react';

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

  const expensiveResult = computeHeavyTask(number);

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