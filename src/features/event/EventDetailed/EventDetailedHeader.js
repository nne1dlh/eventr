import React, { Fragment } from "react";
import { Segment, Image, Item, Header, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const eventImageStyle = {
  filter: "brightness(30%)"
};

const eventImageTextStyle = {
  position: "absolute",
  bottom: "5%",
  left: "5%",
  width: "100%",
  height: "auto",
  color: "white"
};

export const EventDetailedHeader = ({
  event,
  isHost,
  isGoing,
  goingToEvent,
  cancelGoingToEvent,
  loading,
  authenticated,
  openModal
}) => {
  return (
    <Segment.Group>
      <Segment basic attached="top" style={{ padding: "0" }}>
        <Image
          src={`/assets/categoryImages/${event.category}.jpg`}
          fluid
          style={eventImageStyle}
        />

        <Segment basic style={eventImageTextStyle}>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header size="huge" content={event.title} style={{ color: "white" }} />
                <p>
                  {" "}
                  EventDetHeader
                  {event.eventDate && format(event.eventDate.toDate(), "EEEE do LLLL")}
                </p>
                <p>
                  Hosted by{" "}
                  <strong>
                    <Link to={`/profile/${event.hostUid}`} style={{ color: "white" }}>
                      {event.hostedBy}
                    </Link>
                  </strong>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>

      <Segment attached="bottom" clearing>
        {!isHost && (
          <div>
            {isGoing && (
              <Button onClick={() => cancelGoingToEvent(event)}>Cancel My Place</Button>
            )}

            {!isGoing && authenticated && (
              <Button color="teal" loading={loading} onClick={() => goingToEvent(event)}>
                JOIN THIS EVENT
              </Button>
            )}

            {!authenticated && (
              <Button
                color="teal"
                loading={loading}
                onClick={() => openModal("UnauthModal")}
              >
                JOIN THIS EVENT
              </Button>
            )}
          </div>
        )}

        {isHost && (
          <Button as={Link} to={`/manage/${event.id}`} color="orange" floated="right">
            Manage Event
          </Button>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default EventDetailedHeader;
