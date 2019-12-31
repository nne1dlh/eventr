import React from "react";
import { Grid, Header, Image, Segment } from "semantic-ui-react";
import LazyLoad from "react-lazyload";

const UserDetailedPhotos = ({ photos }) => {
  console.log("photos from UDPhoto", photos);
  return (
    <Grid.Column width={12}>
      <Segment attached>
        <Header icon="image" content="Photos" />

        <Image.Group size="small">
          {photos &&
            photos.map(p => (
              <LazyLoad
                key={p.id}
                height={150}
                offset={-150}
                placeholder={<Image src="/assets/user.png"></Image>}
              >
                <Image src={p.url} />
              </LazyLoad>
            ))}
        </Image.Group>
      </Segment>
    </Grid.Column>
  );
};
export default UserDetailedPhotos;
