export const initialRequestState = {
  data: [],
  isLoading: false,
  error: "",
};

export function requestReducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return {
        ...state,
        isLoading: true,
        error: "",
      };

    case "SUCCESS":
      return {
        ...state,
        isLoading: false,
        error: "",
        data: action.payload,
      };

    case "ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      return state;
  }
}