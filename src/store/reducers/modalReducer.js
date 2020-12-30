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

function signUpClose(state, action) {
  return {
    ...state,
    signUpOpen: false
  };
}


function logInOpen(state, action) {
  return {
    ...state,
    logInOpen: true
  };
}

function logInClose(state, action) {
  return {
    ...state,
    logInOpen: false
  };
}


export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "SIGN_UP_OPEN":
      return signUpOpen(state, action);
    case "SIGN_UP_CLOSE":
      return signUpClose(state, action);
    case "LOG_IN_OPEN":
      return logInOpen(state, action);
    case "LOG_IN_CLOSE":
      return logInClose(state, action);
    default:
      return state;
  }
}