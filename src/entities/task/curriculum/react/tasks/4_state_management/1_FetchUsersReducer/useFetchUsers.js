// Реализуйте кастомный хук, который будет использовать useReducer для выполнения асинхронного запроса к API
// URL для запроса: https://jsonplaceholder.typicode.com/users
//
// Требования:
// - Использовать AbortController для предотвращения race conditions и отмены запроса при размонтировании

import { useReducer, useEffect } from 'react'
import { reducer, initialState, FETCH_INIT, FETCH_SUCCESS, FETCH_FAILURE } from './reducer'

export const useFetchUsers = () => {
  // Напишите ваш код здесь
  // Хук должен возвращать состояние (users, loading, error)
}
