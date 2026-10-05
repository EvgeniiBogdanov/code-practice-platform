/**
 * Задача: Загрузка данных через Redux Toolkit
 *
 * ТЗ:
 * 1. Предоставить Redux Store компоненту App через Provider.
 * 2. В компоненте App:
 *    - Запустить получение данных пользователей при монтировании компонента.
 *    - Извлечь данные и статус запроса из Redux Store.
 *    - Отобразить состояния интерфейса:
 *      * Загрузка: текст "Загрузка..."
 *      * Ошибка: текст "Ошибка: [сообщение]"
 *      * Успех: заголовок "Список пользователей (Redux Toolkit)"
 *        и список (<ul>) с именем и email каждого пользователя.
 */

import React, { useEffect } from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { store } from './store'
import { fetchUsers } from './usersSlice'

const App = () => {
  return (
    <div>
    </div>
  )
}

const FetchUsersRTK = () => {
  return (
    <App />
  )
}

export default FetchUsersRTK
