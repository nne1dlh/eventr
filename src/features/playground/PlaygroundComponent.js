import React, { Component } from "react";
import { connect } from "react-redux";
import { incrementAsync, decrementAsync } from "./testActions";
import { Button } from "semantic-ui-react";
import TestPlaceInput from "./TestPlaceInput";
import SimpleMap from "./SimpleMap";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { openModal } from "../modals/modalActions";

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
