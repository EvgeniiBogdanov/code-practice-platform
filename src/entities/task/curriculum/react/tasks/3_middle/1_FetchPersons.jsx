import React from 'react';

/**
 * Задача: Поиск и фильтрация персонажей (Rick and Morty API)
 *
 * Требования:
 * 1. Реализуйте поле ввода для поиска персонажей по имени.
 * 2. Реализуйте выпадающий список (select) для выбора статуса: "Все статусы", "alive", "dead", "unknown".
 * 3. Отправляйте запрос к API (https://rickandmortyapi.com/api/character) при изменении имени или статуса.
 * 4. Отображайте список полученных персонажей (имя, статус и изображение).
 * 5. Корректно обрабатывайте состояния:
 *    - Загрузка (loading)
 *    - Ошибка запроса или персонажи не найдены (error / 404)
 *    - Предотвращение состояния гонки (Race Condition / отмена устаревших запросов)
 */

function getPeople(name) {
  return fetch(`https://rickandmortyapi.com/api/character?name=` + name);
}

export default function App() {
  return <div>App</div>;
}