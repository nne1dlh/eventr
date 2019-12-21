import React from "react";
import { connect } from "react-redux";
import { Grid } from "semantic-ui-react";
import EventDetailedHeader from "./EventDetailedHeader";
import { EventDetailedInfo } from "./EventDetailedInfo";
import EventDetailedChat from "./EventDetailedChat";
import EventDetailedSidebar from "./EventDetailedSidebar";

function EventDetailedPage(props) {
  //const event = props.event;
  return (
    <Grid>
      <Grid.Column width={10}>
        <EventDetailedHeader event={props.event} />
        <EventDetailedInfo event={props.event} />
        <EventDetailedChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <EventDetailedSidebar attendees={props.event.attendees} />
      </Grid.Column>
    </Grid>
  );
}
// const EventDetailedPage = ({ event }) => {
//   //const event = props.event;
//   return (
//     <Grid>
//       <Grid.Column width={10}>
//         <EventDetailedHeader event={event} />
//         <EventDetailedInfo event={event} />
//         <EventDetailedChat />
//       </Grid.Column>
//       <Grid.Column width={6}>
//         <EventDetailedSidebar attendees={event.attendees} />
//       </Grid.Column>
//     </Grid>
//   );
// };

const mapStateToProps = (state, ownProps) => {
  //ownProps are not from store
  const eventId = ownProps.match.params.id;
  console.log(eventId);

  let event = {};

  if (eventId && state.events.length > 0) {
    event = state.events.filter(e => e.id === eventId)[0];
  }
  return { event };
};

export default connect(mapStateToProps)(EventDetailedPage);
