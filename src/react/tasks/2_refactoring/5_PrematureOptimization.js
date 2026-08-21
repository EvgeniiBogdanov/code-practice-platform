// Проведите код-ревью и рефакторинг компонента SimpleCalculator:
// избавьтесь от необоснованной и избыточной оптимизации, упростив код.

import React, { useState, useCallback, useMemo } from 'react';

export default function SimpleCalculator({ a, b }) {
  const [value, setValue] = useState('');

  const sum = useMemo(() => a + b, [a, b]);

  const handleChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  return (
    <div>
      <p>Сумма: {sum}</p>
      <input type="text" value={value} onChange={handleChange} />
    </div>
  );
}