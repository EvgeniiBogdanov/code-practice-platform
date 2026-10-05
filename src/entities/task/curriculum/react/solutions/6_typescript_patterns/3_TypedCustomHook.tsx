import React, { useCallback, useState } from 'react';

//  РЕШЕНИЕ:
// Использование as const при возврате массива превращает его в неизменяемый кортеж (Tuple)
export function useToggle(initialValue = false) {
  const [value, setValue] = useState<boolean>(initialValue);
  
  // Стабильная ссылка: хук могут передать в memo-компонент или зависимости эффекта
  const toggle = useCallback((nextValue?: boolean) => {
    setValue((prev) => (typeof nextValue === 'boolean' ? nextValue : !prev));
  }, []);

  //  Возвращаем readonly [boolean, (nextValue?: boolean) => void]
  return [value, toggle] as const;
}

export default function Demo() {
  const [isOn, toggle] = useToggle(false);

  return (
    <div>
      <p>Состояние лампочки: <strong>{isOn ? 'Включено ' : 'Выключено '}</strong></p>
      <button onClick={() => toggle()}>Переключить</button>
      <button onClick={() => toggle(true)} style={{ marginLeft: '8px' }}>Включить строго</button>
    </div>
  );
}
