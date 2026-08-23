import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// 1. Создайте асинхронный thunk "users/fetchUsers" для получения списка пользователей от API:
//    https://jsonplaceholder.typicode.com/users
//    Используйте синтаксис async/await и конструкцию try/catch для обработки ошибок.
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  // Напишите ваш код здесь
})

const initialState = {
  users: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
}

// 2. Создайте slice "users", обработайте extraReducers для thunk-действий:
//    - pending: статус 'loading', сброс ошибки
//    - fulfilled: статус 'succeeded', сохранение пользователей
//    - rejected: статус 'failed', сохранение ошибки
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Напишите ваш код здесь
  }
})

export default usersSlice.reducer
