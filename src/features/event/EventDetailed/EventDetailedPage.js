import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid } from "semantic-ui-react";
import EventDetailedHeader from "./EventDetailedHeader";
import { withFirestore, firebaseConnect, isEmpty } from "react-redux-firebase";
import { compose } from "redux";
import { EventDetailedInfo } from "./EventDetailedInfo";
import EventDetailedChat from "./EventDetailedChat";
import EventDetailedSidebar from "./EventDetailedSidebar";
import { objectToArray, createDataTree } from "../../../app/common/util/helpers";
import { goingToEvent, cancelGoingToEvent } from "../../user/userActions";
import { addEventComment } from "../eventActions";
import { openModal } from "../../modals/modalActions";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import NotFound from "../../../app/layout/NotFound";

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
    const {
      event,
      auth,
      goingToEvent,
      cancelGoingToEvent,
      addEventComment,
      eventChat,
      loading,
      openModal,
      requesting,
      match
    } = this.props;
    //console.log("event", event);
    const attendees =
      event &&
      event.attendees &&
      objectToArray(event.attendees).sort((a, b) => {
        return a.joinDate.toDate() - b.joinDate.toDate();
      });
    const isHost = event.hostUid === auth.uid;
    const isGoing = attendees && attendees.some(a => a.id === auth.uid); //returs true as soon as it finds match
    const chatTree = !isEmpty(eventChat) && createDataTree(eventChat);
    const authenticated = auth.isLoaded && !auth.isEmpty;
    const loadingEvent = requesting[`events/${match.params.id}`];

    if (loadingEvent) return <LoadingComponent />;

    if (Object.keys(event).length === 0) return <NotFound />;

    return (
      <Grid>
        <Grid.Column width={10}>
          <EventDetailedHeader
            event={event}
            isGoing={isGoing}
            isHost={isHost}
            goingToEvent={goingToEvent}
            cancelGoingToEvent={cancelGoingToEvent}
            loading={loading}
            authenticated={authenticated}
            openModal={openModal}
          />
          <EventDetailedInfo event={event} />
          {authenticated && (
            <EventDetailedChat
              addEventComment={addEventComment}
              eventId={event.id}
              eventChat={chatTree}
            />
          )}
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
  cancelGoingToEvent,
  addEventComment,
  openModal
};

const mapStateToProps = (state, ownProps) => {
  //ownProps are not from store
  const eventId = ownProps.match.params.id;
  // console.log("eventID", eventId);
  //console.log("stateUS", state);

  let event = {};

  if (state.firestore.ordered.events && state.firestore.ordered.events.length > 0) {
    event = state.firestore.ordered.events.filter(e => e.id === eventId)[0] || {};
  }
  return {
    event,
    requesting: state.firestore.status.requesting,
    loading: state.asyncP.loading,
    auth: state.firebase.auth,
    eventChat:
      !isEmpty(state.firebase.data.event_chat) &&
      objectToArray(state.firebase.data.event_chat[ownProps.match.params.id])
  };
};

export default compose(
  withFirestore,
  connect(mapStateToProps, mapDispatchToProps),
  firebaseConnect(props => [`event_chat/${props.match.params.id}`])
)(EventDetailedPage);

// export default withFirestore(
//   connect(mapStateToProps, mapDispatchToProps)(EventDetailedPage)
// );
