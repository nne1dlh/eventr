import { toastr } from "react-redux-toastr";
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError
} from "../async/asyncActions";
import cuid from "cuid";

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

export const setMainPhoto = photo => async (dispatch, getState, { getFirebase }) => {
  const firebase = getFirebase();
  try {
    return await firebase.updateProfile({
      photoURL: photo.url
    });
  } catch (err) {
    console.log(err);
    throw new Error("Problem setting main photo");
  }
};
