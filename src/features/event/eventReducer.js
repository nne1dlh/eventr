import { createReducer } from "../../app/common/util/reducerUtils";
import {
  CREATE_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT,
  FETCH_EVENT,
  FETCH_USER_EVENT
} from "./eventConstants";

const initState = {
  events: [],
  userEvents: []
};

const createEvent = (state, payload) => {
  //state coming from store
  return [...state, payload.event];
};

const updateEvent = (state, payload) => {
  console.log("pay", payload);
  return [...state.filter(e => e.id !== payload.evt.id), payload.evt]; //filtering all existing event and sending updated event
};

const deleteEvent = (state, payload) => {
  return [...state.filter(e => e.id !== payload.eventId)];
};

const fetchEvent = (state, payload) => {
  return {
    ...state,
    events: payload.events
  }; //new state will update store with new events
};

const fetchUserEvent = (state, payload) => {
  return {
    ...state,
    userEvents: payload.events
  };
};

export default createReducer(initState, {
  [CREATE_EVENT]: createEvent,
  [UPDATE_EVENT]: updateEvent,
  [DELETE_EVENT]: deleteEvent,
  [FETCH_EVENT]: fetchEvent,
  [FETCH_USER_EVENT]: fetchUserEvent
});
