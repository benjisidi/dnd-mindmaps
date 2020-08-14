const express = require("express")
const router = express.Router()
const auth = require("../../middleware/auth")
// Mindmap model
const Mindmap = require("../../models/Mindmap")


// @route GET api/mindmaps
// @desc List mindmaps
// @access Private
router.get('/', async (req, auth, res) => {
  mindmaps = await Mindmap.find().sort({ date: -1 })
  res.json(mindmaps)
})

// @route POST api/mindmaps
// @desc Create a new mindmap
// @access Private
router.post('/', async (req, auth, res) => {
  let result
  try {
    const newMindmap = new Mindmap({
      ...req.body
    })

    result = await newMindmap.save()
  } catch (e) {
    res.status(400).json({ success: false, msg: e })
  }
  res.json(result)
})

// @route POST api/mindmaps/:id
// @desc Update a mindmap
// @access Private
router.post('/:id', async (req, auth, res) => {
  let result
  try {
    const mindmap = await Mindmap.findById(req.params.id)
    Object.assign(mindmap, req.body)
    result = await mindmap.save()
  } catch (e) {
    res.status(400).json({ success: false, msg: e })
  }
  res.json(result)
})

// @route DELETE api/mindmaps/:id
// @desc Delete a mindmap
// @access Private
router.delete('/:id', async (req, auth, res) => {
  let mindmap
  try {
    mindmap = await Mindmap.findById(req.params.id)
    await mindmap.remove()
  } catch (e) {
    res.status(404).json({ success: false, msg: e })
  }
  res.json({ success: true, msg: `Deleted ${mindmap.name} with id ${mindmap.id}`, _id: mindmap._id })
})

module.exports = router