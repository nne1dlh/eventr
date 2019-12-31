import React, { Component } from "react";
import { Grid, Loader } from "semantic-ui-react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import EventList from "../eventList/EventList";
import { getEventsForDashboard } from "../eventActions";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import EventActivity from "../EventActivity/EventActivity";

class EventDashboard extends Component {
  state = {
    moreEvents: false,
    loadingInit: true,
    loadedEvents: []
  };

  async componentDidMount() {
    let next = await this.props.getEventsForDashboard();
    console.log("next", next);

    if (next && next.docs.length > 1) {
      this.setState({
        moreEvents: true,
        loadingInit: false
      });
    }
  }

  getNextEvent = async () => {
    const { events } = this.props;
    let lastEvent = events && events[events.length - 1];
    console.log("last", lastEvent);
    let next = await this.props.getEventsForDashboard(lastEvent);
    console.log("next", next);
    if (next && next.docs && next.docs.length <= 1) {
      this.setState({
        moreEvents: false
      });
    }
  };

  componentDidUpdate = prevProps => {
    if (this.props.events !== prevProps.events) {
      this.setState({
        loadedEvents: [...this.state.loadedEvents, ...this.props.events]
      });
    }
  };

  render() {
    const { events, loading } = this.props;
    const { moreEvents, loadedEvents } = this.state;
    if (this.state.loadingInit) return <LoadingComponent />;
    return (
      <Grid>
        <Grid.Column width={10}>
          <EventList
            events={loadedEvents}
            loading={loading}
            moreEvents={moreEvents}
            getNextEvent={this.getNextEvent}
          />
          {/* <Button
            loading={loading}
            content="More"
            color="green"
            floated="right"
            onClick={this.getNextEvent}
            disabled={!this.state.moreEvents}
          /> */}
        </Grid.Column>
        <Grid.Column width={6}>
          <EventActivity />
        </Grid.Column>
        <Grid.Column width={10}>
          <Loader active={loading} />
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  events: state.events,
  loading: state.asyncP.loading
  //loading: state.asyncP.loading
});

const mapDispatchToProps = {
  //access to actions avail from props inside evtdashboard
  getEventsForDashboard
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(firestoreConnect([{ collection: "events" }])(EventDashboard));
