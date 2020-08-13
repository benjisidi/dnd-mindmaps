import { Button, MenuItem } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import cx from "classnames";
import { Stack } from "immutable";
import React from "react";
import { useForm } from "react-hook-form";
import { queryCache, useMutation } from "react-query";
import { useGlobal } from "reactn";
import { deleteMap } from "../../api";


export function ToolbarItemCloudLoad(props) {
  const [curMap, setCurMap] = useGlobal("curMap")
  const { diagram } = props;
  const diagramProps = diagram.getDiagramProps();
  const { controller } = diagramProps;
  const loadMap = (map) => {

    let obj = JSON.parse(map.mapData);
    let model = controller.run("deserializeModel", { controller, obj });
    diagram.openNewModel(model);
    setCurMap(map._id)
    controller.run("setUndoStack", { undoStack: new Stack() })
    controller.run("setRedoStack", { redoStack: new Stack() })
  }

  const itemRenderer = (map, modifiers) => {
    const isSelected = map._id === curMap
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
      <Select itemRenderer={itemRenderer} items={props.existingMaps.status === "success" ? props.existingMaps.data.data : []} onItemSelect={loadMap} filterable={false} >
        <Button icon="cloud-download" minimal large />
      </Select>
    </div>
  );
}
