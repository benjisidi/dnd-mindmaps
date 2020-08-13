import { Button, MenuItem } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import cx from "classnames";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { queryCache, useMutation } from "react-query";
import { useGlobal } from "reactn";
import { createNewMap, updateMap } from "../../api";
import { NameDialog } from "../overlays/rename-dialog";

export function ToolbarItemCloudSave(props) {
  const { register, handleSubmit, watch, errors } = useForm();
  const [updateMapMutation, { updateStatus, updateData, updateError }] = useMutation(updateMap, { onSuccess: () => queryCache.invalidateQueries("mindmaps") })
  const [createMapMutation, { createStatus, createData, createError }] = useMutation(createNewMap, {
    onSuccess: (resp) => {
      queryCache.invalidateQueries("mindmaps")
      setCurmap(resp.data._id)
    }
  })
  const [curMap, setCurmap] = useGlobal("curMap")
  const [saveAsDialog, setSaveAsDialog] = useState(false)
  const closeSaveDialog = () => setSaveAsDialog(false)
  const getMapAsJSON = e => {
    const { diagram } = props;
    const diagramProps = diagram.getDiagramProps();
    const { controller, model } = diagramProps;
    const json = controller.run("serializeModel", diagramProps);
    const jsonStr = JSON.stringify(json)
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
    createMapMutation({ name, mapData, owner: "benji" })
  }

  return (
    <div className={cx("bm-toolbar-item")}>
      <Select itemRenderer={itemRenderer} items={[{ name: "Save", disabled: !curMap, onClick: save }, { name: "Save As", disabled: false, onClick: () => setSaveAsDialog(true) }]} filterable={false} >
        <Button icon="cloud-upload" minimal large />
      </Select>
      <NameDialog
        title="Save Map"
        isOpen={saveAsDialog}
        onClose={closeSaveDialog}
        onSubmit={handleSubmit((formData) => {
          saveAs(formData.mapName)
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