import React, { useReducer } from 'react';

// ❌ ОШИБКА / ЗАДАЧА:
// Стейт редьюсера описан как единый плоский объект с опциональными полями:
// { loading: boolean, data?: string[], error?: string }
// Из-за этого возможны некорректные комбинации (например loading=true И error="Failed").
// 
// Требования:
// 1. Сформируйте State как Discriminated Union по полю status: 'idle' | 'loading' | 'success' | 'error'
// 2. Сформируйте Action как Discriminated Union по полем type: 'FETCH_START' | 'FETCH_SUCCESS' | 'FETCH_ERROR'

type State = {
  loading: boolean;
  data?: string[];
  error?: string;
};

type Action = {
  type: string;
  payload?: any;
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { loading: true };
    case 'FETCH_SUCCESS':
      return { loading: false, data: action.payload };
    case 'FETCH_ERROR':
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

export function PostsLoader() {
  const [state, dispatch] = useReducer(reducer, { loading: false });

  const loadData = () => {
    dispatch({ type: 'FETCH_START' });
    setTimeout(() => {
      dispatch({ type: 'FETCH_SUCCESS', payload: ['Пост 1', 'Пост 2'] });
    }, 1000);
  };

  return (
    <div>
      <button onClick={loadData}>Загрузить посты</button>
      {state.loading && <p>Загрузка...</p>}
      {state.data && <ul>{state.data.map((p, i) => <li key={i}>{p}</li>)}</ul>}
    </div>
  );
}

export default PostsLoader;
