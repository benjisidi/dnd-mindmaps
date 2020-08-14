import { Button, MenuItem } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import cx from "classnames";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useGlobal } from "reactn";
import { NameDialog } from "../overlays/rename-dialog";

export function ToolbarItemCloudSave(props) {
  const { register, handleSubmit, errors } = useForm();
  const [curMap] = useGlobal("curMap")
  const [saveAsDialog, setSaveAsDialog] = useState(false)
  const closeSaveDialog = () => setSaveAsDialog(false)

  return (
    <div className={cx("bm-toolbar-item")}>
      <Select itemRenderer={itemRenderer} items={[{ name: "Save", disabled: !curMap, onClick: () => props.handleSave(curMap) }, { name: "Save As", disabled: false, onClick: () => setSaveAsDialog(true) }]} filterable={false} >
        <Button icon="cloud-upload" minimal large />
      </Select>
      <NameDialog
        title="Save Map"
        isOpen={saveAsDialog}
        onClose={closeSaveDialog}
        onSubmit={handleSubmit((formData) => {
          props.handleCreate(formData.mapName)
          closeSaveDialog()
        })}
        inputName="mapName"
        register={register}
        errors={errors}
        existing={props.existingMaps.status === "success" ? props.existingMaps.data.data.map(x => x.name) : []}
      />
    </div>
  );
}

const itemRenderer = (opt) => {
  return <MenuItem key={opt.name} onClick={opt.onClick} text={opt.name} disabled={opt.disabled} />
}