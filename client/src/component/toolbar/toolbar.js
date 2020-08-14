import { iconClassName } from "@blink-mind/renderer-react";
import { Toaster } from "@blueprintjs/core";
import cx from "classnames";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { useGlobal } from "reactn";
import { useCloud } from "../../utils";
import { getAllMaps } from "../../utils/api";
import { DeletionAlert, NameDialog, LoginDialog, SignUpDialog, ShareDialog } from "../overlays";

import {
  ToolbarItemCloudLoad,
  ToolbarItemCloudSave,
  ToolbarItemExport,
  ToolbarItemLayout,
  ToolbarItemOpen,
  ToolbarItemSearch,
  ToolbarItemTheme,
  ToolbarItemProfile
} from "."
import "./Toolbar.css";
// import debug from "debug";
// const log = debug("app");

export const Toolbar = (props) => {
  const { onClickUndo, onClickRedo, canUndo, canRedo, diagram } = props;
  const existingMaps = useQuery('mindmaps', getAllMaps)
  const [curMap] = useGlobal("curMap")
  const { register, handleSubmit, errors } = useForm();
  const [selectedMap, setSelectedMap] = useState()
  const [loginVisibility, setLoginVisibility] = useState(false)
  const [createUserVisibility, setCreateUserVisibility] = useState(false)
  const [renameVisibility, setRenameVisibility] = useState(false)
  const [deleteVisibility, setDeleteVisibility] = useState(false)
  const [duplicateVisibility, setDuplicateVisibility] = useState(false)
  const [shareVisibility, setShareVisibility] = useState(false)

  const {
    handleDelete,
    handleRename,
    handleLoad,
    handleDuplicate,
    handleSave,
    handleCreateMap,
    handleAuthenticate,
    handleCreateUser,
    handleShare,
    NotificationToasterRef,
  } = useCloud(diagram)

  return (
    <div className="bm-toolbar">
      <div className="bm-toolbar-left">
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
        <ShareDialog
          isOpen={shareVisibility}
          onClose={() => setShareVisibility(false)}
          handleShare={handleShare}
          selectedMap={selectedMap}
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
        <LoginDialog
          isOpen={loginVisibility}
          onClose={() => setLoginVisibility(false)}
          handleAuthenticate={handleAuthenticate}
        />
        <SignUpDialog
          isOpen={createUserVisibility}
          onClose={() => setCreateUserVisibility(false)}
          handleCreateUser={handleCreateUser}
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
          handleCreate={handleCreateMap}
          {...props} />
        <ToolbarItemCloudLoad
          curMap={curMap}
          existingMaps={existingMaps}
          setDeleteVisibility={setDeleteVisibility}
          setDuplicateVisibility={setDuplicateVisibility}
          setRenameVisibility={setRenameVisibility}
          setShareVisibility={setShareVisibility}
          setSelectedMap={setSelectedMap}
          handleLoad={handleLoad}
          {...props} />
      </div>
      <div className="bm-toolbar-center">
        <span className="bm-toolbar-title">{curMap ? existingMaps.status === "success" && existingMaps.data?.data?.filter(x => x._id === curMap)[0]?.name : "Untitled Map"}</span>
      </div>
      <div className="bm-toolbar-right">
        <ToolbarItemProfile
          handleCreateUserClick={() => setCreateUserVisibility(true)}
          handleLoginClick={() => setLoginVisibility(true)}
          handleProfileClick={null}
        />
      </div>
    </div>
  );
}
