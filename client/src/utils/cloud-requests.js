import { createNewMap, getAllMaps, updateMap, deleteMap } from "./api"
import { queryCache, useMutation, useQuery } from "react-query"
import { Stack } from "immutable"
import { useRef } from "react"
import { useGlobal } from "reactn"


const useMapCrud = (diagram) => {
  const NotificationToasterRef = useRef(null);
  const diagramProps = diagram.getDiagramProps();
  const { controller } = diagramProps;
  const [curMap, setCurMap] = useGlobal("curMap")

  const [deleteMapMutation, { deleteStatus, deleteData, deleteError }] = useMutation(deleteMap, {
    onSuccess: (_, selectedMap) => {
      queryCache.invalidateQueries("mindmaps")
      NotificationToasterRef.current.show({ message: `Successfully deleted ${selectedMap.name}`, intent: "success" })
    },
    onError: () => {
      NotificationToasterRef.current.show({ message: "Something went wrong. Please try again.", intent: "danger" })
    }
  })
  const [renameMapMutation, { renameStatus, renameData, renameError }] = useMutation(updateMap, {
    onSuccess: (resp, { selectedMap }) => {
      queryCache.invalidateQueries("mindmaps")
      NotificationToasterRef.current.show({ message: `Successfully renamed ${selectedMap.name} -> ${resp.data.name}`, intent: "success" })
    },
    onError: () => {
      NotificationToasterRef.current.show({ message: "Something went wrong. Please try again.", intent: "danger" })
    }
  })
  const [duplicateMapMutation, { duplicateStatus, duplicateData, duplicateError }] = useMutation(createNewMap, {
    onSuccess: (resp, { selectedMap }) => {
      queryCache.invalidateQueries("mindmaps")
      controller.run("setUndoStack", { undoStack: new Stack() })
      controller.run("setRedoStack", { redoStack: new Stack() })
      console.log(resp)
      NotificationToasterRef.current.show({ message: `Successfully duplicated ${selectedMap.name} -> ${resp.data.name}`, intent: "success" })
    },
    onError: () => {
      NotificationToasterRef.current.show({ message: "Something went wrong. Please try again.", intent: "danger" })
    }
  })
  const [updateMapMutation, { updateStatus, updateData, updateError }] = useMutation(updateMap, {
    onSuccess: () => {
      queryCache.invalidateQueries("mindmaps")
      NotificationToasterRef.current.show({ message: "Saved successfully.", intent: "success" })

    },
    onError: () => {
      NotificationToasterRef.current.show({ message: "Something went wrong. Please try again.", intent: "danger" })
    }
  })
  const [createMapMutation, { createStatus, createData, createError }] = useMutation(createNewMap, {
    onSuccess: (resp, { name }) => {
      queryCache.invalidateQueries("mindmaps")
      NotificationToasterRef.current.show({ message: `Successfully created ${name}`, intent: "success" })
      setCurMap(resp.data._id)
    },
    onError: () => {
      NotificationToasterRef.current.show({ message: "Something went wrong. Please try again.", intent: "danger" })
    }
  })



  const handleDelete = (map) => {
    deleteMapMutation(map)
  }

  const handleRename = (mapName, selectedMap) => {
    console.log(`Renamed ${selectedMap.name} (${selectedMap._id}) to ${mapName}`)
    renameMapMutation({ id: selectedMap._id, update: { name: mapName }, selectedMap })
  }

  const handleDuplicate = (mapName, selectedMap) => {
    console.log(`Duplicated ${selectedMap.name} (${selectedMap._id}) to ${mapName}`)
    duplicateMapMutation({ owner: "benji", name: mapName, mapData: selectedMap.mapData, selectedMap })
  }


  const handleLoad = (map) => {
    let obj = JSON.parse(map.mapData);
    let model = controller.run("deserializeModel", { controller, obj });
    diagram.openNewModel(model);
    controller.run("setUndoStack", { undoStack: new Stack() })
    controller.run("setRedoStack", { redoStack: new Stack() })
    setCurMap(map._id)
  }

  const getMapAsJSON = () => {
    const currenntDiagramProps = diagram.getDiagramProps();
    const { controller: currentController } = currenntDiagramProps;
    const json = currentController.run("serializeModel", currenntDiagramProps);
    const jsonStr = JSON.stringify(json)
    return jsonStr
  };

  const handleSave = (curMap) => {
    const mapData = getMapAsJSON()
    updateMapMutation({ id: curMap, update: { mapData: mapData } })
  }

  const handleCreate = (name) => {
    const mapData = getMapAsJSON()
    createMapMutation({ name, mapData, owner: "benji" })
  }

  return { handleDelete, handleRename, handleLoad, handleDuplicate, handleSave, handleCreate, NotificationToasterRef }
}

export { useMapCrud }