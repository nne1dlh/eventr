import { INCREMENT_COUNTER, DECREMENT_COUNTER } from "./testConstants";
import { createReducer } from "../../app/common/util/reducerUtils";

const initState = {
  dataP: 42
};

const incrementCounter = state => {
  return { ...state, dataP: state.dataP + 1 };
};

const decrementCounter = state => {
  return { ...state, dataP: state.dataP - 1 };
};

//contain func that will return new state to store
// const testReducer = (state = initState, action) => {
//   switch (action.type) {
//     case INCREMENT_COUNTER:
//       return { ...state, dataP: state.dataP + 1 };
//     case DECREMENT_COUNTER:
//       return { ...state, dataP: state.dataP - 1 };
//     default:
//       return state;
//   }
// };

export default createReducer(initState, {
  [INCREMENT_COUNTER]: incrementCounter,
  [DECREMENT_COUNTER]: decrementCounter
});
