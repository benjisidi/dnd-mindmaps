import { Button, Classes, Dialog } from "@blueprintjs/core";
import { useForm } from "react-hook-form"
import React from "react";


const LoginDialog = (props) => {
  const { register, handleSubmit, errors, setError } = useForm({ reValidateMode: "onSubmit", });

  const submitLogin = handleSubmit(async formData => {
    const result = await props.handleAuthenticate(formData)
    if (result.success) {
      props.onClose()
      return
    } else {
      if (result.error === "INVALID_USERNAME") {
        setError("username", { type: "not_found", message: "Username not found" })
        return
      } else if (result.error === "INVALID_PASSWORD") {
        setError("password", { type: "invalid", message: "Password is incorrect" })
        return
      }
    }
  })

  return (
    <Dialog
      isOpen={props.isOpen}
      onClose={props.onClose}
      title="Log in"
      canOutsideClickClose={false}
    >
      <form onSubmit={submitLogin}>
        <div className={Classes.DIALOG_BODY}>
          {errors.username && <span>{errors.username.message}</span>}
          <input
            className={`${Classes.INPUT} ${Classes.LARGE}  ${
              errors.username && Classes.INTENT_DANGER
              } ${Classes.FILL}`}
            name="username"
            placeholder="Username"
            ref={register({ required: "Please enter your username" })}
          />
          {errors.password && <span>{errors.password.message}</span>}
          <input
            className={`${Classes.INPUT} ${Classes.LARGE}  ${
              errors.password && Classes.INTENT_DANGER
              } ${Classes.FILL}`}
            name="password"
            placeholder="Password"
            type="password"
            ref={register({ required: "Please enter your password" })}
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
