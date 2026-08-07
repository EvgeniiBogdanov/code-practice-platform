// Задача: 3. Загрузка данных (RTK + Selectors)
//
// ТЗ:
// 1. Оберните компонент App в Provider со store.
//    - Запустите thunk fetchUsers при монтировании.
//    - Используйте селекторы (selectFilteredUsers, selectSearchQuery, selectUsersStatus, selectUsersError)
//      через useSelector для получения необходимых данных.
//    - Создайте управляемое поле ввода (инпут) для ввода поискового запроса,
//      которое при onChange диспатчит экшен setSearchQuery.
//    - Отобразите список отфильтрованных пользователей.

import React, { useEffect } from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { store } from './store'
import {
  fetchUsers,
  setSearchQuery,
  selectFilteredUsers,
  selectSearchQuery,
  selectUsersState
} from './usersSlice'

const App = () => {
  // Напишите логику с useSelector, useDispatch и useEffect здесь

  return (
    <div>
      {/* Напишите вашу верстку с поисковым инпутом и списком пользователей здесь */}
    </div>
  )
}

const FetchUsersRTKSelectors = () => {
  return (
    <App />
  )
}

export default FetchUsersRTKSelectors
