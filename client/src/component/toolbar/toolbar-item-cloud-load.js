import cx from "classnames";
import { iconClassName } from "@blink-mind/renderer-react";
import { Menu, MenuDivider, MenuItem, Popover, Icon, Button } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select"
import React from "react";
import { downloadFile } from "../../utils";
import { Stack } from "immutable"
import { useGlobal, getGlobal } from "reactn"
import { deleteMap } from "../../api"

import { useQuery, queryCache, useMutation } from "react-query"

export function ToolbarItemCloudLoad(props) {
  const [curMap, setCurMap] = useGlobal("curMap")
  const { diagram } = props;
  const diagramProps = diagram.getDiagramProps();
  const { controller } = diagramProps;
  const [deleteMapMutation, { deleteStatus, deleteData, deleteError }] = useMutation(deleteMap, { onSuccess: () => queryCache.invalidateQueries("mindmaps") })
  const loadMap = (map) => {
    let obj = JSON.parse(map.mapData);
    let model = controller.run("deserializeModel", { controller, obj });
    diagram.openNewModel(model);
    setCurMap(map._id)
    controller.run("setUndoStack", { undoStack: new Stack() })
    controller.run("setRedoStack", { redoStack: new Stack() })
  }
  const handleDeleteMap = (map) => {
    deleteMapMutation(map._id)
    controller.run("setUndoStack", { undoStack: new Stack() })
    controller.run("setRedoStack", { redoStack: new Stack() })
  }
  const itemRenderer = (map, modifiers) => {
    return (
      <MenuItem key={map.name} onClick={modifiers.handleClick} text={map.name} intent={map._id === curMap ? "success" : "none"}>
        <MenuItem disabled={map._id === curMap} key={`${map.name}-delete`} onClick={() => handleDeleteMap(map)} text="Delete" intent="danger" />
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
