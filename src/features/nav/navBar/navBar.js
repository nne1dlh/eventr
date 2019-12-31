import React, { Component, Fragment } from "react";
import { withFirebase } from "react-redux-firebase";
import { connect } from "react-redux";
import { Menu, Container, Button } from "semantic-ui-react";
import { NavLink, Link, withRouter } from "react-router-dom";
import SignedOutMenu from "../Menus/SignedOutMenu";
import SignedInMenu from "../Menus/SignedInMenu";
import { openModal } from "../../modals/modalActions";

class Navbar extends Component {
  handleSignIn = () => {
    this.props.openModal("LoginModal");
  };

  handleRegister = () => {
    this.props.openModal("RegisterModal");
  };

  handleSignOut = () => {
    this.props.firebase.logout(); //withfirebase logout function
    this.props.history.push("/");
  };
  render() {
    const { auth, profile } = this.props;
    const piss = auth.isLoaded && !auth.isEmpty;
    //console.log("profile from navbar", profile);
    //console.log("auth from navbar", auth);
    return (
      <Menu inverted fixed="top">
        <Container>
          <Menu.Item as={NavLink} exact to="/" header>
            <img src="/assets/logo.png" alt="logo" />
            Re-vents
          </Menu.Item>
          <Menu.Item as={NavLink} exact to="/events" name="EventsP" />
          {piss && (
            <Fragment>
              <Menu.Item as={NavLink} to="/people" name="People" />
              <Menu.Item as={NavLink} to="/playground" name="Test" />
              <Menu.Item>
                <Button
                  as={Link}
                  to="/createEvent"
                  floated="right"
                  positive
                  inverted
                  content="Create Event"
                />
              </Menu.Item>
            </Fragment>
          )}

          {piss ? (
            <SignedInMenu
              auth={auth}
              signOut={this.handleSignOut}
              profilefromNavBar={profile}
            />
          ) : (
            <SignedOutMenu signIn={this.handleSignIn} register={this.handleRegister} />
          )}
        </Container>
      </Menu>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.firebase.auth,
  profile: state.firebase.profile
});

const mapDispatchToProps = {
  openModal
};

export default withRouter(
  withFirebase(connect(mapStateToProps, mapDispatchToProps)(Navbar))
); //(state, actions)
