// Проведите рефакторинг компонента навигации Sidebar: переход по ссылкам приводит к полной перезагрузке страницы и сбросу состояния. Исправьте навигацию.

import React from 'react';

export default function Sidebar() {
  return (
    <nav>
      <ul>
        <li><a href="/">Лента</a></li>
        <li><a href="/messages">Сообщения</a></li>
        <li><a href="/profile/me">Мой профиль</a></li>
      </ul>
    </nav>
  );
}