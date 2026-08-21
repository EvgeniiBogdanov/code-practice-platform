// Проведите рефакторинг компонента ScrollToTopButton: устраните потенциальную утечку памяти.

import React, { useState, useEffect } from 'react';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return <button onClick={() => window.scrollTo(0, 0)}>Наверх</button>;
}