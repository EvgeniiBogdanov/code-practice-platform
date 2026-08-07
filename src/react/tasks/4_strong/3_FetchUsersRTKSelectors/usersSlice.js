import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'

// 1. Создайте асинхронный thunk "users/fetchUsers" для получения списка пользователей от API:
//    https://jsonplaceholder.typicode.com/users
//    Используйте синтаксис async/await и конструкцию try/catch для обработки ошибок.
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  // Напишите ваш код здесь
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
    // 2. Добавьте экшен setSearchQuery для изменения строки поиска в стейте
    setSearchQuery: (state, action) => {
      // Напишите ваш код здесь
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export const { setSearchQuery } = usersSlice.actions

// 3. Создайте базовые селекторы для получения частей состояния:
export const selectUsersState = (state) => state.users

// Заглушки для селекторов (замените/допишите правильную реализацию):
export const selectUsers = (state) => []
export const selectSearchQuery = (state) => ''
export const selectUsersStatus = (state) => 'idle'
export const selectUsersError = (state) => null

// 4. Используя функцию createSelector, создайте мемоизированный селектор selectFilteredUsers,
//    который возвращает отфильтрованный список пользователей (по полю name, без учета регистра)
//    на основе текущих пользователей (users) и строки поиска (searchQuery)
// Заглушка для мемоизированного селектора:
export const selectFilteredUsers = (state) => []

export default usersSlice.reducer
