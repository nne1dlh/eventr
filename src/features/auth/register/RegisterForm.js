import React from "react";
import { connect } from "react-redux";
import { Form, Segment, Button, Label, Divider } from "semantic-ui-react";
import { Field, reduxForm } from "redux-form";
import { combineValidators, isRequired } from "revalidate";
import TextInput from "../../../app/common/form/TextInput";
import { registerUser } from "../authActions";
import SocialLogin from "../socialLogin/SocialLogin";

const validate = combineValidators({
  displayName: isRequired("displayName"),
  email: isRequired("email"),
  password: isRequired("passwd")
});

const RegisterForm = ({ handleSubmit, registerUser, error, invalid, submitting }) => {
  return (
    <div>
      <Form size="large" onSubmit={handleSubmit(registerUser)} autoComplete="off">
        <Segment>
          <Field
            name="displayName"
            type="text"
            component={TextInput}
            placeholder="Known As"
          />
          <Field name="email" type="text" component={TextInput} placeholder="Email" />
          <Field
            name="passwd"
            type="password"
            component={TextInput}
            placeholder="Password"
          />
          {error && (
            <Label basic color="red">
              {error}
            </Label>
          )}
          <Button
            disabled={invalid || submitting}
            fluid
            size="large"
            color="teal"
            loading={submitting}
          >
            Register
          </Button>
          <Divider horizontal>Or</Divider>
          <SocialLogin></SocialLogin>
        </Segment>
      </Form>
    </div>
  );
};

const mapDispatchToProps = {
  registerUser
};

export default connect(
  null,
  mapDispatchToProps
)(reduxForm({ form: "registerForm", validate })(RegisterForm));
