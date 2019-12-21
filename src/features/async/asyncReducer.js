import { createReducer } from "../../app/common/util/reducerUtils";
import {
  ASYNC_ACTION_ERROR,
  ASYNC_ACTION_START,
  ASYNC_ACTION_FINISH
} from "./asyncConstants";

const initState = {
  loading: false,
  elName: null
};

const asyncActionStarted = (state, payload) => {
  return {
    ...state,
    loading: true,
    elName: payload //returned to root reducer
  };
};

const asyncActionFinished = state => {
  return {
    ...state,
    loading: false,
    elName: null
  };
};

const asyncActionError = state => {
  return {
    ...state,
    loading: false,
    elName: null
  };
};

export default createReducer(initState, {
  [ASYNC_ACTION_START]: asyncActionStarted,
  [ASYNC_ACTION_FINISH]: asyncActionFinished,
  [ASYNC_ACTION_ERROR]: asyncActionError
});
