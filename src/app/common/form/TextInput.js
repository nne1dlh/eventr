import React from "react";
import { Form, Label } from "semantic-ui-react";

const TextInput = props => {
  const { input, type, placeholder, meta } = props;
  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <input {...input} placeholder={placeholder} type={type} />
      {meta.touched && meta.error && (
        <Label basic color="red">
          {meta.error}
        </Label>
      )}
    </Form.Field>
  );
};
export default TextInput;
