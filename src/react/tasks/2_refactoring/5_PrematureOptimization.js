/* Что проверяет: Понимание того, что мемоизация не бывает бесплатной. Выделение памяти под кэш и проверка 
зависимостей часто обходятся дороже, чем сами вычисления. */

/* В чем подвох: Код выглядит "очень профессионально", везде использованы хуки оптимизации, 
но на деле они только замедляют приложение. */

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
