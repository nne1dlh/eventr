import { toastr } from "react-redux-toastr";
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError
} from "../async/asyncActions";
import cuid from "cuid";
import firebase from "../../app/config/firebase";
import { FETCH_EVENT } from "../event/eventConstants";

export const updateProfile = (
  user //user from form
) => async (dispatch, getState, { getFirebase }) => {
  console.log("update profile user", user);

  const firebase = getFirebase();
  const { isLoaded, isEmpty, ...updatedUser } = user;
  console.log("profile updatedUser", updatedUser);
  try {
    await firebase.updateProfile(updatedUser); //update profile in firestore db provided by react-redux firebase

    toastr.success("Success", "Your profile has been updated");
  } catch (err) {
    console.log(err);
  }
};

export const uploadProfImage = (file, fileName) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const imageName = cuid();
  //getFirebase is from react-fb
  const firebase = getFirebase();
  const firestore = getFirestore();
  const user = firebase.auth().currentUser;
  const path = `${user.uid}/user_images`;
  const options = {
    name: imageName
  };
  try {
    dispatch(asyncActionStart());
    //upld file to firebase storage uploadFile is from react-redux-firebase
    let uploadedFile = await firebase.uploadFile(path, file, null, options);
    //get url of imag
    let downloadURL = await uploadedFile.uploadTaskSnapshot.ref.getDownloadURL();
    //get userdoc from fb
    let userDoc = await firestore.get(`users/${user.uid}`);
    //check if usr has photo if not, upd profile
    if (!userDoc.data().photoURL) {
      await firebase.updateProfile({
        photoURL: downloadURL
      });
      await user.updateProfile({
        //update firebase auth section
        photoURL: downloadURL
      });
    }
    //add the image to firestore
    await firestore.add(
      {
        collection: "users",
        doc: user.uid,
        subcollections: [{ collection: "photos" }]
      },
      {
        name: imageName,
        url: downloadURL
      }
    );
    dispatch(asyncActionFinish());
  } catch (err) {
    console.log(err);
    dispatch(asyncActionError());
  }
};

export const delPhoto = photo => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();
  const firestore = getFirestore();
  const user = firebase.auth().currentUser;
  try {
    await firebase.deleteFile(`${user.uid}/user_images/${photo.name}`);
    await firestore.delete({
      collection: "users",
      doc: user.uid,
      subcollections: [{ collection: "photos", doc: photo.id }]
    });
  } catch (err) {
    console.log(err);
    throw new Error("Problem deleting the picture");
  }
};

export const setMainPhoto = photo => async (dispatch, getState) => {
  const firestore = firebase.firestore();
  const user = firebase.auth().currentUser;
  const today = new Date();
  let userDocRef = firestore.collection("users").doc(user.uid);
  let eventAttendeeRef = firestore.collection("event_attendee");
  try {
    dispatch(asyncActionStart());
    let batch = firestore.batch();

    batch.update(userDocRef, {
      photoURL: photo.url
    });

    let eventQuery = await eventAttendeeRef
      .where("userUid", "==", user.uid)
      .where("eventDate", ">=", today);

    let eventQuerySnap = await eventQuery.get();

    for (let i = 0; i < eventQuerySnap.docs.length; i++) {
      let eventDocRef = await firestore
        .collection("events")
        .doc(eventQuerySnap.docs[i].data().eventId);

      let event = await eventDocRef.get();
      console.log("batchm event", event.data().hostUid);

      if (event.data().hostUid === user.uid) {
        //event.data() undefined
        batch.update(eventDocRef, {
          hostPhotoURL: photo.url,
          [`attendees.${user.uid}.photoURL`]: photo.url
        });
      } else {
        batch.update(eventDocRef, {
          [`attendees.${user.uid}.photoURL`]: photo.url
        });
      }
    }
    console.log("bitch", batch);
    await batch.commit();
    dispatch(asyncActionFinish());

    // return await firebase.updateProfile({
    //   photoURL: photo.url
    // });
  } catch (err) {
    console.log("pisserror", err);
    dispatch(asyncActionError());
    throw new Error("Problem setting main photo");
  }
};

export const goingToEvent = e => async (dispatch, getState) => {
  dispatch(asyncActionStart());

  const firestore = firebase.firestore();
  const user = firebase.auth().currentUser;
  const profile = getState().firebase.profile;
  const attendee = {
    going: true,
    joinDate: new Date(),
    photoURL: profile.photoURL || "/assets/user.png",
    displayName: profile.displayName,
    host: false
  };
  console.log("user uid", user.uid);
  try {
    let eventDocRef = firestore.collection("events").doc(e.id);
    let eventAttendeeDocRef = firestore
      .collection("event_attendee")
      .doc(`${e.id}_${user.id}`);

    await firestore.runTransaction(async transaction => {
      await transaction.get(eventDocRef);
      await transaction.update(eventDocRef, {
        [`attendees.${user.uid}`]: attendee
      });
      await transaction.set(eventAttendeeDocRef, {
        eventId: e.id,
        userUid: user.uid,
        eventDate: e.eventDate,
        host: false
      });
    });

    dispatch(asyncActionFinish());
    toastr.success("Success", "You have signed up for event");
  } catch (err) {
    dispatch(asyncActionError());
    console.log(err);
    toastr.error("Crap", "Problem signing up for event");
  }
};

export const cancelGoingToEvent = e => async (
  dispatch,
  getState,
  { getFirestore, getFirebase }
) => {
  const firestore = getFirestore();
  const firebase = getFirebase();
  const user = firebase.auth().currentUser;
  try {
    await firebase.update(`events/${e.id}`, {
      [`attendees.${user.uid}`]: firestore.FieldValue.delete()
    });
    await firestore.delete(`event_attendee/${e.id}_${user.uid}`);
    toastr.success("Success", "You have been rmoved from event");
  } catch (err) {
    console.log("from cancel event", err);
    toastr.error("Crapola", "Something went wrong with cancel");
  }
};

export const getUserEvents = (userUid, activeTab) => async (dispatch, getState) => {
  console.log("usrid", userUid);
  dispatch(asyncActionStart());
  const firestore = firebase.firestore();
  const today = new Date(Date.now());
  let eventsRef = firestore.collection("event_attendee");
  let query;
  switch (activeTab) {
    case 1: //past events
      query = eventsRef
        .where("userUid", "==", userUid)
        .where("eventDate", "<=", today)
        .orderBy("eventDate", "desc");
      break;
    case 2: //future events
      query = eventsRef
        .where("userUid", "==", userUid)
        .where("eventDate", ">=", today)
        .orderBy("eventDate");
      break;
    case 3: //hosted events
      query = eventsRef
        .where("userUid", "==", userUid)
        .where("host", "==", true)
        .orderBy("eventDate", "desc");
      break;
    default:
      query = eventsRef.where("userUid", "==", userUid).orderBy("eventDate", "desc");
      console.log("shit", userUid); //null when using same user
  }
  try {
    let querySnap = await query.get();
    let events = [];

    for (let i = 0; i < querySnap.docs.length; i++) {
      let evt = await firestore
        .collection("events")
        .doc(querySnap.docs[i].data().eventId)
        .get();
      events.push({ ...evt.data(), id: evt.id });
    }

    dispatch({ type: FETCH_EVENT, payload: { events } });

    console.log("qsnapper", querySnap);
    dispatch(asyncActionFinish());
  } catch (err) {
    console.log(err);
    dispatch(asyncActionError());
  }
};
