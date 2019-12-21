import React, { useState } from "react";
import { Segment, Grid, Icon, Button } from "semantic-ui-react";
import EventsDetailedMap from "./EventsDetailedMap";
import { format, parseISO } from "date-fns";

export const EventDetailedInfo = ({ event }) => {
  const [isMapOpen, showMapToggle] = useState(false); //destructire inot array
  //isMapOpen is slice of state defined by call to useState.
  //showMapToggle is function used to change state
  return (
    <Segment.Group>
      <Segment attached="top">
        <Grid>
          <Grid.Column width={1}>
            <Icon size="large" color="teal" name="info" />
          </Grid.Column>
          <Grid.Column width={15}>
            <p>EventDetailedInfo {event.desc}</p>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment attached>
        <Grid verticalAlign="middle">
          <Grid.Column width={1}>
            <Icon name="calendar" size="large" color="teal" />
          </Grid.Column>
          <Grid.Column width={15}>
            {event.eventDate && (
              <span>
                {format(parseISO(event.eventDate), "EEEE do LLL")} at{" "}
                {format(parseISO(event.eventDate), "h:mm a")}
              </span>
            )}
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment attached>
        <Grid verticalAlign="middle">
          <Grid.Column width={1}>
            <Icon name="marker" size="large" color="teal" />
          </Grid.Column>
          <Grid.Column width={11}>
            <span>{event.venue}</span>
          </Grid.Column>
          <Grid.Column width={4}>
            <Button
              onClick={() => showMapToggle(!isMapOpen)}
              color="teal"
              size="tiny"
              content={isMapOpen ? "Hide Map" : "Show Map"}
            />
          </Grid.Column>
        </Grid>
      </Segment>
      {isMapOpen && (
        <EventsDetailedMap lat={event.venueLatLng.lat} lng={event.venueLatLng.lng} />
      )}
    </Segment.Group>
  );
};
