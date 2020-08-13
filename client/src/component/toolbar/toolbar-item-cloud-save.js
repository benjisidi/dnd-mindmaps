import cx from "classnames";
import { iconClassName } from "@blink-mind/renderer-react";
import { Menu, MenuDivider, MenuItem, Popover, Icon, Button, Dialog } from "@blueprintjs/core";
import React, { useState } from "react";
import { Select } from "@blueprintjs/select"
import { updateMap, createNewMap, getAllMaps } from "../../api"
import { useGlobal } from "reactn"
import { useMutation, useQuery, queryCache } from "react-query"
import { SaveAsDialog } from "../save-as/save-as"
import { useForm } from "react-hook-form"

export function ToolbarItemCloudSave(props) {
  const { register, handleSubmit, watch, errors } = useForm();
  const [updateMapMutation, { updateStatus, updateData, updateError }] = useMutation(updateMap, { onSuccess: () => queryCache.invalidateQueries("mindmaps") })
  const [createMapMutation, { createStatus, createData, createError }] = useMutation(createNewMap, { onSuccess: () => queryCache.invalidateQueries("mindmaps") })
  const [curMap, setCurmap] = useGlobal("curMap")
  const [saveAsDialog, setSaveAsDialog] = useState(false)
  const closeSaveDialog = () => setSaveAsDialog(false)
  console.log(curMap)
  const getMapAsJSON = e => {
    const { diagram } = props;
    const diagramProps = diagram.getDiagramProps();
    const { controller, model } = diagramProps;
    const json = controller.run("serializeModel", diagramProps);
    const jsonStr = JSON.stringify(json)
    console.log(jsonStr)
    return jsonStr
    // const url = `data:text/plain,${encodeURIComponent(jsonStr)}`;
    // const title = controller.run("getTopicTitle", {
    //   ...diagramProps,
    //   topicKey: model.rootTopicKey
    // });
    // downloadFile(url, `${title}.blinkmind`);
  };

  // POST to update curMap's mapData JSON.
  const save = () => {
    const mapData = getMapAsJSON()
    updateMapMutation({ id: curMap, update: { mapData: mapData } })
  }
  const saveAs = (name) => {
    const mapData = getMapAsJSON()
    createMapMutation({ name, mapData, owner: "benji" }).then(resp => {
      setCurmap(resp.data._id)
    })

  }

  return (
    <div className={cx("bm-toolbar-item")}>
      <Select itemRenderer={itemRenderer} items={[{ name: "Save", disabled: !curMap, onClick: save }, { name: "Save As", disabled: false, onClick: () => setSaveAsDialog(true) }]} filterable={false} >
        <Button icon="cloud-upload" minimal large />
      </Select>
      <SaveAsDialog
        isOpen={saveAsDialog}
        onClose={closeSaveDialog}
        onSubmit={handleSubmit((formData) => {
          console.log("Submitted.")
          console.log(formData)
          saveAs(formData.mapName)
          closeSaveDialog()
        })}
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