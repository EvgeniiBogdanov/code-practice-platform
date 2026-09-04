import { useReducer, useEffect } from 'react'
import { reducer, initialState, FETCH_INIT, FETCH_SUCCESS, FETCH_FAILURE } from './reducer'

export const useFetchUsers = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const controller = new AbortController()

    const loadData = async () => {
      dispatch({ type: FETCH_INIT })
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users', {
          signal: controller.signal
        })
        if (!response.ok) {
          throw new Error('Не удалось загрузить данные')
        }
        const data = await response.json()
        dispatch({ type: FETCH_SUCCESS, payload: data })
      } catch (err) {
        if (err.name !== 'AbortError') {
          dispatch({ type: FETCH_FAILURE, payload: err.message })
        }
      }
    }

    loadData()

    return () => {
      controller.abort()
    }
  }, [])

  return state
}
