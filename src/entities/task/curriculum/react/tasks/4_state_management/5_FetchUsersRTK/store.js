import { configureStore } from '@reduxjs/toolkit'
import usersReducer from './usersSlice'

/**
 * Redux Store
 *
 * ТЗ:
 * Настроить и экспортировать Redux Store с подключением редюсера пользователей.
 */
export const store = configureStore({
  reducer: {}
})
