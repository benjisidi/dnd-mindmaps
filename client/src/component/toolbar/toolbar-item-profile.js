import { ButtonGroup, Button, MenuItem, Divider } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import cx from "classnames";
import React from "react";
import { queryCache, useMutation, useQuery } from "react-query"
import { useGlobal } from "reactn"


export function ToolbarItemProfile(props) {
  const [user, setUser] = useGlobal("user")
  const [curMap, setCurMap] = useGlobal("curMap")

  const logOut = () => {
    setUser(null)
    setCurMap(null)
    props.resetMap()
    queryCache.invalidateQueries("mindmaps")
  }
  return !user ?
    <ButtonGroup>
      <Button minimal icon="log-in" onClick={props.handleLoginClick}>Log in</Button>
      <Divider />
      <Button minimal icon="new-person" onClick={props.handleCreateUserClick}>Sign up</Button>
    </ButtonGroup> :
    <>
      <b style={{ paddingRight: "16px" }}>{user.username}</b>
      <Button minimal icon="log-out" onClick={logOut}>Log Out</Button>
    </>
}