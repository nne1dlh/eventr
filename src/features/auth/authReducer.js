import { createReducer } from "../../app/common/util/reducerUtils";
import { SIGN_OUT_USER, LOGIN_USER } from "./authConstants";

//create initial state to pass to store
const initState = {
  auth: false,
  currentUser: null
};

const loginUser = (prevState, payload) => {
  return {
    auth: true,
    currentUser: payload.creds.email
  };
};

const signOutUser = () => {
  return {
    auth: false,
    currentUser: null
  };
};

export default createReducer(initState, {
  [LOGIN_USER]: loginUser,
  [SIGN_OUT_USER]: signOutUser
});
