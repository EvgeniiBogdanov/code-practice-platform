/**
 * Reducer управления состоянием загрузки данных
 *
 * ТЗ:
 * Реализуйте чистую функцию reducer и начальное состояние для управления асинхронным запросом:
 * - Обработайте состояния: старт загрузки, успешное получение данных и ошибка запроса.
 * - Обеспечьте консистентность состояния (исключите одновременное присутствие loading: true и error).
 */

export const FETCH_INIT = 'FETCH_INIT';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const FETCH_FAILURE = 'FETCH_FAILURE';

export const initialState = {
  users: [],
  loading: true,
  error: null,
};

export const reducer = (state, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
