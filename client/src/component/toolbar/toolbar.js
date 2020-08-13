import { iconClassName } from "@blink-mind/renderer-react";
import cx from "classnames";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { queryCache, useMutation, useQuery } from "react-query";
import { useGlobal } from "reactn";
import { createNewMap, getAllMaps, updateMap } from "../../api";
import { NameDialog } from "../dialogs/name";
import { ToolbarItemCloudLoad } from "./toolbar-item-cloud-load";
import { ToolbarItemCloudSave } from "./toolbar-item-cloud-save";
import { ToolbarItemExport } from "./toolbar-item-export";
import { ToolbarItemLayout } from "./toolbar-item-layout";
import { ToolbarItemOpen } from "./toolbar-item-open";
import { ToolbarItemSearch } from "./toolbar-item-search";
import { ToolbarItemTheme } from "./toolbar-item-theme";
import "./Toolbar.css";

// import debug from "debug";
// const log = debug("app");

export const Toolbar = (props) => {
  const { onClickUndo, onClickRedo, canUndo, canRedo } = props;
  const existingMaps = useQuery('mindmaps', getAllMaps)
  const [curMap, setCurMap] = useGlobal("curMap")
  const { register, handleSubmit, watch, errors } = useForm();
  const [selectedMap, setSelectedMap] = useState()
  const [renameVisibility, setRenameVisibility] = useState(false)
  const [duplicateVisibility, setDuplicateVisibility] = useState(false)
  const [renameMapMutation, { renameStatus, renameData, renameError }] = useMutation(updateMap, { onSuccess: () => queryCache.invalidateQueries("mindmaps") })
  const [duplicateMapMutation, { duplicateStatus, duplicateData, duplicateError }] = useMutation(createNewMap, {
    onSuccess: (resp) => {
      queryCache.invalidateQueries("mindmaps")
      setCurMap(resp.data._id)
    }
  })

  const handleRename = (mapName) => {
    console.log(`Renamed ${selectedMap.name} (${selectedMap._id}) to ${mapName}`)
    renameMapMutation({ id: selectedMap._id, update: { name: mapName } })
  }

  const handleDuplicate = (mapName) => {
    console.log(`Duplicated ${selectedMap.name} (${selectedMap._id}) to ${mapName}`)
    duplicateMapMutation({ owner: "benji", name: mapName, mapData: selectedMap.mapData })
  }

  return (
    <div className="bm-toolbar">
      <NameDialog
        title="Rename Map"
        isOpen={renameVisibility}
        onClose={() => setRenameVisibility(false)}
        onSubmit={handleSubmit((formData) => {
          handleRename(formData.renameMapName)
          setRenameVisibility(false)
        })}
        inputName={"renameMapName"}
        register={register}
        errors={errors}
        existing={existingMaps.status === "success" ? existingMaps.data.data.map(x => x.name) : []}
      />
      <NameDialog
        title="Name new map"
        isOpen={duplicateVisibility}
        onClose={() => setDuplicateVisibility(false)}
        onSubmit={handleSubmit((formData) => {
          handleDuplicate(formData.duplicateMapName)
          setDuplicateVisibility(false)
        })}
        inputName={"duplicateMapName"}
        register={register}
        errors={errors}
        existing={existingMaps.status === "success" ? existingMaps.data.data.map(x => x.name) : []}
      />
      <ToolbarItemOpen {...props} />
      <ToolbarItemExport {...props} />
      <ToolbarItemTheme {...props} />
      <ToolbarItemLayout {...props} />
      <ToolbarItemSearch {...props} />
      <div
        className={cx("bm-toolbar-item", iconClassName("undo"), {
          "bm-toolbar-item-disabled": !canUndo
        })}
        onClick={onClickUndo}
      />

      <div
        className={cx("bm-toolbar-item", iconClassName("redo"), {
          "bm-toolbar-item-disabled": !canRedo
        })}
        onClick={onClickRedo}
      />
      <ToolbarItemCloudSave existingMaps={existingMaps} {...props} />
      <ToolbarItemCloudLoad existingMaps={existingMaps} setDuplicateVisibility={setDuplicateVisibility} setRenameVisibility={setRenameVisibility} setSelectedMap={setSelectedMap} {...props} />
    </div>
  );
}
