import React, { Fragment } from "react";
import { Segment, Item, Label } from "semantic-ui-react";

function EventDetailedSidebar({ attendees }) {
  const isHost = false;
  return (
    <Fragment>
      <Segment
        textAlign="center"
        style={{ border: "none" }}
        attached="top"
        secondary
        inverted
        color="teal"
      >
        {attendees && attendees.length}{" "}
        {attendees && attendees.length === 1 ? "Person" : "People"} Going
      </Segment>
      <Segment attached>
        <Item.Group divided>
          {attendees &&
            attendees.map(a => (
              <Item key={a.id} style={{ position: "relative" }}>
                {isHost && (
                  <Label style={{ position: "absolute" }} color="orange" ribbon="right">
                    Host
                  </Label>
                )}

                <Item.Image size="tiny" src={a.photoURL} />
                <Item.Content verticalAlign="middle">
                  <Item.Header as="h3">{a.name}</Item.Header>
                </Item.Content>
              </Item>
            ))}
        </Item.Group>
      </Segment>
    </Fragment>
  );
}

export default EventDetailedSidebar;
