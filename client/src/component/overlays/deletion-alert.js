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


    // <Dialog
    //   isOpen={props.isOpen}
    //   onClose={props.onClose}
    //   title={props.title}
    //   canOutsideClickClose={false}
    // >
    //   <div className={Classes.DIALOG_BODY}>

    //   </div>
    //   <div className={Classes.DIALOG_FOOTER}>
    //     <div className={Classes.DIALOG_FOOTER_ACTIONS}>
    //       <Button onClick={() => props.onClose()}>Close</Button>
    //       <Button intent="danger" onClick={props.onConfirm}>
    //         Confirm
    //       </Button>
    //     </div>
    //   </div>
    // </Dialog>
  )
};
export { DeletionAlert };
