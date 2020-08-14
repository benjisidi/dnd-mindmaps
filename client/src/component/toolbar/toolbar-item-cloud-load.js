import { Button, MenuItem, NonIdealState, Classes, Text, Icon } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import cx from "classnames";
import React from "react";
import { useGlobal } from "reactn"

export function ToolbarItemCloudLoad(props) {
  const [user] = useGlobal("user")
  const itemRenderer = (map, modifiers) => {
    const isSelected = map._id === props.curMap
    const isOwner = map.owner === user?.username
    return (
      <MenuItem icon={isSelected ? "selection" : "circle"} key={map.name} onClick={modifiers.handleClick} text={map.name} intent={isSelected ? "success" : "none"}>
        <MenuItem disabled={isSelected || !isOwner} key={`${map.name}-rename`} onClick={() => {
          props.setSelectedMap(map)
          props.setRenameVisibility(true)
        }}
          icon="edit" text="Rename" />
        <MenuItem key={`${map.name}-duplicate`} onClick={() => {
          props.setSelectedMap(map)
          props.setDuplicateVisibility(true)
        }} icon="duplicate" text="Duplicate" />
        <MenuItem key={`${map.name}-share`} disabled={!isOwner} onClick={() => {
          props.setSelectedMap(map)
          props.setShareVisibility(true)
        }} text="Share" icon="send-message" />
        <MenuItem disabled={isSelected || !isOwner} key={`${map.name}-delete`} onClick={() => {
          props.setSelectedMap(map)
          props.setDeleteVisibility(true)
        }} text="Delete" icon="remove" intent="danger" />
      </MenuItem>
    )
  }

  const NoMaps = () => {
    // return <NonIdealState
    //   title="¯\_(ツ)_/¯"
    //   description={!user ? "Log in to view your mindmaps" : "Use Save As to create a mindmap"}
    //   className={Classes.MENU_ITEM}
    // />

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "4px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon iconSize={36} icon="layout" intent="danger" />
        </div>
        <h4 className={Classes.HEADING} style={{ marginBottom: "4px" }}>No Mindmaps Available</h4>
        <Text>{!user ? <><b>Log in</b> to view your mindmaps</> : <>Use <b>Save As</b> to create a mindmap</>}</Text>
      </div>
    )
  }
  return (
    <div className={cx("bm-toolbar-item")}>
      <Select
        itemRenderer={itemRenderer}
        items={props.existingMaps.status === "success" ? props.existingMaps.data.data : []}
        onItemSelect={props.handleLoad}
        filterable={false}
        noResults={<NoMaps />}
      >
        <Button icon="cloud-download" minimal large />
      </Select>
    </div>
  );
}
