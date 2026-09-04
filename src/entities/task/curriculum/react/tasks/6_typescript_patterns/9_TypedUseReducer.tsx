import React, { useReducer } from 'react';

/**
 * Собеседование: React + TypeScript
 * 
 * КОНТЕКСТ:
 * Вы реализуете хук `useReducer` для управления асинхронной загрузкой списка постов.
 *
 * ПРОБЛЕМА:
 * Состояние описано единым плоским объектом со всеми опциональными флагами:
 * `{ loading: boolean, data?: string[], error?: string }`.
 * Это позволяет создавать недопустимые комбинации (например, `loading: true` одновременно с наличием `error`),
 * а экшены не типизированы и не защищены от ошибок в названиях или некорректного payload.
 *
 * ТРЕБОВАНИЯ:
 * 1. Спроектируйте тип состояния так, чтобы некорректные комбинации данных были невозможны на уровне компилятора:
 *    данные должны быть доступны только в состоянии успеха, а текст ошибки — только в состоянии сбоя.
 * 2. Строго типизируйте экшены: свяжите каждый тип действия (`type`) с его обязательной полезной нагрузкой (`payload`).
 * 3. Обеспечьте автоматическое сужение типов состояния и экшенов в редьюсере и интерфейсе.
 */

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
