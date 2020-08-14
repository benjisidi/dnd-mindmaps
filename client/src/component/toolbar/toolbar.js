import { iconClassName } from "@blink-mind/renderer-react";
import { Toaster } from "@blueprintjs/core";
import cx from "classnames";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { useGlobal } from "reactn";
import { useMapCrud } from "../../utils";
import { getAllMaps } from "../../utils/api";
import { DeletionAlert } from "../overlays/deletion-alert";
import { NameDialog } from "../overlays/rename-dialog";
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
  const { onClickUndo, onClickRedo, canUndo, canRedo, diagram } = props;
  const existingMaps = useQuery('mindmaps', getAllMaps)
  const [curMap] = useGlobal("curMap")
  const { register, handleSubmit, errors } = useForm();
  const [selectedMap, setSelectedMap] = useState()
  const [renameVisibility, setRenameVisibility] = useState(false)
  const [deleteVisibility, setDeleteVisibility] = useState(false)
  const [duplicateVisibility, setDuplicateVisibility] = useState(false)

  const { handleDelete, handleRename, handleLoad, handleDuplicate, handleSave, handleCreate, NotificationToasterRef } = useMapCrud(diagram)

  return (
    <div className="bm-toolbar">
      <Toaster ref={NotificationToasterRef} />
      <DeletionAlert
        isOpen={deleteVisibility}
        targetName={selectedMap?.name}
        handleCancel={() => setDeleteVisibility(false)}
        handleConfirm={() => {
          handleDelete(selectedMap)
          setDeleteVisibility(false)
        }}
      />
      <NameDialog
        title={`Rename ${selectedMap?.name}`}
        isOpen={renameVisibility}
        onClose={() => setRenameVisibility(false)}
        onSubmit={handleSubmit((formData) => {
          handleRename(formData.renameMapName, selectedMap)
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
          handleDuplicate(formData.duplicateMapName, selectedMap)
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
      <ToolbarItemCloudSave
        existingMaps={existingMaps}
        handleSave={handleSave}
        handleCreate={handleCreate}
        {...props} />
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
