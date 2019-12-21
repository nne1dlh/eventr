import React from "react";
import { Menu, Button } from "semantic-ui-react";

function SignedOutMenu(props) {
  return (
    <Menu.Item position="right">
      <Button onClick={props.signIn} basic inverted content="Login" />
      <Button
        onClick={props.register}
        basic
        inverted
        content="RegisterP"
        style={{ marginLeft: "0.5em" }}
      />
    </Menu.Item>
  );
}
export default SignedOutMenu;
