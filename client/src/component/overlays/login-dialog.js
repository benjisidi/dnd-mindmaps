import { Button, Classes, Dialog } from "@blueprintjs/core";
import React from "react";
const LoginDialog = (props) => {
  return (
    <Dialog
      isOpen={props.isOpen}
      onClose={props.onClose}
      title="Log in"
      canOutsideClickClose={false}
    >
      <form onSubmit={props.onSubmit}>
        <div className={Classes.DIALOG_BODY}>
          {props.errors.user && <span>{"Please enter your username"}</span>}
          <input
            className={`${Classes.INPUT} ${Classes.LARGE}  ${
              props.errors.user && Classes.INTENT_DANGER
              } ${Classes.FILL}`}
            name="user"
            placeholder="username"
            ref={props.register({ required: true })}
          />
          <input
            className={`${Classes.INPUT} ${Classes.LARGE}  ${
              props.errors.password && Classes.INTENT_DANGER
              } ${Classes.FILL}`}
            name="password"
            placeholder="password"
            type="password"
            ref={props.register({ required: true })}
          />
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={() => props.onClose()}>Close</Button>
            <Button intent="primary" type="submit">
              Log In
          </Button>
          </div>
        </div>
      </form>
    </Dialog>
  )
};
export { LoginDialog };
