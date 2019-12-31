import React, { Component, Fragment } from "react";
import EventListItem from "./EventListItem";
import InfiniteScroll from "react-infinite-scroller";

class EventList extends Component {
  render() {
    const { events, getNextEvent, loading, moreEvents } = this.props;

    return (
      <Fragment>
        {events && events.length !== 0 && (
          <InfiniteScroll
            pageStart={0}
            loadMore={getNextEvent}
            hasMore={!loading && moreEvents}
            initialLoad={false}
          >
            {events && events.map(e => <EventListItem key={e.id} fromEventList={e} />)}
          </InfiniteScroll>
        )}
      </Fragment>
    );
  }
}
export default EventList;
