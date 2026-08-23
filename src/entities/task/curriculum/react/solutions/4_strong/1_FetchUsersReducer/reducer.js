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
    case FETCH_INIT:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
      };
    case FETCH_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
