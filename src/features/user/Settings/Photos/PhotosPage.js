import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { Segment, Header, Divider, Grid, Button } from "semantic-ui-react";
import DropzoneInput from "./DropzoneInput";
import CropperInput from "./CropperInput";
import { uploadProfImage, delPhoto, setMainPhoto } from "../../userActions";
import { toastr } from "react-redux-toastr";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import UserPhotos from "./UserPhotos";

const queryAuth = ({ auth }) => {
  return [
    {
      collection: "users",
      doc: auth.uid,
      subcollections: [{ collection: "photos" }],
      storeAs: "photos"
    }
  ];
};

const PhotosPage = ({
  uploadProfImage,
  photos,
  profile,
  delPhoto,
  setMainPhoto,
  loading
}) => {
  const [files, setFiles] = useState([]);
  const [image, setImage] = useState(null);

  console.log("profile", profile);
  console.log("pics", photos);

  useEffect(() => {
    return () => {
      files.forEach(f => URL.revokeObjectURL(f.preview));
    };
  }, [files]);

  const handleUploadImage = async () => {
    try {
      await uploadProfImage(image, files[0].name);
      handleCancelCrop();
      toastr.success("Success", "Photo uploaded...");
    } catch (err) {
      console.log(err);
      toastr.error("Opps", "sumptin wong");
    }
  };

  const handleCancelCrop = () => {
    setFiles([]);
    setImage(null);
  };

  const handleDeletePhoto = async photo => {
    try {
      await delPhoto(photo);
    } catch (err) {
      toastr.error("Opps", err.message);
    }
  };

  const handleSetMainPhoto = async pic => {
    try {
      await setMainPhoto(pic);
    } catch (err) {
      console.log(err);
      toastr.error("Ooops", err.message);
    }
  };

  return (
    <Segment>
      <Header dividing size="large" content="Your Photos" />
      <Grid>
        <Grid.Row />
        <Grid.Column width={4}>
          <Header color="teal" sub content="Step 1 - Add Photo" />
          <DropzoneInput setFiles={setFiles} />
        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width={4}>
          <Header sub color="teal" content="Step 2 - Resize image" />
          {files.length > 0 && (
            <CropperInput setImage={setImage} imagePreview={files[0].preview} />
          )}
        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width={4}>
          <Header sub color="teal" content="Step 3 - Preview & Upload" />
          {files.length > 0 && (
            <Fragment>
              <div
                className="img-preview"
                style={{ minHeight: "200px", minWidth: "200px", overflow: "hidden" }}
              />

              <Button.Group>
                <Button
                  onClick={handleUploadImage}
                  style={{ width: "100px" }}
                  positive
                  icon="check"
                  loading={loading}
                />
                <Button
                  disabled={loading}
                  onClick={handleCancelCrop}
                  style={{ width: "100px" }}
                  icon="close"
                />
              </Button.Group>
            </Fragment>
          )}
        </Grid.Column>
      </Grid>

      <Divider />
      <UserPhotos
        photos={photos}
        profile={profile}
        deletePhoto={handleDeletePhoto}
        setMainPhoto={handleSetMainPhoto}
      />
    </Segment>
  );
};

const mapDispatchToProps = {
  uploadProfImage,
  delPhoto,
  setMainPhoto
};

const mapStateToProps = state => ({
  auth: state.firebase.auth,
  profile: state.firebase.profile,
  photos: state.firestore.ordered.photos,
  loading: state.asyncP.loading
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect(auth => queryAuth(auth))
)(PhotosPage);
