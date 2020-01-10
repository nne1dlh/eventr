import React, { Component, Fragment } from "react";
import { Container } from "semantic-ui-react";
import EventDashboard from "../../features/event/EventDashboard/EventDashboard";
import Navbar from "../../features/nav/navBar/navBar";
import { Route, Switch, withRouter } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import EventDetailedPage from "../../features/event/EventDetailed/EventDetailedPage";
import PeopleDashboard from "../../features/user/PeopleDashboard/PeopleDashboard";
import SettingsDashboard from "../../features/user/Settings/SettingsDashboard";
import UserDetailedPage from "../../features/user/UserDetailed/UserDetailedPage";
import EventForm from "../../features/event/EventForm/eventForm";
import Playground from "../../features/playground/PlaygroundComponent";
import ModalManager from "../../features/modals/ModalManager";
import { UserIsAuthenticated } from "../../features/auth/authWrapper";

class App extends Component {
  render() {
    return (
      <Fragment>
        <ModalManager />
        <Route exact path="/" component={HomePage} />
        <Route
          path="/(.+)"
          render={() => (
            <Fragment>
              <Navbar />
              <Container className="main">
                <Switch key={this.props.location.key}>
                  <Route exact path="/events" component={EventDashboard} />
                  <Route path="/events/:id" component={EventDetailedPage} />
                  <Route
                    path="/people"
                    component={UserIsAuthenticated(PeopleDashboard)}
                  />
                  <Route
                    path="/profile/:id"
                    component={UserIsAuthenticated(UserDetailedPage)}
                  />
                  <Route
                    path="/settings"
                    component={UserIsAuthenticated(SettingsDashboard)}
                  />
                  <Route
                    path={["/createEvent", "/manage/:id"]}
                    component={UserIsAuthenticated(EventForm)}
                  />
                  <Route path="/playground" component={Playground} />
                </Switch>
              </Container>
            </Fragment>
          )}
        />
      </Fragment>
    );
  }
}

export default withRouter(App);
// https://github.com/nne1dlh/revents.git
// AIzaSyC94LBIVLGElrWNXhkFYB6igA9GUEIfvyk GmapsJavaScriptAPI
