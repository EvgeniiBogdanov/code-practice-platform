import React, { useEffect } from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { store } from './store'
import {
  fetchUsers,
  setSearchQuery,
  selectFilteredUsers,
  selectSearchQuery,
  selectUsersStatus,
  selectUsersError
} from './usersSlice'

const App = () => {
  const dispatch = useDispatch()
  const users = useSelector(selectFilteredUsers)
  const searchQuery = useSelector(selectSearchQuery)
  const status = useSelector(selectUsersStatus)
  const error = useSelector(selectUsersError)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value))
  }

  return (
    <div>
      <h2>Список пользователей с фильтрацией (RTK + Selectors)</h2>
      <input
        type="text"
        placeholder="Поиск по имени..."
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ marginBottom: '16px', padding: '6px', fontSize: '14px' }}
      />

      {status === 'loading' && <div>Загрузка...</div>}
      {status === 'failed' && <div>Ошибка: {error}</div>}

      {status === 'succeeded' && (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} ({user.email})
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const FetchUsersRTKSelectors = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

export default FetchUsersRTKSelectors
