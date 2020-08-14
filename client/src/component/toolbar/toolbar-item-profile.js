import { Button, MenuItem } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import cx from "classnames";
import React from "react";
import { useGlobal } from "reactn"
export function ToolbarItemProfile(props) {
  const [user] = useGlobal("user")
  return (
    <>
      {!user && <span><a>Create an account</a> | <a>Log in</a></span>}
    </>)
}