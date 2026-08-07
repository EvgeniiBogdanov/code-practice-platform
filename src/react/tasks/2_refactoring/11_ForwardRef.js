/* Что проверяет: Понимание того, что функциональные компоненты по умолчанию не могут принимать проп ref, 
и умение использовать React.forwardRef. */

/* В чем подвох: Вы создали красивый переиспользуемый компонент ввода (UI-kit). 
В родительском компоненте вы пытаетесь передать в него ref, чтобы установить фокус при монтировании. 
Но фокус не работает, а в консоли висит предупреждение (Warning).
*/

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
