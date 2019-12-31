import React from "react";
import { Card, Grid, Header, Image, Menu, Segment, Tab } from "semantic-ui-react";
import { Link } from "react-router-dom";
import format from "date-fns/format";

const panes = [
  { menuItem: "All Events,", pane: { key: "allEvents" } },
  { menuItem: "Past Events,", pane: { key: "pastEvents" } },
  { menuItem: "Future Events,", pane: { key: "futureEvents" } },
  { menuItem: "Hosting,", pane: { key: "hosted" } }
];

const UserDetailedEvents = ({ events, eventsLoading, changeTab }) => {
  return (
    <Grid.Column width={12}>
      <Segment loading={eventsLoading} attached>
        <Header icon="calendar" content="Events" />
        <Tab
          onTabChange={(e, data) => changeTab(e, data)}
          panes={panes}
          menu={{ secondary: true, pointing: true }}
        />
        <br />
        <Card.Group itemsPerRow={5}>
          {events &&
            events.map(e => (
              <Card as={Link} to={`/events/${e.id}`} key={e.id}>
                <Image src={`/assets/categoryImages/${e.category}.jpg`} />
                <Card.Content>
                  <Card.Header textAlign="center">{e.title}</Card.Header>
                  <Card.Meta textAlign="center">
                    <div>
                      {format(e.eventDate && e.eventDate.toDate(), "dd LLL yyyy")}
                    </div>
                    <div>{format(e.eventDate && e.eventDate.toDate(), "h:mm a")}</div>
                  </Card.Meta>
                </Card.Content>
              </Card>
            ))}
        </Card.Group>
      </Segment>
    </Grid.Column>
  );
};

export default UserDetailedEvents;
