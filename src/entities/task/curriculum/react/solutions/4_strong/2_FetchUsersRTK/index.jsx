import React, { useEffect } from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { store } from './store'
import { fetchUsers } from './usersSlice'

const App = () => {
  const dispatch = useDispatch()
  const { users, status, error } = useSelector((state) => state.users)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  if (status === 'loading') return <div>Загрузка...</div>
  if (status === 'failed') return <div>Ошибка: {error}</div>

  return (
    <div>
      <h2>Список пользователей (Redux Toolkit)</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  )
}

const FetchUsersRTK = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

export default FetchUsersRTK
