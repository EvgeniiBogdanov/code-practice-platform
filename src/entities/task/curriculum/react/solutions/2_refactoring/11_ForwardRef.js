import React, { useRef, useEffect, forwardRef } from 'react';

//  ПРАВИЛЬНО: Оборачиваем компонент в forwardRef. 
// Теперь функция принимает два аргумента: props и ref.
const CustomInput = forwardRef((props, ref) => {
  return <input className="fancy-input" placeholder={props.placeholder} ref={ref} />;
});

export default function Form() {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Теперь это отлично работает
    }
  }, []);

  return (
    <form>
      <CustomInput ref={inputRef} placeholder="Введите имя..." />
      <button type="submit">Отправить</button>
    </form>
  );
}
