export const initialState = {
  signUpOpen: false,
  logInOpen: false
}

function signUpOpen(state, action) {
  return {
    ...state,
    signUpOpen: true
  };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "SIGN_UP_OPEN":
      return signUpOpen(state, action);
    default:
      return state;
  }
}