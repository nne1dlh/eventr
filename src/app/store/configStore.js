import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "../reducers/rootReducer";
import thunk from "redux-thunk";
import { reactReduxFirebase, getFirebase } from "react-redux-firebase";
import { reduxFirestore, getFirestore } from "redux-firestore";
import firebase from "../config/firebase";

//storeEnhacer, get instance of firebase in actions
const rrfConfig = {
  userProfile: "users", //very firebase specific key/values
  attachAuthIsReady: true,
  useFirestoreForProfile: true,
  updateProfileOnLogin: false
};

const configStore = () => {
  //init state set in reducers. dont have overall initial state to seed the store
  const middlewares = [thunk.withExtraArgument({ getFirebase, getFirestore })]; //gives us access to firebase API
  const composedEnhancer = composeWithDevTools(
    applyMiddleware(...middlewares),
    reactReduxFirebase(firebase, rrfConfig),
    reduxFirestore(firebase)
  );

  const store = createStore(rootReducer, composedEnhancer);

  return store;
};
export default configStore;
