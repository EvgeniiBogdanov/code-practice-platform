import React, { useState } from 'react';

//  РЕШЕНИЕ:
// Использование as const при возврате массива превращает его в неизменяемый кортеж (Tuple)
export function useToggle(initialValue = false) {
  const [value, setValue] = useState<boolean>(initialValue);
  
  const toggle = (nextValue?: boolean) => {
    if (typeof nextValue === 'boolean') {
      setValue(nextValue);
    } else {
      setValue((prev) => !prev);
    }
  };

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
