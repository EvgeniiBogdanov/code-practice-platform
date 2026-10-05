import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  // signal из thunkAPI отменяет fetch, если вызвать promise.abort() у результата dispatch
  async (_, { signal }) => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users', { signal })
    if (!response.ok) {
      throw new Error(`Не удалось загрузить данные: HTTP ${response.status}`)
    }
    return response.json()
  },
  {
    // Не запускаем повторную загрузку, если она уже идёт или данные получены
    // (повторное монтирование, StrictMode). После ошибки повтор разрешён.
    condition: (_, { getState }) => {
      const { status } = getState().users
      return status === 'idle' || status === 'failed'
    }
  }
)

const initialState = {
  users: [],
  searchQuery: '',
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
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
});

export const { setSearchQuery } = usersSlice.actions

// Простые селекторы — обычные функции. createSelector для чтения поля не нужен:
// результат и так та же ссылка, мемоизация только добавила бы накладные расходы
export const selectUsers = (state) => state.users.users
export const selectSearchQuery = (state) => state.users.searchQuery
export const selectUsersStatus = (state) => state.users.status
export const selectUsersError = (state) => state.users.error

// Мемоизация нужна там, где селектор создаёт новый массив: без неё filter возвращал бы
// новую ссылку при каждом вызове, и useSelector перерисовывал бы компонент на любое изменение стора
export const selectFilteredUsers = createSelector(
  [selectUsers, selectSearchQuery],
  (users, searchQuery) => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return users
    return users.filter((user) => user.name.toLowerCase().includes(query))
  }
)

export default usersSlice.reducer
