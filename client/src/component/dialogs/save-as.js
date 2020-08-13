import { Classes, Dialog, ControlGroup, Button } from "@blueprintjs/core";
import React from "react"
const SaveAsDialog = (props) => {
  return (
    <Dialog
      isOpen={props.isOpen}
      onClose={props.onClose}
      title="Save Map"
      canOutsideClickClose={false}
    >
      <form onSubmit={props.onSubmit}>
        <div className={Classes.DIALOG_BODY}>
          {props.errors.mapName && <span>{props.errors.mapName.type === "unique" ? "That name is taken." : "Please enter a name."}</span>}
          <input
            className={`${Classes.INPUT} ${Classes.LARGE}  ${
              props.errors.user && Classes.INTENT_DANGER
              } ${Classes.FILL}`}
            name="mapName"
            placeholder="Enter map name"
            ref={props.register({ required: true, validate: { unique: (name) => !props.existing.includes(name) } })}
          />
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={() => props.onClose()}>Close</Button>
            <Button intent="primary" type="submit">
              Save
          </Button>
          </div>
        </div>
      </form>
    </Dialog>
  )
};
export { SaveAsDialog };
