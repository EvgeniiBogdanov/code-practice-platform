import React from 'react';
import { Link } from 'react-router-dom'; //  ПРАВИЛЬНО: Импортируем Link

export default function Sidebar() {
  return (
    <nav>
      <ul>
        {/*  ПРАВИЛЬНО: Link меняет URL в адресной строке без перезагрузки страницы */}
        <li><Link to="/">Лента</Link></li>
        <li><Link to="/messages">Сообщения</Link></li>
        <li><Link to="/profile/me">Мой профиль</Link></li>
      </ul>
    </nav>
  );
}
