import React, { Component } from "react";
import { connect } from "react-redux";
import { incrementAsync, decrementAsync } from "./testActions";
import { Button, Header } from "semantic-ui-react";
import TestPlaceInput from "./TestPlaceInput";
import SimpleMap from "./SimpleMap";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { openModal } from "../modals/modalActions";
import { toastr } from "react-redux-toastr";
import firebase from "../../app/config/firebase";

class Playground extends Component {
  state = {
    latlng: {
      lat: 59.95,
      lng: 30.33
    }
  };

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(res => {
        this.setState({
          latlng: res
        });
      })
      .catch(error => console.error("Error", error));
  };

  handleTestUpdateProfile = async () => {
    const firestore = firebase.firestore();
    // doc = malky userUid
    let userDocRef = await firestore
      .collection("users")
      .doc("qNmFO4pqrQg9aCltpGkuIberAEv1");
    try {
      await userDocRef.update({ displayName: "Malky The Moose" });
      toastr.success("Success");
    } catch (error) {
      console.log(error);
      toastr.error("Computer says no");
    }
  };

  handleCreateTestEvent = async () => {
    const firestore = firebase.firestore();
    let eventDocRef = await firestore.collection("events").doc("DELETEME");
    try {
      await eventDocRef.set({
        title: "DELETEME"
      });
      toastr.success("Success");
    } catch (error) {
      console.log(error);
      toastr.error("Computer says no");
    }
  };

  handleTestJoinEvent = async () => {
    const firestore = firebase.firestore();
    let eventDocRef = await firestore.collection("events").doc("DELETEME");
    const attendee = {
      photoURL: "/assets/user.png",
      displayName: "Testing"
    };
    try {
      await eventDocRef.update({
        [`attendees.qNmFO4pqrQg9aCltpGkuIberAEv1`]: attendee
      });
      toastr.success("Success");
    } catch (error) {
      console.log(error);
      toastr.error("Computer says no");
    }
  };

  handleTestCancelGoingToEvent = async () => {
    const firestore = firebase.firestore();
    let eventDocRef = await firestore.collection("events").doc("DELETEME");
    try {
      await eventDocRef.update({
        [`attendees.qNmFO4pqrQg9aCltpGkuIberAEv1`]: firebase.firestore.FieldValue.delete()
      });
      toastr.success("Success");
    } catch (error) {
      console.log(error);
      toastr.error("Computer says no");
    }
  };

  handleTestChangeAttendeePhotoInEvent = async () => {
    const firestore = firebase.firestore();
    let eventDocRef = await firestore.collection("events").doc("DELETEME");
    try {
      await eventDocRef.update({
        [`attendees.qNmFO4pqrQg9aCltpGkuIberAEv1.photoURL`]: "testing123.jpg"
      });
      toastr.success("Success");
    } catch (error) {
      console.log(error);
      toastr.error("Computer says no");
    }
  };

  render() {
    const { incrementAsync, decrementAsync, loading, buttonName } = this.props;

    return (
      <div className="Playground">
        <h1>Plaground Component</h1>
        <h3>The answer is: {this.props.data}</h3>
        {/* in order to pass paramters we need arrow function in onClick handler  */}
        <Button
          name="plus"
          loading={buttonName === "plus" && loading}
          onClick={e => incrementAsync(e.target.name)}
          positive
          content="Increment"
        />

        <Button
          name="minus"
          loading={buttonName === "minus" && loading}
          onClick={e => decrementAsync(e.target.name)}
          negative
          content="Decrement"
        />
        <Button
          onClick={() => this.props.openModal("TestModal", { data: 42 })} //because we are passing name of modal as parameter
          //we need to make this an arrow fucnction
          color="teal"
          content="Open Modal"
        />

        <br />
        <Header as="h2" content="Permissions tests" />
        <Button
          onClick={this.handleCreateTestEvent}
          color="blue"
          fluid
          content="Test create event - should fail if anon"
        />
        <Button
          onClick={this.handleTestUpdateProfile}
          color="orange"
          fluid
          content="Test update dianas profile - should fail if anon/not diana - should succeed if diana"
        />
        <Button
          onClick={this.handleTestJoinEvent}
          color="olive"
          fluid
          content="Test joining an event - should fail if anon/not diana - should succeed if diana"
        />
        <Button
          onClick={this.handleTestCancelGoingToEvent}
          color="purple"
          fluid
          content="Test cancelling attendance to an event - should fail if anon/not diana - should succeed if diana"
        />
        <Button
          onClick={this.handleTestChangeAttendeePhotoInEvent}
          color="violet"
          fluid
          content="Test changing photo for event attendee - should fail if anon/not diana - should succeed if diana"
        />
        <br />
        <br />

        <br />
        <br />
        <TestPlaceInput selectAddress={this.handleSelect} />
        <SimpleMap key={this.state.latlng.lat} latitlong={this.state.latlng} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.dataFrRoot.dataP,
  loading: state.asyncP.loading, //comes from rootReducer !!!!
  buttonName: state.asyncP.elName
});

const mapDispatchToProps = {
  //actions
  incrementAsync,
  decrementAsync,
  openModal
};
export default connect(mapStateToProps, mapDispatchToProps)(Playground); //this passes state to our compo
