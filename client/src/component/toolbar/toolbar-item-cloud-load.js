import cx from "classnames";
import { iconClassName } from "@blink-mind/renderer-react";
import { Menu, MenuDivider, MenuItem, Popover, Icon, Button } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select"
import React from "react";
import { downloadFile } from "../../utils";
import { Stack } from "immutable"
import { useGlobal, getGlobal } from "reactn"

import { useQuery, queryCache } from "react-query"

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
  return (
    <div className={cx("bm-toolbar-item")}>
      <Select itemRenderer={itemRenderer} items={props.existingMaps.status === "success" ? props.existingMaps.data.data : []} onItemSelect={loadMap} filterable={false} >
        <Button icon="cloud-download" minimal large />
      </Select>
    </div>
  );
}

const itemRenderer = (map, { handleClick }) => {
  return <MenuItem key={map.name} onClick={handleClick} text={map.name} />
}