import { closeModal } from "../modals/modalActions";
import { SubmissionError, reset } from "redux-form";
import { toastr } from "react-redux-toastr";

export const login = creds => {
  return async (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    try {
      await firebase.auth().signInWithEmailAndPassword(creds.email, creds.passwd);
      dispatch(closeModal());
    } catch (err) {
      console.log("firebase error", err);
      throw new SubmissionError({
        _error: err.message //makes it avail in loginform
      });
    }
  };
};

export const registerUser = usr => async (
  //usr from redux forms
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();
  const firestore = getFirestore(); //access to base/store API
  try {
    let createdUser = await firebase
      .auth()
      .createUserWithEmailAndPassword(usr.email, usr.passwd);
    console.log("user", createdUser);
    await createdUser.user.updateProfile({
      //updating AUTH part of firebase
      displayName: usr.displayName
    });
    let newUser = {
      displayName: usr.displayName,
      createdAt: firestore.FieldValue.serverTimestamp()
    };
    await firestore.set(`users/${createdUser.user.uid}`, { ...newUser }); //fs.set if we have id
    dispatch(closeModal());
    console.log("users collecton created");
  } catch (err) {
    console.log("pissErroe", err);
    throw new SubmissionError({
      _error: err.message
    });
  }
};

export const socialLogin = selectedProvider => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();
  const firestore = getFirestore();
  try {
    dispatch(closeModal());
    const user = await firebase.login({
      provider: selectedProvider,
      type: "popup"
    });
    if (user.additionalUserInfo.isNewUser) {
      await firestore.set(`users/${user.user.uid}`, {
        displayName: user.profile.displayName,
        photoURL: user.profile.avatarUrl,
        createdAt: firestore.FieldValue.serverTimestamp()
      });
    }
    console.log("UserS", user);
  } catch (err) {
    console.log(err);
  }
};

export const updatePasswd = creds => async (dispatch, getState, { getFirebase }) => {
  const firebase = getFirebase();
  const user = firebase.auth().currentUser;
  try {
    await user.updatePassword(creds.newPassword1); //firebase updatePassword
    await dispatch(reset("account")); //name of form
    toastr.success("Success", "Your password has been updated");
  } catch (err) {
    throw new SubmissionError({
      _error: err.message
    });
  }
};
