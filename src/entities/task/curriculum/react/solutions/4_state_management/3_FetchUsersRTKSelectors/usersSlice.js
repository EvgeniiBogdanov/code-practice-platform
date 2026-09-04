import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users')
      if (!response.ok) {
        throw new Error('Не удалось загрузить данные')
      }
      const data = await response.json()
      return data
    } catch (error) {
      throw error
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

// Базовые селекторы
export const selectUsersState = (state) => state.users

export const selectUsers = createSelector(
  selectUsersState,
  (usersState) => usersState.users
)

export const selectSearchQuery = createSelector(
  selectUsersState,
  (usersState) => usersState.searchQuery
)

export const selectUsersStatus = createSelector(
  selectUsersState,
  (usersState) => usersState.status
)

export const selectUsersError = createSelector(
  selectUsersState,
  (usersState) => usersState.error
)

// Мемоизированный селектор для фильтрации
export const selectFilteredUsers = createSelector(
  [selectUsers, selectSearchQuery],
  (users, searchQuery) => {
    if (!searchQuery.trim()) return users
    return users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }
)

export default usersSlice.reducer
