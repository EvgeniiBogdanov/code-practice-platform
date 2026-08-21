// Проведите рефакторинг: компонент Form пытается сфокусировать CustomInput при монтировании, но фокус не устанавливается. Исправьте работу компонента.

import React, { useRef, useEffect } from 'react';

// Кастомный компонент инпута
const CustomInput = ({ placeholder, ref }) => {
  return <input className="fancy-input" placeholder={placeholder} ref={ref} />;
};

export default function Form() {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form>
      <CustomInput ref={inputRef} placeholder="Введите имя..." />
      <button type="submit">Отправить</button>
    </form>
  );
}