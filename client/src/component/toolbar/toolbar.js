import { iconClassName } from "@blink-mind/renderer-react";
import cx from "classnames";
import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { queryCache, useMutation, useQuery } from "react-query";
import { useGlobal } from "reactn";
import { createNewMap, getAllMaps, updateMap, deleteMap } from "../../api";
import { NameDialog } from "../overlays/rename-dialog";
import { DeletionAlert } from "../overlays/deletion-alert";
import { ToolbarItemCloudLoad } from "./toolbar-item-cloud-load";
import { ToolbarItemCloudSave } from "./toolbar-item-cloud-save";
import { ToolbarItemExport } from "./toolbar-item-export";
import { ToolbarItemLayout } from "./toolbar-item-layout";
import { ToolbarItemOpen } from "./toolbar-item-open";
import { ToolbarItemSearch } from "./toolbar-item-search";
import { ToolbarItemTheme } from "./toolbar-item-theme";
import "./Toolbar.css";
import { Stack } from "immutable";
import { Toaster } from "@blueprintjs/core"

import { deepCompareKeys } from "@blueprintjs/core/lib/esm/common/utils";
// import debug from "debug";
// const log = debug("app");

export const Toolbar = (props) => {
  const { onClickUndo, onClickRedo, canUndo, canRedo, diagram } = props;
  const diagramProps = diagram.getDiagramProps();
  const { controller } = diagramProps;
  const existingMaps = useQuery('mindmaps', getAllMaps)
  const [curMap, setCurMap] = useGlobal("curMap")
  const { register, handleSubmit, watch, errors } = useForm();
  const [selectedMap, setSelectedMap] = useState()
  const [renameVisibility, setRenameVisibility] = useState(false)
  const [deleteVisibility, setDeleteVisibility] = useState(false)
  const [duplicateVisibility, setDuplicateVisibility] = useState(false)

  const [deleteMapMutation, { deleteStatus, deleteData, deleteError }] = useMutation(deleteMap, {
    onSuccess: () => {
      queryCache.invalidateQueries("mindmaps")
      NotificationToaster.current.show({ message: `Successfully deleted ${selectedMap.name}`, intent: "success" })
    },
    onError: () => {
      NotificationToaster.current.show({ message: "Something went wrong. Please try again.", intent: "danger" })
    }
  })
  const [renameMapMutation, { renameStatus, renameData, renameError }] = useMutation(updateMap, {
    onSuccess: (resp) => {
      queryCache.invalidateQueries("mindmaps")
      NotificationToaster.current.show({ message: `Successfully renamed ${selectedMap.name} -> ${resp.data.name}`, intent: "success" })
    },
    onError: () => {
      NotificationToaster.current.show({ message: "Something went wrong. Please try again.", intent: "danger" })
    }
  })
  const [duplicateMapMutation, { duplicateStatus, duplicateData, duplicateError }] = useMutation(createNewMap, {
    onSuccess: (resp) => {
      queryCache.invalidateQueries("mindmaps")
      controller.run("setUndoStack", { undoStack: new Stack() })
      controller.run("setRedoStack", { redoStack: new Stack() })
      console.log(resp)
      NotificationToaster.current.show({ message: `Successfully duplicated ${selectedMap.name} -> ${resp.data.name}`, intent: "success" })
    },
    onError: () => {
      NotificationToaster.current.show({ message: "Something went wrong. Please try again.", intent: "danger" })
    }
  })

  const NotificationToaster = useRef(null);


  const handleDelete = (map) => {
    deleteMapMutation(map._id)
    setDeleteVisibility(false)
  }

  const handleRename = (mapName) => {
    console.log(`Renamed ${selectedMap.name} (${selectedMap._id}) to ${mapName}`)
    renameMapMutation({ id: selectedMap._id, update: { name: mapName } })
  }

  const handleDuplicate = (mapName) => {
    console.log(`Duplicated ${selectedMap.name} (${selectedMap._id}) to ${mapName}`)
    duplicateMapMutation({ owner: "benji", name: mapName, mapData: selectedMap.mapData })
  }


  const handleLoad = (map) => {
    let obj = JSON.parse(map.mapData);
    let model = controller.run("deserializeModel", { controller, obj });
    diagram.openNewModel(model);
    setCurMap(map._id)
    controller.run("setUndoStack", { undoStack: new Stack() })
    controller.run("setRedoStack", { redoStack: new Stack() })
  }

  return (
    <div className="bm-toolbar">
      <Toaster ref={NotificationToaster} />
      <DeletionAlert
        isOpen={deleteVisibility}
        targetName={selectedMap?.name}
        handleCancel={() => setDeleteVisibility(false)}
        handleConfirm={() => handleDelete(selectedMap)}
      />
      <NameDialog
        title={`Rename ${selectedMap?.name}`}
        isOpen={renameVisibility}
        onClose={() => setRenameVisibility(false)}
        onSubmit={handleSubmit((formData) => {
          handleRename(formData.renameMapName)
          setRenameVisibility(false)
        })}
        defaultValue={selectedMap?.name}
        inputName={"renameMapName"}
        register={register}
        errors={errors}
        existing={existingMaps.status === "success" ? existingMaps.data.data.map(x => x.name) : []}
      />
      <NameDialog
        title={`Duplicate ${selectedMap?.name}`}
        isOpen={duplicateVisibility}
        defaultValue={selectedMap?.name}
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
      <ToolbarItemCloudLoad
        curMap={curMap}
        existingMaps={existingMaps}
        setDeleteVisibility={setDeleteVisibility}
        setDuplicateVisibility={setDuplicateVisibility}
        setRenameVisibility={setRenameVisibility}
        setSelectedMap={setSelectedMap}
        handleLoad={handleLoad}
        {...props} />
      <span className="bm-toolbar-title">{curMap ? existingMaps.status === "success" && existingMaps.data?.data?.filter(x => x._id === curMap)[0]?.name : "Untitled Map"}</span>
    </div>
  );
}
