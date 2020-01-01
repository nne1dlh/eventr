import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid } from "semantic-ui-react";
import EventDetailedHeader from "./EventDetailedHeader";
import { withFirestore, firebaseConnect } from "react-redux-firebase";
//import { compose } from "redux";
import { EventDetailedInfo } from "./EventDetailedInfo";
import EventDetailedChat from "./EventDetailedChat";
import EventDetailedSidebar from "./EventDetailedSidebar";
import { objectToArray } from "../../../app/common/util/helpers";
import { goingToEvent, cancelGoingToEvent } from "../../user/userActions";
import { addEventComment } from "../eventActions";

class EventDetailedPage extends Component {
  async componentDidMount() {
    const { firestore, match } = this.props;
    await firestore.setListener(`events/${match.params.id}`);
  }

  async componentWillUnmount() {
    const { firestore, match } = this.props;
    await firestore.unsetListener(`events/${match.params.id}`);
  }

  render() {
    const { event, auth, goingToEvent, cancelGoingToEvent, addEventComment } = this.props;
    console.log("event", event);
    const attendees = event && event.attendees && objectToArray(event.attendees);
    const isHost = event.hostUid === auth.uid;
    const isGoing = attendees && attendees.some(a => a.id === auth.uid); //returs true as soon as it finds match
    return (
      <Grid>
        <Grid.Column width={10}>
          <EventDetailedHeader
            event={event}
            isGoing={isGoing}
            isHost={isHost}
            goingToEvent={goingToEvent}
            cancelGoingToEvent={cancelGoingToEvent}
          />
          <EventDetailedInfo event={event} />
          <EventDetailedChat addEventComment={addEventComment} eventId={event.id} />
        </Grid.Column>
        <Grid.Column width={6}>
          <EventDetailedSidebar attendees={attendees} />
        </Grid.Column>
      </Grid>
    );
  }
}

const mapDispatchToProps = {
  goingToEvent,
  cancelGoingToEvent
};

const mapStateToProps = (state, ownProps) => {
  //ownProps are not from store
  const eventId = ownProps.match.params.id;
  // console.log("eventID", eventId);
  console.log("stateUS", state);

  let event = {};

  if (state.firestore.ordered.events && state.firestore.ordered.events.length > 0) {
    event = state.firestore.ordered.events.filter(e => e.id === eventId)[0] || {};
  }
  return { event, auth: state.firebase.auth };
};

// export default compose(
//   withFirestore,
//   (connect(mapStateToProps, mapDispatchToProps),
//   firebaseConnect(props => [`event_chat/${props.match.params.id}`]))
// )(EventDetailedPage);

export default withFirestore(
  connect(mapStateToProps, mapDispatchToProps)(EventDetailedPage)
);
