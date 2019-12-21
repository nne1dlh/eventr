import React from "react";
import PlacesAutoComplete from "react-places-autocomplete";
import { Form, Segment, List, Label } from "semantic-ui-react";

const PlaceInput = props => {
  const { options, placeholder, meta, input } = props;
  const { value, onChange, onBlur } = input;

  return (
    <div>
      <PlacesAutoComplete
        value={value}
        onChange={onChange}
        searchOptions={options}
        onSelect={props.ourOwnOnSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          //props passed down from PlacesAutoComplete
          <Form.Field error={meta.touched && !!meta.error}>
            <input
              placeholder={placeholder}
              {...getInputProps({ placeholder, onBlur })}
            />
            {meta.touched && meta.error && (
              <Label basic color="red">
                {meta.error}
              </Label>
            )}
            {suggestions.length > 0 && (
              <Segment
                style={{ marginTop: 0, position: "absolute", zIndex: 100, width: "100%" }}
              >
                {loading && <div>Loading...</div>}
                <List selection>
                  {suggestions.map(s => (
                    <List.Item {...getSuggestionItemProps(s)}>
                      <List.Header>{s.formattedSuggestion.mainText}</List.Header>
                      <List.Description>
                        {s.formattedSuggestion.secondaryText}
                      </List.Description>
                    </List.Item>
                  ))}
                </List>
              </Segment>
            )}
          </Form.Field>
        )}
      </PlacesAutoComplete>
    </div>
  );
};

export default PlaceInput;
