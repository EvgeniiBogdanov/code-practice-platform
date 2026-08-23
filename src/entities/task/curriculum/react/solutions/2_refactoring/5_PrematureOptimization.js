import React, { useState } from 'react';

export default function SimpleCalculator({ a = 2, b = 3 }) {
  const [value, setValue] = useState('');

  //  ПРАВИЛЬНО: Дешевые операции вычисляем напрямую при рендере
  const sum = a + b; 

  //  ПРАВИЛЬНО: Обычная функция, сборщик мусора (Garbage Collector) в JS 
  // легко с ней справится, это не вызовет проблем с производительностью
  const handleChange = (e) => { 
    setValue(e.target.value);
  };

  return (
    <div>
      <p>Сумма: {sum}</p>
      <input type="text" value={value} onChange={handleChange} />
    </div>
  );
}
