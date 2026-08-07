// В этом файле опишите action types, initial state и reducer для управления состоянием загрузки данных

export const FETCH_INIT = 'FETCH_INIT';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const FETCH_FAILURE = 'FETCH_FAILURE';

export const initialState = {
  users: [],
  loading: true,
  error: null,
};

export const reducer = (state, action) => {
  // Напишите ваш reducer здесь
  switch (action.type) {
    default:
      return state;
  }
};
