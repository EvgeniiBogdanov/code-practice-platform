import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

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
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
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

export default usersSlice.reducer
