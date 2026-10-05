import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

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
