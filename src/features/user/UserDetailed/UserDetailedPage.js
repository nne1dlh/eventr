import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Grid } from "semantic-ui-react";
import { firestoreConnect, isEmpty } from "react-redux-firebase";
import UserDetailedDescription from "./UserDetailedDescription";
import UserDetailedEvents from "./UserDetailedEvents";
import UserDetailedHeader from "./UserDetailedHeader";
import UserDetailedPhotos from "./UserDetailedPhotos";
import UserDetailedSidebar from "./UserDetailedSidebar";
import { userDetailedQuery } from "../../user/userQueries";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { getUserEvents, followUser, unfollowUser } from "../userActions";

class UserDetailedPage extends Component {
  async componentDidMount() {
    let events = await this.props.getUserEvents(this.props.userUid);
    //console.log("events", events);
  }

  changeTab = (e, data) => {
    //console.log("ChangeTabby", data);
    this.props.getUserEvents(this.props.userUid, data.activeIndex);
  };

  render() {
    const {
      profile,
      photos,
      auth,
      match,
      requesting,
      events,
      eventsLoading,
      followUser,
      unfollowUser,
      following
    } = this.props;
    const isCurrentUser = auth.uid === match.params.id;
    const isFollowing = !isEmpty(following);

    //console.log("currentuser", auth.id);
    //console.log("currentuser", isCurrentUser);
    //console.log("photosUDP", photos);
    const loading = Object.values(requesting).some(a => a === true);
    if (loading) return <LoadingComponent />;

    return (
      <Grid>
        <UserDetailedHeader profile={profile} />
        <UserDetailedDescription profile={profile} />
        <UserDetailedSidebar
          profile={profile}
          isCurrentUser={isCurrentUser}
          followUser={followUser}
          isFollowing={isFollowing}
          unfollowUser={unfollowUser}
        />
        {/* not getting photos, not displaying conditional */}
        {photos && photos.length > 0 && <UserDetailedPhotos photos={photos} />}
        {/* <UserDetailedPhotos photos={photos} /> */}
        <UserDetailedEvents
          events={events}
          eventsLoading={eventsLoading}
          changeTab={this.changeTab}
        />
      </Grid>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let userUid = null;
  let profile = {};
  //console.log("ownProps", ownProps);
  //console.log("atate", state);

  if (ownProps.match.params.id === state.firebase.auth.uid) {
    //console.log("true dat");
    profile = state.firebase.profile;
    userUid = state.firebase.auth.uid;
  } else {
    profile =
      !isEmpty(state.firestore.ordered.profile) && state.firestore.ordered.profile[0];
    userUid = ownProps.match.params.id;
  }

  return {
    profile,
    userUid,
    events: state.events.userEvents,
    eventsLoading: state.asyncP.loading,
    auth: state.firebase.auth,
    photos: state.firestore.ordered.photos, //firestore
    requesting: state.firestore.status.requesting,
    following: state.firestore.ordered.following
  };
};

const mapDispatchToProps = {
  getUserEvents: getUserEvents,
  followUser: followUser,
  unfollowUser: unfollowUser
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect((auth, userUid, match) => userDetailedQuery(auth, userUid, match))
)(UserDetailedPage);
