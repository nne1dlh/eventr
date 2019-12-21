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
import { createEvent, updateEvent } from "../eventActions";
import cuid from "cuid";
import TextInput from "../../../app/common/form/TextInput";
import TextArea from "../../../app/common/form/TextArea";
import SelectInput from "../../../app/common/form/SelectInput";
import DateInput from "../../../app/common/form/DateInput";
import PlaceInput from "../../../app/common/form/PlaceInput";

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

  pissFormSubmit = async values => {
    values.venueLatLng = this.state.venueLatLng;
    //console.log("vals", values);
    try {
      if (this.props.initialValues.id) {
        //existing events have "id" so this is update
        this.props.updateEvent(values);
        this.props.history.push(`/events/${this.props.initialValues.id}`);
      } else {
        console.log("formSubmit", this.state); //new created events dont have "id"
        let createdEvent = await this.props.createEvent(values);
        console.log("New Event", createdEvent);
        {
          createdEvent && this.props.history.push(`/events/${createdEvent.id}`);
        }
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
    const { history, initialValues, invalid, submitting, pristine } = this.props;
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
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  //ownProps is from react-router
  console.log("own", ownProps);
  const eventId = ownProps.match.params.id;

  let event = {};
  if (eventId && state.events.length > 0) {
    event = state.events.filter(e => e.id === eventId)[0]; //will overwrite empty event obj
  }
  return { initialValues: event };
};

const validate = combineValidators({
  title: isRequired({ message: "Title required dinkhead" }),
  category: isRequired({ message: "Category required bitch" }),
  desc: composeValidators(
    isRequired({ message: "Enter a description dinkface" }),
    hasLengthGreaterThan(4)({ message: "desc has to be at least 5 chars" })
  )(),
  city: isRequired("city"),
  venue: isRequired("fuckyou"),
  date: isRequired("date required")
});

const mapDispatchToProps = {
  createEvent,
  updateEvent
};
//higher order components
export default connect(
  mapStateToProps, //passing props to reduxForm
  mapDispatchToProps
)(reduxForm({ form: "eventForm", validate })(EventForm));
