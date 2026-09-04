/**
 * Redux Store
 *
 * ТЗ:
 * Настроить Redux Store с подключением редюсера пользователей.
 */

import { configureStore } from '@reduxjs/toolkit'
import usersReducer from './usersSlice'

export const store = configureStore({
  reducer: {
    users: usersReducer
  }
})
