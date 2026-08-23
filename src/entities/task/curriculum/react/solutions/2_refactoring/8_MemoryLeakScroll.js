import React, { useState, useEffect } from 'react';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300); // Заодно немного сократили код
    };

    window.addEventListener('scroll', handleScroll);

    //  ПРАВИЛЬНО: Удаляем слушатель при размонтировании компонента
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!isVisible) return null;

  return <button onClick={() => window.scrollTo(0, 0)}>Наверх</button>;
}
