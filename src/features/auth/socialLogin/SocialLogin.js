import React from "react";
import { Button, Icon } from "semantic-ui-react";

const SocialLogin = ({ socLogin }) => {
  return (
    <div>
      <Button
        onClick={() => socLogin("facebook")}
        type="button"
        style={{ marginBottom: "10px" }}
        fluid
        color="facebook"
      >
        <Icon name="facebook" /> Login with Facebook
      </Button>

      <Button onClick={() => socLogin("google")} type="button" fluid color="google plus">
        <Icon name="google plus" />
        Login with Google
      </Button>
    </div>
  );
};

export default SocialLogin;
