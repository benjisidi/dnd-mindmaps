import { ButtonGroup, Button, MenuItem, Divider } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import cx from "classnames";
import React from "react";
import { useGlobal } from "reactn"
export function ToolbarItemProfile(props) {
  const [user] = useGlobal("user")
  return !user ?
    <ButtonGroup>
      <Button minimal icon="log-in" onClick={props.handleLoginClick}>Log in</Button>
      <Divider />
      <Button minimal icon="new-person" onClick={props.handleCreateUserClick}>Create an account</Button>
    </ButtonGroup> :
    <span>Logged in.</span>
}