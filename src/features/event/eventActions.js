import { UPDATE_EVENT, DELETE_EVENT, FETCH_EVENT } from "./eventConstants";
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError
} from "../async/asyncActions";
import { fetchSampleData } from "../../app/data/mockApi";
import { toastr } from "react-redux-toastr";
import { createNewEvent } from "../../app/common/util/helpers";

export const createEvent = event => {
  //async returns promise
  return async (dispatch, getState, { getFirestore, getFirebase }) => {
    const firestore = getFirestore();
    const firebase = getFirebase();
    //const user = firestore.auth().currentUser;
    const user = firebase.auth().currentUser;
    const photoURL = getState().firebase.profile.photoURL;
    const newEvent = createNewEvent(user, photoURL, event); //helpers file to create to pass event obj to firestore
    try {
      let createdEvent = await firestore.add("events", newEvent);
      await firestore.set(`event_attendee/${createdEvent.id}_${user.uid}`, {
        //creatdEvent ID returned by firestore
        eventId: createdEvent.id,
        userUid: user.uid,
        eventDate: event.date, //from form
        host: true
      });
      toastr.success("Success !!", "Event has been created");
      return createdEvent;
    } catch (error) {
      toastr.error("Opps", "Sumptin Wrong");
    }
  };
};

export const updateEvent = evt => {
  return async dispatch => {
    try {
      dispatch({
        type: UPDATE_EVENT,
        payload: {
          evt //sent to reducer
        }
      });
      toastr.success("Success Dude !!", "Evt has been updated");
    } catch (error) {
      toastr.error("Oppsie", "Sumptin went weally wong with update evt");
    }
  };
};

export const deleteEvent = eventId => {
  return {
    type: DELETE_EVENT,
    payload: {
      eventId //sent to reducer
    }
  };
};

export const loadEvents = () => {
  return async dispatch => {
    try {
      dispatch(asyncActionStart());
      const events = await fetchSampleData();
      dispatch({ type: FETCH_EVENT, payload: { events } });
      dispatch(asyncActionFinish());
    } catch (error) {
      console.log(error);
      dispatch(asyncActionError());
    }
  };
};
