/**
 * Задача: Фильтрация данных с мемоизацией (RTK + Selectors)
 *
 * ТЗ:
 * 1. Предоставить Redux Store компоненту App через Provider.
 * 2. При монтировании инициировать загрузку пользователей.
 * 3. Реализовать поле ввода для поиска пользователей по имени:
 *    - Управляемый инпут (placeholder="Поиск по имени...")
 *    - Значение поиска хранится в Redux Store и изменяется через dispatch экшена setSearchQuery.
 * 4. Получать данные через селекторы с помощью useSelector:
 *    - Список пользователей отображать через мемоизированный селектор selectFilteredUsers.
 * 5. Отобразить состояния интерфейса:
 *    - Загрузка (status === 'loading'): текст "Загрузка..."
 *    - Ошибка (status === 'failed'): текст "Ошибка: [сообщение]"
 *    - Успех (status === 'succeeded'): заголовок "Список пользователей с фильтрацией (RTK + Selectors)"
 *      и список (<ul>) с отфильтрованными пользователями (имя и email).
 */

import React, { useEffect } from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { store } from './store'
import {
  fetchUsers,
  setSearchQuery,
  selectFilteredUsers,
  selectSearchQuery,
  selectUsersStatus,
  selectUsersError
} from './usersSlice'

const App = () => {
  return (
    <div>
    </div>
  )
}

const FetchUsersRTKSelectors = () => {
  return (
    <App />
  )
}

export default FetchUsersRTKSelectors
