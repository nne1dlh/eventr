import React from "react";
import { Grid, Header, Item, Segment, List, Icon } from "semantic-ui-react";
import format from "date-fns/format";

export const UserDetailedDescription = ({ profile }) => {
  let createdAt;
  if (profile.createdAt) {
    createdAt = format(profile.createdAt.toDate(), "D MMM YYYY", {
      awareOfUnicodeTokens: true
    });
  }
  return (
    <Grid.Column width={12}>
      <Segment>
        <Grid columns={2}>
          <Grid.Column width={10}>
            <Header icon="smile" content="About Display Name" />
            <p>
              I am a: <strong>{profile.occupation || "unemployed"}</strong>
            </p>
            <p>
              Originally from <strong>{profile.origin}</strong>
            </p>
            <p>
              Member Since: <strong>{createdAt}</strong>
            </p>
            <p>{profile.description}</p>
          </Grid.Column>
          <Grid.Column width={6}>
            <Header icon="heart outline" content="Interests" />
            {profile.interests ? (
              <List>
                {profile.interests &&
                  profile.interests.map((i, index) => (
                    <Item key={index}>
                      <Icon name="heart" />
                      <Item.Content>{i}</Item.Content>
                    </Item>
                  ))}{" "}
              </List>
            ) : (
              <p>No Interest</p>
            )}
          </Grid.Column>
        </Grid>
      </Segment>
    </Grid.Column>
  );
};

export default UserDetailedDescription;
