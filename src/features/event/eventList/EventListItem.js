import React, { Component } from "react";
import { Segment, Item, Icon, List, Button } from "semantic-ui-react";
import EventListAttendee from "./EventListAttendee";
import { Link } from "react-router-dom";
import { format, getTime } from "date-fns";

class EventListItem extends Component {
  render() {
    const { fromEventList, deleteEvent } = this.props;
    console.log("eventListItemDate", fromEventList.eventDate);

    return (
      <Segment.Group>
        <Segment>
          <Item.Group>
            <Item>
              <Item.Image size="tiny" circular src={fromEventList.hostPhotoURL} />
              <Item.Content>
                <Item.Header>{fromEventList.title}</Item.Header>
                <Item.Description>Hosted by {fromEventList.host}</Item.Description>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
        <Segment>
          <span>
            <Icon name="clock" />
            {/* {fromEventList.eventDate && fromEventList.eventDate.seconds} */}
            {fromEventList.eventDate &&
              format(fromEventList.eventDate.toDate(), "EEEE do LLL")}
            {/* {format(
              fromEventList &&
                fromEventList.eventDate &&
                fromEventList.eventDate.toDate(),
              "EEEE do LLL"
            )}{" "} */}
            {/* at {format(fromEventList.eventDate.toDate(), "h:mm a")} |<p> Time</p> */}
            <Icon name="marker" /> {fromEventList.venue}
          </span>
        </Segment>
        <Segment secondary>
          <List horizontal>
            {fromEventList.attendees &&
              Object.values(fromEventList.attendees).map((a, index) => (
                <EventListAttendee key={index} attendee={a} />
              ))}
          </List>
        </Segment>
        <Segment clearing>
          <span>{fromEventList.desc}</span>
          <Button
            onClick={e => deleteEvent(fromEventList.id)}
            as="a"
            color="red"
            floated="right"
            content="DeleteP"
          />

          <Button
            as={Link}
            to={`/events/${fromEventList.id}`}
            color="teal"
            floated="right"
            content="ViewPiss"
          />
        </Segment>
      </Segment.Group>
    );
  }
}
export default EventListItem;
