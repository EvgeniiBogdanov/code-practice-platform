import { configureStore } from '@reduxjs/toolkit'
import usersReducer from './usersSlice'

// Создайте и настройте Redux store, передав usersReducer в качестве редюсера для ключа "users"
export const store = configureStore({
  reducer: {
    // Временная заглушка, чтобы избежать ошибки при импорте в Playground.
    // Замените на: users: usersReducer
    _stub: (state = {}) => state
  }
})
