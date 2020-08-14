import axios from "axios"

export const getAllMaps = () => axios.get('/api/mindmaps')

export const updateMap = ({ id, update }) => axios.post(`/api/mindmaps/${id}`, update)

export const createNewMap = ({ owner, name, mapData }) => axios.post('/api/mindmaps', { owner, name, mapData })

export const deleteMap = ({ _id }) => axios.delete(`/api/mindmaps/${_id}`)

export const authenticate = ({ username, password }) => axios.post("/api/auth", { username, password })

export const createUser = ({ username, password }) => axios.post("/api/users", { username, password })