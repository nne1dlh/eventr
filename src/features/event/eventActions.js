import { toastr } from "react-redux-toastr";
import { createNewEvent } from "../../app/common/util/helpers";
import firebase from "../../app/config/firebase";
import { FETCH_EVENT } from "./eventConstants";
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError
} from "../async/asyncActions";

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
        eventDate: event.eventDate, //from form EVENTDATE !!!
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
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    try {
      await firestore.update(`events/${evt.id}`, evt);
      toastr.success("Success Dude !!", "Evt has been updated");
    } catch (error) {
      toastr.error("Oppsie", "Sumptin went really wrong with update evt");
    }
  };
};

export const cancelToggle = (cancelled, eventId) => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  const firestore = getFirestore();
  const message = cancelled
    ? "Are you sure u wan tot cancel ?"
    : "Are you sure you want to reactivate event ?";
  try {
    toastr.confirm(message, {
      onOk: async () =>
        await firestore.update(`events/${eventId}`, {
          cancelled: cancelled
        })
    });
  } catch (err) {
    console.log("Cancel", err);
  }
};

export const getEventsForDashboard = lastEvent => async (dispatch, getState) => {
  const firestore = firebase.firestore();
  const eventsRef = firestore.collection("events"); // DATE !!!!

  try {
    dispatch(asyncActionStart());
    let startAfter =
      lastEvent &&
      (await firestore
        .collection("events")
        .doc(lastEvent.id)
        .get());
    let query;

    lastEvent
      ? (query = eventsRef
          //.where("eventDate", ">=", today)
          .orderBy("eventDate")
          .startAfter(startAfter)
          .limit(2))
      : (query = eventsRef //initial load
          //.where("eventDate", ">=", today)
          .orderBy("eventDate")
          .limit(2));

    let querySnap = await query.get();

    if (querySnap.docs.length === 0) {
      dispatch(asyncActionFinish());
      return querySnap;
    }
    console.log("querySS", querySnap);
    let events = [];

    for (let i = 0; i < querySnap.docs.length; i++) {
      let evt = { ...querySnap.docs[i].data(), id: querySnap.docs[i].id };
      events.push(evt);
    }
    console.log("events", events);
    dispatch({ type: FETCH_EVENT, payload: { events } }); //passing payload into reducer
    dispatch(asyncActionFinish());
    return querySnap;
  } catch (err) {
    console.log(err);
    dispatch(asyncActionError());
  }
};

export const addEventComment = (eventId, comment) => async (
  dispatch,
  getState,
  { getFirebase }
) => {
  const firebase = getFirebase();
  try {
    await firebase.push(`event_chat/${eventId}`, comment);
  } catch (err) {
    console.log(err);
    toastr.error("Crap", "Problem adding comment");
  }
};
