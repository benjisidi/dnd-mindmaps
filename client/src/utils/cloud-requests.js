import { createNewMap, getAllMaps, updateMap, deleteMap, authenticate, createUser } from "./api"
import { queryCache, useMutation, useQuery } from "react-query"
import { Stack } from "immutable"
import { useRef } from "react"
import { useGlobal } from "reactn"


const useCloud = (diagram) => {
  const NotificationToasterRef = useRef(null);
  const diagramProps = diagram.getDiagramProps();
  const { controller } = diagramProps;
  const [curMap, setCurMap] = useGlobal("curMap")
  const [user, setUser] = useGlobal("user")


  const [deleteMapMutation] = useMutation(deleteMap, {
    onSuccess: (_, selectedMap) => {
      queryCache.invalidateQueries("mindmaps")
      NotificationToasterRef.current.show({ message: `Successfully deleted ${selectedMap.name}`, intent: "success" })
    },
    onError: () => {
      NotificationToasterRef.current.show({ message: "Something went wrong. Please try again.", intent: "danger" })
    }
  })
  const [renameMapMutation] = useMutation(updateMap, {
    onSuccess: (resp, { selectedMap }) => {
      queryCache.invalidateQueries("mindmaps")
      NotificationToasterRef.current.show({ message: `Successfully renamed ${selectedMap.name} -> ${resp.data.name}`, intent: "success" })
    },
    onError: () => {
      NotificationToasterRef.current.show({ message: "Something went wrong. Please try again.", intent: "danger" })
    }
  })
  const [shareMapMutation] = useMutation(updateMap, {
    onSuccess: (resp, { selectedMap }) => {
      queryCache.invalidateQueries("mindmaps")
      NotificationToasterRef.current.show({ message: `Successfully shared ${selectedMap.name}`, intent: "success" })
    },
    onError: () => {
      NotificationToasterRef.current.show({ message: "Something went wrong. Please try again.", intent: "danger" })
    }
  })
  const [duplicateMapMutation] = useMutation(createNewMap, {
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
  const [updateMapMutation] = useMutation(updateMap, {
    onSuccess: () => {
      queryCache.invalidateQueries("mindmaps")
      NotificationToasterRef.current.show({ message: "Saved successfully.", intent: "success" })

    },
    onError: () => {
      NotificationToasterRef.current.show({ message: "Something went wrong. Please try again.", intent: "danger" })
    }
  })
  const [createMapMutation] = useMutation(createNewMap, {
    onSuccess: (resp, { name }) => {
      queryCache.invalidateQueries("mindmaps")
      NotificationToasterRef.current.show({ message: `Successfully created ${name}`, intent: "success" })
      setCurMap(resp.data._id)
    },
    onError: () => {
      NotificationToasterRef.current.show({ message: "Something went wrong. Please try again.", intent: "danger" })
    }
  })

  const [authenticateMutation] = useMutation(authenticate, {
    onSuccess: (resp, { username }) => {
      queryCache.invalidateQueries("mindmaps")
      setUser({ token: resp.data.token, id: resp.data.user.id, username: resp.data.user.username })
      NotificationToasterRef.current.show({ message: `Welcome, ${username}.`, intent: "success" })
    }
  })

  const [createUserMutation] = useMutation(createUser, {
    onSuccess: (resp, { username }) => {
      queryCache.invalidateQueries("mindmaps")
      setUser({ token: resp.data.token, id: resp.data.user.id, username: resp.data.user.username })
      NotificationToasterRef.current.show({ message: `You've signed up, ${username}.`, intent: "success" })
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
    duplicateMapMutation({ owner: user.username, name: mapName, mapData: selectedMap.mapData, selectedMap })
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
    const currentDiagramProps = diagram.getDiagramProps();
    const { controller: currentController } = currentDiagramProps;
    const json = currentController.run("serializeModel", currentDiagramProps);
    const jsonStr = JSON.stringify(json)
    return jsonStr
  };

  const handleSave = (curMap) => {
    const mapData = getMapAsJSON()
    updateMapMutation({ id: curMap, update: { mapData: mapData } })
  }

  const handleCreateMap = (name) => {
    const mapData = getMapAsJSON()
    createMapMutation({ name, mapData, owner: user.username })
  }

  const handleAuthenticate = async (formData) => {
    let success
    let error
    await authenticateMutation(formData, { onSuccess: () => success = true, onError: (e) => { success = false; error = e.response.data.err } })
    return { success, error }
  }

  const handleCreateUser = async (formData) => {
    let success
    let error
    await createUserMutation(formData, { onSuccess: () => success = true, onError: (e) => { success = false; error = e.response.data.err } })
    return { success, error }
  }

  const handleShare = async (users, selectedMap) => {
    await shareMapMutation({ id: selectedMap._id, update: { users }, selectedMap })
  }

  return { handleShare, handleAuthenticate, handleDelete, handleRename, handleLoad, handleDuplicate, handleSave, handleCreateMap, NotificationToasterRef, handleCreateUser }
}

export { useCloud }