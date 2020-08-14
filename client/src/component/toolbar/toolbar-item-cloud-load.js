import { Button, MenuItem } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import cx from "classnames";
import React from "react";


export function ToolbarItemCloudLoad(props) {
  const itemRenderer = (map, modifiers) => {
    const isSelected = map._id === props.curMap
    return (
      <MenuItem icon={isSelected ? "selection" : "circle"} key={map.name} onClick={modifiers.handleClick} text={map.name} intent={isSelected ? "success" : "none"}>
        <MenuItem disabled={isSelected} key={`${map.name}-rename`} onClick={() => {
          props.setSelectedMap(map)
          props.setRenameVisibility(true)
        }}
          icon="edit" text="Rename" />
        <MenuItem key={`${map.name}-duplicate`} onClick={() => {
          props.setSelectedMap(map)
          props.setDuplicateVisibility(true)
        }} icon="duplicate" text="Duplicate" />
        <MenuItem disabled={isSelected} key={`${map.name}-delete`} onClick={() => {
          props.setSelectedMap(map)
          props.setDeleteVisibility(true)
        }} text="Delete" icon="remove" intent="danger" />
      </MenuItem>
    )
  }
  return (
    <div className={cx("bm-toolbar-item")}>
      <Select
        itemRenderer={itemRenderer}
        items={props.existingMaps.status === "success" ? props.existingMaps.data.data : []}
        onItemSelect={props.handleLoad}
        filterable={false} >
        <Button icon="cloud-download" minimal large />
      </Select>
    </div>
  );
}
