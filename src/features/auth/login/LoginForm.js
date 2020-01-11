import React from "react";
import { Form, Segment, Button, Label, Divider } from "semantic-ui-react";
import { Field, reduxForm } from "redux-form";
import TextInput from "../../../app/common/form/TextInput";
import { login, socialLogin } from "../authActions";
import { connect } from "react-redux";
import SocialLogin from "../socialLogin/SocialLogin";

const LoginForm = props => {
  const { login, socialLogin, handleSubmit, error, submitting } = props; //handleSubmit comes from redux forms
  return (
    <Form size="large" onSubmit={handleSubmit(login)} autoComplete="on">
      <Segment>
        <Field
          name="email"
          component={TextInput}
          type="text"
          placeholder="Email Address"
        />
        <Field
          name="passwd"
          component={TextInput}
          type="password"
          placeholder="password"
        />
        {error && (
          <Label basic color="red">
            {error}
          </Label>
        )}
        <Button loading={submitting} fluid size="large" color="teal">
          Login
        </Button>
        <Divider horizontal>Or</Divider>
        <SocialLogin socLogin={socialLogin}></SocialLogin>
      </Segment>
    </Form>
  );
};

const mapDispatchToProps = {
  login,
  socialLogin
};

export default connect(
  null,
  mapDispatchToProps
)(reduxForm({ form: "loginForm" })(LoginForm));
