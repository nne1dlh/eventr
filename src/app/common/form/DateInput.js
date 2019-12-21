import React from "react";
import { Form, Label } from "semantic-ui-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const DateInput = ({
  input: { value, onChange, onBlur },
  width,
  placeholder,
  meta,
  ...restP
}) => {
  const { touched, error } = meta;
  console.log("restPfromDInout", restP);
  return (
    <Form.Field error={touched && !!error}>
      <DatePicker
        {...restP}
        placeholderText={placeholder}
        selected={
          value
            ? Object.prototype.toString.call(value) !== "[object Date]" //if object is not date
              ? value.toDate() //convert to date
              : value //if object is a date just return value
            : null //if no value return null
        }
        onChange={onChange} //allows redux form to track changes to input
        onBlur={(e, val) => onBlur(val)}
        onChangeRaw={e => e.preventDefault()}
      />
      {touched && error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  );
};

export default DateInput;
