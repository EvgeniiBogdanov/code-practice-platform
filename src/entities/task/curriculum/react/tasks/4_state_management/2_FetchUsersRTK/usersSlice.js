/**
 * Users Slice & Async Thunk (Redux Toolkit)
 *
 * ТЗ:
 * 1. Реализовать асинхронный thunk fetchUsers для получения пользователей:
 *    URL: https://jsonplaceholder.typicode.com/users
 * 2. Реализовать слайс пользователей (usersSlice):
 *    - Состояние должно содержать:
 *      * users: массив пользователей
 *      * status: статус запроса ('idle' | 'loading' | 'succeeded' | 'failed')
 *      * error: текст ошибки или null
 *    - Обработать жизненный цикл асинхронного thunk fetchUsers в слайсе.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
})

const initialState = {
  users: [],
  status: 'idle',
  error: null
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {}
})

export default usersSlice.reducer
