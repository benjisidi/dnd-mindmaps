import { Button, Classes, Dialog } from "@blueprintjs/core";
import { useForm } from "react-hook-form"
import React from "react";
const SignUpDialog = (props) => {
  const { register, handleSubmit, errors, setError } = useForm({ reValidateMode: "onSubmit", });

  const submitSignUp = handleSubmit(async formData => {
    if (formData.password !== formData.confirmPassword) {
      setError("password", { type: "no_match", message: "Passwords do not match" })
      return
    }
    const result = await props.handleCreateUser(formData)
    if (result.success) {
      props.onClose()
      return
    } else {
      if (result.error === "USERNAME_EXISTS") {
        setError("username", { type: "not_found", message: "Username already exists" })
        return
      }
    }
  })
  return (
    <Dialog
      isOpen={props.isOpen}
      onClose={props.onClose}
      title="Sign up"
      canOutsideClickClose={false}
    >
      <form onSubmit={submitSignUp}>
        <div className={Classes.DIALOG_BODY}>
          {errors.username && <span>{errors.username.message}</span>}
          <input
            className={`${Classes.INPUT} ${Classes.LARGE}  ${
              errors.username && Classes.INTENT_DANGER
              } ${Classes.FILL}`}
            name="username"
            placeholder="Username"
            ref={register({ required: "Please enter a username" })}
          />
          {errors.password && <span>{errors.password.message}</span>}
          <input
            className={`${Classes.INPUT} ${Classes.LARGE}  ${
              errors.password && Classes.INTENT_DANGER
              } ${Classes.FILL}`}
            name="password"
            placeholder="Password"
            type="password"
            ref={register({ required: "Please enter a password" })}
          />
          {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
          <input
            className={`${Classes.INPUT} ${Classes.LARGE}  ${
              errors.password && Classes.INTENT_DANGER
              } ${Classes.FILL}`}
            name="confirmPassword"
            placeholder="Confirm Password"
            type="password"
            ref={register({ required: "Please confirm your password" })}
          />
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={() => props.onClose()}>Close</Button>
            <Button intent="primary" type="submit">
              Sign up
          </Button>
          </div>
        </div>
      </form>
    </Dialog>
  )
};
export { SignUpDialog };
