/**
 * Users Slice & Selectors (Redux Toolkit)
 *
 * ТЗ:
 * 1. Асинхронный thunk fetchUsers: загрузка пользователей (https://jsonplaceholder.typicode.com/users).
 * 2. Слайс users:
 *    - Состояние: users (массив), searchQuery (строка поиска), status, error.
 *    - Экшен setSearchQuery для обновления поискового запроса.
 *    - Обработка жизненного цикла thunk fetchUsers.
 * 3. Селекторы:
 *    - Базовые селекторы для извлечения состояния пользователей.
 *    - Мемоизированный селектор selectFilteredUsers (через createSelector):
 *      фильтрация пользователей по имени (name) на основе searchQuery (без учёта регистра).
 *      Если поисковый запрос пуст — возвращаются все пользователи.
 */

import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
})

const initialState = {
  users: [],
  searchQuery: '',
  status: 'idle',
  error: null
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
    }
  },
  extraReducers: (builder) => {
  }
})

export const { setSearchQuery } = usersSlice.actions

export const selectUsersState = (state) => state.users

export const selectUsers = (state) => []
export const selectSearchQuery = (state) => ''
export const selectUsersStatus = (state) => 'idle'
export const selectUsersError = (state) => null

export const selectFilteredUsers = (state) => []

export default usersSlice.reducer
