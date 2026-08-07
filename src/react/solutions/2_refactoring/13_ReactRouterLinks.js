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

/*
=== Разбор решения ===
Тег <a> с атрибутом href отправляет новый запрос на сервер и полностью перезагружает HTML-документ. В React Router для клиентской навигации (когда перерисовываются только нужные компоненты, а страница не перезагружается) используется компонент <Link>.
*/
