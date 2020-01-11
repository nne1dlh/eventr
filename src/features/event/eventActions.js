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
      dispatch(asyncActionStart());
      let createdEvent = await firestore.add("events", newEvent);
      await firestore.set(`event_attendee/${createdEvent.id}_${user.uid}`, {
        //creatdEvent ID returned by firestore
        eventId: createdEvent.id,
        userUid: user.uid,
        eventDate: event.eventDate, //from form EVENTDATE !!!
        host: true
      });
      toastr.success("Success !!", "Event has been created");
      dispatch(asyncActionFinish());
      return createdEvent;
    } catch (error) {
      toastr.error("Opps", "Sumptin Wrong");
      dispatch(asyncActionError());
    }
  };
};

export const updateEvent = evt => {
  return async (dispatch, getState) => {
    const firestore = firebase.firestore();
    try {
      dispatch(asyncActionStart());
      let eventDocRef = firestore.collection("events").doc(evt.id);
      let dateEqual = getState().firestore.ordered.events[0].eventDate.isEqual(
        evt.eventDate
      );

      if (!dateEqual) {
        let batch = firestore.batch();
        batch.update(eventDocRef, evt);

        let eventAttendeeRef = firestore.collection("event_attendee");
        let eventAttendeeQuery = await eventAttendeeRef.where("eventId", "==", evt.id);
        let eventAttendeeQuerySnap = await eventAttendeeQuery.get();

        for (let i = 0; i < eventAttendeeQuerySnap.docs.length; i++) {
          let eventAttendeeDocRef = await firestore
            .collection("event_attendee")
            .doc(eventAttendeeQuerySnap.docs[i].id);

          batch.update(eventAttendeeDocRef, {
            eventDate: evt.eventDate
          });
        }
        await batch.commit();
      } else {
        await eventDocRef.update(evt);
      }
      dispatch(asyncActionFinish());
      toastr.success("Success Dude !!", "Evt has been updated");
    } catch (error) {
      dispatch(asyncActionError());
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
  let today = new Date();

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
          .where("eventDate", ">=", today)
          .orderBy("eventDate")
          .startAfter(startAfter)
          .limit(2))
      : (query = eventsRef //initial load
          .where("eventDate", ">=", today)
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

export const addEventComment = (eventId, values, parentId) => async (
  dispatch,
  getState,
  { getFirebase }
) => {
  const firebase = getFirebase();
  const profile = getState().firebase.profile;
  const user = firebase.auth().currentUser;
  let newComment = {
    parentId: parentId,
    displayName: profile.displayName,
    photoURL: profile.photoURL || "/assets/user.png",
    uid: user.uid,
    text: values.comment,
    date: Date.now()
  };
  try {
    await firebase.push(`event_chat/${eventId}`, newComment);
    console.log("success adding comment");
  } catch (err) {
    console.log(err);
    toastr.error("Crap", "Problem adding comment");
  }
};
