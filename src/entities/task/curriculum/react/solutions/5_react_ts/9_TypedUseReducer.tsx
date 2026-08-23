import React, { useReducer } from 'react';

//  РЕШЕНИЕ:
// 1. Discriminated Union для состояний (невозможные состояния исключены на уровне типов)
type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: string[] }
  | { status: 'error'; error: string };

// 2. Discriminated Union для экшенов (payload жестко связан с type)
type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: string[] }
  | { type: 'FETCH_ERROR'; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { status: 'loading' };
    case 'FETCH_SUCCESS':
      return { status: 'success', data: action.payload };
    case 'FETCH_ERROR':
      return { status: 'error', error: action.payload };
    default:
      return state;
  }
}

export function PostsLoader() {
  const [state, dispatch] = useReducer(reducer, { status: 'idle' });

  const loadData = () => {
    dispatch({ type: 'FETCH_START' });
    setTimeout(() => {
      dispatch({ type: 'FETCH_SUCCESS', payload: ['Пост 1', 'Пост 2', 'Пост 3'] });
    }, 1000);
  };

  return (
    <div>
      <button onClick={loadData}>Загрузить посты</button>
      
      {state.status === 'idle' && <p>Нажмите кнопку для загрузки</p>}
      {state.status === 'loading' && <p>Загрузка...</p>}
      {state.status === 'success' && (
        <ul>
          {state.data.map((post, idx) => (
            <li key={idx}>{post}</li>
          ))}
        </ul>
      )}
      {state.status === 'error' && <p style={{ color: 'red' }}>Ошибка: {state.error}</p>}
    </div>
  );
}

export default PostsLoader;
