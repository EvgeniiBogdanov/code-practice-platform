/**
 * Кастомный хук useFetchUsers
 *
 * ТЗ:
 * 1. Выполнить запрос к API: https://jsonplaceholder.typicode.com/users
 * 2. Управлять состоянием запроса с помощью useReducer (reducer и initialState из ./reducer).
 * 3. Обеспечить корректную обработку жизненного цикла: отмена запроса при размонтировании
 *    компонента (AbortController) и защита от состояния гонки (race condition).
 * 4. Хук должен возвращать объект состояния: { users, loading, error }.
 */

import { useReducer, useEffect } from 'react'
import { reducer, initialState, FETCH_INIT, FETCH_SUCCESS, FETCH_FAILURE } from './reducer'

export const useFetchUsers = () => {
}
