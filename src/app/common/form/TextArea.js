import React from "react";
import { Form, Label } from "semantic-ui-react";

const TextArea = props => {
  const { input, rows, type, placeholder, meta } = props;
  console.log(input);
  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <textarea {...input} placeholder={placeholder} type={type} rows={rows}></textarea>
      {meta.touched && meta.error && (
        <Label basic color="red">
          {meta.error}
        </Label>
      )}
    </Form.Field>
  );
};
export default TextArea;
