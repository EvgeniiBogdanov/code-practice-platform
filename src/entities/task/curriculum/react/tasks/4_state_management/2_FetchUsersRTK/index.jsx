// Задача: 2. Загрузка данных (Redux Toolkit)
//
// ТЗ:
// 1. Оберните компонент App в React Redux Provider и передайте настроенный store
// 2. Внутри App используйте хуки useSelector и useDispatch:
//    - При монтировании отправьте (dispatch) асинхронное действие fetchUsers
//    - Получите из состояния свойства: users, status, error
// 3. Отобразите список пользователей, надпись "Загрузка..." или ошибку.

import React, { useEffect } from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { store } from './store'
import { fetchUsers } from './usersSlice'

const App = () => {
  // Напишите ваш код работы с Redux (useDispatch, useSelector, useEffect) здесь

  return (
    <div>
      {/* Напишите вашу верстку здесь */}
    </div>
  )
}

// Оберните компонент в Provider
const FetchUsersRTK = () => {
  return (
    <App />
  )
}

export default FetchUsersRTK
