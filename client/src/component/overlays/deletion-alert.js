import { Button, Classes, Alert, Intent } from "@blueprintjs/core";
import React from "react";
const DeletionAlert = (props) => {
  return (


    <Alert
      cancelButtonText="Cancel"
      confirmButtonText="Delete"
      icon="trash"
      intent={Intent.DANGER}
      isOpen={props.isOpen}
      onCancel={props.handleCancel}
      onConfirm={props.handleConfirm}
    >
      <p>
        Are you sure you want to delete <b>{props.targetName}</b>? This action is irreversible.
      </p>
    </Alert>
  )
};
export { DeletionAlert };
