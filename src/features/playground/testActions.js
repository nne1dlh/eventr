import { INCREMENT_COUNTER, DECREMENT_COUNTER } from "./testConstants";
import { asyncActionFinish } from "../async/asyncActions";
import { ASYNC_ACTION_START } from "../async/asyncConstants";

export const incrementCounter = () => {
  //action creators that return actions
  return {
    type: INCREMENT_COUNTER
    //payload: {} objects or strings (no functions)
  };
};

export const decrementCounter = () => {
  return {
    type: DECREMENT_COUNTER
  };
};

const delay = ms => {
  return new Promise(res => setTimeout(res, ms));
};

export const incrementAsync = name => {
  return async dispatch => {
    dispatch({ type: ASYNC_ACTION_START, payload: name });
    await delay(1800);
    dispatch(incrementCounter());
    dispatch(asyncActionFinish());
  };
};

export const decrementAsync = name => {
  return async dispatch => {
    dispatch({ type: ASYNC_ACTION_START, payload: name });
    await delay(1500);
    dispatch({ type: DECREMENT_COUNTER });
    dispatch(asyncActionFinish());
  };
};
