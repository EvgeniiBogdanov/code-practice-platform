/* Что проверяет: Понимание того, что React контролирует только свою область видимости (DOM-дерево компонента). 
Глобальные объекты браузера (window, document) нужно контролировать вручную. */

/* В чем подвох: Компонент подписывается на событие прокрутки страницы (scroll), чтобы показать кнопку "Наверх". 
Пользователь переходит на другую страницу (компонент удаляется из DOM), но слушатель остается 
висеть на window и пытаться обновить стейт несуществующего компонента. */

import React, { useState, useEffect } from 'react';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // ❌ ОШИБКА: Слушатель добавлен, но никогда не удаляется
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
  }, []); // Выполняется один раз при монтировании

  if (!isVisible) return null;

  return <button onClick={() => window.scrollTo(0, 0)}>Наверх</button>;
}
