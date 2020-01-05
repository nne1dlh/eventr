import React, { Fragment } from "react";
import { Header, Card, Image, Button } from "semantic-ui-react";

const UserPhotos = ({ photos, profile, deletePhoto, setMainPhoto, loading }) => {
  let filteredPhotos;
  if (photos) {
    filteredPhotos = photos.filter(p => {
      return p.url !== profile.photoURL; //give us array of all photos except main
    });
  }
  console.log("profile", profile);
  return (
    <Fragment>
      <Header sub color="teal" content="All Photos" />

      <Card.Group itemsPerRow={5}>
        <Card>
          <Image src={profile.photoURL || "/assets/user.png"} />
          <Button positive>Main Photo</Button>
        </Card>
        {photos &&
          filteredPhotos.map(p => (
            <Card key={p.id}>
              <Image src={p.url} />
              <div className="ui two buttons">
                <Button
                  onClick={() => setMainPhoto(p)}
                  basic
                  color="green"
                  loading={loading}
                >
                  Main
                </Button>
                <Button
                  onClick={() => {
                    return deletePhoto(p);
                  }}
                  basic
                  icon="trash"
                  color="red"
                />
              </div>
            </Card>
          ))}
      </Card.Group>
    </Fragment>
  );
};

export default UserPhotos;
