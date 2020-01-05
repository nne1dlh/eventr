import React from "react";
import { Header, Segment, Feed, Sticky } from "semantic-ui-react";
import EventActivityItem from "./EventActivityItem";

const EventActivity = ({ activities, contextRef }) => {
  return (
    <Sticky context={contextRef} offset={100} styleElement={{ zIndex: 0 }}>
      <Header attached="top" content="Recent activity" />
      <Segment attached>
        <Feed>
          {activities &&
            activities.map(a => <EventActivityItem key={a.id} activity={a} />)}
        </Feed>
      </Segment>
    </Sticky>
  );
};

export default EventActivity;
