import React, { Component } from "react";
import { Segment, Item, Icon, List, Button, Label } from "semantic-ui-react";
import EventListAttendee from "./EventListAttendee";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { objectToArray } from "../../../app/common/util/helpers";

class EventListItem extends Component {
  render() {
    const { fromEventList } = this.props;
    console.log("eventListItemDate", fromEventList.eventDate);
    console.log("pisspropEvent", fromEventList);

    return (
      <Segment.Group>
        <Segment>
          <Item.Group>
            <Item>
              <Item.Image size="tiny" circular src={fromEventList.hostPhotoURL} />
              <Item.Content>
                <Item.Header as={Link} to={`/events/${fromEventList.id}`}>
                  {fromEventList.title}
                </Item.Header>
                <Item.Description>
                  Hosted by{" "}
                  <Link to={`/profile/${fromEventList.hostUid}`}>
                    {fromEventList.hostedBy}
                  </Link>
                </Item.Description>
                {fromEventList.cancelled && (
                  <Label
                    style={{ top: "-40px" }}
                    ribbon="right"
                    color="red"
                    content="This event has been cancelled"
                  />
                )}
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
              objectToArray(fromEventList.attendees).map(a => (
                <EventListAttendee key={a.id} attendee={a} />
              ))}
          </List>
        </Segment>
        <Segment clearing>
          <span>{fromEventList.desc}</span>

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
