/*global google*/
import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import {
  composeValidators,
  combineValidators,
  isRequired,
  hasLengthGreaterThan
} from "revalidate";
import { Segment, Form, Button, Grid, Header } from "semantic-ui-react";
import { createEvent, updateEvent, cancelToggle } from "../eventActions";
import TextInput from "../../../app/common/form/TextInput";
import TextArea from "../../../app/common/form/TextArea";
import SelectInput from "../../../app/common/form/SelectInput";
import DateInput from "../../../app/common/form/DateInput";
import PlaceInput from "../../../app/common/form/PlaceInput";
import { withFirestore } from "react-redux-firebase";

const category = [
  { key: "drinks", text: "Drinks", value: "drinks" },
  { key: "culture", text: "Culture", value: "culture" },
  { key: "film", text: "Film", value: "film" },
  { key: "food", text: "Food", value: "food" },
  { key: "music", text: "Music", value: "music" },
  { key: "travel", text: "Travel", value: "travel" }
];

class EventForm extends Component {
  constructor(props) {
    super();
    this.state = { ...props.event, cityLatLng: {}, venueLatLng: {} };
    //this.pissFormSubmit = this.pissFormSubmit.bind(this);
    //this.handleInputChange = this.handleInputChange.bind(this);
  }

  async componentDidMount() {
    const { firestore, match } = this.props;
    await firestore.setListener(`events/${match.params.id}`);
  }

  async componentWillUnmount() {
    const { firestore, match } = this.props;
    await firestore.unsetListener(`events/${match.params.id}`);
  }

  pissFormSubmit = async values => {
    values.venueLatLng = this.state.venueLatLng;
    //console.log("vals", values);
    try {
      if (this.props.initialValues.id) {
        if (Object.keys(values.venueLatLng).length === 0) {
          values.venueLatLng = this.props.event.venueLatLng;
        }
        //existing events have "id" so this is update
        this.props.updateEvent(values);
        this.props.history.push(`/events/${this.props.initialValues.id}`);
      } else {
        console.log("formSubmit", this.state); //new created events dont have "id"
        let createdEvent = await this.props.createEvent(values);
        console.log("New Event", createdEvent);

        createdEvent && this.props.history.push(`/events/${createdEvent.id}`);
      }
    } catch (err) {
      console.log("piss form erro", err);
    }
  };

  handleCitySelect = selectedCity => {
    geocodeByAddress(selectedCity)
      .then(res => getLatLng(res[0]))
      .then(latlng => {
        this.setState({
          cityLatLng: latlng
        });
      })
      .then(() => {
        this.props.change("city", selectedCity);
      });
  };

  handleVenueSelect = selectedVenue => {
    geocodeByAddress(selectedVenue)
      .then(res => getLatLng(res[0]))
      .then(latlng => {
        this.setState({
          venueLatLng: latlng
        });
      })
      .then(() => {
        this.props.change("venue", selectedVenue);
      });
  };

  render() {
    const {
      history,
      initialValues,
      invalid,
      submitting,
      pristine,
      event,
      cancelToggle
    } = this.props;
    return (
      <Grid>
        <Grid.Column width={10}>
          <Segment>
            <Header sub color="teal" content="Event Details" />
            <Form onSubmit={this.props.handleSubmit(this.pissFormSubmit)}>
              <Field name="title" component={TextInput} placeholder="Event Title" />
              <Field
                name="category"
                component={SelectInput}
                placeholder="Category" //passing these as props to SelectInput component
                options={category}
                multiple={null}
              />
              <Field
                name="desc"
                component={TextArea}
                placeholder="description"
                rows={3}
              />
              <Header sub color="teal" content="Event Location Details" />
              <Field
                name="city"
                component={PlaceInput}
                placeholder="Event City"
                options={{ types: ["(cities)"] }}
                ourOwnOnSelect={this.handleCitySelect}
              />
              <Field
                name="venue"
                component={PlaceInput}
                placeholder="Event Venue"
                options={{
                  location: new google.maps.LatLng(this.state.cityLatLng),
                  radius: 1000,
                  types: ["establishment"]
                }}
                ourOwnOnSelect={this.handleVenueSelect}
              />
              <Field
                name="eventDate" //has to be fieldname in state prooly due to destructure+
                component={DateInput}
                placeholder="Event DateP"
                dateFormat="dd LLL yyyy h:mm a"
                showTimeSelect //displays timepicka
                timeFormat="HH:mm"
              />

              <Button disabled={invalid || submitting || pristine} positive type="submit">
                Submit
              </Button>
              <Button
                onClick={
                  initialValues.id
                    ? () => history.push(`/events/${initialValues.id}`)
                    : () => history.push("/events")
                }
                type="button"
              >
                Cancel
              </Button>
              <Button
                type="button"
                color={event.cancelled ? "green" : "red"}
                floated="right"
                content={event.cancelled ? "Reactivate event" : "Cancel Event"}
                onClick={() => cancelToggle(!event.cancelled, event.id)}
              ></Button>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  //ownProps is from react-router
  //console.log("own", ownProps);
  const eventId = ownProps.match.params.id;

  let event = {};
  if (state.firestore.ordered.events && state.firestore.ordered.events.length > 0) {
    event = state.firestore.ordered.events.filter(e => e.id === eventId)[0] || {};
  }
  return { initialValues: event, event };
};

const validate = combineValidators({
  title: isRequired({ message: "Title required head" }),
  category: isRequired({ message: "Category required plesae" }),
  desc: composeValidators(
    isRequired({ message: "Enter a description face" }),
    hasLengthGreaterThan(4)({ message: "desc has to be at least 5 chars" })
  )(),
  city: isRequired("city"),
  venue: isRequired("heyyou"),
  date: isRequired("date required")
});

const mapDispatchToProps = {
  createEvent,
  updateEvent,
  cancelToggle
};
//higher order components
export default withFirestore(
  connect(
    mapStateToProps, //passing props to reduxForm
    mapDispatchToProps
  )(reduxForm({ form: "eventForm", validate, enableReinitialize: true })(EventForm))
);
