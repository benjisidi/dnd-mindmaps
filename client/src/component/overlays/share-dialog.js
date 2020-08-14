import { Button, Classes, Dialog, TagInput, Text } from "@blueprintjs/core";
import React, { useState, useEffect } from "react";


const ShareDialog = (props) => {
  const [values, setValues] = useState(props?.selectedMap?.users || [])
  const [oldValues, setOldValues] = useState([])

  useEffect(() => {
    setValues(props.selectedMap?.users || [])
  }, [props.selectedMap])

  const handleClear = () => {
    if (values.length === 0) {
      setValues(oldValues)
      setOldValues([])
    } else {
      setOldValues(values)
      setValues([])
    }
  }

  const handleChange = (vals) => setValues(vals)

  const handleSubmit = () => {
    console.log(values)
    props.handleShare(values, props.selectedMap)
    props.onClose()
  }

  const clearButton = (
    <Button
      icon={values.length > 1 ? "cross" : "refresh"}
      minimal={true}
      onClick={handleClear}
    />
  );
  return (
    <Dialog
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={`Share ${props?.selectedMap?.name}`}
      canOutsideClickClose={false}
    >
      <div className={Classes.DIALOG_BODY}>
        <Text>
          Enter the usernames of the users you wish to share this map with
          </Text>

        <TagInput
          name="users"
          leftIcon="user"
          onChange={handleChange}
          placeholder="Separate values with commas, enter to submit"
          rightElement={clearButton}
          tagProps={{ minimal: true }}
          values={values}
        />

      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={() => props.onClose()}>Close</Button>
          <Button intent="primary" onClick={handleSubmit}>
            Confirm
          </Button>
        </div>
      </div>
    </Dialog>
  )
};
export { ShareDialog };
